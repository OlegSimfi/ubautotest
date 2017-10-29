/**
 * Created by pavel.mash on 11.11.2016.
 */

/**
 * @typedef {Object} AbstractFieldAttributes
 * @property {UBEntityAttribute} [attribute]
 * @property {String} name
 * @property {String} dataType
 * @property {String} [description]
 * @property {Boolean} [allowNull]
 * @property {String|Number|Boolean} [defaultValue]
 * @property {String} [defaultConstraintName]
 * @property {Number} [size]
 * @property {Number} [prec]
 * @property {String} [enumGroup]
 * @property {string} [refTable]
 * @property {string} [baseName]
 */

const _ = require('lodash')
/**
 * Abstract field definition
 * @param {AbstractFieldAttributes} cfg
 * @constructor
 */
function FieldDefinition (cfg) {
  this.attribute = cfg.attribute
  this.name = cfg.name
  this.dataType = cfg.dataType || 'NVARCHAR'
  this.caption = cfg.description || ''
  this.allowNull = cfg.allowNull !== false
  this.defaultValue = cfg.defaultValue
  this.defaultConstraintName = cfg.defaultConstraintName
  this.size = cfg.size
  this.prec = cfg.prec
  this.enumGroup = cfg.enumGroup
  this.refTable = cfg.refTable
  this.baseName = cfg.baseName

  this.isString = (['VARCHAR', 'NVARCHAR', 'UVARCHAR', 'CHAR', 'NCHAR', 'NTEXT', 'TEXT'].indexOf(this.dataType) !== -1)
  this.isBoolean = (this.dataType === 'BOOLEAN')
  this._upperName = this.name.toUpperCase()
}

/**
 * Describe a table
 */
class TableDefinition {
  /**
   * create DB schema domain object
   * @param {Object} config
   * @param {String} config.name
   * @param {String} config.caption
   */
  constructor (config) {
    /** @type UBEntity */
    this.__entity = null
    /**
     * Name of reference table
     * @type {String}
     */
    this.name = config.name
    this._upperName = this.name.toUpperCase()
    this.caption = config.caption
    this.primaryKey = undefined
    /** @type {Array<FieldDefinition>} */
    this.columns = []
    this.indexes = []
    /** @type {Array<FKAttributes>} */
    this.foreignKeys = []
    this.checkConstraints = []
    this.sequences = []
    // other
    this.othersNames = {}
    this.isIndexOrganized = false
    this.doComparision = true
  }

  /**
   * @param {AbstractFieldAttributes} fieldAttributes
   * @returns {FieldDefinition}
   */
  addColumn (fieldAttributes) {
    let fd = new FieldDefinition(fieldAttributes)
    this.columns.push(fd)
    return fd
  }

  /**
   * @param {string} name
   * @return {FieldDefinition}
   */
  columnByName (name) {
    return _.find(this.columns, {_upperName: name.toUpperCase()})
  }

  /**
   * @typedef {Object} IndexAttributes
   * @property {string} name
   * @property {string} [_upperName] computed name in Upper case
   * @property {Array<string>} keys
   * @property {boolean} [isUnique=false]
   * @property {boolean} [isDisabled=false]
   * @property {boolean} [isConstraint=false]
   */

  /**
   * @param {IndexAttributes} obj
   * @param {boolean} [checkName]
   * @returns {*}
   */
  addIndex (obj, checkName) {
    let existed = -1
    obj.isUnique = obj.isUnique || false
    obj.isDisabled = obj.isDisabled || false
    obj.isConstraint = obj.isConstraint || false
    obj._upperName = obj.name.toUpperCase()
    if (obj.keys && obj.keys.length) obj.keys = obj.keys.map(name => name.toUpperCase())
    if (checkName) {
      existed = _.findIndex(this.indexes, {_upperName: obj._upperName})
    }
    if (existed !== -1) {
      this.indexes[ existed ] = obj
    } else {
      this.indexes.push(obj)
    }
    return obj
  }

  /**
   * @param {string} name
   * @return {number}
   */
  getIndexIndexByName (name) {
    return _.findIndex(this.indexes, {_upperName: name.toUpperCase()})
  }

  /**
   * @param {string} name
   * @return {IndexAttributes}
   */
  indexByName (name) {
    return _.find(this.indexes, {_upperName: name.toUpperCase()})
  }

  /**
   * @param {string} name
   * @return {Array<IndexAttributes>}
   */
  getIndexesByColumnName (name) {
    let resultIdx = []
    for (let indexObj of this.indexes) {
      for (let attrCode in indexObj) {
        if (strIComp(attrCode, name)) {
          resultIdx.push(indexObj)
          break
        }
      }
    }
    return resultIdx
  }

  /**
   * @param {IndexAttributes} refObj
   * @return {IndexAttributes|null}
   */
  findEqualIndexByParam (refObj) {
    for (let idxObj of this.indexes) {
      if (_.isEqual(idxObj.keys, refObj.keys) && ((idxObj.isUnique || false) === (refObj.isUnique || false))) {
        return idxObj
      }
    }
    return null
  }

  /**
   * @typedef {Object} FKAttributes
   * @property {string} name
   * @property {string} [_upperName]
   * @property {Array<string>} keys
   * @property {string} references
   * @property {boolean} [generateFK=true]
   * @property {boolean} [isDisabled=false]
   * @property {string} [deleteAction='NO_ACTION'] one of NO_ACTION, CASCADE, SET_NULL,  SET_DEFAULT
   * @property {string} [updateAction='NO_ACTION']
   */

  /**
   * @param {FKAttributes} obj
   * @param checkName
   * @returns {*}
   */
  addFK (obj, checkName) {
    let idxIndex = -1
    obj._upperName = obj.name.toUpperCase()
    if (checkName) {
      idxIndex = _.findIndex(this.foreignKeys, {_upperName: obj._upperName})
    }
    if (idxIndex !== -1) {
      this.foreignKeys[ idxIndex ] = obj
    } else {
      this.foreignKeys.push(obj)
    }
    return obj
  }

  getFKIndexByName (fkName) {
    return _.findIndex(this.foreignKeys, {_upperName: fkName.toUpperCase()})
  }

  /**
   * @param fkName
   * @return {FKAttributes}
   */
  getFKByName (fkName) {
    return _.find(this.foreignKeys, {_upperName: fkName.toUpperCase()})
  }

  getFKByColumnName (name) {
    for (let fkObj of this.foreignKeys) {
      for (let columnName of fkObj.keys) {
        if (strIComp(columnName, name)) {
          return [ fkObj ]
        }
      }
    }
    return []
  }

  findEqualFKByParam (refObj) {
    for (let fkObj of this.foreignKeys) {
      if (_.isEqual(fkObj.keys, refObj.keys) && strIComp(fkObj.references, refObj.references)) {
        return fkObj
      }
    }
    return null
  }

  addCheckConstr (obj, checkName) {
    let idxIndex = -1
    obj._upperName = obj.name.toUpperCase()
    if (checkName) {
      idxIndex = _.find(this.checkConstraints, { _upperName: obj._upperName })
    }
    if (idxIndex !== -1) {
      this.checkConstraints[ idxIndex ] = obj
    } else {
      this.checkConstraints.push(obj)
    }
    return obj
  }

  getCheckConstrByName (name) {
    return _.find(this.checkConstraints, {_upperName: name.toUpperCase()})
  }

  addSequence (obj) {
    obj._upperName = obj.name.toUpperCase()
    this.sequences.push(obj)
    return obj
  }

  addOther (obj) {
    this.othersNames[ obj.name.toUpperCase() ] = obj
    return obj
  }

  getOtherByName (name) {
    return this.othersNames[ name.toUpperCase() ]
  }

  existOther (name) {
    return (this.getOtherByName(name) != null)
  }
}

/**
 * Case insensitive compare
 * @param {string} s1
 * @param {string} s2
 * @returns {boolean}
 */
function strIComp (s1, s2) {
  return s1.toUpperCase() === s2.toUpperCase()
}

module.exports = {
  TableDefinition,
  FieldDefinition,
  strIComp
}
