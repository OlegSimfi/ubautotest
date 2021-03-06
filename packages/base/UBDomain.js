/**
 * UnityBase domain object model (metadata) - in-memory representation of all *.meta files included in the application config.
 *
 * Developer should never create {@link UBDomain} class directly, but instead use a:
 *
 *  - inside server-side methods - {@link App.domainInfo App.domainInfo} property
 *  - inside CLI scripts - using {@link UBConnection.getDomainInfo UBConnection.getDomainInfo} method
 *  - inside a browser - `UBConnection.domain` property
 *
 * Information about domain is used in many aspects of UnityBase:
 *
 *  - database generation
 *  - documentation generation
 *  - forms generation
 *  - views generation etc.
 *  - transform UBQL -> SQL
 *  - etc
 *
 * @module @unitybase/base/UBDomain
 */

const _ = require('lodash')

/**
 * Database connection config (w/o credential)
 * @typedef {Object} DBConnectionConfig
 * @property {string} name
 * @property {string} dialect
 * @property {Array<string>} supportLang
 * @property {string} advSettings database specific settings
 */

/**
 * @classdesc
 * UnityBase domain object model.
 * Construct new UBDomain instance based on getDomainInfo UB server method result
 *
 * Usage sample:
 *
 *     // retrieve a localized caption of uba_user.name attribute
 *     domain.get('uba_user').attr('name').caption
 *
 * @class
 * @param {Object} domainInfo getDomainInfo UB server method result
 * @param {Object} domainInfo.domain raw entities collection
 * @param {Object} domainInfo.entityMethods entities methods access rights for current user
 * @param {Object} domainInfo.models information about domain models
 * @param {Object} domainInfo.i18n entities localization to current user language
 * @param {Object} domainInfo.forceMIMEConvertors list of registered server-side MIME converters for document type attribute content
 */
function UBDomain (domainInfo) {
  let me = this
  let entityCodes = Object.keys(domainInfo.domain)
  let isV4API = (typeof domainInfo.entityMethods === 'undefined')
  /**
   * Hash of entities. Keys is entity name, value is UBEntity
   * @type {Object<String, UBEntity>}
   */
  this.entities = {}
  /**
   * Connection collection (for extended domain info only).
   * @type {Array<DBConnectionConfig>}
   */
  this.connections = domainInfo['connections']
  entityCodes.forEach(function (entityCode) {
    if (isV4API) {
      let entity = domainInfo.domain[entityCode]
      me.entities[entityCode] = new UBEntity(
        entity,
        entity.entityMethods || {},
        entity.i18n,
        entityCode,
        me
      )
    } else {
      me.entities[entityCode] = new UBEntity(
        domainInfo.domain[entityCode],
        domainInfo.entityMethods[entityCode] || {},
        domainInfo.i18n[entityCode],
        entityCode,
        me
      )
    }
  })

  /**
   * Models collection
   * @type {Object<String, UBModel>}
   */
  this.models = {}
  let modelCodes = Object.keys(domainInfo.models)
  modelCodes.forEach(function (modelCode) {
    let m = domainInfo.models[modelCode]
    me.models[modelCode] = new UBModel(m, modelCode)
  })

  /**
   *
   * @type {Object}
   * @readonly
   */
  this.forceMIMEConvertors = domainInfo.forceMIMEConvertors
}

/**
 * Check all provided entity methods are accessible via RLS.
 *
 * If entity does not exist in domain or at last one of provided methods is not accessible - return false
 *
 * @param {String} entityCode
 * @param {String|Array} methodNames
 */
UBDomain.prototype.isEntityMethodsAccessible = function (entityCode, methodNames) {
  let entity = this.entities[entityCode]
  if (!entity) return false
  return Array.isArray(methodNames) ? entity.haveAccessToMethods(methodNames) : entity.haveAccessToMethod(methodNames)
}
/**
 * Get entity by code
 * @param {String} entityCode
 * @param {Boolean} [raiseErrorIfNotExists=true] If `true`(default) and entity does not exists throw error
 * @returns {UBEntity}
 */
UBDomain.prototype.get = function (entityCode, raiseErrorIfNotExists) {
  let result = this.entities[entityCode]
  if ((raiseErrorIfNotExists !== false) && !result) {
    throw new Error('Entity with code "' + entityCode + '" does not exists or not accessible')
  }
  return result
}

/**
 * Check entity present in domain & user has access right for at least one entity method
 * @param {String} entityCode
 * @returns {Boolean}
 */
UBDomain.prototype.has = function (entityCode) {
  return !!this.entities[entityCode]
}

/**
* @callback domainEntitiesIteratorCallback
* @param {UBEntity} entity
* @param {String} entityCode
* @param {Object<String, UBEntity>} entities
*/

/**
 * Iterates over domain entities and invokes `callBack` for each entity.
 * The iteratee is invoked with three arguments: (UBEntity, entityName, UBDomain.entities)
 * @param {domainEntitiesIteratorCallback} cb
 */
UBDomain.prototype.eachEntity = function (cb) {
  return _.forEach(this.entities, cb)
}

/**
 * Filter entities by properties
 * @example
 *
 *      // sessionCachedEntites contains all entities with property cacheType equal Session
 *      var sessionCachedEntites = domain.filterEntities({cacheType: 'Session'});
 *
 * @param {Object|Function} config
 * @returns {Array}
 */
UBDomain.prototype.filterEntities = function (config) {
  if (_.isFunction(config)) {
    return _.filter(this.entities, config)
  } else {
    return _.filter(this.entities, function (item) {
      let res = true
      for (let prop in config) {
        if (config.hasOwnProperty(prop)) {
          res = res && (item[prop] === config[prop])
        }
      }
      return res
    })
  }
}

/**
 * UnityBase base attribute data types
 * @readonly
 * @enum
 */
UBDomain.ubDataTypes = {
  /** Small string. MSSQL: NVARCHAR, ORACLE: NVARCHAR2, POSTGRE: VARCHAR */
  String: 'String',
  /** 32-bite Integer. MSSQL: INT, ORACLE: INTEGER, POSTGRE: INTEGER */
  Int: 'Int',
  /** 64-bite Integer. MSSQL: BIGINT, ORACLE: NUMBER(19), POSTGRE: BIGINT */
  BigInt: 'BigInt',
  /** Double. MSSQL: FLOAT, ORACLE: NUMBER(19, 4), POSTGRE: NUMERIC(19, 4) */
  Float: 'Float',
  /** Currency. MSSQL: FLOAT, ORACLE: NUMBER(19, 2), POSTGRE: NUMERIC(19, 2) */
  Currency: 'Currency',
  /** Boolean. MSSQL: TINYINT, ORACLE: NUMBER(1), POSTGRE: SMALLINT */
  Boolean: 'Boolean',
  /** Date + Time in UTC (GMT+0) timezone. MSSQL: DATETIME, OARCLE: DATE, POSTGRE: TIMESTAMP WITH TIME ZONE */
  DateTime: 'DateTime',
  /** Long strint. MSSQL: NVARCHAR(MAX), ORACLE: CLOB, POSTGRE: TEXT */
  Text: 'Text',
  /** Alias for BigInt */
  ID: 'ID',
  /** Reference to enother entity. BigInt */
  Entity: 'Entity',
  /** Store a JSON with information about Document place in blob store */
  Document: 'Document',
  Many: 'Many',
  /**  Seconds since UNIX epoch, Int64. MSSQL: BIGINT, ORACLE: NUMBER(19), POSTGRE: BIGINT */
  TimeLog: 'TimeLog',
  /** Enumertion (see ubm_enum) */
  Enum: 'Enum',
  /** Bynary data. MSSQL: VARBINARY(MAX), ORACLE: BLOB, POSTGRE: BYTEA */
  BLOB: 'BLOB',
  /** Date (without time) in UTC (GMT+0) */
  Date: 'Date'
}

UBDomain.prototype.ubDataTypes = UBDomain.ubDataTypes

/**
 * Types of expressions in attribute mapping
 * @readonly
 * @enum
 */
UBDomain.ExpressionType = {
  Field: 'Field',
  Expression: 'Expression'
}

/**
 * UnityBase base mixins
 * @readonly
 * @enum
 */
UBDomain.ubMixins = {
  dataHistory: 'dataHistory',
  mStorage: 'mStorage',
  unity: 'unity',
  treePath: 'treePath'
}

/**
 * Service attribute names
 * @readonly
 * @enum
 */
UBDomain.ubServiceFields = {
  dateFrom: 'mi_datefrom',
  dateTo: 'mi_dateto'
}

/**
 * Entity dataSource types
 * @enum {String}
 * @readonly
 */
UBDomain.EntityDataSourceType = {
  Normal: 'Normal',
  External: 'External',
  System: 'System',
  Virtual: 'Virtual'
}

/**
 * @enum
 */
UBDomain.EntityCacheTypes = {
  None: 'None',
  Entity: 'Entity',
  Session: 'Session',
  SessionEntity: 'SessionEntity'
}

/**
 * Priority to apply a mapping of a attributes/entities to the physical tables depending of connection dialect
 */
UBDomain.dialectsPriority = {
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
 * Return physical type by UBDataType
 * @param {String} dataType
 * @return {String}
 */
UBDomain.getPhysicalDataType = function (dataType) {
  let ubDataTypes = UBDomain.ubDataTypes
  let typeMap = {}

  if (!this.physicalTypeMap) {
    typeMap[ubDataTypes.Int] = 'int'
    typeMap[ubDataTypes.Entity] = 'int'
    typeMap[ubDataTypes.ID] = 'int'
    typeMap[ubDataTypes.BigInt] = 'int'

    typeMap[ubDataTypes.String] = 'string'
    typeMap[ubDataTypes.Text] = 'string'
    typeMap[ubDataTypes.Enum] = 'string'

    typeMap[ubDataTypes.Float] = 'float'
    typeMap[ubDataTypes.Currency] = 'float'

    typeMap[ubDataTypes.Boolean] = 'boolean'

    typeMap[ubDataTypes.Date] = 'date'
    typeMap[ubDataTypes.DateTime] = 'date'

    this.physicalTypeMap = typeMap
  }
  return this.physicalTypeMap[dataType] || 'auto'
}

/**
 * Model (logical group of entities)
 * @class
 * @param cfg
 * @param cfg.path
 * @param cfg.needInit
 * @param cfg.needLocalize
 * @param cfg.order
 * @param {string} [cfg.moduleName]
 * @param {string} [cfg.moduleSuffix]
 * @param {string} [cfg.clientRequirePath] if passed are used instead of moduleName + moduleSuffix
 * @param {string} [cfg.realPublicPath]
 * @param {string} modelCode
 */
function UBModel (cfg, modelCode) {
  /**
   * Model name as specified in application config
   * @type {string}
   */
  this.name = modelCode
  this.path = cfg.path
  if (cfg.needInit) {
    /**
     * `initModel.js` script is available in the public folder (should be injected by client)
     * @type {boolean}
     */
    this.needInit = cfg.needInit
  }
  if (cfg.needLocalize) {
    /**
     * `locale-Lang.js` script is available in the public folder (should be injected by client)
     * @type {boolean}
     */
    this.needLocalize = cfg.needLocalize
  }
  /**
   * An order of model initialization (as it is provided in server domain config)
   * @type {number}
   */
  this.order = cfg.order
  /**
   * Module name for `require`
   */
  this.moduleName = cfg.moduleName
  // if (cfg.moduleSuffix && cfg.moduleName) {
  //   this.moduleName = this.moduleName + '/' + cfg.moduleSuffix
  // }
  /**
   * The path for retrieve a model public accessible files (using clientRequire endpoint)
   *
   * @type {string}
   */
  this.clientRequirePath = /* cfg.clientRequirePath
    ? cfg.clientRequirePath
    : */(cfg.moduleSuffix && cfg.moduleName)
      ? this.moduleName + '/' + cfg.moduleSuffix
      : (this.moduleName || this.path)

  if (cfg.realPublicPath) {
    /**
     * Server-side domain only - the full path to model public folder (if any)
     * @type {string}
     */
    this.realPublicPath = cfg.realPublicPath
  }
}
UBModel.prototype.needInit = false
UBModel.prototype.needLocalize = false
UBModel.prototype.realPublicPath = ''

/**
 * Collection of attributes
 * @class
 */
function UBEntityAttributes () {}
/**
 * Return a JSON representation of all entity attributes
 * @returns {Object}
 */
UBEntityAttributes.prototype.asJSON = function () {
  let result = {}
  _.forEach(this, function (prop, propName) {
    if (prop.asJSON) {
      result[propName] = prop.asJSON()
    } else {
      result[propName] = prop
    }
  })
  return result
}

/** @class */
function UBEntityMapping (maping) {
  /**
   * @type {string}
   */
  this.selectName = maping.selectName || ''
  /** @type {string} */
  this.execName = maping.execName || this.selectName
  /** @type {string} */
  this.pkGenerator = maping.pkGenerator
}

/**
 * @class
 * @param {Object} entityInfo
 * @param {Object} entityMethods
 * @param {Object} i18n
 * @param {String} entityCode
 * @param {UBDomain} domain
 */
function UBEntity (entityInfo, entityMethods, i18n, entityCode, domain) {
  let me = this
  let mixinNames, mixinInfo, i18nMixin, dialectProiority

  if (i18n) {
    _.merge(entityInfo, i18n)
  }
  /**
   * Non enumerable (to prevent JSON.stringify circular ref) read only domain
   * @property {UBDomain} domain
   * @readonly
   */
  Object.defineProperty(this, 'domain', {enumerable: false, value: domain})
  /**
   * @type {String}
   * @readonly
   */
  this.code = entityCode
  /**
   * Entity model name
   * @type{String}
   * @readonly
   */
  this.modelName = entityInfo.modelName
  /**
   * Entity name
   * @type {String}
   * @readonly
   */
  this.name = entityInfo.name

  if (entityInfo.caption) this.caption = entityInfo.caption
  if (entityInfo.description) this.description = entityInfo.description
  if (entityInfo.documentation) this.documentation = entityInfo.documentation
  if (entityInfo.descriptionAttribute) this.descriptionAttribute = entityInfo.descriptionAttribute
  if (entityInfo.cacheType) this.cacheType = entityInfo.cacheType
  if (entityInfo.dsType) this.dsType = entityInfo.dsType

  /**
   * Internal short alias
   * @type {String}
   * @readonly
   */
  this.sqlAlias = entityInfo.sqlAlias
  /**
   * Data source connection name
   * @type {String}
   * @readonly
   */
  this.connectionName = entityInfo.connectionName
  /**
   * This is a Full Text Search entity
   * @type {boolean}
   */
  this.isFTSDataTable = entityInfo.isFTSDataTable === true

  /**
   * Reference to connection definition (for extended domain only)
   * @type {DBConnectionConfig}
   * @readonly
   */
  this.connectionConfig = (this.connectionName && this.domain.connections) ? _.find(this.domain.connections, {name: this.connectionName}) : undefined
  /**
   * Optional mapping of entity to physical data (for extended domain info only).
   * Calculated from a entity mapping collection in accordance with application connection configuration
   * @type {UBEntityMapping}
   * @readonly
   */
  this.mapping = undefined

  if (entityInfo.mapping && Object.keys(entityInfo.mapping).length) {
    dialectProiority = UBDomain.dialectsPriority[this.connectionConfig.dialect]
    _.forEach(dialectProiority, function (dialect) {
      if (entityInfo.mapping[dialect]) {
        me.mapping = new UBEntityMapping(entityInfo.mapping[dialect])
        return false
      }
    })
  }

  /**
   * Optional dbKeys (for extended domain info)
   * @type {Object}
   */
  this.dbKeys = entityInfo.dbKeys && Object.keys(entityInfo.dbKeys).length ? entityInfo.dbKeys : undefined
  /**
   * Optional dbExtensions (for extended domain info)
   * @type {Object}
   */
  this.dbExtensions = entityInfo.dbExtensions && Object.keys(entityInfo.dbExtensions).length ? entityInfo.dbExtensions : undefined

  /**
   * Entity attributes collection
   * @type {Object<string, UBEntityAttribute>}
   */
  this.attributes = new UBEntityAttributes()
  _.forEach(entityInfo.attributes, function (attributeInfo, attributeCode) {
    me.attributes[attributeCode] = new UBEntityAttribute(attributeInfo, attributeCode, me)
  })

  mixinNames = Object.keys(entityInfo.mixins || {})
  /**
   * Collection of entity mixins
   * @type {Object<String, UBEntityMixin>}
   */
  this.mixins = {}
  mixinNames.forEach(function (mixinCode) {
    mixinInfo = entityInfo.mixins[mixinCode]
    i18nMixin = (i18n && i18n.mixins ? i18n.mixins[mixinCode] : null)
    switch (mixinCode) {
      case 'mStorage':
        me.mixins[mixinCode] = new UBEntityStoreMixin(mixinInfo, i18nMixin, mixinCode)
        break
      case 'dataHistory':
        me.mixins[mixinCode] = new UBEntityHistoryMixin(mixinInfo, i18nMixin, mixinCode)
        break
      case 'aclRls':
        me.mixins[mixinCode] = new UBEntityAclRlsMixin(mixinInfo, i18nMixin, mixinCode)
        break
      case 'fts':
        me.mixins[mixinCode] = new UBEntityFtsMixin(mixinInfo, i18nMixin, mixinCode)
        break
      case 'als':
        me.mixins[mixinCode] = new UBEntityAlsMixin(mixinInfo, i18nMixin, mixinCode)
        break
      default:
        me.mixins[mixinCode] = new UBEntityMixin(mixinInfo, i18nMixin, mixinCode)
    }
  })
  /**
   * Entity methods, allowed for current logged-in user in format {method1: 1, method2: 1}. 1 mean method is allowed
   * @type {Object<String, Number>}
   * @readOnly
   */
  this.entityMethods = entityMethods || {}
}

/**
 * Entity caption
 * @type {string}
 */
UBEntity.prototype.caption = ''
/**
 * Entity description
 * @type {string}
 */
UBEntity.prototype.description = ''
/**
 * Documentation
 * @type {string}
 */
UBEntity.prototype.documentation = ''
/**
 * Name of attribute witch used as a display value in lookup
 * @type {string}
 */
UBEntity.prototype.descriptionAttribute = ''

/**
 * Indicate how entity content is cached on the client side.
 *
 * @type {UBDomain.EntityCacheTypes}
 * @readonly
 */
UBEntity.prototype.cacheType = 'None'

/**
 *
 * @type {UBDomain.EntityDataSourceType}
 */
UBEntity.prototype.dsType = 'Normal'

/**
 * Return an entity caption to display on UI
 * @returns {string}
 */
UBEntity.prototype.getEntityCaption = function () {
  return this.caption || this.description
}

/**
 * Get entity attribute by code. Return undefined if attribute does not found
 * @param {String} attributeCode
 * @param {Boolean} [simple] Is do not complex attribute name. By default false.
 * @returns {UBEntityAttribute}
 */
UBEntity.prototype.attr = function (attributeCode, simple) {
  let res = this.attributes[attributeCode]
  if (!res && !simple) {
    res = this.getEntityAttribute(attributeCode)
  }
  return res
}

/**
 * Get entity attribute by code. Throw error if attribute does not found.
 * @param attributeCode
 * @returns {UBEntityAttribute}
 */
UBEntity.prototype.getAttribute = function (attributeCode) {
  let attr = this.attributes[attributeCode]
  if (!attr) {
    throw new Error(`Attribute ${this.code}.${attributeCode} doesn't exist`)
  }
  return attr
}

/**
 * @callback entityAttributesIteratorCallback
 * @param {UBEntityAttribute} attribute
 * @param {String} [attributeName]
 * @param {UBEntityAttributes} [attributes]
 */

/**
 * Iterates over entity attributes.
 * The iteratee is invoked with three arguments: (UBEntityAttribute, attributeName, UBEntityAttributes)
 * @param {entityAttributesIteratorCallback} callBack
 */
UBEntity.prototype.eachAttribute = function (callBack) {
  return _.forEach(this.attributes, callBack)
}

/**
 * Get entity mixin by code. Returns "undefined" if the mixin is not found
 * @param {String} mixinCode
 * @returns {UBEntityMixin}
 */
UBEntity.prototype.mixin = function (mixinCode) {
  return this.mixins[mixinCode]
}

/**
 * Check the entity has mixin. Returns `true` if the mixin is exist and enabled
 * @param {String} mixinCode
 * @returns {Boolean}
 */
UBEntity.prototype.hasMixin = function (mixinCode) {
  let mixin = this.mixins[mixinCode]
  if (mixinCode === 'audit') {
    return !mixin || (!!mixin && mixin.enabled)
  }
  return (!!mixin && mixin.enabled)
}

/**
 * Check the entity has mixin. Throw error if mixin dose not exist or not enabled
 * @param {String} mixinCode
 */
UBEntity.prototype.checkMixin = function (mixinCode) {
  if (!this.hasMixin(mixinCode)) {
    throw new Error('Entity ' + this.code + ' does not have mixin ' + mixinCode)
  }
}

UBEntity.prototype.asJSON = function () {
  let result = { code: this.code }
  _.forEach(this, function (prop, propName) {
    if (propName === 'domain') {
      return
    }
    if (prop.asJSON) {
      result[propName] = prop.asJSON()
    } else {
      result[propName] = prop
    }
  })
  return result
}

/**
 * Check current user have access to specified entity method
 * @param {String} methodCode
 * @returns {Boolean}
 */
UBEntity.prototype.haveAccessToMethod = function (methodCode) {
  return (UB.isServer && process.isServer)
    ? App.els(this.code, methodCode)
    : this.entityMethods[methodCode] === 1
}

/**
 * Filter attributes by properties
 * @param {Object|Function} config
 * @returns {Array}
 * example
 *
 *      domain.get('uba_user').filterAttribute({dataType: 'Document'});
 *
 *   return all attributes where property dataType equal Document
 */
UBEntity.prototype.filterAttribute = function (config) {
  if (_.isFunction(config)) {
    return _.filter(this.attributes, config)
  } else {
    return _.filter(this.attributes, function (item) {
      let res = true
      for (let prop in config) {
        if (config.hasOwnProperty(prop)) {
          res = res && (item[prop] === config[prop])
        }
      }
      return res
    })
  }
}

/**
 * Check current user have access to AT LAST one of specified methods
 * @param {Array} methods
 * @returns {boolean}
 */
UBEntity.prototype.haveAccessToAnyMethods = function (methods) {
  let me = this
  let fMethods = methods || []
  let result = false

  fMethods.forEach(function (methodCode) {
    if (UB.isServer && process.isServer) {
      result = result || App.els(me.code, methodCode)
    } else {
      result = result || me.entityMethods[ methodCode ] === 1
    }
  })
  return result
}

/**
 * Check current user have access to ALL of specified methods
 * @param {Array<String>} methods Method names
 * @returns {Boolean}
 */
UBEntity.prototype.haveAccessToMethods = function (methods) {
  let me = this
  let result = true
  let fMethods = methods || []

  fMethods.forEach(function (methodCode) {
    if (UB.isServer && process.isServer) {
      result = result && App.els(me.code, methodCode)
    } else {
      result = result && (me.entityMethods[ methodCode ] === 1)
    }
  })
  return result
}

/**
 * Convert UnityBase server dateTime response to Date object
 * @private
 * @param value
 * @returns {Date}
 */
function iso8601Parse (value) {
  return value ? new Date(value) : null
}

/**
 * Convert UnityBase server date response to Date object.
 * date response is a day with 00 time (2015-07-17T00:00Z), to get a real date we must add current timezone shift
 * @private
 * @param value
 * @returns {Date}
 */
function iso8601ParseAsDate (value) {
  let res = value ? new Date(value) : null
  if (res) {
    res.setTime(res.getTime() + res.getTimezoneOffset() * 60 * 1000)
  }
  return res
}

/**
 * Convert UnityBase server Boolean response to Boolean (0 = false & 1 = trhe)
 * @private
 * @param v Value to convert
 * @returns {Boolean|null}
 */
function booleanParse (v) {
  if (typeof v === 'boolean') {
    return v
  }
  if ((v === undefined || v === null || v === '')) {
    return null
  }
  return (v === 1) || (v === '1')
}

/**
 * Return array of conversion rules for raw server response data
 * @param {Array<String>} fieldList
 * @returns {Array<{index: number, convertFn: function}>}
 */
UBEntity.prototype.getConvertRules = function (fieldList) {
  let me = this
  let rules = []
  let types = UBDomain.ubDataTypes

  fieldList.forEach(function (fieldName, index) {
    let attribute = me.attr(fieldName)
    if (attribute) {
      if (attribute.dataType === types.DateTime) {
        rules.push({
          index: index,
          convertFn: iso8601Parse
        })
      } else if (attribute.dataType === types.Date) {
        rules.push({
          index: index,
          convertFn: iso8601ParseAsDate
        })
      } else if (attribute.dataType === types.Boolean) {
        rules.push({
          index: index,
          convertFn: booleanParse
        })
      }
    }
  })
  return rules
}

/**
 * Return description attribute name (`descriptionAttribute` metadata property)
 * This property may be empty or valid(validation performed by server)
 * If case property is empty - try to get attribute with code `caption`
 *
 * @return {String}
 */
UBEntity.prototype.getDescriptionAttribute = function () {
  let result = this.descriptionAttribute || 'caption'
  if (!this.attr(result)) {
    throw new Error('Missing description attribute for entity ' + this.code)
  }
  return result
}

/**
 * Return information about attribute and attribute entity. Understand complex attributes like firmID.firmType.code
 * @param {String} attributeName
 * @param {Number} [deep] If 0 - last, -1 - before last, > 0 - root. Default 0.
 * @return {{ entity: String, attribute: Object, attributeCode: String }}
 */
UBEntity.prototype.getEntityAttributeInfo = function (attributeName, deep) {
  let domainEntity = this
  let attributeNameParts = attributeName.split('.')
  let currentLevel = -(attributeNameParts.length - 1)
  let complexAttr = []
  let currentEntity = this.code
  /** @type UBEntityAttribute */
  let attribute
  let key

  if (deep && deep > 0) {
    return { entity: currentEntity, attribute: domainEntity.attr(attributeNameParts[0]), attributeCode: attributeNameParts[0] }
  }

  while (domainEntity && attributeNameParts.length) {
    if (domainEntity && attributeNameParts.length === 1) {
      complexAttr = attributeNameParts[0].split('@')
      if (complexAttr.length > 1) {
        domainEntity = this.domain.get(complexAttr[1]) // real entity is text after @
        attributeName = complexAttr[0]
      }
      return { entity: currentEntity, attribute: domainEntity.attr(attributeName), attributeCode: attributeName }
    }
    key = attributeNameParts.shift()
    complexAttr = key.split('@')
    if (complexAttr.length > 1) {
      currentEntity = complexAttr[1]
      domainEntity = this.domain.get(currentEntity) // real entity is text after @
      key = complexAttr[0]
    }
    attribute = domainEntity.attr(key)
    if (attribute) { // check that attribute exists in domainEntity
      if (currentLevel === (deep || 0)) {
        return { entity: currentEntity, attribute: attribute, attributeCode: key }
      }
      attributeName = attributeNameParts[0]
      if (attribute.dataType === 'Enum' && attributeName === 'name') {
        return { entity: currentEntity, attribute: attribute, attributeCode: key }
      } else {
        currentEntity = attribute.associatedEntity
        domainEntity = attribute.getAssociatedEntity()
      }
    } else {
      return undefined
    }
    currentLevel += 1
  }
  return undefined
}

/**
 * Return Entity attribute. Understand complex attributes like firmID.firmType.code
 * @param {String} attributeName
 * @param {Number} [deep] If 0 - last, -1 - before last, > 0 - root. Default 0.
 * @return {UBEntityAttribute}
 */
UBEntity.prototype.getEntityAttribute = function (attributeName, deep) {
  let domainEntity = this
  let attributeNameParts = attributeName.split('.')
  let currentLevel = -(attributeNameParts.length - 1)
  let complexAttr = []
  let attribute
  let key

  if (deep && deep > 0) {
    return domainEntity.attributes[attributeNameParts[0]]
  }

    // TODO: Сделать так же для других спец.символов, кроме @
  while (domainEntity && attributeNameParts.length) {
    if (domainEntity && attributeNameParts.length === 1) {
      complexAttr = attributeNameParts[0].split('@')
      if (complexAttr.length > 1) {
        domainEntity = this.domain.get(complexAttr[1]) // real entity is text after @
        attributeName = complexAttr[0]
      }
      return domainEntity.attributes[attributeName]
    }
    key = attributeNameParts.shift()
    complexAttr = key.split('@')
    if (complexAttr.length > 1) {
      domainEntity = this.domain.get(complexAttr[1]) // real entity is text after @
      key = complexAttr[0]
    }
    attribute = domainEntity.attributes[key]
    if (attribute) { // check that attribute exists in domainEntity
      if (currentLevel === (deep || 0)) {
        return attribute
      }
      attributeName = attributeNameParts[0]
      if (attribute.dataType === 'Enum') {
        if (attributeName === 'name') { // WTF?
          return attribute
        } else {
          domainEntity = this.domain.get('ubm_enum')
        }
      } else {
        domainEntity = this.domain.get(attribute.associatedEntity)
      }
    } else {
      return undefined
    }
    currentLevel += 1
  }
  return undefined
}

/**
 * return attributes code list
 * @param {Object|Function} [filter]
 * @returns String[]
 */
UBEntity.prototype.getAttributeNames = function (filter) {
  let attributes = []
  if (filter) {
    _.forEach(this.filterAttribute(filter), function (attr) {
      attributes.push(attr.code)
    })
    return attributes
  } else {
    return Object.keys(this.attributes)
  }
}

/**
 * Return requirements entity code list for field list
 * @param {String[]} [fieldList] (optional)
 * @return {String[]}
 */
UBEntity.prototype.getEntityRequirements = function (fieldList) {
  let result = []

  fieldList = fieldList || this.getAttributeNames()

  for (let i = 0, len = fieldList.length; i < len; ++i) {
    let fieldNameParts = fieldList[i].split('.')

    let attr = this.getEntityAttribute(fieldNameParts[0])
    if (attr.dataType === 'Entity') {
      if (fieldNameParts.length > 1) {
        let tail = [fieldNameParts.slice(1).join('.')]
        result = _.union(result, attr.getAssociatedEntity().getEntityRequirements(tail))
      } else {
        result = _.union(result, [attr.associatedEntity])
      }
    }
  }

  return result
}

/**
 * Check the entity contains attribute(s) and throw error if not contains
 * @param {String|Array<String>} attributeName
 * @param {String} contextMessage
 */
UBEntity.prototype.checkAttributeExist = function (attributeName, contextMessage) {
  let me = this
  attributeName = !_.isArray(attributeName) ? [attributeName] : attributeName
  _.forEach(attributeName, function (fieldName) {
    if (!me.getEntityAttributeInfo(fieldName)) {
      throw new Error(contextMessage + (contextMessage ? ' ' : '') +
            'The entity "' + me.code + '" does not have attribute "' + fieldName + '"')
    }
  })
}

/**
 * Return entity description.
 * @returns {string}
 */
UBEntity.prototype.getEntityDescription = function () {
  return this.description || this.caption
}

/** @class */
function UBEntityAttributeMapping (maping) {
  /**
   * @type {UBDomain.ExpressionType}
   */
  this.expressionType = maping.expressionType
  /** @type {string} */
  this.expression = maping.expression
}

/**
 * @param {Object} attributeInfo
 * @param {String} attributeCode
 * @param {UBEntity} entity
 * @constructor
 */
function UBEntityAttribute (attributeInfo, attributeCode, entity) {
  // i18n already merged by entity constructor
  /**
   * @type {String}
   * @readonly
   */
  this.code = attributeCode
  /** @type {String}
  * @readonly
  */
  this.name = attributeInfo.name
  /**
   * Non enumerable (to prevent JSON.stringify circular ref) read only entity reference
   * @property {UBEntity} entity
   * @readonly
   */
  Object.defineProperty(this, 'entity', {enumerable: false, value: entity})
  /**
   * Data type
   * @type {UBDomain.ubDataTypes}
   * @readonly
   */
  this.dataType = attributeInfo.dataType || 'String'
  /**
   * Name of entity referenced by the attribute (for attributes of type `Many` - entity name from the AssociationManyData)
   * @type {String}
   * @readonly
   */
  this.associatedEntity = attributeInfo.associatedEntity
  /**
   * @type {String}
   * @readonly
   */
  this.associationAttr = attributeInfo.associationAttr
  /**
   * @type {String}
   * @readonly
   */
  this.caption = attributeInfo.caption || ''
  /**
   * @type {String}
   * @readonly
   */
  this.description = attributeInfo.description || ''
  /**
   * @type {String}
   * @readonly
   */
  this.documentation = attributeInfo.documentation || ''
  /**
   * @type {Number}
   * @readonly
   */
  this.size = attributeInfo.size || 0
  /**
   * Attribute value can be empty or null
   * @type {boolean}
   * @readonly
   */
  this.allowNull = (attributeInfo.allowNull !== false)
  /**
   * Allow order by clause by this attribute
   * @type {boolean}
   * @readonly
   */
  this.allowSort = (attributeInfo.allowSort !== false)
  /**
   * @type {boolean}
   * @readonly
   */
  this.isUnique = (attributeInfo.isUnique === true)
  /**
   * @type{String}
   * @readonly
   */
  this.defaultValue = attributeInfo.defaultValue
  /**
   * Allow edit
   * @type {Boolean}
   * @readonly
   */
  this.readOnly = (attributeInfo.readOnly === true)
  /**
   * @property {Boolean}
   * @readonly
   */
  this.isMultiLang = (attributeInfo.isMultiLang === true)
  /**
   * Possible for dataType=Entity - enable cascade delete on application serve level (not on database level)
   * @type {Boolean}
   * @readonly
   */
  this.cascadeDelete = (attributeInfo.cascadeDelete === true)
  /**
   * Required for dataType=Enum - Group code from ubm_enum.eGroup
   * @property {String} enumGroup
   * @readonly
   */
  this.enumGroup = attributeInfo.enumGroup
  /**
   * @type {Object}
   * @readonly
   */
  this.customSettings = attributeInfo.customSettings || {}
  /**
   * Required for dataType=Many - name of the many-to-many table. UB create system entity with this name and generate table during DDL generation
   * @property {String}
   * @readonly
   */
  this.associationManyData = attributeInfo.associationManyData
  /**
   * Applicable to attribute with dataType=Document - name of store from storeConfig application config section. If emtpy - store with isDefault=true will be used
   * @type{String}
   * @readonly
   */
  this.storeName = attributeInfo.storeName
  /**
   * Applicable for dataType=Entity. If false DDL generator will bypass foreign key generation on the database level
   * @type {boolean}
   */
  this.generateFK = attributeInfo.generateFK !== false
  /**
   * If true - client should shows this attribute in auto-build forms and in '*' select fields
   * @type {boolean}
   */
  this.defaultView = attributeInfo.defaultView !== false
  /**
   * Optional mapping of atribute to phisical data (for extended domain info only).
   * Calculated from a entity mapping collection in accordance with application connection confiduration
   * @type {UBEntityAttributeMapping}
   * @readonly
   */
  this.mapping = undefined

  let me = this
  if (attributeInfo.mapping && Object.keys(attributeInfo.mapping).length) {
    let dialectsPriority = UBDomain.dialectsPriority[this.entity.connectionConfig.dialect]
    _.forEach(dialectsPriority, function (dialect) {
      if (attributeInfo.mapping[dialect]) {
        me.mapping = new UBEntityAttributeMapping(attributeInfo.mapping[dialect])
        return false // break loop
      }
    })
  }

  /**
   * @property {String} physicalDataType
   * @readonly
   */
  this.physicalDataType = UBDomain.getPhysicalDataType(this.dataType || 'String')
}

/**
 * Return associated entity. Return null if attribute type is not Entity.
 * @returns {UBEntity}
 */
UBEntityAttribute.prototype.getAssociatedEntity = function () {
  return this.associatedEntity ? this.entity.domain.get(this.associatedEntity) : null
}

UBEntityAttribute.prototype.asJSON = function () {
  let result = {}
  _.forEach(this, function (prop, propName) {
    if (propName === 'entity') {
      return
    }
    if (prop.asJSON) {
      result[propName] = prop.asJSON()
    } else {
      result[propName] = prop
    }
  })
  return result
}

/**
 * Contains all properties defined in mixin section of a entity metafile
 * @class
 * @protected
 * @param {Object} mixinInfo
 * @param {Object} i18n
 * @param {String} mixinCode
 */
function UBEntityMixin (mixinInfo, i18n, mixinCode) {
  /**
   * Mixin code
   * @type {String}
   */
  this.code = mixinCode
  _.assign(this, mixinInfo)
  if (i18n) {
    _.assign(this, i18n)
  }
}

UBEntityMixin.prototype.enabled = true

/**
 * Mixin for persisting entity to a database
 * @class
 * @extends UBEntityMixin
 * @param mixinInfo
 * @param i18n
 * @param mixinCode
 */
function UBEntityStoreMixin (mixinInfo, i18n, mixinCode) {
  UBEntityMixin.apply(this, arguments)
}
UBEntityStoreMixin.prototype = Object.create(UBEntityMixin.prototype)
UBEntityStoreMixin.prototype.constructor = UBEntityStoreMixin
// defaults
/**
 * Is `simpleAudit` enabled
 * @type {boolean}
 */
UBEntityStoreMixin.prototype.simpleAudit = false
/**
 * Use a soft delete
 * @type {boolean}
 */
UBEntityStoreMixin.prototype.safeDelete = false

/**
 * Historical data storage mixin
 * @class
 * @extends UBEntityMixin
 * @param mixinInfo
 * @param i18n
 * @param mixinCode
 * @constructor
 */
function UBEntityHistoryMixin (mixinInfo, i18n, mixinCode) {
  UBEntityMixin.apply(this, arguments)
}
UBEntityHistoryMixin.prototype = Object.create(UBEntityMixin.prototype)
UBEntityHistoryMixin.prototype.constructor = UBEntityHistoryMixin
/**
 * A history storage strategy
 * @type {string}
 */
UBEntityHistoryMixin.prototype.historyType = 'common'
/**
 * Access control list mixin
 * @class
 * @extends UBEntityMixin
 * @param mixinInfo
 * @param i18n
 * @param mixinCode
 */
function UBEntityAclRlsMixin (mixinInfo, i18n, mixinCode) {
  UBEntityMixin.apply(this, arguments)
}
UBEntityAclRlsMixin.prototype = Object.create(UBEntityMixin.prototype)
UBEntityAclRlsMixin.prototype.constructor = UBEntityAclRlsMixin
// defaults
UBEntityAclRlsMixin.prototype.aclRlsUseUnityName = false
UBEntityAclRlsMixin.prototype.aclRlsSelectionRule = 'exists'

/**
 * Full text search mixin
 * @class
 * @extends UBEntityMixin
 * @param mixinInfo
 * @param i18n
 * @param mixinCode
 */
function UBEntityFtsMixin (mixinInfo, i18n, mixinCode) {
  UBEntityMixin.apply(this, arguments)
}
UBEntityFtsMixin.prototype = Object.create(UBEntityMixin.prototype)
UBEntityFtsMixin.prototype.constructor = UBEntityFtsMixin
/**
 * scope
 * @type {string}
 */
UBEntityFtsMixin.prototype.scope = 'connection' // sConnection
/**
 * Data provider type
 * @type {string}
 */
UBEntityFtsMixin.prototype.dataProvider = 'mixin'// dcMixin
/**
 * Attribute level security mixin
 * @param mixinInfo
 * @param i18n
 * @param mixinCode
 * @constructor
 * @extends UBEntityMixin
 */
function UBEntityAlsMixin (mixinInfo, i18n, mixinCode) {
  UBEntityMixin.apply(this, arguments)
}
UBEntityAlsMixin.prototype = Object.create(UBEntityMixin.prototype)
UBEntityAlsMixin.prototype.constructor = UBEntityAlsMixin
/**
 * Is optimistic
 * @type {boolean}
 */
UBEntityAlsMixin.prototype.alsOptimistic = true

UBDomain.UBEntity = UBEntity
UBDomain.UBModel = UBModel
UBDomain.UBEntity.UBEntityAttribute = UBEntityAttribute
module.exports = UBDomain

