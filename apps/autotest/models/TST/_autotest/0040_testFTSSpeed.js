/**
 * Created by pavel.mash on 23.04.2015.
 * >ub ./0030_testFTS.js -cfg D:\projects\Autotest\ubConfig.json -app autotest -u admin -p admin  -n 100 -t 10
 */
const assert = require('assert')
const fs = require('fs')
const cmdLineOpt = require('@unitybase/base').options
const argv = require('@unitybase/base').argv
const path = require('path')
const _ = require('lodash')
const __FILE_NAME = 'СonstitutionUkr.txt'

module.exports = function runFTSSpeedTest (options) {
  if (!options) {
    let opts = cmdLineOpt.describe('', 'FTS test')
      .add(argv.establishConnectionFromCmdLineAttributes._cmdLineParams)
      .add({short: 'n', long: 'iterationCnt', param: 'iterationCnt', defaultValue: 100, help: 'Iteration count'})
      .add({short: 't', long: 'transLen', param: 'transLen', defaultValue: 10, help: 'Transaction length'})

    options = opts.parseVerbose({}, true)
    if (!options) return
  }

  let session = argv.establishConnectionFromCmdLineAttributes(options)
  let _conn = session.connection

  console.debug('\tFTS speed test')
  testFTSSpeed(_conn, options)
}

function testFTSSpeed (connection, options) {
  let trans = []
  let curTrLen
  let iterationCnt = parseInt(options.iterationCnt, 10)
  let transLen = parseInt(options.transLen, 10)

  let bibleArr = fs.readFileSync(path.join(__dirname, 'fixtures', __FILE_NAME)).split('\r\n')
  bibleArr.splice(0, 72) // remove Table of content

  let descrMaxLen = 2000
  let d = new Date(2015, 1, 1)
  let n, descr

  console.time('FTSSpeed')
  curTrLen = 0
  for (let i = 0; i < iterationCnt; i++) {
    d.setDate(i % 30 + 1); d.setMonth(i % 11 + 1)
    descr = bibleArr[i].slice(0, descrMaxLen)
    trans.push({
      entity: 'tst_document',
      method: 'insert',
      execParams: {
        code: 'code' + ('000' + i).slice(-3),
        docDate: d,
        description: descr
      }
    })
    curTrLen++
    if (curTrLen = transLen || i === iterationCnt - 1) {
      connection.query(trans)
      trans = []
      curTrLen = 0
    }
  }
  console.timeEnd('FTSSpeed')
  console.debug('Finish FTS for ', iterationCnt, 'iteration. TransLen=', transLen)
}
