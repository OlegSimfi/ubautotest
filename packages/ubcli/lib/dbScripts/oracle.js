/**
 * Create Oracle database & database objects for a UnityBase ORM
 * @module cmd/initDB/oracle
 */

var DBA_FAKE = '__dba'
/**
 * Drop a specified schema & role (databaseName)
 * @param {ServerSession} session
 * @param {Object} databaseConfig A database configuration
 */
module.exports.dropDatabase = function dropDatabase (session, databaseConfig) {
  var conn = session.connection
  var upperUser = databaseConfig.userID.toUpperCase()

  var userExist = conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: DBA_FAKE}, data: "SELECT COUNT(1) as CNT FROM dba_users WHERE username = '" + upperUser + "'"})
  if (userExist.length && userExist[0].CNT !== 0) {
    var activeConnections = conn.xhr({
      endpoint: 'runSQL',
      URLParams: {CONNECTION: DBA_FAKE},
      data: "SELECT sid, serial# AS sn FROM v$session WHERE username = '" + upperUser + "'"
    })
    var i, l
    for (i = 0, l = activeConnections.length; i < l; i++) {
      conn.xhr({
        endpoint: 'runSQL',
        URLParams: {CONNECTION: DBA_FAKE},
        data: "alter system kill session '" + activeConnections[i].SID + ', ' + activeConnections[i].SN + "'"
      })
    }
    conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: DBA_FAKE}, data: 'DROP USER ' + upperUser + ' CASCADE'})
  } else {
    console.warn('User %s dose not exists. Drop skipped', upperUser)
  }
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
    data: UB.format('CREATE USER {0} IDENTIFIED BY {1} DEFAULT TABLESPACE USERS TEMPORARY TABLESPACE TEMP PROFILE DEFAULT ACCOUNT UNLOCK;',
            databaseConfig.userID, databaseConfig.password)
  })

  var grants = [
      'GRANT CONNECT TO {0}',
      'GRANT RESOURCE TO {0}',
      'ALTER USER {0} DEFAULT ROLE ALL',
      'GRANT ALTER ANY INDEX TO {0}',
      'GRANT ALTER ANY PROCEDURE TO {0}',
      'GRANT ALTER ANY SEQUENCE TO {0}',
      'GRANT ALTER ANY TABLE TO {0}',
      'GRANT ALTER ANY TRIGGER TO {0}',
      'GRANT CREATE ANY INDEX TO {0}',
      'GRANT CREATE ANY PROCEDURE TO {0}',
      'GRANT CREATE ANY SEQUENCE TO {0}',
      'GRANT CREATE ANY SYNONYM TO {0}',
      'GRANT CREATE ANY TABLE TO {0}',
      'GRANT CREATE ANY TRIGGER TO {0}',
      'GRANT CREATE DATABASE LINK TO {0}',
      'GRANT CREATE PROCEDURE TO {0}',
      'GRANT CREATE PUBLIC SYNONYM TO {0}',
      'GRANT CREATE SESSION TO {0}',
      'GRANT CREATE SYNONYM TO {0}',
      'GRANT CREATE TABLE TO {0}',
      'GRANT CREATE TRIGGER TO {0}',
      'GRANT CREATE VIEW TO {0}',
      'GRANT DEBUG ANY PROCEDURE TO {0}',
      'GRANT DEBUG CONNECT SESSION TO {0}',
      'GRANT QUERY REWRITE TO {0}',
      'GRANT SELECT ANY SEQUENCE TO {0}',
      'GRANT UNLIMITED TABLESPACE TO {0}'
    ], i, l
  for (i = 0, l = grants.length; i < l; i++) {
    conn.xhr({
      endpoint: 'runSQL',
      URLParams: {CONNECTION: DBA_FAKE},
      data: UB.format(grants[i], databaseConfig.userID)
    })
  }
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
    fs = require('fs')

  conn.xhr({
    endpoint: 'runSQL',
    URLParams: {CONNECTION: databaseConfig.name},
    data: UB.format('CREATE SEQUENCE SEQ_UBMAIN     START WITH {0}0000000000 MAXVALUE {0}4999999999 MINVALUE {0}0000000000 NOCYCLE CACHE 10 ORDER', clientNum)
  })

  conn.xhr({
    endpoint: 'runSQL',
    URLParams: {CONNECTION: databaseConfig.name},
    data: UB.format('CREATE SEQUENCE SEQ_UBMAIN_BY1 START WITH {0}500000000000 MAXVALUE {0}999999999999 MINVALUE {0}500000000000 NOCYCLE ORDER', clientNum)
  })

  var createObjectSQL = fs.readFileSync(path.join(__dirname, 'oracleObjects.sql'))
  let delimRe = /\r\n/.test(createObjectSQL) ? '/\r\n' : '/\n' // git can remove \r\n
  var statements = createObjectSQL.split(delimRe)
  statements.forEach(function (statement) {
    if (statement)
            { conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: databaseConfig.name}, data: statement}) }
  })

  var initialData = fs.readFileSync(path.join(__dirname, 'oracleTables.sql'))
  statements = initialData.split(delimRe)
  statements.forEach(function (statement) {
    if (statement)
            { conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'main'}, data: statement}) }
  })
}
