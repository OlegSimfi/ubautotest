'use strict'

var me = tst_pdfSign

me.entity.addMethod('doTest')

/**
 * @param {ubMethodParams} ctx
 * @param {TubList} ctx.mParams
 * @param {Number} ctx.mParams.threadNum
 * @param {String} ctx.mParams.location
 */
me.doTest = function (ctx) {
    // testTubList(ctx);
    // testThreadClass(ctx);
  //  testUBMail(ctx);
  testCanvas(ctx)
  testSigner(ctx)
}

/**
 * Test TubList
 * @param {ubMethodParams} ctx
 * @param {TubList} ctx.mParams
 * @param {Number} ctx.mParams.threadNum
 * @param {String} ctx.mParams.location
 */
function testTubList (ctx) {
  var
    threadObj,
    params = ctx.mParams,
    threadNum = params.threadNum

  console.time('Create & destroy 10 ThreadClass ' + threadNum)
  for (let i = 0; i < 10; i++) {
    threadObj = new TubList()
    threadObj.freeNative()
  }
  console.timeEnd('Create & destroy 10 ThreadClass ' + threadNum)
}

/**
 * Test UBMail
 * @param {ubMethodParams} ctx
 * @param {TubList} ctx.mParams
 * @param {Number} ctx.mParams.threadNum
 * @param {String} ctx.mParams.location
 */
function testUBMail (ctx) {
  var
    UBMail = require('@unitybase/mailer'),
    threadObj,
    params = ctx.mParams,
    threadNum = params.threadNum

  console.time('Create & destroy 10 ThreadClass ' + threadNum)
  for (let i = 0; i < 10; i++) {
    threadObj = new UBMail.TubMailSender({
      host: 'mail.softline.kiev.ua',
      port: '25',
      tls: false
    })
    threadObj.freeNative()
  }
  console.timeEnd('Create & destroy 10 ThreadClass ' + threadNum)
}

/**
 * Test ThreadClass
 * @param {ubMethodParams} ctx
 * @param {TubList} ctx.mParams
 * @param {Number} ctx.mParams.threadNum
 * @param {String} ctx.mParams.location
 */
function testThreadClass (ctx) {
  var
    ThreadTest = require('ThreadTest'),
    TubThreadClass = ThreadTest.TubThreadClass,
    threadObj,
    params = ctx.mParams,
    threadNum = params.threadNum

  console.time('Create & destroy 10 ThreadClass ' + threadNum)
  for (let i = 0; i < 100; i++) {
    if (ThreadTest.verifyData(i, i) !== i + i) {
      throw new Error('wrong verifyData result')
    }

    threadObj = new TubThreadClass()
    threadObj = new TubThreadClass()
    threadObj.freeNative()
    gc()
  }
  console.timeEnd('Create & destroy 10 ThreadClass ' + threadNum)
}

/**
 * Test TubCanvas
 * @param {ubMethodParams} ctx
 * @param {TubList} ctx.mParams
 * @param {Number} ctx.mParams.threadNum
 * @param {String} ctx.mParams.location
 */
function testCanvas (ctx) {
  var
    UBCanvas = require('@unitybase/canvas'),
    params = ctx.mParams,
    threadNum = params.threadNum,
    canvasWidth = 100,
    canvasHeight = 80,
    canvas

  console.time('Creating 10 canvas in thread ' + threadNum)
  for (let i = 0; i < 10; i++) {
    canvas = new UBCanvas(canvasWidth, canvasHeight)
    canvas.setFont('Times New Roman', {r: 84, g: 141, b: 212}, 8)
    canvas.drawText(1, 1, '№–' + new Date().toString(), canvasWidth, canvasHeight)
    canvas.getContent('bin2base64')
    canvas.freeNative()
  }
  console.timeEnd('Creating 10 canvas in thread ' + threadNum)
}
/**
 * Test TubSigner
 * @param {ubMethodParams} ctx
 * @param {TubList} ctx.mParams
 * @param {Number} ctx.mParams.threadNum
 * @param {String} ctx.mParams.location
 */
function testSigner (ctx) {
  let params = ctx.mParams
  let threadNum = params.threadNum

  console.time('Signing 10 docs in thread ' + threadNum)
  let signTest = require('PDFSign/_autotest/test_TubSigner.js')
  signTest()
  console.timeEnd('Signing 10 docs in thread ' + threadNum)
}
