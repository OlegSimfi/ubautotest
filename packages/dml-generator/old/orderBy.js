/**
 * Created by v.orel on 14.01.2017.
 */
const CustomItem = require('./customItem')
const reRoundBr = /^\(.*\)$/
class OrderByItem extends CustomItem {
  constructor (builder, item) {
    super(builder)

    this.orderByType = item.order.toUpperCase || 'ASC'
    this.isExternal = item.isExternal
    const expressionIndexInFrom = builder.fieldList && builder.fieldList.indexOf(item.expression)
    if (expressionIndexInFrom >= 0) {
      this.expression = expressionIndexInFrom
    } else {
      this.addexpression({expression: item.expression})
      this.loopExpression({condition: (exprProps) => (exprProps.existNamedParam || (exprProps.existOpenBracket && exprProps.existCloseBracket))})
    }
  }
  getSQL () {
    return this.preparedExpressions.haveNotFieldSQLExpr && !reRoundBr.test(this.expression)
      ? `(${this.expression}) ${this.orderByType}` : `${this.expression} ${this.orderByType}`
  }
}
class OrderByList {
  constructor (builder, itemList) {
    this.builder = builder
    this.items = []

    for (let item in itemList) {
      if (!item.expression) {
        // todo EMetabaseException
        throw new Error('Invalid or empty "expression" property in orderList item')
      }
      this.items.push(new OrderByItem(item))
    }
  }
  getSQL () {
    if (this.items.length === 0) {
      return ''
    }
    const res = []
    for (let item of this.items) {
      res.push(item.getSQL())
    }
    return `ORDER BY ${res.join(',')}`
  }
}
module.exports = OrderByList