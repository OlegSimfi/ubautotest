/**
 * Created by v.orel on 20.01.2017.
 */
const CustomItem = require('./customItem')
class ColumnItem extends CustomItem {
  constructor (fieldItem, dataSource) {
    super(fieldItem, dataSource)
    if (this.isMany) {
      const column = `[destID${this.manySubPart.length === 0 ? '' : '.' + this.manySubPart.join('.')}]`
      /**
       * @type {{sql: string, params: Array}}
       */
      const subQuery = this.dataSource.builder.biuldSelectSql(this.manyAttribute.associationManyData, {
        fieldList: [this.dataSource.builder.buildManyColumnFiled(column)],
        whereList: {c: {
          expression: `[sourceID]=${this.dataSource.alias}.ID`,
          condition: 'custom'
        }}
      }, dataSource)
      this.expression = this.dataSource.builder.buildManyColumnExpression(subQuery.sql)
    }
    if (dataSource.parent) {
      this.sql = `${this.expression}`
    } else {
      this.sql = `${this.expression} AS F${dataSource.getColumnIndex()}`
    }
  }
}
/**
 * Columns list for select query
 */
class ColumnList {
  /**
   * @param {ubqlSelect} ubql
   * @param {DataSource} dataSource
   */
  constructor (ubql, dataSource) {
    const {fieldList} = ubql
    /**
     * @class ColumnList
     * @property {ColumnItem[]} items
     */
    this.items = []
    for (let fieldItem of fieldList) {
      this.items.push(new ColumnItem(fieldItem, dataSource))
    }
    /**
     * @class ColumnList
     * @property {string} sql
     */
    this.sql = 'SELECT '
    if (this.items.length === 0) {
      this.sql += 'null'
    } else {
      const res = []
      for (let column of this.items) {
        res.push(column.sql)
      }
      this.sql += res.join(',')
    }
  }
}
module.exports = ColumnList
