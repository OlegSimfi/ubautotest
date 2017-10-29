/**
 * Created by v.orel on 11.01.2017.
 */
const ColumnList = require('./column')
const DataSourceList = require('./datasource')
const WhereList = require('./where')
const OrderByList = require('./orderBy')
const GroupByList = require('./groupBy')

class CustomSQLBuilder {
  /**
   * Build SQL for select
   * @param {ubqlSelect} ubql
   * @param {string} entity
   * @param {Array} params
   * @param {boolean} isExternal
   * @returns {{sql: string, params: Array}}
   */
  biuldSelectSql (entity, ubql, params, isExternal) {
    params = params || []
    const {options, fieldList, whereList, logicalPredicates, joinAs, orderBy, groupBy} = ubql
    if (options.start < 0) { // todo EMetabaseException
      throw new Error('Parameter "options.start" value is invalid')
    }
    if (options.limit < 0) { // todo EMetabaseException
      throw new Error('Parameter "options.limit" value is invalid')
    }
    const datasources = new DataSourceList(entity)
    const columns = new ColumnList(fieldList)
    const where = new WhereList(whereList, logicalPredicates, joinAs)
    const orderByList = new OrderByList(orderBy)
    const groupByList = new GroupByList(groupBy)

    const sql = 'SELECT ' + columns.getSQL().fields + datasources.getSQL() + where.getSQL() + orderByList.getSQL() + groupByList.getSQL()

    return {sql: sql, params: params}
  }

  constructor ({entity, method, fieldList, execFieldList, fieldListType, execType, whereList, logicalPredicates, joinAs, orderByList, groupByList, options, parentBuilder, isExternalCall: isExternalCall = true}) {
    this.entity = App.domain_.get(entity)
    // this.dialect = entity.connectionConfig.dialect
    this.method = method
    this.options = options || {}
    this.execType = execType
    this.execparams = {}
    this.fieldList = fieldList
    this.isExternalCall = isExternalCall
    this.parentBuilder = parentBuilder
    this.params = parentBuilder ? parentBuilder.params : []
    this.localUniqID = 1
    this.datasources = new DataSourceList(this)
    this.isDataSourceCusomSQL = this._isDataSourceCusomSQL(this.entity)

    if (this.options.start < 0) {
      // todo EMetabaseException
      throw new Error('Parameter "options.start" value is invalid')
    }
    if (this.options.limit < 0) {
      // todo EMetabaseException
      throw new Error('Parameter "options.start" value is invalid')
    }

    let doFieldList = !this.isDataSourceCusomSQL && (fieldListType === 'exec' ? execFieldList : fieldList)
    // todo ProcessAlsData
    //   aPrepareContext.ProcessAlsData.InitBy(aSQL.alsNeed, aSQL.alsCurrState, aSQL.alsCurrRoles);

    if (doFieldList) {
      this.lang = this.builder === 'insert' ? App.defaultLang : Session.userLang || App.defaultLang
      this.columns = new ColumnList(this, doFieldList)
    }
    // whereList
    if (!this.isDataSourceCusomSQL && whereList) {
      this.whereList = new WhereList(this, whereList, logicalPredicates, joinAs)
    }
    // orderBy items
    if (orderByList) {
      this.orderByList = new OrderByList(this, orderByList)
    }
    // groupBy items
    if (groupByList) {
      this.groupByList = new GroupByList(this, groupByList)
    }
  }
  get dialect () {
    return ['AnsiSQL']
  }
  _isDataSourceCusomSQL (entity) {
    const mapping = entity.mapping
    return !!(mapping && mapping.customSQL)
  }
  getManyExpressionType () {
    return 'Field'
  }
  getManyExpression () {
    return ''
  }
  buildSelectQuery () {
    return this.buildBaseSelectQuery()
  }
  /**
   * @returns {string}
   */
  buildBaseSelectQuery () {
    const parts = ['SELECT ']
    this.fieldsPrefix && parts.push(`${this.fieldsPrefix} `)
    parts.push(this.columns.getSQL().fields)

    this.fieldsSuffix && parts.push(this.fieldsSuffix)

    parts.push(this.datasources.getSQL())

    this.whereList && parts.push(this.whereList.getSQL())

    // todo assign groupby
    if (this.groupby) {
      parts.push(' GROUP BY ')
      parts.push(this.groupby)
    }
    // todo assign orderby
    if (this.orderby) {
      parts.push(' ORDER BY ')
      parts.push(this.orderby)
    }
    return parts.join('')
  }
  getJoinText (stageIsWhere) {
    return `${this.joinType} JOIN ${this.toDs.selectName} ${this.toDs.uniqCalcShortName} ON ${this.toDs.uniqCalcShortName}.${this.toAttr.name}=${this.fromDs.uniqCalcShortName}.${this.fromAttr.name}`
//    return 'CustomSQLBuilder cannot generate join SQL expression'
  }
}

module.exports = CustomSQLBuilder