/**
 * Created by pavel.mash on 11.11.2016.
 */

const DBAbstract = require('./DBAbstract')
const {TableDefinition} = require('../AbstractSchema')

const _ = require('lodash')

class DBSQLite3 extends DBAbstract {

  loadDatabaseMetadata () {
    let mTables = this.refTableDefs

    /** @type {Array<Object>} */
    let dbTables = this.conn.xhr({
      endpoint: 'runSQL',
      data: `select name, tbl_name as caption from sqlite_master where type='table' and name not like 'sqlite_%'`,
      URLParams: { CONNECTION: this.dbConnectionConfig.name }
    })

    // filter tables from a metadata if any
    if (mTables.length) {
      dbTables = _.filter(dbTables, (dbTab) => _.findIndex(mTables, { name: dbTab.name }) !== -1)
    }
    for (let tabDef of dbTables) {
      let asIsTable = new TableDefinition({
        name: tabDef.name,
        caption: tabDef.caption
      })
      let primaryKeyFields = []

      // Table Columns
      let columnSQL = `PRAGMA table_info('${asIsTable.name}')`
      let columnsFromDb = this.conn.xhr({
        endpoint: 'runSQL',
        data: columnSQL,
        URLParams: { CONNECTION: this.dbConnectionConfig.name }
      })
      // cid name     type        notnull dflt_value pk
      // 0  ID       BIGINT         1       null      1
      // 1  name    VARCHAR(128)    1        0
      for (let colDef of columnsFromDb) {
        let fType
        let fLength = 0
        let fPrec = 0
        let fScale = 0
        let fullType = colDef[ 'type' ]
        // varchar(100) -> ["varchar(100)", "varchar", "(100)", "100", ""]
        // DECIMAL(10,5) ["DECIMAL(10,5)", "DECIMAL", "(10,5)", "10", "5"]
        // BIGINT -> null
        let parsedType = fullType.match(/(\w*)(\((\d*),? *(\d*)\))/)
        if (parsedType) {
          fType = parsedType[ 1 ]
          if (parsedType[ 4 ]) { // have precision
            fPrec = parseInt(parsedType[ 3 ], 10)
            fScale = parseInt(parsedType[ 4 ], 10)
          } else {
            fLength = parseInt(parsedType[ 3 ], 10)
          }
        } else {
          fType = fullType
        }
        let dataType = this.dataBaseTypeToUni(fType, fLength, fPrec, fScale)

        asIsTable.addColumn({
          name: colDef[ 'name' ],
          caption: colDef[ 'COMMENTS' ] || '', // TODO COMMENTS is a fake
          allowNull: (colDef[ 'notnull' ] !== 1),
          dataType: dataType,
          size: (dataType === 'UVARCHAR') ? fLength : fPrec,
          prec: fScale,
          isComputed: false,
          defaultValue: colDef[ 'dflt_value' ]
        })
        if (colDef[ 'pk' ] === 1) {
          primaryKeyFields.push(colDef.name)
        }
      }

      // foreign key
      let fkFromDb = this.conn.xhr({
        endpoint: 'runSQL',
        data: `PRAGMA foreign_key_list('${asIsTable.name}')`,
        URLParams: { CONNECTION: this.dbConnectionConfig.name }
      })
      // id seq  table       from            to    on_update   on_delete  match
      // 0  0   uba_user   mi_modifyuser    null   NO ACTION   NO ACTION  NONE
      // 1  0   uba_user   mi_createuser    null   NO ACTION   NO ACTION  NONE
      // 2  0   uba_user   mi_owner         null   NO ACTION   NO ACTION  NONE
      for (let fkey of fkFromDb) {
        asIsTable.addFK({
          name: `FK_${fkey[ 'table' ]}_${fkey.from}`,
          keys: [ fkey.from ] || [],
          references: fkey[ 'to' ] || 'ID',
          isDisabled: false,
          deleteAction: fkey[ 'on_delete' ] === 'NO ACTION' ? 'NO_ACTION' : fkey[ 'on_delete' ], // NO_ACTION, CASCADE, SET_NULL,  SET_DEFAULT
          updateAction: fkey[ 'on_update' ]
        })
      }

      // primary keys
      // there is only one primary key (but possible several fields on(sourceID, destID). SQL return field in right order?
      if (primaryKeyFields.length) {
        let mustBeTab = _.find(mTables, {_upperName: asIsTable._upperName})
        let pkNamePart = mustBeTab
          ? mustBeTab.__entity.sqlAlias ? mustBeTab.__entity.sqlAlias : asIsTable._upperName
          : asIsTable._upperName
        asIsTable.primaryKey = {
          name: `PK_${pkNamePart}`, // there is no possibility to set a primary key name in SQLIte3
          keys: primaryKeyFields.slice(0) // create a copy of array
        }
      }

      // indexes. in case of several field - it is ordered by SQL
      let indexesFromDb = this.conn.xhr({
        endpoint: 'runSQL',
        data: `PRAGMA index_list('${asIsTable.name}')`,
        URLParams: { CONNECTION: this.dbConnectionConfig.name }
      })
      // seq   name                unique  origin    partial
      // 0    idx_unique              1     c         0
      // 1    idx_composit            0     c         0
      // 2    idx_usr_mi_createuser   0     c         0
      // 3    sqlite_autoindex_er_1   1     pk        0
      for (let indexDef of indexesFromDb) {
        if (indexDef[ 'origin' ] === 'pk') continue
        let idxCols = this.conn.xhr({
          endpoint: 'runSQL',
          data: `PRAGMA index_xinfo(${indexDef.name})`,
          URLParams: { CONNECTION: this.dbConnectionConfig.name }
        })
        // seqno cid   name         desc col    key
        // 0     9    mi_createdate 0  ISO8601   1
        // 1     10   mi_createuser 0  BINARY    1
        // 2     -1                 0  BINARY    0
        let idxColArr = _(idxCols).filter({ key: 1 }).map((col) => col[ 'desc' ] === 0 ? col.name : col.name + ' DESC').value()
        asIsTable.addIndex({
          name: indexDef.name,
          isUnique: indexDef[ 'unique' ] === 1,
          isDisabled: false,
          isConstraint: indexDef[ 'origin' ] === 'pk',
          keys: idxColArr
        })
      }
      this.dbTableDefs.push(asIsTable)
    }
  }

  /**
   * @override
   * @param {TableDefinition} table
   * @param {FieldDefinition} column
   * @param {String} updateType
   * @param {Object} [value] optional for updateType updConst
   */
  genCodeUpdate (table, column, updateType, value) {
    function quoteIfNeed (v) {
      return column.isString
        ? (!column.defaultValue && (column.refTable || column.enumGroup)
          ? v.replace(/'/g, "''")
          : "''" + v.replace(/'/g, '') + "''")
        : v
      //  return ((!column.isString || (!column.defaultValue && (column.refTable || column.enumGroup))) ? v : "''" + v.replace(/'/g,'') + "''" );
    }
    switch (updateType) {
      case 'updConstComment':
        this.DDL.updateColumn.statements.push(
          `-- update ${table.name} set ${column.name} = ${quoteIfNeed(value)} where ${column.name} is null`
        )
        break
      case 'updConst':
        this.DDL.updateColumn.statements.push(
          `update ${table.name} set ${column.name} = ${value} where ${column.name} is null`
        )
        break
      case 'updNull':
        let possibleDefault = column.defaultValue ? quoteIfNeed(column.defaultValue) : '[Please_set_value_for_notnull_field]'
        this.DDL.updateColumn.statements.push(
          `-- update ${table.name} set ${column.name} = ${possibleDefault} where ${column.name} is null`
        )
        break
      case 'updBase':
        this.DDL.updateColumn.statements.push(
          `update dbo.${table.name} set ${column.name} = ${quoteIfNeed(column.baseName)} where ${column.name} is null`
        )
        break
    }
  }
  /**
   * Generate a DDL statement for column
   * @param {TableDefinition} table
   * @param {FieldDefinition} column
   */
  columnDDL (table, column) {
    let res = column.name + ' ' +
      this.createTypeDefine(column) +
      (column.defaultValue ? ` DEFAULT (${column.defaultValue})` : '') +
      (column.allowNull ? ' NULL' : ' NOT NULL') +
      (column.name === 'ID' ? ' PRIMARY KEY' : '')
    let checkConstraint = _.find(table.checkConstraints, { column: column.name })
    if (checkConstraint) {
      res += (checkConstraint.type === 'bool'
        ? ` CHECK (${checkConstraint.column} IN (0,1) )`
        : ` CHECK (${checkConstraint.expression})`)
    }
    return res
  }

  /**
   * @param {FKAttributes} constraintFK
   */
  foreignKeyDDL (constraintFK) {
    // lookup on mustBe tables, because asIs tatbe may noy exist yet
    let referenceObj = _.find(this.refTableDefs, { _upperName: constraintFK.references.toUpperCase() })
    if (!referenceObj) {
      throw new Error('Referenced object not found. Object name is ' + constraintFK.references)
    }
    if (constraintFK.generateFK) {
      return ' CONSTRAINT ' + constraintFK.name +
        ' FOREIGN KEY (' + constraintFK.keys.join(',') + ') REFERENCES ' +
        constraintFK.references + '(' + referenceObj.primaryKey.keys.join(',') + ')'
    }
  }

  /**
   * @override
   */
  genCodeCreateTable (table) {
    let res
    let entity = table.__entity
    let colLen = table.columns.length

    if (entity.isFTSDataTable) {
      res = [ 'CREATE VIRTUAL TABLE ', table.name, ' USING fts4(\r\n' ]
    } else {
      res = [ 'CREATE TABLE ', table.name, ' (\r\n' ]
    }

    table.columns.forEach((column, index) => {
      if (column.name === 'rowid') {
        return
      }
      res.push('\t', this.columnDDL(table, column))
      if (index < colLen - 1) res.push(',')
      if (column.caption) res.push(' --', column.caption)
      res.push('\r\n')
    })
    if (table.isIndexOrganized && table.primaryKey) {
      res.push(' ,CONSTRAINT ', table.primaryKey.name,
        ' PRIMARY KEY ( ', table.primaryKey.keys.join(','), ') \r\n')
    }

    table.foreignKeys.forEach((fk) => {
      let fkText = this.foreignKeyDDL(fk)
      if (fkText) {
        res.push('\t,' + fkText + '\t\n')
      }
    })

    function getParamValue (params, name) {
      let res
      for (let param of params) {
        if (param.startsWith(name + '=')) {
          res = param.slice(name.length + 1)
          break
        }
      }
      return res
    }

    if (entity.isFTSDataTable) { // add a tokenizer
      let advSettings = entity.connectionConfig.advSettings.split(',')
      if (advSettings.length) {
        let tokenizer = getParamValue(advSettings, 'Tokenizer') || ''
        if (tokenizer) {
          let aLang = table.name.split('_').pop() // get the language as a last part of name `fts_myEntity_uk` -> `uk`
          let tokenizerParams = getParamValue(advSettings, 'TokenizerParams') || ''
          if (tokenizerParams.indexOf('lang=') === -1) { // no lang is defined in params - add a lang
            tokenizerParams += 'lang=' + aLang
          }
          res.push(',tokenize=', tokenizer, ' ', tokenizerParams)
        }
      }
      res.push()
    }
    res.push(')')
    this.DDL.createTable.statements.push(res.join(''))
  }

  genCodeRename (table, oldName, newName, typeObj) {
    throw new Error(`try to rename ${typeObj} for ${table.name} ${oldName} -> ${newName}`)
  }

  /**
   * Convert database types to universal.
   * @param dataType
   * @param {number} len
   * @param {number}  prec
   * @param {number}  scale
   * @return {string}
   */
  dataBaseTypeToUni (dataType, len, prec, scale) {
    dataType = dataType.toUpperCase()
    switch (dataType) {
      case 'NUMERIC':
        if (prec === 19 && scale === 2) {
          return 'CURRENCY'
        } else if (prec === 19 && scale === 4) {
          return 'FLOAT'
        } else {
          return 'BIGINT'
        }
      case 'INT8': return 'BIGINT'
      case 'INT4': return 'INTEGER'
      case 'SMALLINT': return 'BOOLEAN'
      case 'TIMESTAMP': return 'TIMESTAMP' // Не будет совпадать с типом DATETIME и сгенерится ALTER
      case 'TIMESTAMP WITH TIME ZONE': return 'DATETIME'
      case 'TIMESTAMP WITHOUT TIME ZONE': return 'TIMESTAMP WITHOUT TIME ZONE' // Не будет совпадать с типом DATETIME и сгенерится ALTER
      case 'DATE': return 'DATE' // Не будет совпадать с типом DATETIME и сгенерится ALTER
      case 'CHARACTER VARYING': return 'UVARCHAR'
      case 'NVARYING': return 'UVARCHAR'
      case 'VARCHAR': return 'UVARCHAR'
      case 'TEXT': return 'TEXT'
      case 'BYTEA': return 'BLOB'
      default: return dataType
    }
  }

  /**
   * convert universal types to database
   * @param {string} dataType
   * @return {string}
   */
  uniTypeToDataBase (dataType) {
    switch (dataType) {
      case 'VARCHAR': return 'VARCHAR'
      case 'NVARCHAR': return 'VARCHAR'
      case 'INTEGER': return 'INTEGER'
      case 'BIGINT': return 'BIGINT'
      case 'FLOAT': return 'FLOAT'
      case 'CURRENCY': return 'NUMERIC'
      case 'BOOLEAN': return 'SMALLINT'
      // case 'DATETIME': return 'TEXT COLLATE ISO8601';
      case 'DATETIME': return 'DATETIME'
      case 'TEXT': return 'TEXT'
      case 'DOCUMENT': return 'TEXT'
      case 'BLOB': return 'BLOB'
      default: return dataType
    }
  }

  /**
   * @param {TableDefinition} table
   * @param {FieldDefinition} column
   * @param {boolean} [delayedNotNull] optional true to set not null in alter
   */
  genCodeAddColumn (table, column, delayedNotNull) {
    if (!column.allowNull) column.allowNull = true // MPV TODO TEMPORARY!!
    this.DDL.addColumn.statements.push(
      `ALTER TABLE ${table.name} ADD ${this.columnDDL(table, column)}`
    )
  }

  /**
   * @param {TableDefinition} table
   * @param {FieldDefinition} column
   * @param baseColumn
   */
  genCodeAddColumnBase (table, column, baseColumn) {
    if (!column.allowNull) column.allowNull = true // MPV TODO TEMPORARY!!
    this.DDL.addColumn.statements.push(
      `ALTER TABLE ${table.name} ADD ${this.columnDDL(table, column)}`
    )

    this.DDL.updateColumn.statements.push(
      `UPDATE ${table.name} SET ${column.name} = ${baseColumn} WHERE (1 = 1)`
    )
    // if (!column.allowNull){
    //    this.resAlterColumnNotNullSQL.push(
    //        ['alter table ', table.name, ' alter column ', column.name , ' ',
    //            this.createTypeDefine(column), (column.allowNull ? ' null': ' not null') ].join('')
    //    );
    // }
  }

  getExpression (macro, column) {
    function dateTimeExpression (val) {
      if (!val) { return val }
      switch (val) {
        case 'currentDate':
          return "strftime('%Y-%m-%dT%H:%M:%SZ', 'now')"
        case 'maxDate':
          return "'9999-12-31'"
        default :
          throw new Error('Unknown expression with code ' + val)
      }
    }

    if (!column) return dateTimeExpression(macro)

    if (column.isBoolean) return ((macro === 'TRUE') || (macro === '1')) ? '1' : '0'
    if (column.isString) return "'" + macro + "'"
    if (column.dataType === 'DATETIME') return dateTimeExpression(macro)
    return macro
  }

  genCodeSetCaption (tableName, column, value, oldValue) {
    // TODO - comments may be added directly to the DDL statement create table bla-_lka --table bla-bla
  }

  genCodeAlterColumn (table, tableDB, column, columnDB, typeChanged, sizeChanged, allowNullChanged) {
    this.DDL.warnings.statements.push(`Attempt to alter a column ${tableDB.name}.${columnDB.name} as (typeChanged: ${typeChanged}, sizeChanged: ${sizeChanged}, allowNullChanged: ${allowNullChanged}`)
  }

  genCodeSetDefault (table, column) {
    // Real implementation for SQLIte3 is in the create table
    // alter table X alter column Y set default Z
  }

  genCodeCreatePK (table) {
    // Real implementation for SQLIte3 is in the create table
  }

  genCodeCreateFK (table, constraintFK) {
    // FK name is fake for SQLIte3, so warning doesn't matter
    // this.DDL.warnings.statements.push(
    //   `Attempt to create FK 'alter table ${table.name} add constraint ${constraintFK.name}...`
    // )
  }

  genCodeCreateIndex (table, indexSH, comment) {
    if (table.__entity.isFTSDataTable) return // virtual tables may not be indexed
    this.DDL.createIndex.statements.push(
      [ comment ? '--' + comment + '\r\n' : '', indexSH.isUnique ? 'CREATE UNIQUE INDEX ' : 'CREATE INDEX ', indexSH.name, ' ON ', table.name,
        '(', indexSH.keys.join(','), ') ' ].join('')
    )
  }

  genCodeCreateCheckC (table, checkConstr) {
    // moved to create table
  }

  genCodeDropColumn (tableDB, columnDB) {
    this.DDL.dropColumn.push(`alter table ${tableDB.name} drop column ${columnDB.name}`)
  }

  genCodeDropConstraint (tableName, constraintName) {
    // FK name is fake for SQLIte3, so warning doesn't matter
    // this.DDL.warnings.statements.push(`Attempt to drop a constraint ${constraintName} on table ${tableName}`)
  }

  genCodeDropDefault (table, column) {
    this.DDL.warnings.statements.push(`Attempt to drop a default for ${table.name}.${column.name}`)
  }

  genCodeDropIndex (tableDB, table, indexDB, comment, objCollect) {
    this.DDL.warnings.statements.push(`Attempt to drop a index ${indexDB.name} on table ${tableDB.name}`)
  }
}

module.exports = DBSQLite3
