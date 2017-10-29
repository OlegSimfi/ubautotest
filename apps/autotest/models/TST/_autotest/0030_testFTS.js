/**
 * Created by pavel.mash on 23.04.2015.
 * >ub ./0030_testFTS.js -cfg D:\projects\Autotest\ubConfig.json -app autotest -u admin -p admin
 */
const assert = require('assert')
const fs = require('fs')
const cmdLineOpt = require('@unitybase/base').options
const argv = require('@unitybase/base').argv
const path = require('path')
const _ = require('lodash')
const __FILE_NAME = 'СonstitutionUkr.txt'

module.exports = function runFTSTest (options) {
  if (!options) {
    let opts = cmdLineOpt.describe('', 'FTS test')
      .add(argv.establishConnectionFromCmdLineAttributes._cmdLineParams)
    options = opts.parseVerbose({}, true)
    if (!options) return
  }

  let session = argv.establishConnectionFromCmdLineAttributes(options)
  let _conn = session.connection

  let expectations = [
    /* 0 */{condition: 'республіка', cnt: 1}, // code016; стаття 5. україна є республікою.
    /* 1 */{condition: 'БоГу', cnt: 1}, // 006 усвідомлюючи відповідальність перед богом, власною совістю,
    /* 2 */{condition: 'територія', cnt: 5}, // територія, територію, території
    /* 3 */{condition: 'консолідація націй', cnt: 1}, // 033  стаття 11. держава сприяє консолідації та розвиткові української нації,
    /* 4 */{condition: 'громадян', cnt: 5}, // громадян, громадянина, громадянин, громадянами,

    /* 5 */{condition: 'без*', cnt: 6}, // безпека, безпосередньо

    /* 6 */{condition: 'право україні', cnt: 4},
    /* 7 */{condition: 'право NEAR україні', cnt: 3},
    /* 8 */{condition: 'право NEAR/5 україні', cnt: 2},
    /* 9 */{condition: 'право NEAR україна NEAR/2 народ', cnt: 1},

    /* 10 */{condition: 'громадян України', cnt: 3},
    /* 11 */{condition: '"громадян України"', cnt: 1},

    /* 12 */{condition: 'громадянин OR бог', cnt: 6}, // god expected once :)
    /* 13 */{condition: '"громадян України" OR бог', cnt: 2}
    //   громадян -України !!!
  ]

  console.debug('\tFTS test')
  insertFirst50Article(_conn)
  testReadFTSGlobalAndEntity(_conn)
  expectationTest(_conn, expectations)
  modifyData(_conn, expectations)
  expectationTest(_conn, expectations)
}

function insertFirst50Article (connection) {
  let descrMaxLen = 2000
  let d = new Date(2015, 1, 1)
  let n, descr

  let testArr = fs.readFileSync(path.join(__dirname, 'fixtures', __FILE_NAME)).split('\r\n')

  console.time('FTS')
  for (let i = 0; i < 50; i++) {
    d.setDate(i % 30 + 1); d.setMonth(i % 11 + 1)
    descr = testArr[i].slice(0, descrMaxLen)
    connection.insert({
      entity: 'tst_document',
      execParams: {
        code: 'code' + ('000' + i).slice(-3),
        docDate: d,
        description: descr
      }
    })
  }
  console.timeEnd('FTS')
}

function testReadFTSGlobalAndEntity (connection) {
  let res, dataFTS, res2, dataEntity

  res = connection.run({
    entity: 'fts_ftsDefault',
    method: 'fts',
    fieldList: ['ID'],
    whereList: {match: {condition: 'match', values: {'any': 'Україна'}}},
    options: {limit: 100, start: 0}
  })
  dataFTS = res.resultData.data

  res2 = connection.Repository('tst_document').attrs('ID').where('', 'match', 'Україна').selectAsArray()
  dataEntity = res2.resultData.data

  assert.deepEqual(_.chain(dataFTS).flatten().sort().value(), _.chain(dataEntity).flatten().sort().value())

  res2 = connection.Repository('tst_document', null, connection).attrs('ID')
        .where('', 'match', 'Україна')
        .where('docDate', '<', new Date(2015, 2, 13))
        .selectAsArray()
  assert.equal(res2.resultData.data.length, 6, 'FTS + docDate filter fail')
}

function expectationTest (connection, matches) {
  let res, dataFTS

  let l = matches.length
  for (let i = 0; i < l; i++) {
    res = connection.run({
      entity: 'fts_ftsDefault',
      method: 'fts',
      fieldList: ['ID', 'entity', 'entitydescr', 'snippet'],
      whereList: {match: {condition: 'match', values: {'any': matches[i].condition}}},
      options: {limit: 100, start: 0}
    })
    dataFTS = res.resultData.data
    assert.equal(dataFTS.length, matches[i].cnt, 'Expectation for: ' + matches[i].condition)
  }
}

/**
 * Change  `республікою` to `монархією` in record with code=code16
 * Delete  record with code006 (word 'богом')
 *
 * @param {UBConnection} connection
 * @param {Array<Object>} expectations
 */
function modifyData (connection, expectations) {
  let modification = {
    code: 'code016',
    description: 'Стаття 5. Україна є монархією.'
  }

  let row = connection.Repository('tst_document').attrs(['ID', 'mi_modifyDate']).where('code', '=', modification.code).selectAsObject()
  connection.query({entity: 'tst_document', method: 'select', ID: row[0].ID, lockType: 'ltTemp', fieldList: ['ID']})
  connection.query({
    alsNeed: false,
    entity: 'tst_document',
    method: 'update',
    fieldList: ['ID'],
    execParams: {
      ID: row[0].ID,
      mi_modifyDate: row[0].mi_modifyDate,
      description: modification.description
    }
  })
  expectations[0].cnt = 0
  expectations.push({condition: 'монархія', cnt: 1})
  connection.query({entity: 'tst_document', method: 'unlock', ID: row[0].ID})

  let ID = connection.lookup('tst_document', 'ID', {expression: 'code', condition: 'equal', values: {nameVal: 'code006'}})
  connection.query({
    entity: 'tst_document',
    method: 'delete',
    execParams: { ID: ID }
  })
  expectations[1].cnt = 0
  expectations[12].cnt = expectations[12].cnt - 1
  expectations[13].cnt = expectations[13].cnt - 1
}
