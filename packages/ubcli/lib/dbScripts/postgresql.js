/**
 * Create PostgreSQl database & database objects for a UnityBase ORM
 * @module cmd/initDB/postgreSQL
 */

var DBA_FAKE = '__dba'

/**
 * Drop a specified schema & role (databaseName)
 * @param {ServerSession} session
 * @param {Object} databaseConfig A database configuration
 */
module.exports.dropDatabase = function dropDatabase (session, databaseConfig) {
  var conn = session.connection
  conn.xhr({
    endpoint: 'runSQL',
    URLParams: {CONNECTION: DBA_FAKE},
    data: UB.format('DROP SCHEMA IF EXISTS {0} CASCADE; DROP USER IF EXISTS {0};', databaseConfig.userID)
  })
}

/**
 * Drop a specified schema & role (databaseName) with a pwd
 * @param {UBConnection} conn
 * @param {Object} databaseConfig A database configuration
 */
module.exports.createDatabase = function createDatabase (conn, databaseConfig) {
  conn.xhr({
    endpoint: 'runSQL',
    URLParams: {CONNECTION: DBA_FAKE},
    data: UB.format("CREATE ROLE {0} LOGIN PASSWORD '{1}' VALID UNTIL 'infinity'; CREATE SCHEMA {0} AUTHORIZATION {0};", databaseConfig.userID, databaseConfig.password)
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
    sequences = 'CREATE SEQUENCE SEQ_UBMAIN INCREMENT 1 MAXVALUE   {0}4999999999 START   {0}0000000000 CYCLE; CREATE SEQUENCE SEQ_UBMAIN_BY1 INCREMENT 1 MAXVALUE {0}999999999999 START {0}500000000000 CYCLE;',
    script
  conn.xhr({
    endpoint: 'runSQL',
    URLParams: {CONNECTION: databaseConfig.name},
    data: UB.format(sequences, clientNum)
  })
  script = fs.readFileSync(path.join(__dirname, 'postgreSQLObjects.sql'))
  conn.xhr({
    endpoint: 'runSQL',
    URLParams: {CONNECTION: databaseConfig.name},
    data: script
  })
  script = fs.readFileSync(path.join(__dirname, 'postgreSQLTables.sql'))
  conn.xhr({
    endpoint: 'runSQL',
    URLParams: {CONNECTION: databaseConfig.name},
    data: script
  })
}
