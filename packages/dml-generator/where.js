/**
 * Created by v.orel on 16.02.2017.
 */
const CustomItem = require('./customItem')
class WhereItem extends CustomItem {
  /**
   *
   * @param {ubqlWhere} ubqlWhereItem
   * @param {DataSource} dataSource
   * @param {Array} params
   */
  constructor (ubqlWhereItem, dataSource, params) {
    super(ubqlWhereItem.expression, dataSource)
    this.condition = ubqlWhereItem.condition
    this.values = ubqlWhereItem.values
    this.params = params
    // todo replace {master} macros
  }
  _preparePositionParameterText () {
    // todo for oracle date casting
    return '?'
  }
  get sql () {
    if (!this._sql) {
      this._sql = this._sqlInternal()
    }
    if ('value' in this) {
      this.params.push(this.value)
    }
    return this._sql
  }
}
class WhereItemSubQuery extends WhereItem {
  // todo
  _sqlInternal () {
    delete this.value
    return this.expression
  }
}
class WhereItemCustom extends WhereItem {
  _sqlInternal () {
    delete this.value
    return this.expression
  }
}
const conditionsCompare = {
  equal: '=',
  notequal: '<>',
  more: '>',
  moreequal: '>=',
  less: '<',
  lessequal: '<='
}
class WhereItemCompare extends WhereItem {
  _sqlInternal () {
    const valuesNames = Object.keys(this.values)
    if (valuesNames.length > 0) {
      this.value = this.values[valuesNames[0]]
    }
    if (this.isMany) {
      const column = `[destID${this.manySubPart.length === 0 ? '' : '.' + this.manySubPart.join('.')}]`
      const subQuery = this.dataSource.builder.biuldSelectSql(this.manyAttribute.associationManyData, {
        // space because non attr expression
        fieldList: [' 1'],
        whereList: {
          c: {
            expression: `[sourceID]=${this.dataSource.alias}.ID`,
            condition: 'custom'
          },
          c2: {
            expression: column,
            condition: this.condition,
            values: this.values
          }
        }
      }, this.dataSource)
      return `EXISTS (${subQuery.sql})`
    }
    return `${this.expression}${conditionsCompare[this.condition]}${this._preparePositionParameterText()}`
  }
}
class WhereItemEqual extends WhereItemCompare {

}
class WhereItemIn extends WhereItem {
  _sqlInternal () {
    const valuesNames = Object.keys(this.values)
    const val = (valuesNames.length > 0) && this.values[valuesNames[0]]
    if (!val) {
      throw new Error('in or notIn condition must contain at least one value')
    }
    // todo check elements type
    if (!Array.isArray(val)) {
      throw new Error('in or not in parameter must be no empty string or integer array')
    }
    return `${this.expression} ${this.condition === 'in' ? 'IN' : 'NOT IN'} (${JSON.stringify(val)})`
  }
}
class WhereItemNull extends WhereItem {
  _sqlInternal () {
    return `${this.expression} ${this.condition === 'isnull' ? 'IS NULL' : 'IS NOT NULL'}`
  }
}
const conditionsLike = {
  like: '',
  notlike: 'NOT',
  startwith: '',
  notstartwith: 'NOT'
}
class WhereItemLike extends WhereItem {
  _sqlInternal () {
    // todo add % to begin or end of value if needed
    return `${this.expression} ${conditionsLike[this.condition]} ${'LIKE'} (?)`
  }
}
class WhereItemMatch extends WhereItem {
  // todo
}
const whereItemClassesByCondition = {
  'custom': WhereItemCustom,
  'equal': WhereItemEqual,
  'notequal': WhereItemEqual,
  'more': WhereItemCompare,
  'moreequal': WhereItemCompare,
  'less': WhereItemCompare,
  'lesslqual': WhereItemCompare,
  // 'between': WhereItemBetween,
  'in': WhereItemIn,
  'notin': WhereItemIn,
  'subquery': WhereItemSubQuery,
  'isnull': WhereItemNull,
  'notisnull': WhereItemNull,
  'like': WhereItemLike,
  'notlike': WhereItemLike,
  'startwith': WhereItemLike,
  'notstartwith': WhereItemLike,
  'match': WhereItemMatch
}
const reLogicalPredicate = /(\[[^\]]*])/g
const openBracketCode = '['.charCodeAt(0)
class LogicalPredicate {
  /**
   *
   * @param {Map.<string, WhereItem>} whereItems
   * @param {string} expression
   */
  constructor (whereItems, expression) {
    this.parts = expression.split(reLogicalPredicate)
    for (let i = 0; i < this.parts.length; i++) {
      const part = this.parts[i]
      if (part.charCodeAt(0) === openBracketCode) {
        const predicateName = part.substr(1, part.length - 2)
        const whereItem = whereItems.get(predicateName)
        if (whereItem) {
          if (whereItem.inJoinAsPredicate) {
            throw new Error(`Logical predicate with name "${predicateName}" already used in "joinAs" predicates`)
          }
          whereItem.inLogicalPredicate = true
          this.parts[i] = whereItem
        } else {
          throw new Error(`Condition ${predicateName} not found`)
        }
      }
    }
    // this.sql = parts.join('')
  }
  get sql () {
    for (let i = 0; i < this.parts.length; i++) {
      const part = this.parts[i]
      if (part instanceof WhereItem) {
        this.parts[i] = part.sql
      }
    }
    return this.parts.join('')
  }
}
class LogicalPredicates {
  /**
   *
   * @param {Map.<string, WhereItem>} whereItems
   * @param {string[]} logicalPredicates
   */
  constructor (whereItems, logicalPredicates) {
    this.items = []
    for (let logicalPredicateExpression of logicalPredicates) {
      this.items.push((new LogicalPredicate(whereItems, logicalPredicateExpression)))
    }
  }
  get sql () {
    let res = []
    for (let item of this.items) {
      res.push(item.sql)
    }
    return res.join(' AND ')
  }
}
class WhereList {
  /**
   * @param {ubqlSelect} ubql
   * @param {DataSource} dataSource
   * @param {boolean} isExternal
   * @param {Array} params
   */
  constructor (ubql, dataSource, isExternal, params) {
    const {whereList, logicalPredicates, joinAs} = ubql
    this.items = new Map()
    if (!whereList) {
      return
    }
    const itemNames = Object.keys(whereList)
    for (let itemName of itemNames) {
      const item = whereList[itemName]
      // const whereItem = this.items[itemName] = new WhereItem(item)
      this.items.set(itemName,
        new whereItemClassesByCondition[item.condition.toLowerCase()](item, dataSource, params)
      )
    }
    if (joinAs) {
      for (let joinAsPredicate of joinAs) {
        /**
         * @type WhereItem
         */
        const item = this.items.get(joinAsPredicate)
        if (item) {
          item.inJoinAsPredicate = true
          item.dataSource.whereItems.push(item)
        }
      }
    }
    if (logicalPredicates) {
      this.logicalPredicates = new LogicalPredicates(this.items, logicalPredicates)
    }
  }
  get sql () {
    const res = []
    for (let [, item] of this.items) {
      // todo may be resolve by class
      if (item.expression && (item.condition !== 'subquery') && !item.inLogicalPredicate && !item.inJoinAsPredicate) {
        res.push(item.sql)
      }
    }
    if (this.logicalPredicates) {
      res.push(this.logicalPredicates.sql)
    }
    return (res.length > 0) ? ` WHERE ${res.join(' AND ')}` : ''
  }
}
module.exports = WhereList
