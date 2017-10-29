/**
 * Created by v.orel on 20.01.2017.
 */
const reSimpleExpression = /^[SUM|COUNT|AVG|MAX|MIN|CAST|COALESCE|LENGTH|LOWER|UPPER|DAY|MONTH|YEAR|ROUND|FLOOR|CEILING|MASTER|SELF|(]*\[?[\w.@]*]?\)*$/
const reBrackedExpression = /(\[[\w.@]*])/
const reAttrExpression = /^[^\s<>=,()?)]*$/

class CustomItem {
  /**
   * Parse expression
   * @param {String} expression
   * @param {DataSource} dataSource
   */
  constructor (expression, dataSource) {
    /*
    - check expression is complex
    - find all [...]
    - for every [...] parse expression
     - split for .
     - for every part
      - check is @
       - if true - may be add link dataset
       - if false - is final
        - true - add expression
        - false - may be add join dataset
     */
    /**
     * @class CustomItem
     * @property {boolean} isSimple
     */
    // todo
    this.isSimple = reSimpleExpression.test(expression)
    if (this.isSimple && reAttrExpression.test(expression)) {
      if (expression.charAt(0) !== '[') {
        expression = '[' + expression
      }
      if (expression.charAt(expression.length - 1) !== ']') {
        expression = expression + ']'
      }
    }
    this.expression = expression
    const expressionParts = expression.split(reBrackedExpression)
    let expressionPart
    for (let expressionPartIndex = 0; expressionPartIndex < expressionParts.length; expressionPartIndex++) {
      expressionPart = expressionParts[expressionPartIndex]
      if (expressionPart.charAt(0) === '[' || expressionPart.charAt(expressionPart.length - 1) === ']') {
        expressionPart = expressionPart.substr(1, expressionPart.length - 2)
      } else {
        continue
      }
      /**
       * @class CustomItem
       * @type {DataSource} dataSource
       */
      this.dataSource = dataSource
      // todo check isAlready parsed
      const predicates = expressionPart.split('.')
      /**
       * @type {UBEntityAttribute}
       */
      let attribute
      let i
      let L = predicates.length
      for (i = 0; i < L - 1; i++) {
        const predicate = predicates[i]
        // todo this.dataSource cache
        let linkEntity
        if (predicate.indexOf('@') !== -1) {
          const complexAttr = predicate.split('@')
          linkEntity = complexAttr[1]
          attribute = this.dataSource.entity.attributes[complexAttr[0]]
        } else {
          attribute = this.dataSource.entity.attributes[predicate]
        }
        if (attribute.dataType === App.domainInfo.ubDataTypes.Many) {
          /**
           * @class CustomItem
           * @property {boolean} isMany
           */
          this.isMany = true
          /**
           * @class CustomItem
           * @property {[]} manySubPart
           */
          this.manySubPart = predicates.slice(i + 1, L)
          /**
           * @class CustomItem
           * @type {UBEntityAttribute} manyAttribute
           */
          this.manyAttribute = attribute
/*          const subQ = dataSource.builder.biuldSelectSql(attribute.associationManyData, {
            fieldList: [`',' + Cast([destID${sub.length === 0 ? '' : '.' + sub.join('.')}] as varchar)`],
            whereList: {c: {
              expression: `[sourceID]=${this.dataSource.alias}.ID`,
              condition: 'custom'
            }}
          }, dataSource)
          this.expression = `stuff((${subQ.sql} for xml path('')), 1, 1, '')`
*/
          return
        } else {
          this.dataSource = this.dataSource.addChild(attribute)
          if (linkEntity) {
            this.dataSource = this.dataSource.addLink(linkEntity)
          }
        }
      }
      expressionParts[expressionPartIndex] = `${this.dataSource.alias}.${predicates[i]}`
    }
    /**
     * @class CustomItem
     * @public
     * @property {string} expression parsed expression
     */
    this.expression = expressionParts.join('')
  }
}
module.exports = CustomItem
