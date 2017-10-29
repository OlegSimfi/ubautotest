/**
 * Date: 25.09.16
 * Test DDL generator
 */
var
  assert = require('assert'),
  fs = require('fs'),
  argv = require('@unitybase/base').argv,
  session, conn

session = argv.establishConnectionFromCmdLineAttributes()
conn = session.connection

try {
  console.debug('test DDL generator')
  runTest(conn)
} finally {
  session.logout()
}

function runTest (conn) {
  var dictID = conn.lookup('tst_dictionary', 'ID', {expression: 'code', condition: 'equal', values: {code: 'code10'}})
  assert.throws(function () {
    conn.run({
	        entity: 'tst_dictionary',
	        method: 'delete',
      execParams: { ID: dictID }
    })
  }, /ERR_REFERENCE_ERROR/, 'Referential constraint in database must fail for tst_dictionaly with code="code10" deletion')

  var data = conn.Repository('tst_dictionary').attrs(['mi_modifyDate']).where('ID', '=', dictID).selectAsObject()
  assert.throws(function () {
    conn.run({
	        entity: 'tst_dictionary',
	        method: 'update',
      execParams: { ID: dictID, code: 'code20', mi_modifyDate: data[0].mi_modifyDate}
    })
  }, /VALUE_MUST_BE_UNIQUE/, 'Unique constraint in database must fail for tst_dictionaly update from "code10" to "code20"')

    // testcase for TubDataStore.generateDDL() call in case data store is created in one context but called in other
  conn.get('getIDTest')
}
