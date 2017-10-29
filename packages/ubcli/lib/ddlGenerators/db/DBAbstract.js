const _ = require('lodash')
const {strIComp} = require('../AbstractSchema')
/**
 * Created by pavel.mash on 11.11.2016.
 */

class DBAbstract {
  /**
   * @param {UBConnection} conn
   * @param {DBConnectionConfig} dbConnectionConfig
   * @param {Array<TableDefinition>} referencedTables
   * @param {boolean} [isUnsafe=true] do not comment out a unsafe DB operations
   */
  constructor (conn, dbConnectionConfig, referencedTables, isUnsafe = true) {
    this.dbConnectionConfig = dbConnectionConfig
    /** @type {Array<TableDefinition>} */
    this.refTableDefs = referencedTables
    this.conn = conn
    /** @type {Array<TableDefinition>} */
    this.dbTableDefs = []
    /**
     * Array of upper-cased sequence names
     * @type {Array<string>}
     */
    this.sequencesDefs = []
    this.defaultLang = conn.getAppInfo().defaultLang
    this.isUnsafe = isUnsafe
    this.DDL = {
      sys: { order: 10, statements: [], description: 'System objects' }, // 'SET TRANSACTION ISOLATION LEVEL READ COMMITTED'
      dropFK: { order: 20, statements: [], description: 'Drop foreign keys' },
      dropIndex: { order: 30, statements: [], description: 'Drop indexes' },
      dropPK: { order: 40, statements: [], description: 'Drop primary keys' },
      dropDefault: { order: 50, statements: [], description: 'Drop default constraints' },
      dropCheckC: { order: 60, statements: [], description: 'Drop check constraints' },
      dropSequence: { order: 70, statements: [], description: 'Drop sequences' },

      createTable: { order: 80, statements: [], description: 'Create tables' },
      addColumn: { order: 90, statements: [], description: 'Add columns' },
      alterColumn: { order: 100, statements: [], description: 'Alter columns' },
      updateColumn: { order: 110, statements: [], description: '! update values for known or estimated changes' },
      rename: { order: 120, statements: [], description: 'Renamed objects' },
      setDefault: { order: 130, statements: [], description: 'Set new default' },
      alterColumnNotNull: {
        order: 140,
        statements: [],
        description: 'Alter columns set not null where was null allowed'
      },

      createPK: { order: 150, statements: [], description: 'Create primary keys' },
      createIndex: { order: 160, statements: [], description: 'Create indexes' },
      createCheckC: { order: 170, statements: [], description: 'Create check constraint' },
      createFK: { order: 180, statements: [], description: 'Create foreign keys' },
      createSequence: { order: 190, statements: [], description: 'Create sequence' },
      others: {
        order: 1200,
        statements: [],
        description: 'Create other object defined in dbExtensions section entity domain'
      },

      dropColumn: { order: 210, statements: [], description: 'drop columns' },

      caption: { order: 220, statements: [], description: 'Annotate an objects' },
      warnings: { order: 230, statements: [], description: 'Warnings' }
    }
  }

  /**
   * Load information from a database schema definition into this.dbTableDefs
   * @abstract
   */
  loadDatabaseMetadata () {
    throw new Error('Abstract loadDatabaseMetadata')
  }

  addWarning (text) {
    this.DDL.warnings.statements.push(text)
  }

  /**
   * @abstract
   * @param {TableDefinition} table
   * @param {string} oldName
   * @param {string} newName
   * @param {string} typeObj
   */
  genCodeRename (table, oldName, newName, typeObj) {
    throw new Error('Abstract genCodeRename')
  }

  /**
   * @abstract
   * @param {TableDefinition} table
   * @param {FieldDefinition} column
   * @param {String} updateType
   * @param {Object} [value] optional for updateType updConst
   */
  genCodeUpdate (table, column, updateType, value) {
    throw new Error(`Abstract genCodeUpdate(${table.name}, ${column.name}, ${updateType}, ${value})`)
  }

  /**
   * TODO rename to Annotate
   * Implemenation must generate a annotation for a table / column
   * @abstract
   */
  genCodeSetCaption (tableName, column, value, oldValue) {
    throw new Error('Abstract genCodeSetCaption')
  }

  /**
   * @abstract
   */
  genCodeCreateCheckC (table, checkConstr) {
    throw new Error('Abstract genCodeCreateCheckC')
  }

  /**
   * @abstract
   */
  genCodeDropColumn (tableDB, columnDB) {
    throw new Error('Abstract genCodeDropColumn')
  }

  /**
   * @abstract
   */
  genCodeSetDefault (table, column) {
    throw new Error('Abstract genCodeSetDefault')
  }

  /**
   * @abstract
   * @param {TableDefinition} table
   * @param {FieldDefinition} column
   */
  genCodeDropDefault (table, column) {
    throw new Error('Abstract genCodeDropDefault')
  }

  /**
   * @abstract
   */
  genCodeAlterColumn (table, tableDB, column, columnDB, typeChanged, sizeChanged, allowNullChanged) {
    throw new Error('Abstract genCodeAlterColumn')
  }

  /**
   * @abstract
   * @param {TableDefinition} table
   * @param {FieldDefinition} column
   * @param {boolean} [delayedNotNull] optional true to set not null in alter
   */
  genCodeAddColumn (table, column, delayedNotNull) {
    throw new Error('Abstract genCodeAddColumn')
  }
  /**
   * Generate code for add language column
   * TODO rename to addLanguageColumn
   * @abstract
   * @param {TableDefinition} table
   * @param {FieldDefinition} column
   * @param baseColumn
   */
  genCodeAddColumnBase (table, column, baseColumn) {
    throw new Error('Abstract genCodeAddColumnBase')
  }
  /**
   * @abstract
   * @param {TableDefinition} table
   */
  genCodeCreateTable (table) {
    throw new Error('Abstract genCodeCreateTable')
  }
  /**
   * @abstract
   * @param {TableDefinition} table
   */
  genCodeCreatePK (table) {
    throw new Error('Abstract genCodeCreatePK')
  }
  /**
   * @abstract
   * @param {TableDefinition} table
   * @param {Object} constraintFK
   */
  genCodeCreateFK (table, constraintFK) {
    throw new Error('Abstract genCodeCreateFK')
  }

  /**
   * @abstract
   * @param {TableDefinition} tableDB
   * @param {TableDefinition} table
   * @param {IndexAttributes} indexDB
   * @param {String} [comment]
   * @param {Array} [objCollect]
   */
  genCodeDropIndex (tableDB, table, indexDB, comment, objCollect) {
    throw new Error('Abstract genCodeDropIndex')
  }
  /**
   * @abstract
   */
  genCodeDropPK (tableName, constraintName) {
    throw new Error('Abstract genCodeDropPK')
  }
  /**
   * @abstract
   * @param {string} tableName
   * @param {string} constraintName
   */
  genCodeDropConstraint (tableName, constraintName) {
    throw new Error('Abstract genCodeDropConstraint')
  }
  /**
   * @abstract
   */
  genCodeAddSequence (table, sequenceObj) {
    throw new Error('Abstract genCodeAddSequence')
  }
  /**
   * @abstract
   */
  genCodeDropSequence (sequenceName) {
    throw new Error('Abstract genCodeDropSequence')
  }
  /**
   * @abstract
   * @param {TableDefinition} table
   * @param {IndexAttributes} indexSH
   * @param {string} [comment]
   */
  genCodeCreateIndex (table, indexSH, comment) {
    throw new Error('Abstract genCodeCreateIndex')
  }
  /**
   * Return a database-specific value for default expression.
   * Can parse UB macros (maxDate, currentDate etc)
   * @abstract
   * @param {string} macro
   * @param {FieldDefinition} [column]
   */
  getExpression (macro, column) {
    throw new Error('Abstract getExpression')
  }

  /**
   * Convert universal types to database type
   * @abstract
   * @param {string} dataType
   * @return {string}
   */
  uniTypeToDataBase (dataType) {
    throw new Error('Abstract uniTypeToDataBase')
  }
  /**
   * Convert database types to universal.
   * @abstract
   * @param dataType
   * @param {number} len
   * @param {number}  prec
   * @param {number}  scale
   * @return {String}
   */
  dataBaseTypeToUni (dataType, len, prec, scale) {
    throw new Error('Abstract dataBaseTypeToUni')
  }
  /**
   * Decode a default values for a attributes to a database-specific values
   * "maxDate", "currentDate", quoter strings
   * @param {TableDefinition} table
   */
  normalizeDefaults (table) {
    for (let column of table.columns) {
      if (column.defaultValue) {
        column.defaultValue = this.getExpression(column.defaultValue, column)
      }
    }
  }

  /** compare referenced tables with database metadata */
  compare () {
    for (let mustBe of this.refTableDefs) {
      if (!mustBe.doComparision) continue
      this.normalizeDefaults(mustBe)
      let asIs = _.find(this.dbTableDefs, {_upperName: mustBe._upperName})
      this.compareTableDefinitions(mustBe, asIs)
    }
  }

  /**
   * Compare the "Must Be" (as defined by entity metadata) table definition with database table definition
   * @param {TableDefinition} mustBe
   * @param {TableDefinition} asIs
   */
  compareTableDefinitions (mustBe, asIs) {
    let notEqualPK = false
    if (!asIs) { // table in database does not exists
      this.genCodeCreateTable(mustBe)

      // todo rename genCodeSetCaption -> addDBObjectDescription
      this.genCodeSetCaption(mustBe.name, null, mustBe.caption, null)
      for (let col of mustBe.columns) {
        this.genCodeSetCaption(mustBe.name, col.name, col.caption, null)
      }
    } else {
      if (asIs.caption !== mustBe.caption && mustBe.caption) {
        this.genCodeSetCaption(mustBe.name, null, mustBe.caption, asIs.caption)
      }

      this.compareColumns(mustBe, asIs)

      // drop PK if not equals or not exist in schema
      if (asIs.primaryKey && !mustBe.existOther(asIs.primaryKey.name) &&
         (!mustBe.primaryKey || !_.isEqual(asIs.primaryKey.keys, mustBe.primaryKey.keys))
      ) {
        this.genCodeDropPK(asIs.name, asIs.primaryKey.name)
      } else {
        if (asIs.primaryKey && mustBe.primaryKey && !strIComp(asIs.primaryKey.name, mustBe.primaryKey.name)) {
          this.genCodeRename(mustBe, asIs.primaryKey.name, mustBe.primaryKey.name, 'PK')
        }
      }

      // drop FK if not found in schema by name or not equal by columnus
      debugger
      for (let asIsFK of asIs.foreignKeys) {
        if (mustBe.existOther(asIsFK.name)) continue
        let mustBeFK = mustBe.getFKByName(asIsFK.name)
        if (mustBeFK && mustBeFK.isDeleted) continue
        if (!mustBeFK || !_.isEqual(asIsFK.keys, mustBeFK.keys) || !strIComp(mustBeFK.references, asIsFK.references) ||
            asIsFK.updateAction !== 'NO_ACTION' || asIsFK.deleteAction !== 'NO_ACTION') {
          this.genCodeDropConstraint(asIs.name, asIsFK.name)
          if (mustBeFK) mustBeFK.isDeleted = true
        }
      }

      // drop indexes
      for (let asIsIndex of asIs.indexes) {
        if (mustBe.existOther(asIsIndex.name)) continue
        let mustBeIndex = mustBe.indexByName(asIsIndex.name)
        if (!mustBeIndex || asIsIndex.isForDelete ||
          !_.isEqual(mustBeIndex.keys, asIsIndex.keys) ||
          (mustBeIndex.isUnique !== mustBeIndex.isUnique) ||
          asIsIndex.isDisabled
        ) {
          if (!asIsIndex.isDeleted) {
            this.genCodeDropIndex(asIs, mustBe, asIsIndex,
              asIsIndex.isForDelete && !asIsIndex.isForDeleteMsg ? asIsIndex.isForDeleteMsg : null)
          }
          if (mustBeIndex) mustBeIndex.isDeleted = true
        }
      }

      // drop check constraint
      for (let asIsChk of asIs.checkConstraints) {
        if (mustBe.existOther(asIsChk.name)) continue
        let mustBeChk = mustBe.getCheckConstrByName(asIsChk.name)
        if (!mustBeChk) {
          this.genCodeDropConstraint(asIs.name, asIsChk.name)
        }
      }

      // sequence
      // TODO - increase sequence value to indicate physical structure is changed
      // if (me.schema.sequences['S_' + asIs.name.toUpperCase()]){
      //    me.genCodeDropSequence('S_' + asIs.name.toUpperCase());
      // }
    }

    // create PK
    if (mustBe.primaryKey && ((asIs && !asIs.primaryKey) || notEqualPK || !asIs)) {
      this.genCodeCreatePK(mustBe)
    }

    // create fk
    for (let mustBeFK of mustBe.foreignKeys) {
      let asIsFK = asIs && asIs.getFKByName(mustBeFK.name)
      // && !constrFK.isRenamed
      if ((mustBeFK.isDeleted || !asIsFK) && !mustBeFK.isRenamed) {
        this.genCodeCreateFK(mustBe, mustBeFK)
      }
    }

    // create index
    for (let mustBeIndex of mustBe.indexes) {
      let asIsIndex = asIs && asIs.indexByName(mustBeIndex.name)
      if ((mustBeIndex.isDeleted || !asIsIndex) && !mustBeIndex.isRenamed) {
        this.genCodeCreateIndex(mustBe, mustBeIndex)
      }
    }

    // create check constraint
    for (let mustBeChk of mustBe.checkConstraints) {
      let asIsChk = asIs && asIs.getCheckConstrByName(mustBeChk.name)
      if (!asIsChk) {
        this.genCodeCreateCheckC(mustBe, mustBeChk)
      }
    }

    // TODO sequences must be on the schema level
    // mustBe.sequences.forEach(function (sequenceObj) {
    //   obj = me.schema.sequences[sequenceObj.name.toUpperCase()]
    //   if (!obj) {
    //     me.genCodeAddSequence(mustBe, sequenceObj)
    //   }
    // })

    // others
    _.forEach(mustBe.othersNames, (otherObj) => {
      if (!otherObj.expression && _.isString(otherObj.expression)) {
        if (!otherObj.existInDB) {
          this.DDL.others.statements.push(otherObj.expression)
        }
      }
    })
  }

  /**
   * Compare columns of Must Be - as in metadata and asIs - as in database TableDefinition definition adn generate a DDL statements
   * @param {TableDefinition} mustBe
   * @param {TableDefinition} asIs
   */
  compareColumns (mustBe, asIs) {
    let delayedNotNull
    // compare columns
    for (let asIsC of asIs.columns) {
      let sizeChanged = false
      let sizeIsSmaller = false
      let mustBeC = mustBe.columnByName(asIsC.name)

      if (mustBeC) { // alter
        // caption
        if (mustBeC.caption !== asIsC.caption) {
          this.genCodeSetCaption(mustBe.name, mustBeC.name, mustBeC.caption, asIsC.caption)
        }
        // mustBeC exists in schema
        let typeChanged = !strIComp(mustBeC.dataType, asIsC.dataType)
        if (typeChanged && (asIsC.dataType === 'UVARCHAR' &&
          (mustBeC.dataType === 'NVARCHAR' || mustBeC.dataType === 'VARCHAR'))) {
          typeChanged = false
        }
        // noinspection FallthroughInSwitchStatementJS
        switch (asIsC.dataType) {
          case 'NVARCHAR':
          case 'UVARCHAR':
          case 'VARCHAR':
            sizeChanged = mustBeC.size !== asIsC.size
            sizeIsSmaller = (mustBeC.size < asIsC.size)
            break
          case 'NUMERIC':
            sizeChanged = mustBeC.size !== asIsC.size || mustBeC.prec !== asIsC.prec
            sizeIsSmaller = (mustBeC.size < asIsC.size) || (mustBeC.prec < asIsC.prec)
            break
        }

        let allowNullChanged = mustBeC.allowNull !== asIsC.allowNull

        let asIsType = this.createTypeDefine(asIsC)
        let mustBeType = this.createTypeDefine(mustBeC)
        let mustBeColumn = `${mustBe.name}.${mustBeC.name}`
        if (typeChanged &&
          (mustBeC.dataType === 'INTEGER' || mustBeC.dataType === 'BIGINT' || mustBeC.dataType === 'NUMBER') &&
          (asIsC.dataType === 'NVARCHAR' || asIsC.dataType === 'VARCHAR' || asIsC.dataType === 'UVARCHAR' ||
          asIsC.dataType === 'NTEXT' || asIsC.dataType === 'NCHAR' || mustBeC.dataType === 'CHAR')) {
          this.addWarning(`Altering type for ${mustBeColumn} from ${asIsType} to ${mustBeType} may be wrong`)
        }
        if (typeChanged && (
            (asIsC.dataType === 'NTEXT') || (mustBeC.dataType === 'NTEXT') ||
            (asIsC.dataType === 'DATETIME') || (mustBeC.dataType === 'DATETIME') ||
            ((asIsC.dataType === 'BIGINT') && (mustBeC.dataType === 'INTEGER')) ||
            ((asIsC.dataType === 'NUMERIC') && (mustBeC.size > 10) && (mustBeC.dataType === 'INTEGER')) ||
            ((asIsC.dataType === 'NUMERIC') && (mustBeC.size > 19) && (mustBeC.dataType === 'BIGINT')) ||
            ((asIsC.dataType === 'NUMERIC') && (mustBeC.prec !== 0) && (mustBeC.dataType === 'BIGINT' || mustBeC.dataType === 'INTEGER'))
          )
        ) {
          this.addWarning(`Altering type for ${mustBeColumn} from ${asIsType} to ${mustBeType} may be wrong`)
        }
        if (sizeChanged && sizeIsSmaller) {
          this.addWarning(`The size or precision for field ${mustBeColumn} was reduced potential loss of data: ${asIsType} -> ${mustBeType}`)
        }
        if (mustBeC.name === 'bigintValue')
          debugger
        let defChanged = this.compareDefault(mustBeC.dataType, mustBeC.defaultValue, asIsC.defaultValue, mustBeC.defaultConstraintName, asIsC.defaultConstraintName)
        // TEMP
        if (defChanged) {
          console.log(`CONSTRAINT changed for ${mustBe.name}.${mustBeC.name} Must be "${mustBeC.defaultValue}" but in database "${asIsC.defaultValue}"`)
        }
        if (defChanged && (asIsC.defaultValue != null)) {
          this.genCodeDropDefault(mustBe, asIsC)
        }
        if (defChanged && mustBeC.defaultValue) {
          this.genCodeSetDefault(mustBe, mustBeC)
        }
        if (!defChanged && (allowNullChanged || typeChanged)) {
          if (asIsC.defaultValue && this.dbConnectionConfig.dialect.startsWith('MSSQL')) {
            this.genCodeDropDefault(mustBe, asIsC)
          }
          if (mustBeC.defaultValue) {
            this.genCodeSetDefault(mustBe, mustBeC)
          }
        }
        if (typeChanged || sizeChanged || allowNullChanged) {
          this.genCodeAlterColumn(mustBe, asIs, mustBeC, asIsC, typeChanged, sizeChanged, allowNullChanged)
        }

        if (allowNullChanged && !mustBeC.allowNull) {
          delayedNotNull = false
          if (!mustBeC.allowNull) {
            delayedNotNull = true
            this.genCodeUpdate(mustBe, mustBeC, this.isUnsafe || mustBeC.defaultValue ? 'updConst' : 'updConstComment',
              mustBeC.defaultValue ? mustBeC.defaultValue : this.getColumnValueForUpdate(mustBe, mustBeC))
          }
          if (!delayedNotNull) {
            this.genCodeUpdate(mustBe, mustBeC, 'updNull')
          }
        }
        mustBeC.existInDB = true
      } else { // drop column
        if (asIsC.defaultValue) {
          this.genCodeDropDefault(asIs, asIsC)
        }
        this.addWarning(`Will drop field ${asIs.name}.${asIsC.name} ${this.createTypeDefine(asIsC.dataType)}. Check may be there is useful data!!!`)
        this.genCodeDropColumn(asIs, asIsC)
        asIsC.isDeleted = true
      }
    }

    // new columns
    for (let mustBeCol of mustBe.columns) {
      if (mustBeCol.existInDB || mustBeCol.name === 'rowid') continue // special case for sqlite3
      delayedNotNull = false
      // update by base mustBeCol
      if (mustBeCol.baseName) { // multi language column
        let lang = this.dbConnectionConfig.supportLang[0]
        let columnBase = ''
        if (lang === this.defaultLang) {
          columnBase = mustBeCol.baseName
        } else {
          columnBase = mustBeCol.baseName + '_' + lang
        }
        if (asIs.columnByName(columnBase)) {
          this.genCodeAddColumnBase(mustBe, mustBeCol, columnBase)
        } else {
          this.addWarning(`--  mustBeCol ${mustBe.name}.${columnBase} for base language not exists. Data for column ${mustBeCol.name} may not be initialized`)
          this.genCodeAddColumn(mustBe, mustBeCol)
        }
      } else {
        delayedNotNull = false
        if (!mustBeCol.defaultValue && !mustBeCol.allowNull) {
          delayedNotNull = true
          this.genCodeUpdate(mustBe, mustBeCol, this.isUnsafe ? 'updConst' : 'updConstComment', this.getColumnValueForUpdate(mustBe, mustBeCol))
        }

        this.genCodeAddColumn(mustBe, mustBeCol, delayedNotNull)
      }
      // caption
      this.genCodeSetCaption(mustBe.name, mustBeCol.name, mustBeCol.caption, null)
    }
  }

  /**
   * Generate a column type DDL part
   * @override
   * @param {FieldDefinition} column
   * @return {string}
   */
  createTypeDefine (column) {
    let res = this.uniTypeToDataBase(column.dataType)
    switch (column.dataType) {
      case 'NVARCHAR':
      case 'UVARCHAR':
      case 'VARCHAR':
        res += `(${column.size.toString()})`
        break
      case 'NUMERIC':
      case 'FLOAT':
      case 'CURRENCY':
        res += `(${column.size.toString()}, ${column.prec.toString()})`
        break
      case 'BOOLEAN':
        res += '(1)'
        break
    }
    return res
  }

  compareDefault (dataType, mustBeDefault, asIsDefault, mustBeConstraintName, asIsConstraintName) {
    if (!mustBeDefault && !asIsDefault) return false
    return (mustBeDefault !== asIsDefault) && (mustBeDefault !== `'${asIsDefault}'`) && (`(${mustBeDefault})` !== asIsDefault)
  }

  /**
   * @param {TableDefinition} table
   * @param {FieldDefinition} column
   * @return {*}
   */
  getColumnValueForUpdate (table, column) {
    let res
    let constraint = table.getFKByColumnName(column.name)
    if (constraint.length > 0) {
      constraint = constraint[0]
      return `(select min(id) from ${constraint.references})`
    }
    if (column.enumGroup) {
      return `(select min(code) from ubm_enum where egroup = '${column.enumGroup}')`
    }
    switch (column.dataType) {
      case 'NVARCHAR':
      case 'VARCHAR':
      case 'UVARCHAR':
      case 'INTEGER':
      case 'BIGINT':
      case 'FLOAT':
      case 'CURRENCY':
      case 'TEXT': res = 'ID'; break
      case 'BOOLEAN': res = '0'; break
      case 'DATETIME': res = this.getExpression('currentDate'); break
    }
    return res
  }
  generateStatements () {
    return this.DDL
  }
}

module.exports = DBAbstract
