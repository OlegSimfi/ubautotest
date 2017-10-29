/*
 created by xmax 05.04.2013
 rewrite to ES6 & ubcli by pavel.mash 08.2016
 */
const _ = require('lodash')
const UBDomain = require('@unitybase/base').UBDomain
const {TableDefinition, strIComp} = require('./AbstractSchema')

/**
 * Return name of a table for entity (depending of a mapping)
 * @param {UBEntity} entity
 * @returns {string}
 */
function getTableDBName (entity) {
  return (entity.mapping && entity.mapping.selectName) ? entity.mapping.selectName : entity.name
}

/**
 * Generate a name of a foreign key as it must be in database
 * @param {string} sourceTableName
 * @param {string} sourceColumnName
 * @param {string} destTableName
 * @param {DDLGenerator.dbDialectes} dialect
 * @return {string}
 */
function genFKName (sourceTableName, sourceColumnName, destTableName, dialect = DDLGenerator.dbDialectes.AnsiSQL) {
  const MAX_IDENTIFIER_LEN = DDLGenerator.MAX_DB_IDENTIFIER_LENGTHS[dialect]
  let prefix = 'FK_' + sourceTableName.toUpperCase() + '_'
  let colName = sourceColumnName.toUpperCase()
  let suffix = '_REF'
  let delta
  let baseLen = prefix.length + destTableName.length + 1

  if ((baseLen + colName.length + suffix.length > MAX_IDENTIFIER_LEN)) {
    delta = MAX_IDENTIFIER_LEN - baseLen - colName.length
    if (delta >= 0) {
      suffix = suffix.substring(0, delta)
    } else {
      suffix = ''
      delta = MAX_IDENTIFIER_LEN - baseLen
      if ((delta < colName.length) && (delta > 2)) {
        colName = colName.substring(0, delta)
      } else {
        colName = colName.substring(0, 3)
        baseLen = prefix.length + 1 + colName.length
        delta = MAX_IDENTIFIER_LEN - baseLen
        if (delta < destTableName.length) {
          destTableName = destTableName.substring(0, delta)
        } else {
          destTableName = destTableName.substring(0, 3)
          baseLen = 4 + destTableName.length + 1 + colName.length
          if (MAX_IDENTIFIER_LEN - baseLen > 4) {
            sourceTableName = sourceTableName.substring(0, MAX_IDENTIFIER_LEN - baseLen)
            prefix = 'FK_' + sourceTableName.toUpperCase() + '_'
          }
        }
      }
    }
  }
  return prefix + colName + suffix + '_' + destTableName.toUpperCase()
}

/**
 * Return name of an attribute in a database according to mapping and dialect
 * @param {UBEntity} entity
 * @param {String} attributeCode
 */
function getAttributeDBName (entity, attributeCode) {
  let attribute = entity.attributes[attributeCode]
  if (!attribute) {
    throw new Error(`Attribute ${attributeCode} does not exist in entity ${entity.name}`)
  }
  let mappedTo = attribute.mapping
  if (mappedTo && (mappedTo.expressionType === UBDomain.ExpressionType.Field) && mappedTo.expression) {
    return mappedTo.expression
  } else {
    return attributeCode
  }
}

function createDefUniqueIndex (dialect, tableDef, sqlAlias, attrName, isHistory, storage) {
  var xDef = {
    isUnique: true,
    name: formatName('UIDX_', sqlAlias, `_${attrName.toUpperCase()}`, dialect),
    keys: [ attrName ]
  }
  if (isHistory) {
    xDef.keys.push('mi_dateFrom')
    // если елемент уникален то никак ни в рамках истории одного элемента
    // xDef.keys.push('mi_data_id');
  }
  if (storage.safeDelete) {
    if (DDLGenerator.isPostgre(dialect)) {
      // felix 29.10.2013 TODO После переделки на COALESCE стало невозможно сравнить индексы на postgres,
      // рассматривается вариант перехода на ненулевое значение. Пока временно возвращено поле без COALESCE
      // xDef.keys.push("COALESCE(mi_deletedate, TIMESTAMP WITH TIME ZONE 'epoch')");
      xDef.keys.push('mi_deleteDate')
    } else {
      xDef.keys.push('mi_deleteDate')
    }
  }
  tableDef.addIndex(xDef)
}

/**
 * Create a shorten name based on DDLGenerator.MAX_DB_IDENTIFIER_LENGTHS for a given DB dialect
 * @param prefix
 * @param root
 * @param suffix
 * @param {DDLGenerator.dbDialectes} dialect
 * @returns {*}
 */
function formatName (prefix, root, suffix, dialect = DDLGenerator.dbDialectes.AnsiSQL) {
  const MAX_IDENTIFIER_LEN = DDLGenerator.MAX_DB_IDENTIFIER_LENGTHS[dialect]
  let totalLen = prefix.length + root.length + suffix.length
  let deltaLen
  if (totalLen > MAX_IDENTIFIER_LEN) {
    deltaLen = totalLen - MAX_IDENTIFIER_LEN
    if (deltaLen < suffix.length - 1) {
      suffix = suffix.substring(0, suffix.length - deltaLen)
    } else {
      deltaLen = deltaLen - (suffix.length - 2)
      suffix = suffix.substring(0, 2)
      if (deltaLen < root.length - 1) {
        root = root.substring(0, root.length - deltaLen)
      }
    }
  }
  return prefix + root + suffix
}

class DDLGenerator {
  constructor () {
    /**
     * @type {Array<TableDefinition>}
     */
    this.referenceTableDefs = []
    // this.connections = {}
    this.relatedEntities = []
    this.isUnsafe = false
  }

  /**
   * Generate DD SQL for entity list
   * @param {Array<string>} names Entity names (may be regular expressions)
   * @param {UBConnection} conn
   * @param {boolean} [unsafe=false]
   * @return {Object} DDL SQL
   */
  generateDDL (names, conn, unsafe = false) {
    let result = {}
    let alreadyTraversed = new WeakSet()

    this.isUnsafe = unsafe
    let domain = conn.getDomainInfo(true) // request extended domain info
    let namesRe = names.map((re) => new RegExp(re))

    let forGeneration = _.filter(domain.entities, (entity) => {
      for (let re of namesRe) {
        // ignore DDL generation for External & Virtual entities
        if (re.test(entity.name) && (entity.dsType === UBDomain.EntityDataSourceType.Normal)) {
          return true
        }
      }
      return false
    })

    for (let entity of forGeneration) {
      alreadyTraversed.add(entity)
      this.createReference(conn, entity)
    }
    // load referenced object for comparator
    this.relatedEntities.forEach((entityName) => {
      let entity = domain.get(entityName)
      if (alreadyTraversed.has(entity)) {
        return // continue
      }
      let tabDef = this.createReference(conn, entity)
      alreadyTraversed.add(entity)
      if (tabDef) {
        tabDef.doComparision = false
      }
    })

    let tablesByConnection = _.groupBy(
      this.referenceTableDefs,
      (tableDef) => tableDef.__entity.connectionName
    )

    for (let dbConnCfg of domain.connections) {
      if (tablesByConnection[dbConnCfg.name] && tablesByConnection[dbConnCfg.name].length) {
        /** @type DBAbstract */
        let Maker = require(`./db/${dbConnCfg.dialect}`)
        let maker = new Maker(conn, dbConnCfg, tablesByConnection[dbConnCfg.name])
        console.log(`Loading database metadata for connection ${maker.dbConnectionConfig.name} (${maker.dbConnectionConfig.dialect})...`)
        console.time('Loaded in')
        maker.loadDatabaseMetadata()
        console.timeEnd('Loaded in')
        maker.compare()
        result[dbConnCfg.name] = maker.generateStatements()
      }
    }
    return result
  }

  /**
   * Create reference table structure based on metadata
   * @param {UBConnection} conn
   * @param {UBEntity} entity
   * @return {TableDefinition}
   */
  createReference (conn, entity) {
    let addedAttributes = new Map()
    let sqlAlias = (entity.sqlAlias || entity.name).toUpperCase()
    let isHistory = entity.mixins.dataHistory
    let storage = entity.mixins.mStorage
    let dialect = entity.connectionConfig.dialect
    let supportLang = entity.connectionConfig.supportLang
    let entityTableName = getTableDBName(entity)
    let tabNameInUpper = entityTableName.toUpperCase()
    let lang

    if (_.find(this.referenceTableDefs, (tabDef) => tabDef.name.toUpperCase() === tabNameInUpper)) {
      return null // already added
    }
    let tableDef = new TableDefinition({
      name: entityTableName,
      caption: entity.description || entity.caption
    })

    let defaultLang = conn.getAppInfo().defaultLang
    // generateIndexForPK = (dialect === TubSQLDialect.Oracle);

    _.forEach(entity.attributes,
      /** @param {UBEntityAttribute} attribute
       * @param {string} attrCode
       */
      (attribute, attrCode) => {
        if (attribute.mapping && (attribute.mapping.expressionType === UBDomain.ExpressionType.Expression)) {
          return // calculated attribute
        }
        addedAttributes.set(attrCode.toUpperCase(), attribute)
        let m = attribute.mapping
        if (m && (m.expressionType === UBDomain.ExpressionType.Field) && m.expression) {
          if (!strIComp(attrCode, m.expression) && addedAttributes.has(m.expression.toUpperCase())) {
            return // use a original attribute
          }
          if (!strIComp(attrCode, m.expression) && entity.attributes[m.expression]) return // Entity attribute mapped to other attribute
          attrCode = m.expression // use a field name from mapping
          if (tableDef.columnByName(attrCode)) return  // already added
        }
        let attrName = attrCode.toUpperCase()
        let attrNameF = attrCode.toUpperCase()
        if (!attrNameF) {
          throw new Error('attrNameF is undefined for ' + attrCode)
        }

        if (attribute.dataType === UBDomain.ubDataTypes.Many) {
          this.addManyTable(entity, attribute)
          return
        }
        DDLGenerator.addTableField(tableDef, attribute, attrCode, null /* attrCode */)
        // multi language
        if (attribute.isMultiLang && ((attribute.dataType === UBDomain.ubDataTypes.String) || (attribute.dataType === UBDomain.ubDataTypes.Text))) {
          for (lang of supportLang) {
            if (lang !== defaultLang) {
              DDLGenerator.addTableField(tableDef, attribute, attrCode + '_' + lang, attrCode)
            }
          }
        }

        if (attribute.dataType === UBDomain.ubDataTypes.Boolean) {
          let fName = formatName(`CHK_${sqlAlias}_`, attrCode, '_BOOL', entity.connectionConfig.dialect)
          tableDef.addCheckConstr({
            name: fName,
            column: attrCode,
            type: 'bool'
          })
        }

        if ((attribute.dataType === UBDomain.ubDataTypes.Entity) && (attribute.name !== 'ID')) {
          this.relatedEntities.push(attribute.associatedEntity)
          let associatedEntity = attribute.getAssociatedEntity()
          if (associatedEntity.connectionName === entity.connectionName) { // referential constraint between different connection not supported
            tableDef.addFK({
              name: genFKName(sqlAlias, attrNameF, (associatedEntity.sqlAlias || associatedEntity.name || ''), entity.connectionConfig.dialect),
              keys: [attribute.name.toUpperCase()],
              references: associatedEntity.name,
              generateFK: attribute.generateFK
            })
          }
          // indexing
          if (!attribute.isUnique) {
            tableDef.addIndex({
              name: formatName('IDX_', sqlAlias, `_${attrNameF}`, entity.connectionConfig.dialect),
              isUnique: false,
              keys: [ attrName ]
            })
            if (attribute.isMultiLang) {
              for (lang of supportLang) {
                if (lang !== defaultLang) {
                  tableDef.addIndex({
                    name: formatName('IDX_', sqlAlias, `_${attrNameF}_${lang}`, entity.connectionConfig.dialect),
                    isUnique: false,
                    keys: [attrName]
                  })
                }
              }
            }
          }
        }

        if (attribute.isUnique) {
          createDefUniqueIndex(dialect, tableDef, sqlAlias, attrName, isHistory, storage)
          if (attribute.isMultiLang) {
            for (lang of supportLang) {
              if (lang !== defaultLang) createDefUniqueIndex(dialect, tableDef, sqlAlias, attrName + '_' + lang, isHistory, storage)
            }
          }
        }
      }
    )

    if (entity.cacheType === UBDomain.EntityCacheTypes.Entity || entity.cacheType === UBDomain.EntityCacheTypes.SessionEntity) {
      tableDef.addSequence({ name: 'S_' + tableDef.name.toUpperCase(), randomStart: true })
    }

    // for a primary key generators, what dose not mapped on the select statement
    if (entity.mapping && entity.mapping.pkGenerator && (entity.mapping.pkGenerator.indexOf('select ') < 0)) {
      tableDef.addSequence({ name: entity.mapping.pkGenerator.toUpperCase(), randomStart: false })
    }

    if (entity.mixins.tree) {
      tableDef.addIndex({
        name: formatName('IDX_', sqlAlias, '_TREEPATH', entity.connectionConfig.dialect),
        isUnique: false,
        keys: [ 'mi_treePath' ]
      })
    }

    if (entity.mixins.unity) {
      let u = entity.mixins.unity
      this.relatedEntities.push(u.entity)
      let refTo = entity.domain.get(u.entity)
      tableDef.addFK({
        name: genFKName(sqlAlias, 'id', (refTo.sqlAlias || refTo.name || ''), entity.connectionConfig.dialect),
        keys: [ 'ID' ],
        references: refTo.name,
        generateFK: true
      })
    }

    if (entity.mixins.dataHistory) {
      let keys = ['mi_dateTo']
      if (entity.mixins.mStorage && entity.mixins.mStorage.safeDelete) {
        keys.push('mi_deleteDate')
      }
      tableDef.addIndex({
        name: formatName('IDX_', sqlAlias, '_DTODD', entity.connectionConfig.dialect),
        isUnique: false,
        keys: keys
      })
      tableDef.addCheckConstr({
        name: 'CHK_' + sqlAlias + '_HIST',
        expression: 'mi_dateFrom <= mi_dateTo',
        type: 'custom'
      })

      keys = ['mi_dateFrom', 'mi_data_id']
      if (entity.mixins.mStorage && entity.mixins.mStorage.safeDelete) {
        keys.push('mi_deleteDate')
        tableDef.addIndex({
          name: formatName('UIDX_', sqlAlias, '_HIST', entity.connectionConfig.dialect),
          isUnique: true,
          keys
        })
      }
    }

    tableDef.primaryKey = {name: 'PK_' + sqlAlias, keys: [getAttributeDBName(entity, 'ID')]} // [UB-1386]

    this.addCustomElements(tableDef, entity)

    tableDef.__entity = entity
    this.referenceTableDefs.push(tableDef)
    return tableDef
  }

  /**
   *
   * @param {TableDefinition} tableDef
   * @param {UBEntity} entity
   */
  addCustomElements (tableDef, entity) {
    let dbKeys
    let haveDeleteDateInFields = false
    let dialect = entity.connectionConfig.dialect
    let isHistory = entity.mixins.dataHistory
    if (entity.dbKeys) {
      dbKeys = entity.dbKeys
      _.forEach(dbKeys, (fields, dbKey) => {
        let indexDef = { name: dbKey, isUnique: true, keys: [], keyOptions: {} }
        _.forEach(fields, (options, field) => {
          let fieldKey = field
          if (options.func && ((DDLGenerator.isOracle(dialect)) || (DDLGenerator.isPostgre(dialect)))) {
            fieldKey = options.func + '(' + fieldKey + ')'
          }
          if (options.sort && (DDLGenerator.isEqualStrings(options.sort, 'DESC'))) {
            fieldKey += ' DESC'
          }
          indexDef.keys.push(fieldKey)
          if (field === 'mi_deleteDate') {
            haveDeleteDateInFields = true
          }
        })
        if (isHistory) {
          indexDef.keys.push('mi_dateFrom')
        }
        if (entity.mixins.mStorage && entity.mixins.mStorage.safeDelete && !haveDeleteDateInFields) {
          indexDef.keys.push('mi_deleteDate')
        }
        tableDef.addIndex(indexDef)
      })
    }
    if (entity.dbExtensions) {
      _.forEach(entity.dbExtensions, (commands, dbKey) => {
        if (!commands.type) {
          commands.type = 'OTHER'
        }
        let objDef
        if (commands.definition && (commands.type !== 'OTHER')) {
          let definition = commands.definition
          switch (commands.type) {
            case 'INDEX':
              objDef = {name: dbKey, keys: [], isUnique: definition.isUnique}
              _.forEach(definition.keys, (fKeyOptions, fkeyText) => {
                if (fKeyOptions.func && ((DDLGenerator.isOracle(dialect)) || (DDLGenerator.isPostgre(dialect)))) {
                  fkeyText = fKeyOptions.func + '(' + fkeyText + ')'
                }
                if (fKeyOptions.sort && (DDLGenerator.isEqualStrings(fKeyOptions.sort, 'DESC'))) {
                  fkeyText += ' DESC'
                }
                objDef.keys.push(fkeyText)
              })
              tableDef.addIndex(objDef, true)
              break
            case 'CHECK':
              objDef = {name: dbKey, type: 'custom', expression: definition.check}
              tableDef.addCheckConstr(objDef, true)
              break
            case 'FK':
              objDef = {name: dbKey, keys: [ definition.key ], references: definition.references, generateFK: true}
              this.relatedEntities.push(objDef.references)
              tableDef.addFK(objDef, true)
              break
          }
        } else {
          objDef = {name: dbKey, expression: commands[ DDLGenerator.dbDialectes[ dialect ] ]}
          tableDef.addOther(objDef)
        }
      })
    }
  }

  /**
   *
   * @param {TableDefinition} tableDef
   * @param {UBEntityAttribute} attribute
   * @param {String} fieldName
   * @param {String} [baseName=null]
   */
  static addTableField (tableDef, attribute, fieldName, baseName = null) {
    let dataType, size, prec, enumGroup
    let allowNull = attribute.allowNull
    let refTable
    // convert UB type to phisical type
    switch (attribute.dataType) {
      case UBDomain.ubDataTypes.String:
        dataType = 'NVARCHAR'
        size = attribute.size
        if (DDLGenerator.isOracle(attribute.entity.connectionConfig.dialect) && (attribute.size > 2000)) {
          throw new Error(`Specified length of attribute "${attribute.entity.name}.${attribute.name}" too long for Oracle`)
        }
        break
      case UBDomain.ubDataTypes.Enum:
        dataType = 'NVARCHAR'
        size = 32
        enumGroup = attribute.enumGroup
        break
      case UBDomain.ubDataTypes.Int:
        dataType = 'INTEGER'
        break
      case UBDomain.ubDataTypes.BigInt:
        dataType = 'BIGINT'
        break
      case UBDomain.ubDataTypes.Float:
        dataType = 'FLOAT'
        size = 19
        prec = 4
        break
      case UBDomain.ubDataTypes.Currency:
        dataType = 'CURRENCY'
        size = 19
        prec = 2
        break
      case UBDomain.ubDataTypes.Boolean:
        dataType = 'BOOLEAN'
        allowNull = false
        break
      case UBDomain.ubDataTypes.DateTime:
        dataType = 'DATETIME'
        break
      case UBDomain.ubDataTypes.Date:
        dataType = 'DATETIME'
        break
      case UBDomain.ubDataTypes.Text:
        dataType = 'TEXT'
        break
      case UBDomain.ubDataTypes.ID:
        dataType = 'BIGINT'
        allowNull = false
        break
      case UBDomain.ubDataTypes.Entity:
        dataType = 'BIGINT'
        refTable = getTableDBName(attribute.entity.domain.get(attribute.associatedEntity))
        break
      case UBDomain.ubDataTypes.Document:
        dataType = 'VARCHAR'
        size = 4000
        break
      case UBDomain.ubDataTypes.TimeLog:
        dataType = 'BIGINT'
        break
      case UBDomain.ubDataTypes.BLOB:
        dataType = 'BLOB'
        break
      default:
        throw new Error(`Unknown data type "${attribute.dataType}" for "${attribute.entity.name}.${attribute.name}"`)
    }
    tableDef.addColumn({
      name: fieldName,
      dataType,
      description: attribute.description || attribute.caption,
      allowNull,
      defaultValue: (attribute.defaultValue ? attribute.defaultValue : undefined),
      defaultConstraintName: attribute.defaultValue
        ? formatName(attribute.entity.sqlAlias || attribute.entity.name, `_${fieldName.toUpperCase()}`, '_DEF', attribute.entity.connectionConfig.dialect)
        : '',
      size,
      prec,
      enumGroup,
      refTable,
      baseName
    })
  }

  /**
   *
   * @param {UBEntity} entity
   * @param {UBEntityAttribute} attribute
   */
  addManyTable (entity, attribute) {
    let associatedEntity = entity.domain.get(attribute.associatedEntity)
    this.relatedEntities.push(attribute.associatedEntity)
    let tableDef = new TableDefinition({
      name: attribute.associationManyData,
      caption: ''
    })
    tableDef.__entity = entity.domain.get(attribute.associationManyData)
    tableDef.addColumn({
      name: 'sourceID',
      dataType: 'BIGINT',
      allowNull: false
    })
    tableDef.addColumn({
      name: 'destID',
      dataType: 'BIGINT',
      allowNull: false
    })
    tableDef.primaryKey = {name: 'PK_' + attribute.associationManyData, keys: [ 'sourceID', 'destID' ]}
    tableDef.addFK({
      name: genFKName(attribute.associationManyData, 'SOURCEID', entity.sqlAlias, entity.connectionConfig.dialect),
      keys: [ 'sourceID'.toUpperCase() ],
      references: getTableDBName(entity),
      generateFK: true
    })
    tableDef.addFK({
      name: genFKName(attribute.associationManyData, 'DESTID', associatedEntity.sqlAlias, entity.connectionConfig.dialect),
      keys: [ 'destID'.toUpperCase() ],
      references: getTableDBName(associatedEntity),
      generateFK: true
    })
    tableDef.addIndex({
      name: formatName('IDX_', attribute.associationManyData, '_DESTID', entity.connectionConfig.dialect),
      keys: [ 'destID'.toUpperCase() ]
    })
    tableDef.isIndexOrganized = true
    this.referenceTableDefs.push(tableDef)
  }

  /**
   * @param {String} dialect
   * @returns {boolean}
   */
  static isOracle (dialect) {
    return dialect.startsWith('Oracle')
  }

  /**
   * @param {String} dialect
   * @returns {boolean}
   */
  static isMSSQL (dialect) {
    return dialect.startsWith('MSSQL')
  }

  static isPostgre (dialect) {
    return (dialect === DDLGenerator.dbDialectes.PostgreSQL)
  }

  static isEqualStrings (a, b) {
    return _.isString(a) && _.isString(b) && (a.toUpperCase() === b.toUpperCase())
  }

  static isEqualArrayKey (array1, array2) {
    return _.isEqual(array1, array2)
  }
}

DDLGenerator.specialColumns = {
  mi_owner: { default: 10 },
  mi_createUser: { default: 10 },
  mi_createDate: { defaultExpr: 'currentDate' },
  mi_modifyUser: { default: 10 },
  mi_modifyDate: { defaultExpr: 'currentDate' }
}

DDLGenerator.dialectsPriority = {
  MSSQL2012: [ 'MSSQL2012', 'MSSQL', 'AnsiSQL' ],
  MSSQL2008: [ 'MSSQL2008', 'MSSQL', 'AnsiSQL' ],
  MSSQL: [ 'MSSQL', 'AnsiSQL' ],
  Oracle11: [ 'Oracle11', 'Oracle', 'AnsiSQL' ],
  Oracle10: [ 'Oracle10', 'Oracle', 'AnsiSQL' ],
  Oracle9: [ 'Oracle9', 'Oracle', 'AnsiSQL' ],
  Oracle: [ 'Oracle', 'AnsiSQL' ],
  PostgreSQL: [ 'PostgreSQL', 'AnsiSQL' ],
  AnsiSQL: [ 'AnsiSQL' ],
  Firebird: [ 'Firebird', 'AnsiSQL' ],
  SQLite3: [ 'SQLite3', 'AnsiSQL' ]
}

/**
 * @enum
 */
DDLGenerator.dbDialectes = {
  AnsiSQL: 'AnsiSQL',
  Oracle: 'Oracle',
  MSSQL: 'MSSQL',
  MSSQL2008: 'MSSQL2008',
  MSSQL2012: 'MSSQL2012',
  Oracle9: 'Oracle9',
  Oracle10: 'Oracle10',
  Oracle11: 'Oracle11',
  SQLite3: 'SQLite3',
  PostgreSQL: 'PostgreSQL',
  Firebird: 'Firebird'
}

DDLGenerator.MAX_DB_IDENTIFIER_LENGTHS = {
  AnsiSQL: 30,
  Oracle: 30,
  MSSQL: 116,
  MSSQL2008: 116,
  MSSQL2012: 116,
  Oracle9: 30,
  Oracle10: 30,
  Oracle11: 30,
  Oracle12: 116,
  SQLite3: 128,
  PostgreSQL: 63,
  Firebird: 30
}

module.exports = DDLGenerator
