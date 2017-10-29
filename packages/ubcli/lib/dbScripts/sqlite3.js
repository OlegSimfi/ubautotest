/**
 * Create SQLite3 database & database objects for a UnityBase ORM
 * @module cmd/initDB/sqlite3
 */

var DBA_FAKE = '__dba'
var fs = require('fs')

/**
 * Drop a specified schema & role (databaseName)
 * @param {ServerSession} session
 * @param {Object} databaseConfig A database configuration
 */
module.exports.dropDatabase = function dropDatabase (session, databaseConfig) {
  var path = require('path')
  var dbPath = path.join(process.configPath, databaseConfig.databaseName)
  console.debug('Start drop a database', dbPath)
  if (fs.existsSync(dbPath)) {
    if (session.__serverStartedByMe) {
      stopServer()
    } else {
      throw new Error('To drop a SQLite3 database start cmd/initDB in local mode')
    }
    if (!fs.unlinkSync(dbPath)) {
      throw new Error('Can not delete SQLite3 database file ' + dbPath + ' May be database in use?')
    }
    startServer()
  }
}

/**
 * Drop a specified schema & role (databaseName) with a pwd
 * @param {UBConnection} conn
 * @param {Object} databaseConfig A database configuration
 */
module.exports.createDatabase = function createDatabase (conn, databaseConfig) {
  // SQLite3 database are created automatically during connection open
}

function splitAndExec (stmts, ubConnection, dbConnectionName) {
  // git can replace \r\n by \n on windows
  let delimRe = /\r\n/.test(stmts) ? '--next\r\n' : '--next\n'
  var statements = stmts.split(delimRe)
  statements.forEach(function (statement) {
    if (statement)
            { ubConnection.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: dbConnectionName}, data: statement}) }
  })
}
/**
 * Create a minimally required  functions & tables for a first sign-in
 * @param {UBConnection} conn
 * @param {Number} clientNum A number of client we create database for
 * @param {Object} databaseConfig A database configuration
 */
module.exports.createMinSchema = function createMinSchema (conn, clientNum, databaseConfig) {
  var
    path = require('path'),
    fs = require('fs'),
    script

  script = 'create table seq_ubmain (client_num INTEGER) /* generateID = clientNum+currentTimeUnixEpoch*100 + 1...99 */'
  splitAndExec(script, conn, databaseConfig.name)
    // set a initial ID value
  script = UB.format('insert into seq_ubmain (client_num) values({0}0000000000)', clientNum)
  splitAndExec(script, conn, databaseConfig.name)

    // TODO put clientNum to a table for a ID generator initialization
  script = fs.readFileSync(path.join(__dirname, 'sqlite3Tables.sql'))
  splitAndExec(script, conn, databaseConfig.name)
}
