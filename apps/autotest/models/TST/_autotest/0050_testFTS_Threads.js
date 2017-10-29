/**
 * Will test Full text search engine in multithread mode.
 *
 * Unity base must be running in -c mode
 *
 * >ub ./0050_testFTS_Threads.js -cfg D:\projects\Autotest\ubConfig.json -app autotest -u admin -p admin  -t 5
 *
 * @author pavel.mash
 * @created 25.04.2015
 */
const Worker = require('@unitybase/base').Worker
let workers = []

// we can't start server from worker thread try to start it here
const argv = require('@unitybase/base').argv
let session = argv.establishConnectionFromCmdLineAttributes()
let numThreads = parseInt(argv.findCmdLineSwitchValue('t') || '2', 10)
let i

try {
  console.log('start ', numThreads, 'thread')
    // create threads
// MPV -temporary disable multythread test while not fixed!

  for (i = 0; i < numThreads; i++) {
    workers.push(new Worker({
      onmessage: onProcessWorker,
      onterminate: onTerminateWorker,
      onerror: onWorkerError
    }))
    console.log('Create worker ', i)
  }
    // add reader thread
  workers.push(new Worker({
    onmessage: onProcessReaderWorker,
    onterminate: onTerminateWorker,
    onerror: onWorkerError
  }))

  try {
    __dirname
  } catch (e) {
    global.__dirname = 'D:\\projects\\Autotest\\models\\TST\\_autotest'
  }

  i = 0
  workers.forEach(function (worker) {
    worker.postMessage({signal: 'start', folder: __dirname, thread: i, beginFrom: i * 100 * 0, insertCount: 99})
    console.log('Worker ', i, 'started')
    i++
  })
    // wait for done
  workers.forEach(function (worker) {
    console.log(worker.waitMessage(100000))
  })
} finally {
  session.logout()
}

function onTerminateWorker () {
  postMessage('Worker terminated')
}

function onWorkerError (message, exception) {
  postMessage('Worker exception: ' + exception + ' during handle message ' + message)
}

function onProcessWorker (message) {
  // MUST BE HERE - this is worker function
  var
    argv = require('@unitybase/base').argv,
    session,
    __FILE_NAME = 'СonstitutionUkr.txt',
    folder,
    _conn,
    transLen, command, startTime

    // first of all we await for worker num
  command = message
  if (command.signal !== 'start') {
    throw new Error('Start phase. Wrong message ' + message)
  }
    // postMessage('connected');
  folder = command.folder

  session = argv.establishConnectionFromCmdLineAttributes()
  _conn = session.connection
  transLen = parseInt(argv.findCmdLineSwitchValue('transLen') || '10', 10)

  startTime = Date.now()
  try {
    console.debug('\tFTS test')
    testFTS(_conn, folder)
  } finally {
    if (session) session.logout()
  }
  postMessage({signal: 'done', thread: command.thread, timeSpend: Date.now() - startTime})
  terminate()

  function testFTS (connection, folder) {
    var fs = require('fs'),
      path = require('path'),
      testArr, trans = [], curTrLen,
      descrMaxLen = 2000,
      d = new Date(2015, 1, 1),
      i, n, descr

    testArr = fs.readFileSync(path.join(folder, 'fixtures', __FILE_NAME)).split('\r\n')

    curTrLen = 0
    for (i = command.beginFrom; i < command.beginFrom + command.insertCount; i++) {
      d.setDate(i % 30 + 1); d.setMonth(i % 11 + 1)
      descr = testArr[i].slice(0, descrMaxLen)
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
      if (curTrLen = transLen || i === command.beginFrom + command.insertCount - 1) {
        connection.runList(trans); trans = []; curTrLen = 0
      }
    }
  }
}

function onProcessReaderWorker (message) {
  var
    argv = require('@unitybase/base').argv,
    session,
    _conn, res,
    command, startTime

    // first of all we await for worker num
  command = message
  if (command.signal !== 'start') {
    throw new Error('Start phase. Wrong message ' + message)
  }

  session = argv.establishConnectionFromCmdLineAttributes()
  _conn = session.connection

  startTime = Date.now()
  try {
    console.debug('\tFTS read test')
    res = testReadFTS(_conn)
  } finally {
    if (session) session.logout()
  }
  postMessage({signal: res, thread: command.thread, timeSpend: Date.now() - startTime})
  terminate()

  function testReadFTS (connection) {
    var fs = require('fs'),
      path = require('path'),
      i, res

    for (i = command.beginFrom; i < command.beginFrom + command.insertCount; i++) {
      res = connection.run({
        entity: 'fts_ftsDefault',
        method: 'fts',
        fieldList: ['ID', 'entity', 'entitydescr', 'snippet'],
        whereList: {match: {condition: 'match', values: {'any': 'Україна'}}},
        options: {limit: 100, start: 0}
      })
      if (!res.resultData || !res.resultData.data || !res.resultData.data.length) {
        throw new Error('invalidReadSearch')
      }
    }
    return 'done'
  }
}
