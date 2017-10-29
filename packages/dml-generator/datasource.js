/**
 * Created by v.orel on 20.01.2017.
 */
const dsNames = []
for (let i = 0; i < 100; i++) {
  dsNames.push(`DS${i}`)
}

const enumEntity = 'ubm_enum'
const enumCodeAttr = 'code'
const enumGroupAttr = 'eGroup'
const idAttr = 'ID'
/**
 * Main data source for select query
 */
class DataSource {
  /**
   * @param {string} entity
   * @param {DataSource} parent
   * @param {SqlBuilder} builder
   */
  constructor (entity, parent, builder) {
    /**
     * @class DataSource
     * @protected
     * @property {SqlBuilder} builder
     */
    this.builder = parent ? parent.builder : builder
    /**
     * @class DataSource
     * @protected
     * @property {string} entityName
     */
    this.entityName = entity
    /**
     * @class DataSource
     * @public
     * @property {UBEntity} entity
     */
    this.entity = App.domainInfo.get(entity)
    /**
     * @class DataSource
     * @public
     * @property {DataSource} parent
     */
    this.parent = parent
    /**
     * @class DataSource
     * @public
     * @method getDSName
     * @returns string}
     */
    /**
     * @class DataSource
     * @public
     * @method getColumnIndex
     * @returns string}
     */
    if (parent) {
      this.getDSName = parent.getDSName
      this.getColumnIndex = parent.getColumnIndex
    } else {
      let iDS = 0
      this.getDSName = function () {
        return dsNames[iDS++]
      }
      let iCol = 0
      this.getColumnIndex = function () {
        return iCol++
      }
    }
    /**
     * @class DataSource
     * @public
     * @property {string} alias alias for SQL
     */
    this.alias = this.getDSName()
    /**
     * @class DataSource
     * @private
     * @property {Map.<UBEntityAttribute|UBEntity, JoinDS>} childDS Child items
     */
    this.childDS = new Map()
  }
  /**
   * SQL of the FROM-JOIN part
   * @returns {string}
   */
  get sql () {
    /**
     * @class DataSource
     * @protected
     * @property {string} _sql
     */
    if (!this._sql) {
      const res = [this._sqlInternal]
      for (let child of this.childDS.values()) {
        res.push(child.sql)
      }
      this._sql = res.join(' ')
    }
    return this._sql
  }
  get _sqlInternal () {
    return ` FROM ${this.entity.name} AS ${this.alias}`
  }
  /**
   *
   * @param {UBEntityAttribute} attribute
   * @returns {JoinDS}
   */
  addChild (attribute) {
    const associatedEntityName = attribute.dataType === App.domainInfo.ubDataTypes.Enum ? enumEntity : attribute.associatedEntity
    let res = this.childDS.get(attribute)
    if (!res) {
      res = new JoinDS(associatedEntityName, attribute, this)
      this.childDS.set(attribute, res)
    }
    return res
  }

  /**
   *
   * @param {string} entityName
   * @returns {JoinDS}
   */
  addLink (entityName) {
    const entity = App.domainInfo.get(entityName)
    const attribute = entity.getAttribute(idAttr)
    let res = this.childDS.get(entity)
    if (!res) {
      res = new JoinDS(entityName, attribute, this, true)
      this.childDS.set(entity, res)
    }
    return res
  }
}

class JoinDS extends DataSource {
  /**
   *
   * @param {string} associatedEntityName
   * @param {UBEntityAttribute} attribute
   * @param {DataSource} parent
   * @param {boolean} [isLeft]
   */
  constructor (associatedEntityName, attribute, parent, isLeft) {
    // const associatedEntityName = attribute.dataType === App.domainInfo.ubDataTypes.Enum ? enumEntity : attribute.associatedEntity
    if (!App.domainInfo.has(associatedEntityName)) {
      throw new Error(`Association entity in attribute "${attribute.name}" of object "${attribute.entity.name}" is empty`)
    }
    super(associatedEntityName, parent)
    /**
     * @class JoinDS
     * @public
     * @property {UBEntityAttribute} attribute
     */
    this.attribute = attribute
    /**
     * @class JoinDS
     * @public
     * @property {string} joinType
     */
    this.joinType = isLeft || (this.parent.joinType === 'LEFT') ||
      (this.attribute.allowNull) || (this.attribute.dataType === App.domainInfo.ubDataTypes.Enum) /* ||
      ((this.attribute.associationAttr || idAttr) === idAttr) */ ? 'LEFT' : 'INNER'
    /**
     * @class JoinDS
     * @public
     * @property {WhereItem[]} whereItems
     */
    this.whereItems = []
  }
  get _sqlInternal () {
    const associationAttr = this.attribute.dataType === App.domainInfo.ubDataTypes.Enum ? enumCodeAttr
      : (this.attribute.associationAttr || idAttr)

    const res = [`${this.joinType} JOIN ${this.entityName} ${this.alias} ON ${this.alias}.${associationAttr}=${this.parent.alias}.${this.attribute.name}`]
    if (this.attribute.enumGroup) {
      res.push(` AND ${this.alias}.${enumGroupAttr}="${this.attribute.enumGroup}"`)
    }
    for (let whereItem of this.whereItems) {
      if (whereItem.inJoinAsPredicate) {
        res.push(` AND ${whereItem.sql}`)
      }
    }
    return res.join('')
  }
}

module.exports = DataSource
