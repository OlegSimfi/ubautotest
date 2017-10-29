/**
 * Will test IIT cryptography .
 *
 * @author xmax
 * @created 25.09.2015
 */
const Worker = require('@unitybase/base').Worker
const assert = require('assert')
const fs = require('fs')
const cmdLineOpt = require('@unitybase/base').options
const argv = require('@unitybase/base').argv
const path = require('path')
const TEST_NAME = 'IIT cryptography thread test'

module.exports = function runIITCryptoTest (options) {
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

  for (let i = 0; i < numThreads; i++) {
    onProcessWorker({signal: 'start', thread: i})
  }
  return // TODO - MPV  require not work inside worker onProcessWorker
  let workers = []
  // create threads
  for (let i = 0; i < numThreads; i++) {
    workers.push(new Worker({
      onmessage: onProcessWorker,
      onterminate: onTerminateWorker,
      onerror: onWorkerError
    }))
    console.debug('Create worker ', i)
  }

  let i = 0
  workers.forEach((worker) => {
    worker.postMessage({signal: 'start', thread: i})
    console.log('Worker ', i, 'started')
    i++
  })
  // wait for done
  workers.forEach((worker) => {
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
  const argv = require('@unitybase/base').argv
  const cmdLineOpt = require('@unitybase/base/options')

  let result

  if (message.signal !== 'start') {
    throw new Error('Start phase. Wrong message ' + message)
  }

  let opts = cmdLineOpt.describe('', 'worker')
    .add(argv.establishConnectionFromCmdLineAttributes._cmdLineParams)
  let options = opts.parseVerbose({}, true)

  let session = argv.establishConnectionFromCmdLineAttributes(options)
  let connection = session.connection
  let startTime = Date.now()
  try {
    result = connection.query([{
      entity: 'tst_crypto',
      method: 'doTest',
      execParams: {
        code: message.thread
      }
    }])
  } finally {
    session.logout()
  }
  if (global.postMessage) { // we are in worker
    postMessage({signal: 'done', thread: message.thread, timeSpend: Date.now() - startTime, result: result})
    terminate()
  }
}
