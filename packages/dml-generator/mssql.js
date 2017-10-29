/**
 * Created by v.orel on 25.03.2017.
 */
const builder = require('./builder')
// const mssqlBuilder = Object.create(builder)
class MSSQLBuilder extends builder {
  /**
   * @param {string} column
   */
  static buildManyColumnFiled (column) {
    return `',' + Cast(${column} as varchar)`
  }
  /**
   * @param {string} sql
   */
  static buildManyColumnExpression (sql) {
    return `stuff((${sql} for xml path('')), 1, 1, '')`
  }
}
module.exports = MSSQLBuilder
