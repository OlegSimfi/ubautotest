'use strict'

const tstm1 = require('./modules/tstm')
const assert = require('assert')
const _ = require('lodash')

var me = tst_service

me.entity.addMethod('multiply')
/**
 * @param {ubMethodParams} ctx
 */
me.multiply = function (ctx) {
  var params = ctx.mParams,
    a = params.a || 1,
    b = params.b || 1
  params.multiplyResult = a * b
}

me.schedulerTest = function (ctx) {
  console.log('SCHEDULLER: log message from a test scheduller')
  var store = new TubDataStore('uba_user')
  return 'test scheduler executed at' + new Date()
}

me.entity.addMethod('uDataTest')
/**
 * @param {ubMethodParams} ctx
 */
me.uDataTest = function (ctx) {
  var sessionData = Session.uData
  assert.deepEqual(sessionData.tstNumArray, [1, 2, 3])
  assert.deepEqual(sessionData.tstStrArray, ['1', '2', '3'])
  assert.deepEqual(sessionData.tstNested, {a: 1, b: '2'})
  assert.ok(!sessionData.hasOwnProperty('addedNotInOnLogin'), 'uData persisted only in Session.on("login")')
  Session.uData.addedNotInOnLogin = 'must not persis between calls'
}

App.globalCachePut('aa', '12')
console.log('Got a value:', App.globalCacheGet('aa'))

me.serviceRLS = function () {
  console.log('!!! service RLS this = ', this.entity.name)
  return '(0=0)'
}

me.entity.addMethod('testDataStoreInitialization')
/**
 * @param {ubMethodParams} ctx
 */
me.testDataStoreInitialization = function (ctx) {
  var objArr = [{ID: 1, b: 'aaa'}, {ID: 2}]
  ctx.dataStore.initFromJSON(objArr)
}

/**
 * Test server-side report generation
 *
 * 	var arr = []; for(var i=0; i< 25; i++){ arr.push($App.connection.run({entity: 'tst_service', method: 'testServerReportPDF'})); } Q.all(arr).done(UB.logDebug)
 *
 * @param {ubMethodParams} ctx
 */
me.testServerReportPDF = function (ctx) {
  console.time('testServerReportPDF')

  var UBReport = require('models/UBS/public/UBReport.js')

  var report = UBReport.makeReport('test', 'pdf', {})
  report.done(function (result) {
         // debugger;
    var fs = require('fs')
    if (result.reportType === 'pdf') {
      console.log('Generate PDF of', result.reportData.byteLength)
             // fs.writeFileSync('d:\\result.pdf', result.reportData );
    } else {
      console.log('Generate HTML of', result.reportData.length)
      fs.writeFileSync('d:\\result.html', result.reportData)
    }
    console.timeEnd('testServerReportPDF')
  })
}
me.entity.addMethod('testServerReportPDF')

/**
 * Test UB.UBAbortError
 * @param {ubMethodParams} ctx
 */
me.abortTest = function (ctx) {
  throw new UB.UBAbort('UBAbort exception logged as ERROR log level')
}
me.entity.addMethod('abortTest')

/**
 * Test throw new Error
 * @param {ubMethodParams} ctx
 */
me.throwTest = function (ctx) {
  throw new Error('Error exception logger as EXC level')
}
me.entity.addMethod('throwTest')

/**
 * Test throw new Error
 * @param {ubMethodParams} ctx
 */
me.usualExceptionTest = function (ctx) {
  var
  a = {}
  ctx.mParams.res = a.b.c
}
me.entity.addMethod('usualExceptionTest')

/**
 * Test outOfMemory Exception
 * @param {ubMethodParams} ctx
 */
me.outOfMemExceptionTest = function (ctx) {
  var
  s = '1234567890'

  while (true) {
    s += s
  }
}
me.entity.addMethod('outOfMemExceptionTest')

me.handledExceptionTest = function (ctx) {
  throw new UB.UBAbort('<<<HelloFromHandledError>>>')
}
me.entity.addMethod('handledExceptionTest')

/**
 * Test Session.runAsAdmin
 * @param {ubMethodParams} ctx
 */
me.runAsAdminTest = function (ctx) {
  let uDataBefore = _.cloneDeep(Session.uData)
  Session.runAsAdmin(function () {
    // uParam.ID = userID;
    // uParam.mi_modifyDate = UB.Repository('uba_user').attrs(['ID','mi_modifyDate']).where('ID', '=', 'userID').select().get('mi_modifyDate');
    let store = new TubDataStore('uba_user')
    store.run('update', {
      fieldList: ['ID'],
      '__skipOptimisticLock': true,
        // execParams: uParam
      execParams: {ID: 10, name: 'admin'}
        // execParams: {ID: 1, name: 'Admin'}
    }
    )
  })
  let uDataAfter = Session.uData
  ctx.mParams.runAsAdminUData = {
    before: uDataBefore,
    after: uDataAfter
  }
}
me.entity.addMethod('runAsAdminTest')

me.dmlGeneratorTest = function(ctx) {
  var generator = require('@unitybase/dml-generator')
  ctx.mParams.resultSQL = generator.mssql.biuldSelectSql('tst_maindata',{fieldList: ['parent1@tst_maindata.manyValue.mi_modifyUser.name'],whereList:{c1: {
  expression:'parent1@tst_maindata.manyValue.mi_modifyUser.name', condition : 'equal', values: {c1: 'admin'}
  }}})
  ctx.mParams.sql2 = generator.mssql.biuldSelectSql('tst_maindata', UB.Repository('tst_maindata').attrs('[nonNullDict_ID.caption]', '[nonNullDict_ID.caption_en^]', 'nonNullDict_ID.filterValue', 'nonNullDict_ID.floatValue').ubql())
}
me.entity.addMethod('dmlGeneratorTest')
