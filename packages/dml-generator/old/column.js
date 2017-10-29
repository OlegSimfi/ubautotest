/**
 * Created by v.orel on 11.01.2017.
 */
const parserUtils = require('./parserUtils')
const CustomItem = require('./customItem')
class LangAttribute {
  constructor (builder, expression) {
    this.attributeName = expression.attributeName
    this.lang = []
    this.existLangPointer = expression.existLangPointer
    this.noLangPointer = !expression.existLangPointer

    const lang = (expression.lang || App.defaultLang).toLowerCase()

    if (!this.lang.includes(lang)) {
      this.lang.push(lang)
      if (lang === builder.lang) {
        let langAttrValueName
        if (!expression.existLangPointer) {
          langAttrValueName = expression.attributeName
        } else {
          if (lang === App.defaultLang) {
            langAttrValueName = `${expression.attributeName}^`
          } else {
            langAttrValueName = `${expression.attributeName}_${lang}^`
          }
        }
        /* todo to exec query
        if (builder.execParams[langAttrValueName]) {
          this.defaultLangValues = builder.execParams[langAttrValueName]
        } */
      }
    }
  }
}

class LangAttributeList {
  constructor () {
    this.items = {}
  }
  register (builder, preparedExpressions) {
    for (let expression of preparedExpressions.items) {
      const langAttrName = `${parserUtils.rootLevel}.${expression.attributeName}`
      if (!this.items[langAttrName]) {
        this.items[langAttrName] = new LangAttribute(builder, expression)
      }
    }
  }
  checkUsingForUpdate () {
    for (let langAttrName in this.items) {
      const langAttrForUpdate = this.items[langAttrName]
      if (langAttrForUpdate.existLangPointer && langAttrForUpdate.noLangPointer) {
        // todo EMetabaseException
        throw new Error(`Invalid using lang pointer in attribute "${langAttrForUpdate.attributeName}" for update operation`)
      }
    }
  }
  addFieldsForInsert (builder, columns) {
    const storedLang = builder.lang
    for (let langAttrName in this.items) {
      const langAttrForInsert = this.items[langAttrName]
      for (let lang of builder.entity.connectionConfig.supportLang) {
        if (lang !== builder.lang) {
          if (langAttrForInsert.lang.includes(lang)) {
            builder.lang = lang
            const column = columns._add(langAttrForInsert.attributeName, false)
            builder.lang = storedLang
            if ((Object.keys(langAttrForInsert.defaultLangValues).length > 0) && (column.preparedExpressions.items.length > 0)) {
              builder.execParams[column.preparedExpressions.items[0].nonPrefixSQLExpression] = langAttrForInsert.defaultLangValues[Object.keys(langAttrForInsert.defaultLangValues)[0]]
            }
          }
        }
      }
    }
  }
}

class Column extends CustomItem {
  constructor (builder, columns, langAttributeList, expression, isExternal) {
    super(builder)

    let exprProps
    if (parserUtils.deniedNotSimpleExpr && isExternal) {
      exprProps = parserUtils.extractExpressionProps(expression, {})
      if ((!exprProps.isAttributeExpression && !exprProps.existServiceExpr) || !exprProps.simpleExpression) {
        // todo EMetabaseException
        throw new Error(`Invalid expression ${expression} from external call. In this mode server support only simple attribute expressions`)
      }
    }

    this.fieldName = this.addexpression({expression})
    this._establishResultName(columns)
    if (((this.builder.execType === 'insert') || (this.builder.execType === 'update')) && this.preparedExpressions.haveMultiLang) {
      langAttributeList.register(builder, this.preparedExpressions)
    }
    this.loopExpression({
      exprPropsParams: {onlyOpenBracket: true},
      condition: (exprProps) => exprProps.existOpenBracket,
      registerInColumnList: false,
      doAfterRegister: () => {
        if ((this.builder.execType === 'insert') && (this.preparedExpressions.haveMultiLang)) {
          langAttributeList.register(builder, this.preparedExpressions)
        }
      }
    })
  }
  _establishResultName (columns) {
    if (this.fieldName) {
      this.resultName = this.fieldName
    } else {
      if (this.preparedExpressions.items.length === 1) {
        this.resultName = this.preparedExpressions.items[0].nonPrefixExpression
      } else {
        const {attributeName} = this.preparedExpressions.items[0]
        this.resultName = columns.registerName(attributeName, attributeName, false, true)
      }
      if (!this.resultName) {
        // todo may be optimize
        this.resultName = `f${Math.round(Math.random() * 1000000000)}`
      }
    }
  }
}
class ColumnList {
  /**
   * List of columns for builder
   * @param {CustomSQLBuilder} builder
   * @param {Array} fieldList
   */
  constructor (builder, fieldList) {
    this.items = []
    this.builder = builder
    this.langAttributeList = new LangAttributeList()
    builder.columns = this

    for (let fieldItem of fieldList) {
      // todo is external
      const isExternal = false
      this._add(fieldItem, isExternal)
    }

    // For update operation deny use the same attr with and without lang pointer "[name]" and "[name^]" in the same time
    if (builder.execType === 'update') {
      this.langAttributeList.checkUsingForUpdate()
    }
    if ((builder.execType === 'insert') && !builder.isDataSourceCusomSQL) {
      this.langAttributeList.addFieldsForInsert(builder, this)
    }
  }
  /**
   * Add column to list
   * @param {String} expression
   * @param {Boolean} isExternal
   * @returns {Column}
   */
  _add (expression, isExternal = false) {
    const column = new Column(this.builder, this, this.langAttributeList, expression, isExternal)
    this.items.push(column)
    if ((expression === parserUtils.ubID) || (expression === parserUtils.ubBracketID)) {
      this.idColumn = column
    }
    return column
  }
  registerName (nonPrefixExpression, baseName, notFoundResultAsEmptyStr, useBaseName) {
    let res
    if (!this.items[nonPrefixExpression]) {
      this.items[nonPrefixExpression] = true
      res = notFoundResultAsEmptyStr ? '' : (useBaseName ? baseName : nonPrefixExpression)
    } else {
      for (let i = 2; i < Number.MAX_SAFE_INTEGER; i++) {
        res = `${useBaseName ? baseName : nonPrefixExpression}${i}`
        if (!this.items[res]) {
          this.items[res] = true
          break
        }
      }
    }
    return res
  }
  getSQL (withFieldsNames) {
    if (this.items.length === 0) {
      return {fields: 'null'}
    }
    const resFields = []
    const resFieldsNames = []
    for (let column of this.items) {
      if (column.expression === parserUtils.serviceFields.allFields) {
        continue
      }
      if (column.fieldName) {
        const needRoundBracket = column.preparedExpressions.haveNotFieldSQLExpr && parserUtils.isHaveOpenCloseRoundBracket(column.expression)
        resFields.push(`${needRoundBracket ? '(' : ''}${column.expression}${needRoundBracket ? ')' : ''} AS ${column.fieldName}`)
        if (withFieldsNames) {
          resFieldsNames.push(column.fieldName)
        }
      } else {
        resFields.push(column.expression)
        if (withFieldsNames) {
          resFieldsNames.push(column.resultName)
        }
      }
    }
    return {fields: resFields.join(','), fieldsNames: resFieldsNames.join(',')}
  }
}

module.exports = ColumnList