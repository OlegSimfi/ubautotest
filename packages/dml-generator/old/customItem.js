/**
 * Created by v.orel on 17.01.2017.
 */
const parserUtils = require('./parserUtils')
const maxSQLBuilderCyclingRef = 32
const reSelfDSValue = new RegExp(parserUtils.macros.selfDSValue, 'g')

class PreparedExpression {
//  constructor () {
//  }
}
class AllFieldsExpression extends PreparedExpression {
  constructor () {
    super()
    this.fieldName = ''
    this.expr = parserUtils.serviceFields.allFields
  }
}

class SQLExpression extends PreparedExpression {
  constructor (expression, lang, id) {
    super()
    this.expr = expression.replace(/#/g, ' ')
    this.fieldName = ''
    this.attributeName = ''
    this.isMultiLang = false
    this.lang = lang
    this.existLangPointer = false
    this.expression = this.expr
    this.nonPrefixExpression = `F${id}`
    this.dataType = 'Unknown'
    this.expressionType = 'Expression'
  }
}

class NonBracketExpression extends PreparedExpression {
  /**
   * Expression without brackets
   * @param {String} expression
   * @param {String} lang
   */
  constructor (expression, lang) {
    super()
    this.expr = expression
    this.fieldName = ''
    this.attributeName = ''
    this.isMultiLang = false
    this.lang = lang
    this.existLangPointer = false
    this.expression = expression
    this.nonPrefixExpression = expression
    this.dataType = 'unknown'
    this.expressionType = 'Expression'
  }
}

class AttributeExpression extends PreparedExpression {
  constructor ({dsItem, entity, attribute, lang, level, exprProps, exprLinkProps, complexAttrExpression, noLangExpr}) {
    super()

    this.attrEntity = entity
    this.attributeName = attribute.name
    this.isMultiLang = attribute.isMultiLang
    this.lang = lang
    this.existLangPointer = exprProps.existLangPointer
    this.dataType = attribute.dataType
    this.level = level
    // todo ALS is need
    if (level === parserUtils.rootLevel) {
      this.complexExpression = parserUtils.bracketExpr(exprProps.expression).expression
    } else {
      const complexExprProps = parserUtils.extractExpressionProps(complexAttrExpression)
      if (!complexExprProps.simpleExpression) {
        this.complexExpression = parserUtils.bracketExpr(exprProps.expression).expression
      } else {
        this.complexExpression = parserUtils.bracketExpr(complexAttrExpression).expression
      }
    }

    let attrSQLExpression = this.getSqlExpression(noLangExpr)

    this.sqlExpression = (
      this.expressionType === 'Expression'
        ? attrSQLExpression
        : `${dsItem.uniqCalcShortName}.${attrSQLExpression}`
    ).replace(reSelfDSValue, dsItem.uniqCalcShortName)
    this.nonPrefixSQLExpression = attrSQLExpression.replace(reSelfDSValue, dsItem.uniqCalcShortName)
  }
}
class AttributeSimpleExpression extends AttributeExpression {
  constructor ({originalExpression, preparedExpressions, dsItem, entity, attribute, lang, level, exprProps, exprLinkProps, complexAttrExpression, noLangExpr, registerInColumnList}) {
    super({dsItem, entity, attribute, lang, level, exprProps, exprLinkProps, complexAttrExpression, noLangExpr})

    const mapping = attribute.mapping
    if ((mapping && mapping.expression)) {
      this.mapped = true
      this.expressionType = mapping.expressionType
    } else {
      this.expressionType = 'Field'
    }
    this.expr = parserUtils.bracketExpr(originalExpression).expression.replace(this.complexExpression, this.sqlExpression, 'g')
    if (registerInColumnList) {
      if ((preparedExpressions.items.length > 0) || preparedExpressions.items.haveNotFieldSQLExpr) {
        this.fieldName = preparedExpressions.builder.columns.registerName(this.nonPrefixSQLExpression, attribute.name, false, true)
      } else if (preparedExpressions.items.length === 0) { // todo and (fPreparedExpression.ExpressionType = sqletField
        this.fieldName = preparedExpressions.builder.columns.registerName(this.nonPrefixSQLExpression, attribute.name, true, false)
      }
    }
  }
  getSqlExpression (noLangExpr) {
    if (!this.isMultiLang || (this.isMultiLang && this.existLangPointer)) {
      return this.existLangPointer ? (this.lang === App.defaultLang ? this.attributeName : noLangExpr) : this.attributeName
    } else {
      return this.lang === App.defaultLang ? this.attributeName : `${this.attributeName}_${this.lang}`
    }
  }
}
class AttributeManyExpression extends AttributeExpression {
  constructor ({originalExpression, exprList, dsItem, entity, attribute, lang, level, exprProps, exprLinkProps, complexAttrExpression, noLangExpr, manyAttrExprCollapsed, registerInColumnList}) {
    super({dsItem, entity, attribute, lang, level, exprProps, exprLinkProps, complexAttrExpression, noLangExpr, manyAttrExprCollapsed})
    this.manyAttrExprCollapsed = manyAttrExprCollapsed
    this.expressionType = this.builder.getManyExpressionType
    this.expr = parserUtils.bracketExpr(originalExpression).expression.replace(this.complexExpression, `(${this.sqlExpression})`, 'g')
    if (registerInColumnList) {
      const lastWord = parserUtils.expressionLastWord(exprProps.expression)
      this.fieldName = exprList.builder.columns.registerName(lastWord, lastWord, false, true)
    }
  }
  getSqlExpression () {
    // todo
    return this.builder.getManyExpression.bind(this)
  }
}

class PreparedExpressions {
  constructor (item) {
    this.item = item
    this.builder = item.builder
    this.items = []
  }
  add ({originalExpression, attrExpression, complexAttrExpression, entity, lang, level, parentJoin, manyAttrExprCollapsed, registerInColumnList}) {
    let expression
    if (originalExpression === parserUtils.serviceFields.allFields) {
      expression = new AllFieldsExpression()
    } else {
      entity = entity || this.builder.entity
      lang = lang || this.builder.lang
      if (entity.connectionName !== this.builder.entity.connectionName) {
        // todo EMetabaseException
        throw new Error(`Connection for entity "${entity.name}" must be identical to context entity "${this.builder.entity.name}"`)
      }
      let {expression: inExpression, props: exprProps} = parserUtils.bracketExpr(attrExpression)
      if (exprProps.existOpenBracket && !exprProps.existCloseBracket) {
        throw new Error(`Error in expression "${attrExpression}": "]" expected but "[" found`)
      } else if (!exprProps.existOpenBracket && exprProps.existCloseBracket) {
        throw new Error(`Error in expression "${attrExpression}": "[" expected but "]" found`)
      }
      // todo EntityList.AddEntity(entity); ??? for caching

      if (exprProps.existNativeSQL) {
        // it is ready sql expression
        expression = new SQLExpression(inExpression, lang, this.builder.localUniqID++)
      } else {
        // it  is Attribute expression
        const exprList = parserUtils.splitBracketExpressions(inExpression, false)
        if (exprList.length === 0) {
          // there is no open and close brackets so left all as is
          expression = new NonBracketExpression(inExpression, lang)
        } else {
          for (let expr of exprList) {
            const data = this._extractDataFromExpr(expr, entity)
            const {attribute, exprLinkProps, noLangExpr} = data
            exprProps = data.exprProps
            lang = data.lang

            const dsItem = this.builder.datasources.getItem(entity, level)
            if (exprLinkProps.existLink && (level === parserUtils.rootLevel)) {
              const associatedEntity = App.domain_.get(exprLinkProps.essLink)
              if (!associatedEntity) {
                // todo EMetabaseException
                throw new Error(`Association entity in attribute "${expr}" of object "${exprLinkProps.essLink}" is empty`)
              }
              if (this.builder.isExternalCall) {
                if (!App.els(associatedEntity.name, this.builder.method)) {
                  // todo EMetabaseException
                  // todo uncomment this
                  // throw new Error(`ELS - access deny for user "${Session.uData.login}" method "${associatedEntity.name}.${this.builder.method}"`)
                }
              }
              dsItem.joinList.add({
                fromAttr: parserUtils.ubID,
                toAttr: parserUtils.ubID,
                ds: this.builder.datasources.getItem(associatedEntity, level),
                joinType: 'LEFT',
                isLastJoin: true
              })
            }

            if (!exprProps.existDot || (attribute.dataType === 'Many')) {
              // if this is simple expression or many-attribute(all dots handled by creator SQL for this attribute)
              // then it goes to result
              expression =
                new (attribute.dataType === 'Many' ? AttributeManyExpression : AttributeSimpleExpression)(
                  {originalExpression, preparedExpressions: this, entity, attribute, lang, level, exprProps, exprLinkProps, complexAttrExpression, noLangExpr, dsItem, manyAttrExprCollapsed, registerInColumnList}
                )
            } else {
              // complex expression, need check associations
              const partExpr = exprLinkProps.expression
              const associatedEntityName = attribute.dataType === 'Enum' ? parserUtils.entities.enum : attribute.associatedEntity
              const associatedEntity = App.domain_.get(associatedEntityName)
              if (!associatedEntity) {
                // todo EMetabaseException
                throw new Error(`Association entity in attribute "${partExpr}" of object "${associatedEntityName}" is empty`)
              }
              if (!App.els(associatedEntity.name, this.builder.method)) {
                // todo EMetabaseException
                // todo uncomment this
                // todo move it to joinItem
                // throw new Error(`ELS - access deny for user "${Session.uData.login}" method "${associatedEntity.name}.${this.builder.method}"`)
              }
              // todo EntityList.AddEntity(fAssociatedEntityRef) ??? for caching
              const nextLevel = `${level}.[${entity.name}.${partExpr}]`
              const nextExpr = exprLinkProps.existLink
                ? parserUtils.delStartStr(expr, `${partExpr}@${exprLinkProps.essLink}.`)
                : parserUtils.delStartStr(expr, `${partExpr}.`)
              exprProps = parserUtils.extractExpressionProps(nextExpr)
              let partNextExpr = parserUtils.expressionFirstWord(nextExpr)
              let addedJoin
              const whereItem = this.item.constructor.name.startsWith('WhereItem') && this.item
              if (partNextExpr) {
                const nextAttrName = ((attribute.dataType === 'Enum') ? 'code' : attribute.associationAttr || parserUtils.ubID)
                const nextAttr = associatedEntity.attr(nextAttrName)
                if (!nextAttr) {
                  // todo EMetabaseException
                  throw new Error(`Attribute association "${entity.name}.${partExpr}" linked to "${associatedEntity.name}.${nextAttrName}", but attribute "${nextAttrName}" in entity "${associatedEntity.name}" not found`)
                }
                const nextExprLinkProps = parserUtils.extractOneExprLink(partNextExpr)
                partNextExpr = nextExprLinkProps.expression

                addedJoin = dsItem.joinList.add({
                  fromAttr: attribute,
                  toAttr: nextAttr,
                  dsTo: this.builder.datasources.getItem(associatedEntity, nextLevel),
                  joinType: (parentJoin && (parentJoin.JoinType === 'LEFT')) || nextExprLinkProps.existLink || (nextAttrName === parserUtils.ubID) && 'LEFT',
                  whereItem,
                  isLastJoin: !exprProps.existDot
                })
              }
              const complexExpression = (level === parserUtils.rootLevel || (this.items.length)) ? expr : complexAttrExpression

              return this.add({
                originalExpression,
                attrExpression: nextExpr,
                complexAttrExpression: complexExpression,
                entity: associatedEntity,
                lang,
                parentJoin: addedJoin,
                whereItem,
                level: nextLevel,
                manyAttrExprCollapsed,
                registerInColumnList
              })
            }
          }
        }
      }
    }
    if (expression.expressionType !== 'Field') {
      this.haveNotFieldSQLExpr = true
    }
    if (expression.dataType === 'Many') {
      this.haveManyDataType = true
    }
    if (expression.isMultiLang) {
      this.haveMultiLang = true
    }
    if (expression.existLangPointer) {
      this.haveLangPointer = true
    }
    this.items.push(expression)
    return expression
  }
  _extractDataFromExpr (expr, entity) {
    const exprProps = parserUtils.extractExpressionProps(expr, {})
    const exprLinkProps = parserUtils.extractOneExprLink(parserUtils.expressionFirstWord(expr))
    const partExpr = exprLinkProps.expression

    const {expression, lang, noLangExpr} = exprProps.existLangPointer
      ? {expression: partExpr}
      : parserUtils.extractAttrAndLang(partExpr, entity.connectionConfig.supportLang)

    let attrEntity
    let attribute

    if (!exprLinkProps || !exprLinkProps.existLink) {
      attrEntity = entity
    } else {
      // todo may be move to mixin
      attrEntity = App.domain_.get(exprLinkProps.essLink, false)
      if (!attrEntity) {
        // todo EMetabaseException
        throw new Error(`Attribute expression "${expression}" linked on Entity "${exprLinkProps.essLink} but this entity not found in Domain`)
      }
      const unityMixin = attrEntity.mixin(parserUtils.mixins.unity)
      if (!unityMixin) {
        // todo EMetabaseException
        throw new Error(`Entity "${exprLinkProps.essLink}" not contain mixin "${parserUtils.mixins.unity}" and cannot be used in linking expression`)
      }
      if (unityMixin.entity !== entity.name) {
        // todo EMetabaseException
        throw new Error(`Entity "${exprLinkProps.essLink}" not inherited from unity entity "${entity.name}" and cannot be used in linking expression`)
      }
    }

    if (!(attribute = attrEntity.attributes[expression])) {
      throw new Error(`Attribute ${attrEntity.name}.${partExpr} not exist`)
    }
    return {attribute, exprProps, exprLinkProps, lang, noLangExpr}
  }
}

class CustomItem {
  constructor (builder) {
    this.builder = builder
    this.preparedExpressions = new PreparedExpressions(this)
  }
  addexpression ({expression, entity, level, parentJoin, manyAttrExprCollapsed: manyAttrExprCollapsed = true, registerInColumnList: registerInColumnList = true}) {
    const {expr, fieldName} = this.preparedExpressions.add({
      originalExpression: expression,
      attrExpression: expression,
      complexAttrExpression: expression,
      entity: entity || this.builder.entity,
      lang: this.builder.lang,
      level: level || parserUtils.rootLevel,
      parentJoin,
      manyAttrExprCollapsed,
      registerInColumnList
    })
    this.expression = expr
    return fieldName
  }
  loopExpression ({exprPropsParams, condition, manyAttrExprCollapsed, registerInColumnList, doAfterRegister}) {
    let runCounter = 0
    let exprProps = parserUtils.extractExpressionProps(this.expression, exprPropsParams)
    while (condition(exprProps)) {
      if (runCounter++ >= maxSQLBuilderCyclingRef) {
        throw new Error(`Circular reference after ${maxSQLBuilderCyclingRef} steps on expression: ${this.expression}`)
      }
      /*
       { Внимание! Важный момент! Выражение AddedColumn.Expression может быть сложным и состоять из многих атрибутов,
       в том числе и атрибутов разных сущностей. Поэтому 2-й параметр в PrepareSQLExpression нужна сущность,
       которая является родной к выражению AddedColumn.Expression:
       например: выше выражение было b_id.caption, соотв. параметром должнв пойти сущность B, к которой принадлежит caption,
       а не сущность A, которая является контекстов вызова (у нас это AEntity).
       А теперь представим что выражение имеет вид b_id.caption + c_id.caption ...
       Проблема в том, что пока не могу понять, как передать туда список сущностей, а не ПЕРВУЮ }
       // Felix TODO
       */
      let entity, level
      if ((this.preparedExpressions.items.length === 1) && (this.preparedExpressions.items[0].attrEntity)) {
        entity = this.preparedExpressions.items[0].attrEntity
        level = this.preparedExpressions.items[0].level
      } else {
        entity = this.builder.entity
        level = parserUtils.rootLevel
      }
      this.addexpression({expression: this.expression, entity, level, manyAttrExprCollapsed, registerInColumnList})

      doAfterRegister && doAfterRegister()
      exprProps = parserUtils.extractExpressionProps(this.expression, exprPropsParams)
    }
  }
}

module.exports = CustomItem