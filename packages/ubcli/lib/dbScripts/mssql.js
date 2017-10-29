/**
 * Create SQl Server database & objects for a UnityBase ORM
 * @module cmd/initDB/mssql
 */

const DBA_FAKE = '__dba'
const path = require('path')
const fs = require('fs')

/**
 * Drop a specified schema & role (databaseName)
 * @param {ServerSession} session
 * @param {Object} databaseConfig A database configuration
 */
module.exports.dropDatabase = function dropDatabase (session, databaseConfig) {
  let conn = session.connection
  let checkDB = conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: DBA_FAKE}, data: `select DB_ID (N'${databaseConfig.databaseName}') as DBID`})
  if (checkDB[0]['DBID']) {
        // conn.xhr({
        //    endpoint: 'runSQL',
        //    URLParams: {CONNECTION: DBA_FAKE},
        //    data: UB.format("ALTER DATABASE {0} SET SINGLE_USER WITH ROLLBACK IMMEDIATE", databaseConfig.databaseName)
        // });
    conn.xhr({
      endpoint: 'runSQL',
      URLParams: {CONNECTION: DBA_FAKE},
      data: `DROP DATABASE ${databaseConfig.databaseName}`
    })
  } else {
    console.warn('Database %s dose not exists. Drop skipped', databaseConfig.databaseName)
  }
}

function splitAndExec (stmts, ubConnection, dbConnectionName) {
  let delimRe = /\r\n/.test(stmts) ? 'GO\r\n' : 'GO\n' // git can remove \r\n
  let statements = stmts.split(delimRe)
  statements.forEach(function (statement) {
    if (statement && statement !== 'GO') {
      ubConnection.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: dbConnectionName}, data: statement})
    }
  })
}
/**
 * Drop a specified schema & role (databaseName) with a pwd
 * @param {UBConnection} conn
 * @param {Object} databaseConfig A database configuration
 */
module.exports.createDatabase = function createDatabase (conn, databaseConfig) {
  let script = fs.readFileSync(path.join(__dirname, 'mssqlCreateDatabase.sql'))
  script = UB.format(script, databaseConfig.databaseName, databaseConfig.userID, databaseConfig.password)
  splitAndExec(script, conn, DBA_FAKE)

  script = fs.readFileSync(path.join(__dirname, 'mssqlCreateLogin.sql'))
  script = UB.format(script, databaseConfig.databaseName, databaseConfig.userID, databaseConfig.password)
  splitAndExec(script, conn, DBA_FAKE /* databaseConfig.name */)
}

/**
 * Create a minimally required  functions & tables for a first sign-in
 * @param {UBConnection} conn
 * @param {Number} clientNum A number of client we create database for
 * @param {Object} databaseConfig A database configuration
 */
module.exports.createMinSchema = function createMinSchema (conn, clientNum, databaseConfig) {
  let sequences = [
    'CREATE SEQUENCE dbo.SEQ_UBMAIN AS bigint START WITH {0}0000000000 INCREMENT BY 1 MINVALUE {0}0000000000 MAXVALUE {0}4999999999 NO CACHE',
    'GO',
    'CREATE SEQUENCE dbo.SEQ_UBMAIN_BY1 AS bigint START WITH {0}500000000000 INCREMENT BY 1 MINVALUE {0}500000000000 MAXVALUE {0}999999999999 NO CACHE'
  ].join('\r\n')

  sequences = UB.format(sequences, clientNum)
  splitAndExec(sequences, conn, databaseConfig.name)

  let script = fs.readFileSync(path.join(__dirname, 'mssqlObjects.sql'))
  splitAndExec(script, conn, databaseConfig.name)

  script = fs.readFileSync(path.join(__dirname, 'mssqlTables.sql'))
  splitAndExec(script, conn, databaseConfig.name)
}
