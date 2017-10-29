/**
 * Created by v.orel on 14.01.2017.
 */
// todo may be common parent for columns, where, order and group by
const CustomItem = require('./customItem')
class GroupByItem extends CustomItem {
  constructor (builder, item) {
    super(builder)
    this.addexpression({expression: item})
    this.loopExpression({condition: (exprProps) => (exprProps.existNamedParam || (exprProps.existOpenBracket && exprProps.existCloseBracket))})
  }
  getSQL () {
    return this.expression
  }
}
class GroupByList {
  constructor (builder, itemList) {
    this.builder = builder
    this.items = []

    for (let item in itemList) {
      this.items.push(new GroupByItem(item))
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
    return `GROUP BY ${res.join(',')}`
  }
}
module.exports = GroupByList