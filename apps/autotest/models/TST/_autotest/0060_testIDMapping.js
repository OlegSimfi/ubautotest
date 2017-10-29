/**
 * Created by pavel.mash on 28.08.2015.
 */

const assert = require('assert')
const fs = require('fs')
const cmdLineOpt = require('@unitybase/base').options
const argv = require('@unitybase/base').argv
const path = require('path')
const TEST_NAME = 'ID mapping'

module.exports = function runFTSTest (options) {
  if (!options) {
    let opts = cmdLineOpt.describe('', TEST_NAME)
      .add(argv.establishConnectionFromCmdLineAttributes._cmdLineParams)
    options = opts.parseVerbose({}, true)
    if (!options) return
  }

  let session = argv.establishConnectionFromCmdLineAttributes(options)
  let conn = session.connection

  console.debug('Start ' + TEST_NAME)
  testIDMapping(conn)
}

/**
 * Issue UB-1219: Error during delete operation in case ID attribute is mapped
 * @param {UBConnection} conn
 */
function testIDMapping (conn) {
  // add new
  let ID = conn.insert({
    entity: 'tst_IDMapping',
    fieldList: ['ID'],
    execParams: { code: 'testIDMap'}
  })
  // delete it
  conn.query({
    entity: 'tst_IDMapping',
    method: 'delete',
    execParams: {ID: ID}
  })
}
