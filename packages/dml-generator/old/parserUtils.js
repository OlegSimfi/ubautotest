/**
 * Created by v.orel on 11.01.2017.
 */
// todo documentation
const chars = {
  opBracket: '['.charCodeAt(0),
  clBracket: ']'.charCodeAt(0),
  lang: '^'.charCodeAt(0),
  namedParam: ':'.charCodeAt(0),
  nativeSQL: '#'.charCodeAt(0),
  dot: '.'.charCodeAt(0),
  coma: ','.charCodeAt(0),
  opRBracket: '('.charCodeAt(0),
  clRBracket: ')'.charCodeAt(0),
  param: '?'.charCodeAt(0),
  opFBracket: '{'.charCodeAt(0),
  clFBracket: '}'.charCodeAt(0),
  gt: '>'.charCodeAt(0),
  lt: '<'.charCodeAt(0),
  eq: '='.charCodeAt(0),
  space: '='.charCodeAt(0),
  chA: 'A'.charCodeAt(0),
  chZ: 'Z'.charCodeAt(0),
  cha: 'a'.charCodeAt(0),
  chz: 'z'.charCodeAt(0),
  ch0: '0'.charCodeAt(0),
  ch9: '9'.charCodeAt(0),
  ch_: '_'.charCodeAt(0),
  chAmp: '@'.charCodeAt(0),
  upperDelta: 'a'.charCodeAt(0) - 'A'.charCodeAt(0),
  isIdentifier: function (ch) {
    return ((ch >= chars.ch0) && (ch <= chars.ch9)) ||
      ((ch >= chars.chA) && (ch <= chars.chZ)) ||
      ((ch >= chars.cha) && (ch <= chars.chz)) ||
      (ch === chars.ch_)
  }
}
const dbFieldServiceFunctions = {
  'SUM': true,
  'COUNT': true,
  'AVG': true,
  'MAX': true,
  'MIN': true,
  'CAST': true,
  'COALESCE': true,
  'LENGTH': true,
  'LOWER': true,
  'UPPER': true,
  'DAY': true,
  'MONTH': true,
  'YEAR': true,
  'ROUND': true,
  'FLOOR': true,
  'CEILING': true,
  'MASTER': true,
  'SELF': true
}
const reBracketField = /\[([^\]]*)]/g
const reGetFirstWord = /([^.]*)\./
const reGetLastWord = /\.([^.]*)/

const parserUtils = {
  rootLevel: 'Root',
  deniedNotSimpleExpr: true,
  ubID: 'ID',
  ubBracketID: '[ID]',
  macros: {
    maxdate: '#maxdate',
    currentdate: '#currentdate',
    selfDSValue: '{self}',
    parentDSValue: '{master}'
  },
  mixins: {
    unity: 'unity'
  },
  entities: {
    enum: 'ubm_enum'
  },
  serviceFields: {
    allFields: '*',
    sourceBr: '[sourceID]',
    destBr: '[destID]'
  },
  extractExpressionProps: function (expression, {onlyDot: onlyDot = false, onlyOpenBracket: onlyOpenBracket = false} = {}) {
    const res = {
      isAttributeExpression: true,
      simpleExpression: true,
      expression
    }
    let ch
    let expr = {
      expression,
      length: expression.length,
      curPos: 0
    }
    let insideAttrExpr = false
    let servExprBrCounter = 0
    // let subQueryExprBrCounter = 0
    let insideSubQueryExpr = false
    while (expr.curPos < expr.length) {
      ch = expression.charCodeAt(expr.curPos++)
      if (ch === chars.opBracket) {
        res.existOpenBracket = true
        if (onlyOpenBracket) {
          break
        }
        insideAttrExpr = true
      } else if (ch === chars.clBracket) {
        res.existCloseBracket = true
        insideAttrExpr = false
      } else if (ch === chars.lang) {
        res.existLangPointer = true
      } else if (ch === chars.namedParam) {
        res.existNamedParam = true
      } else if (ch === chars.nativeSQL) {
        res.existNativeSQL = true
      } else if (ch === chars.dot) {
        res.existDot = true
        if (onlyDot) {
          break
        }
      } else if ((ch === chars.coma) || (ch === chars.opRBracket) || (ch === chars.clRBracket) || (ch === chars.param)) {
        res.isAttributeExpression = false
        if (!insideAttrExpr || !res.existOpenBracket) {
          if (ch === chars.opRBracket) {
            servExprBrCounter++
            if (!parserUtils._findServiceExprBackFrom(expr)) {
              res.simpleExpression = false
            } else {
              res.existServiceExpr = true
            }
          } else if (ch === chars.clRBracket) {
            if (servExprBrCounter <= 0) {
              res.simpleExpression = false
            }
            servExprBrCounter--
          } else {
            res.simpleExpression = false
          }
        }
      } else if ((ch === chars.opFBracket) || (ch === chars.clFBracket)) {
        if (ch === chars.clFBracket) {
          // subQueryExprBrCounter--
          if (!parserUtils._findServiceExprBackFrom(expr)) {
            res.simpleExpression = false
          } else {
            res.existServiceExpr = true
          }
          insideSubQueryExpr = false
        } else {
          insideSubQueryExpr = true
          // subQueryExprBrCounter++
        }
      } else if ((ch === chars.gt) || (ch === chars.lt) || (ch === chars.eq)) {
        res.isAttributeExpression = false
        if (!res.existOpenBracket) {
          res.simpleExpression = false
        }
      } else if (ch === chars.space) {
        res.isAttributeExpression = false
      } else if (chars.isIdentifier(ch)) {
        if (!insideAttrExpr && !insideSubQueryExpr && res.existOpenBracket) {
          res.simpleExpression = false
        }
      } else {
        if (!parserUtils._isExprLink(expr)) {
          res.simpleExpression = false
        }
      }
    }
    return res
  },
  bracketExpr (expression) {
    const props = parserUtils.extractExpressionProps(expression)
    const expr = ['', expression, '']
    if (props.isAttributeExpression && !props.existNativeSQL && !props.existOpenBracket) {
      expr[0] = '['
      props.existOpenBracket = true
    }
    if (props.isAttributeExpression && !props.existNativeSQL && !props.existCloseBracket) {
      expr[2] = ']'
      props.existCloseBracket = true
    }
    return {props, expression: expr.join('')}
  },
  splitBracketExpressions: function (expression, withBracket) {
    const expressions = []
    while (true) {
      const res = reBracketField.exec(expression)
      if (res) {
        const resForPush = res[withBracket ? 0 : 1]
        if (!expressions.includes(resForPush)) {
          expressions.push(resForPush)
        }
      } else {
        break
      }
    }
    return expressions
  },
  expressionFirstWord: function (expression) {
    const res = reGetFirstWord.exec(expression)
    return res ? res[1] : expression
  },
  expressionLastWord: function (expression) {
    const res = reGetLastWord.exec(expression)
    return res ? res[1] : expression
  },
  extractOneExprLink: function (expression) {
    let existLink = false
    let expr = {
      expression,
      length: expression.length, // TODO rename length
      curPos: 0
    }
    while (expr.curPos < expr.length) {
      if (parserUtils._isExprLink(expr)) {
        existLink = true
        break
      }
      expr.curPos++
    }
    if (existLink) {
      return {
        existLink,
        expression: expression.substr(expr.curPos),
        essLink: expression.substr(0, expr.curPos - 2)
      }
    } else {
      return {existLink, expression}
    }
  },
  extractAttrAndLang: function (expression, supportLang) {
    const noLangExpr = expression.endsWith('^') ? expression.substr(0, expression.length - 1) : expression
    const pos = expression.lastIndexOf('_')
    let expr, lang
    if (pos > 0) {
      expr = expression.substr(0, pos)
      lang = expression.substr(pos + 1).toLocaleLowerCase()
      if (!supportLang.includes(lang)) {
        expr = noLangExpr
        lang = undefined
      }
    } else {
      expr = noLangExpr
    }
    return {
      expression: expr,
      lang,
      noLangExpr
    }
  },
  delStartStr (str, subStr) {
    return str.startsWith(subStr) ? str.substr(subStr.length) : str
  },
  isHaveOpenCloseRoundBracket (expr) {
    return parserUtils._reHaveOpenCloseRoundBracket.test(expr)
  },
  _reHaveOpenCloseRoundBracket: /^\(.*\)$/,
  _isExprLink: function (expr) {
    if (expr.expression.charCodeAt(expr.curPos) === chars.chAmp) {
      if (chars.isIdentifier(expr.expression.charCodeAt(expr.curPos - 1))) {
        return true
      }
      chars.chAmp++
    }
    return false
  },
  _findServiceExprBackFrom: function (expr) {
    let pos = expr.curPos
    if (pos === 0) {
      return false
    }
    let haveData = false
    let ch
    while (pos >= 0) {
      ch = expr.expression.charCodeAt(pos--)
      if (chars.isIdentifier(ch)) {
        haveData = true
      } else break
    }
    if (!haveData) {
      return false
    }
    return !!dbFieldServiceFunctions[expr.substr(pos + 1, expr.curPos - pos).toUpperCase()]
  }
}

module.exports = parserUtils
