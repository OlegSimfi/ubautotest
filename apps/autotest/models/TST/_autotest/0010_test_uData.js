/**
 * Created by pavel.mash on 25.05.2015.
 */
const assert = require('assert')
const fs = require('fs')
const cmdLineOpt = require('@unitybase/base').options
const argv = require('@unitybase/base').argv
const path = require('path')
const _ = require('lodash')

module.exports = function runUDataTest (options) {
  if (!options) {
    let opts = cmdLineOpt.describe('', 'uData test')
      .add(argv.establishConnectionFromCmdLineAttributes._cmdLineParams)
    options = opts.parseVerbose({}, true)
    if (!options) return
  }

  // console.log('orig options:', options)
  let session = argv.establishConnectionFromCmdLineAttributes(options)
  let conn = session.connection

  function relogon (credential) {
    let opts = _.merge({}, options, {forceStartServer: true}, credential)
    session.logout() // shut down server
    // console.log('new options:', opts)
    session = argv.establishConnectionFromCmdLineAttributes(opts)
    conn = session.connection
  }

  /**
   * Test uData is restored after Session.runAsAdmin call
   */
  function testUDataPersistence () {
    relogon({user: 'testelsuser', pwd: 'testElsPwd'})
    // check it filled
    let resp = conn.query({
      entity: 'tst_service',
      method: 'runAsAdminTest'
    })
    assert.deepEqual(resp.runAsAdminUData.before, resp.runAsAdminUData.after, 'uData before and after runAsAdmin must be equal')
  }

  console.debug('test_uData')
  testUData(conn)
  console.debug('test_uData persistance')
  testUDataPersistence()
  // console.debug('test data store')
  // testDataStore(conn)
}

/**
 *  Test uData is Object and it persisted only on Session.on('login');
 * @param {UBConnection} conn
 */
function testUData (conn) {
    // check it filled
  conn.query({
    entity: 'tst_service',
    method: 'uDataTest'
  })
    // and if we define something in uData not in Session.on(login) nothing changed
  conn.query({
    entity: 'tst_service',
    method: 'uDataTest'
  })
}

function testDataStore (conn) {
  assert.throws(function () {
    conn.run({
      entity: 'tst_service',
      method: 'testDataStoreInitialization'
    })
  }, /Wrong JSON/, 'Wrong JSON do not raise AV')
}
