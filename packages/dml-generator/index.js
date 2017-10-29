/**
 * Created by v.orel on 05.01.2017.
 * @module
 */
// module.exports = require('./builder')
const mssql = require('./mssql')
module.exports = {
  mssql
}
/*
const MSSQLBuilder = require('msSQLBuilder')

exports.buildSelectSql = function (params) {
  const builder = new MSSQLBuilder(params)
  return builder.buildSelectQuery()
}
*/