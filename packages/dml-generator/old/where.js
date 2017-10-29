/**
 * Created by v.orel on 13.01.2017.
 */
const parserUtils = require('./parserUtils')
const ColumnList = require('./column')
const CustomItem = require('./customItem')
const reParentDS = new RegExp(parserUtils.macros.parentDSValue, 'g')
class WhereItem  extends CustomItem {
  constructor (builder, item) {
    super(builder)
    this.condition = item.condition
    this.subQueryType = item.subQueryType
    this.isExternal = item.isExternal

    if (parserUtils.deniedNotSimpleExpr && item.isExternal) {
      if (!parserUtils.extractExpressionProps(item.expression).simpleExpression) {
        // todo EMetabaseException
        throw new Error(`Invalid expression ${item.expression} from external call. In this mode server support only simple attribute expressions`)
      }
    }

    const parentBuilder = builder.parentBuilder
    if (parentBuilder && reParentDS.test(item.expression)) {
      // todo may be optimize
      const mainDSItem = parentBuilder.datasources.mainDsItem
      if (mainDSItem) {
        const exprList = parserUtils.splitBracketExpressions(item.expression, false)
        for (let parseExpr of exprList) {
          if (reParentDS.test(parseExpr)) {
            const newExpr = parseExpr.replace(reParentDS, mainDSItem.uniqCalcShortName)
            item.expression = new RegExp(`[${parseExpr}]`, newExpr)
          }
        }
        if (reParentDS.test(item.expression)) {
          item.expression = item.expression.replace(reParentDS, mainDSItem.uniqCalcShortName)
        }
      }
    }
    let parseExpr = this._prepareSQLWhereItemExpressionText(item)
    if (parseExpr) {
      // if ((this.condition === 'Match') && (item.condition !== 'Match')) {
      //   this.condition = item.condition
      // }
      this.addexpression({expression: parseExpr, manyAttrExprCollapsed: false})
      /*
       //Внимание! Построитель НЕ БУДЕТ поддерживать сложные условия, в которых участвуют "adtMany" атрибуты!
       //Проблема в том, что нужно переделать текст выражения с "Many" атрибутом, и построитель этого НЕ сможет сделать, если выражение сложное.
       //Поэтому с 23.11.2015 вводится ограничение на использование "Many" атрибутов в where-выражениях
       */
      if (this.preparedExpressions.haveManyDataType && (this.preparedExpressions.items.length > 0)) {
        if (this.preparedExpressions.items.length > 1) {
          // todo EMetabaseException
          throw new Error(`Complex expression for "Many" type attributes not supported: ${item.expression}`)
        }
        const {attrEntity: manyAttrEntity, attributeName: manyAttrName} = this.preparedExpressions.items[0]
        const manyAttr = manyAttrEntity.attrs(manyAttrName)
        if (manyAttr.dataType === 'Many') {
          item.subQueryType = this._getSubQueryType()
          if (!item.subQueryType) {
            // todo EMetabaseException
            throw new Error('"Many" type attribute support only next conditions: "Equal", "In", "NotEqual", "NotIn", "IsNull", "NotIsNull"')
          }
          item.expression = ''
          item.condition = 'subquery'
          const whereItems = {
            cond1: {
              expression: `${parserUtils.serviceFields.sourceBr}=${parserUtils.macros.parentDSValue}.id`,
              condition: 'custom'
            }
          }
          if (this._canAddClientConditions()) {
            whereItems.cond2 = {
              expression: parserUtils.serviceFields.destBr,
              condition: 'in',
              values: item.values
            }
          }
          item.values = {
            entityName: manyAttr.associationManyData,
            options: {limit: 1},
            whereList: new WhereList(builder, whereItems)
          }
          this.needRePrepare = true
          return
        }
      }

      this.loopExpression({
        exprPropsParams: {onlyOpenBracket: true},
        condition: (exprProps) => exprProps.existOpenBracket,
        registerInColumnList: false,
        manyAttrExprCollapsed: false
      })
      this.params = item.values
    }
  }
  getSQL () {
    if (!this._sqlExpression) {
      this._sqlExpression = this._getSqlExpression()
      for (let paramName in this.params) {
        const paramVal = this.params[paramName]
        if (paramVal !== undefined) {
          this.builder.params.push(paramVal)
          /*
          let i = 2
          let paramUniqName = paramName
          while (this.builder.params[paramUniqName] !== undefined) {
            paramUniqName = `${paramName}_${i++}`
          }
          this.builder.params[paramUniqName] = paramVal */
        }
      }
    }
    return this._sqlExpression
  }
  _getSqlExpression () {
    let res = this.expression
    for (let paramName in this.params) {
      const paramVal = this.params[paramName]
      if (paramVal && (typeof paramVal === 'string')) {
        if (paramVal === parserUtils.macros.maxdate) {
          this.params[paramName] = new Date('9999-12-31T00:00:00Z')
        } else if (paramVal === parserUtils.macros.currentdate) {
          this.params[paramName] = new Date()
        } else {
          const macrosValue = this._isValueMacros(res, paramVal)
          if (macrosValue) {
            res = macrosValue
            delete this.params[paramName]
          }
        }
      }
    }
    return res
  }
  _isValueMacros (expression, paramVal) {
    // todo
  }
  _prepareSQLWhereItemExpressionText (item) {
    // in childs
    return null
  }
  _getSubQueryType () {
    return null
  }
  _preparePositionParameterText () {
    // todo for oracle date casting
    return '?'
  }
  _canAddClientConditions () {
    return false
  }
}
class WhereItemSubQuery extends WhereItem {
  constructor (builder, item) {
    super(builder, item)
    if (builder.execType !== 'Select') {
      // todo EMetabaseException
      throw new Error(`Cannot use subquery in where item if main query NOT SELECT`)
    }
    const whereItemQueryEntity = App.domain_.get(item.values.entity)
    if (!whereItemQueryEntity) {
      // todo EMetabaseException
      throw new Error(`Entity "${item.values.entity}" not exist in Domain`)
    }
    this.subQueryBuilder = new builder.constructor({
      entity: whereItemQueryEntity,
      method: builder.method,
      fieldList: item.values.fieldList,
      execFieldList: item.values.execFieldList,
      fieldListType: item.values.fieldListType,
      execType: item.values.execType,
      whereList: item.values.whereList,
      logicalPredicates: item.values.logicalPredicates,
      joinAs: item.values.joinAs,
      orderByList: item.values.orderByList,
      groupByList: item.values.groupByList,
      options: item.values.options,
      parentBuilder: builder,
      isExternalCall: builder.isExternalCall
    })
    item.values.alsNeed = false
  }
  _getSqlExpression () {
    if ((this.subQueryType === 'Exists') || (this.subQueryType === 'NotExists')) {
      this.subQueryBuilder.columns = new ColumnList(this, ['1'])
    }
    const subQueryText = this.subQueryBuilder.buildSelectQuery()
    if (this.subQueryType === 'In') {
      return `${this.expression} IN (${subQueryText})`
    } else if (this.subQueryType === 'NotIn') {
      return `${this.expression} NOT IN (${subQueryText})`
    } else if (this.subQueryType === 'Exists') {
      return `EXISTS (${subQueryText})`
    } else if (this.subQueryType === 'NotExists') {
      return `NOT EXISTS (${subQueryText})`
    }
    return ''
  }
  _prepareSQLWhereItemExpressionText (item) {
    return item.expression
  }
}
class WhereItemCustom extends WhereItem {
  _prepareSQLWhereItemExpressionText (item) {
    return item.expression
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
  _prepareSQLWhereItemExpressionText (item) {
    return `${item.expression}${conditionsCompare[item.condition]}${this._preparePositionParameterText()}`
  }
}
class WhereItemEqual extends WhereItemCompare {
  _getSubQueryType () {
    return this.condition === 'equal' ? 'Exists' : 'NotExists'
  }
  _canAddClientConditions () {
    return true
  }
}
class WhereItemBetween extends WhereItem {
  _prepareSQLWhereItemExpressionText (item) {
    const exprList = parserUtils.splitBracketExpressions(item.expression)
    switch (exprList) {
      // todo think about parameters format
      case 1:
        return `(${item.expression} BETWEEN ${this._preparePositionParameterText()} AND ${this._preparePositionParameterText()})`
      case 2:
        return `(${this._preparePositionParameterText()} BETWEEN ${exprList[0].expression} AND ${exprList[1].expression})`
      default:
        throw new Error(`Invalid expression "${item.expression}" for "between attributes" condition`)
    }
  }
}
class WhereItemIn extends WhereItem {
  _prepareSQLWhereItemExpressionText (item) {
    const valuesNames = Object.keys(item.values)
    const val = (valuesNames.length > 0) && item.values[valuesNames[0]]
    if (!val) {
      throw new Error('in or notIn condition must contain at least one value')
    }
    // todo check elements type
    if (!Array.isArray(val)) {
      throw new Error('in or not in parameter must be no empty string or integer array')
    }
    return `${item.expression} ${this.condition === 'in' ? 'IN' : 'NOT IN'} (${JSON.stringify(val)})`
  }
  _getSubQueryType () {
    return this.condition === 'in' ? 'Exists' : 'NotExists'
  }
  _canAddClientConditions () {
    return true
  }
}
class WhereItemNull extends WhereItem {
  _getSubQueryType () {
    return this.condition === 'isnull' ? 'NotExists' : 'Exists'
  }
  _prepareSQLWhereItemExpressionText (item) {
    return `${item.expression} ${item.condition === 'IsNull' ? 'IS NULL' : 'IS NOT NULL'}`
  }
}
const conditionsLike = {
  like: '',
  notlike: 'NOT',
  startwith: '',
  notstartwith: 'NOT'
}
class WhereItemLike extends WhereItem {
  _prepareSQLWhereItemExpressionText (item) {
    // todo add % to begin or end of value if needed
    return `${item.expression} ${conditionsLike[item.condition]} ${this.builder.likePredicate} (?)`
  }
}
class WhereItemMatch extends WhereItem {
  _prepareSQLWhereItemExpressionText (item) {
    // todo
    return ``
  }
}
const whereItemClassesByCondition = {
  'custom': WhereItemCustom,
  'equal': WhereItemEqual,
  'notequal': WhereItemEqual,
  'more': WhereItemCompare,
  'moreequal': WhereItemCompare,
  'less': WhereItemCompare,
  'lesslqual': WhereItemCompare,
  'between': WhereItemBetween,
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
const reLogicalPredicate = /\[([^\]]*)]/g
class LogicalPredicate {
  constructor (whereItems, expression) {
    this.expression = expression
    const knownPredicates = {}
    let predicateRes
    while ((predicateRes = reLogicalPredicate.exec(expression))) {
      const predicateName = predicateRes[1]
      if (!knownPredicates[predicateName]) {
        const whereItem = whereItems.get(predicateName)
        if (whereItem) {
          if (whereItem.inJoinAsPredicate) {
            throw new Error(`Logical predicate with name "${predicateName}" already used in "joinAs" predicates`)
          }
          whereItem.inLogicalPredicate = true
          const re = new RegExp(`(\\[${predicateName}])`, 'g')
          this.expression = this.expression.replace(re, whereItem.getSQL(), 'g')
        } else {
          throw new Error(`Condition ${predicateName} not found`)
        }
        knownPredicates[predicateName] = true
      }
    }
  }
}
class LogicalPredicateList {
  constructor (whereItems, logicalPredicates) {
    this.items = []
    for (let logicalPredicateExpression of logicalPredicates) {
      this.items.push(new LogicalPredicate(whereItems, logicalPredicateExpression))
    }
  }
  getSQL () {
    const res = []
    for (let item of this.items) {
      res.push(item.expression)
    }
    return res
  }
}
class WhereList {
  constructor (builder, itemsList, logicalPredicates, joinAs) {
    this.builder = builder
// todo aPrepareContext.ProcessAlsData.Init;
    const itemNames = Object.keys(itemsList)
    this.items = new Map()

    for (let itemName of itemNames) {
      const item = itemsList[itemName]
      // const whereItem = this.items[itemName] = new WhereItem(item)
      this.items.set(itemName, this._add(item))
    }
    if (joinAs) {
      for (let joinAsPredicate of joinAs) {
        const item = this.items.get(joinAsPredicate)
        if (item) {
          item.inJoinAsPredicate = true
        }
      }
    }
    if (logicalPredicates) {
      this.logicalPredicates = new LogicalPredicateList(this.items, logicalPredicates)
    }
  }
  getSQL () {
    const res = []
    for (let [, item] of this.items) {
      // todo may be resolve by class
      if (item.expression && (item.condition !== 'subquery') && !item.inLogicalPredicate && !item.inJoinAsPredicate) {
        res.push(item.getSQL())
      }
    }
    this.logicalPredicates && res.push.apply(res, this.logicalPredicates.getSQL())
    return (res.length > 0) ? ` WHERE ${res.join(' AND ')}` : ''
  }
  _add (item) {
    let whereItem
    do {
      whereItem = new whereItemClassesByCondition[item.condition.toLowerCase()](this.builder, item)
    } while (whereItem.needRePrepare)
    return whereItem
  }
}
module.exports = WhereList