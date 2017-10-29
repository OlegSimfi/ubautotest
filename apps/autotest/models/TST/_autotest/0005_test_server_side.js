/**
 * User: pavel.mash
 * Date: 22.10.14
 * Test server side implementations from serverSide folder
 */
const assert = require('assert')
const path = require('path')
const fs = require('fs')
const cmdLineOpt = require('@unitybase/base').options
const argv = require('@unitybase/base').argv
const TEST_NAME = 'Server-side tests'

module.exports = function runOTPTest (options) {
  let session, conn

  if (!options) {
    let opts = cmdLineOpt.describe('', TEST_NAME)
      .add(argv.establishConnectionFromCmdLineAttributes._cmdLineParams)
    options = opts.parseVerbose({}, true)
    if (!options) return
  }

  session = argv.establishConnectionFromCmdLineAttributes(options)
  // if (!session.__serverStartedByMe) {
  //   throw new Error('Shut down server before run this test')
  // }
  conn = session.connection

  console.debug('start ' + TEST_NAME)
  testServerSide()

  function testServerSide () {
    let folder = path.dirname(__filename)
    let tests = fs.readdirSync(path.join(folder, 'serverSide'))

    console.debug('test Server-side js')
    tests.forEach((test) => {
      if (!test.endsWith('.js')) return
      let content = fs.readFileSync(path.join(folder, 'serverSide', test))
      console.debug('Eval a ' + test)
      let result = {res: false}
      try {
        result = conn.post('evaluateScript', content)
      } catch (e) {
        throw new Error(`Error in server-side script ${test}`)
      }
      assert.ok(result.res === true)
    })
  }
}
