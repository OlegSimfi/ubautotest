/**
 * Will test PDF signing.
 *
 * Unity base must be running in -c mode
 *
 * UB ./models/tst/_autotest/0080_testPDFSigner.js -cfg ubConfig.json -app autotest -u admin -p admin  -t 5
 *
 * @author mpv
 * @created 04.11.2015
 */

const Worker = require('@unitybase/base').Worker
const assert = require('assert')
const fs = require('fs')
const cmdLineOpt = require('@unitybase/base').options
const argv = require('@unitybase/base').argv
const path = require('path')
const TEST_NAME = 'PDF signing thread test'

module.exports = function runPDFSignTest (options) {
  if (!options) {
    let opts = cmdLineOpt.describe('', TEST_NAME)
      .add(argv.establishConnectionFromCmdLineAttributes._cmdLineParams)
      .add({short: 't', long: 'numThreads', param: 'numThreads', defaultValue: 2, help: 'Thread count'})
    options = opts.parseVerbose({}, true)
    if (!options) return
  } else {
    options.numThreads = 2
  }

  // start a server for workers (if stopped)
  argv.establishConnectionFromCmdLineAttributes(options)

  let numThreads = parseInt(options.numThreads, 10)
  console.debug('start ', numThreads, TEST_NAME)

  let workers = []

  console.log('start ', numThreads, 'thread')
  for (let i = 0; i < numThreads; i++) {
    onProcessWorker({signal: 'start', thread: i})
  }
  return // TODO - MPV  require not work inside worker onProcessWorker

    // create threads
  for (let i = 0; i < numThreads; i++) {
    workers.push(new Worker({
      onmessage: onProcessWorker,
      onterminate: onTerminateWorker,
      onerror: onWorkerError
    }))
    console.log('Create worker ', i)
  }

  let i = 0
  workers.forEach(function (worker) {
    worker.postMessage({signal: 'start', thread: i})
    console.log('Worker ', i, 'started')
    i++
  })
    // wait for done
  workers.forEach(function (worker) {
    let workerMessage = worker.waitMessage(100000)
    assert.ok(workerMessage.signal !== 'error', workerMessage.message)
  })
}

function onTerminateWorker () {
  postMessage({signal: 'terminated'})
}

function onWorkerError (message, exception) {
  postMessage({signal: 'error', message: exception + ' during handle message ' + message})
}

function onProcessWorker (message) {
  var
    argv = require('@unitybase/base').argv,
    session,
    connection,
    result,
    startTime

  if (message.signal !== 'start') {
    throw new Error('Start phase. Wrong message ' + message)
  }

  session = argv.establishConnectionFromCmdLineAttributes()
  connection = session.connection
  startTime = Date.now()
  try {
    result = connection.query({
      entity: 'tst_pdfSign',
      method: 'doTest',
      threadNum: message.thread,
      location: 'Located in ' + message.thread
    })
  } finally {
    if (session) {
      session.logout()
    }
  }
  if (global.postMessage) { // we are in worker
    postMessage({signal: 'done', thread: message.thread, timeSpend: Date.now() - startTime, result: result})
    terminate()
  }
}
