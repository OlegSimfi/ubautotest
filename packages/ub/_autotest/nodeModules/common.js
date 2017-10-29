// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var path = require('path')
var assert = require('assert')

exports.testDir = path.dirname(__filename)
exports.fixturesDir = path.join(exports.testDir, 'fixtures')
exports.libDir = path.join(exports.testDir, '../lib')
exports.tmpDir = path.join(exports.testDir, 'tmp')
exports.PORT = +process.env.NODE_COMMON_PORT || 12346

if (process.platform === 'win32') {
  exports.PIPE = '\\\\.\\pipe\\libuv-test'
} else {
  exports.PIPE = exports.tmpDir + '/test.sock'
}

var util = require('util')
for (var i in util) exports[i] = util[i]
// for (var i in exports) global[i] = exports[i];

function protoCtrChain (o) {
  var result = []
  for (; o; o = o.__proto__) { result.push(o.constructor) }
  return result.join()
}

exports.indirectInstanceOf = function (obj, cls) {
  if (obj instanceof cls) { return true }
  var clsChain = protoCtrChain(cls.prototype)
  var objChain = protoCtrChain(obj)
  return objChain.slice(-clsChain.length) === clsChain
}

exports.ddCommand = function (filename, kilobytes) {
  if (process.platform === 'win32') {
    var p = path.resolve(exports.fixturesDir, 'create-file.js')
    return '"' + process.argv[0] + '" "' + p + '" "' +
           filename + '" ' + (kilobytes * 1024)
  } else {
    return 'dd if=/dev/zero of="' + filename + '" bs=1024 count=' + kilobytes
  }
}

exports.spawnCat = function (options) {
  var spawn = require('child_process').spawn

  if (process.platform === 'win32') {
    return spawn('more', [], options)
  } else {
    return spawn('cat', [], options)
  }
}

exports.spawnPwd = function (options) {
  var spawn = require('child_process').spawn

  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/c', 'cd'], options)
  } else {
    return spawn('pwd', [], options)
  }
}

// Turn this off if the test should not check for global leaks.
exports.globalCheck = true

process.on('exit', function () {
  if (!exports.globalCheck) return
  var knownGlobals = [/* setTimeout,
                      setInterval,
                      setImmediate,
                      clearTimeout,
                      clearInterval,
                      clearImmediate, */
    console,
                      // Buffer,
    process,
    global
  ]

  if (global.gc) {
    knownGlobals.push(gc)
  }
  if (global.__module) { // for a ub -f mode
    knownGlobals.push(__module)
  }
  if (global.UB) {
    knownGlobals.push(UB)
//	knownGlobals.push(_);
    knownGlobals.push(Buffer)
    knownGlobals.push(setTimeout)
    knownGlobals.push(setInterval)
    knownGlobals.push(setImmediate)
    knownGlobals.push(clearTimeout)
    knownGlobals.push(clearInterval)
// todo
//	knownGlobals.push(clearImmediate);
    knownGlobals.push(_timerLoop)
//	knownGlobals.push(Ext);
	// tomporary - PDF fonts need atob & btoa
//	knownGlobals.push(atob);
//	knownGlobals.push(btoa);

    knownGlobals.push(id)
    knownGlobals.push(exports)
    knownGlobals.push(parent)
    knownGlobals.push(filename)
    knownGlobals.push(loaded)
    knownGlobals.push(children)
    knownGlobals.push(paths)
// TODO: remove in 1.9 require need
    knownGlobals.push(toLog)
    knownGlobals.push(objectToJSON)
    knownGlobals.push(loadFileToBuffer)
    knownGlobals.push(writeFile)
    knownGlobals.push(writeFileNew)
    knownGlobals.push(appendFileNew)
    knownGlobals.push(readDir)
    knownGlobals.push(forceDirectories)
    knownGlobals.push(removeDir)
    knownGlobals.push(deleteFile)
    knownGlobals.push(relToAbs)
    knownGlobals.push(moveFile)
    knownGlobals.push(copyFile)
    knownGlobals.push(sleep)
    knownGlobals.push(createGuid)
    knownGlobals.push(shellExecute)
    knownGlobals.push(base64tofile)
    knownGlobals.push(sendMail)
    knownGlobals.push(sendUTFMail)
    knownGlobals.push(removeCommentsFromJSON)
    knownGlobals.push(runInThisContext)
    knownGlobals.push(runInVariableScopeContext)
    knownGlobals.push(ncrc32)
    knownGlobals.push(nsha256)
    knownGlobals.push(startServer)
    knownGlobals.push(stopServer)
  }

  if (global.DTRACE_HTTP_SERVER_RESPONSE) {
    knownGlobals.push(DTRACE_HTTP_SERVER_RESPONSE)
    knownGlobals.push(DTRACE_HTTP_SERVER_REQUEST)
    knownGlobals.push(DTRACE_HTTP_CLIENT_RESPONSE)
    knownGlobals.push(DTRACE_HTTP_CLIENT_REQUEST)
    knownGlobals.push(DTRACE_NET_STREAM_END)
    knownGlobals.push(DTRACE_NET_SERVER_CONNECTION)
    knownGlobals.push(DTRACE_NET_SOCKET_READ)
    knownGlobals.push(DTRACE_NET_SOCKET_WRITE)
  }
  if (global.COUNTER_NET_SERVER_CONNECTION) {
    knownGlobals.push(COUNTER_NET_SERVER_CONNECTION)
    knownGlobals.push(COUNTER_NET_SERVER_CONNECTION_CLOSE)
    knownGlobals.push(COUNTER_HTTP_SERVER_REQUEST)
    knownGlobals.push(COUNTER_HTTP_SERVER_RESPONSE)
    knownGlobals.push(COUNTER_HTTP_CLIENT_REQUEST)
    knownGlobals.push(COUNTER_HTTP_CLIENT_RESPONSE)
  }

  if (global.ArrayBuffer) {
    knownGlobals.push(ArrayBuffer)
    knownGlobals.push(Int8Array)
    knownGlobals.push(Uint8Array)
    knownGlobals.push(Uint8ClampedArray)
    knownGlobals.push(Int16Array)
    knownGlobals.push(Uint16Array)
    knownGlobals.push(Int32Array)
    knownGlobals.push(Uint32Array)
    knownGlobals.push(Float32Array)
    knownGlobals.push(Float64Array)
    knownGlobals.push(DataView)
  }

  for (var x in global) {
    var found = false
    if (x === 'exports' || x === 'require') continue
    for (var y in knownGlobals) {
      if (global[x] === knownGlobals[y]) {
        found = true
        break
      }
    }

    if (!found) {
      console.error('Unknown global: %s %o', x, global[x])
      assert.ok(false, 'Unknown global found')
    }
  }
})

var mustCallChecks = []

function runCallChecks (exitCode) {
  if (exitCode !== 0) return

  var failed = mustCallChecks.filter(function (context) {
    return context.actual !== context.expected
  })

  failed.forEach(function (context) {
    console.log('Mismatched %s function calls. Expected %d, actual %d.',
                context.name,
                context.expected,
                context.actual)
    console.log(context.stack.split('\n').slice(2).join('\n'))
  })

  if (failed.length) process.exit(1)
}

exports.mustCall = function (fn, expected) {
  if (typeof expected !== 'number') expected = 1

  var context = {
    expected: expected,
    actual: 0,
    stack: (new Error()).stack,
    name: fn.name || '<anonymous>'
  }

  // add the exit listener only once to avoid listener leak warnings
  if (mustCallChecks.length === 0) process.on('exit', runCallChecks)

  mustCallChecks.push(context)

  return function () {
    context.actual++
    return fn.apply(this, arguments)
  }
}

exports.platformTimeout = function (ms) {
/*  if (process.config.target_defaults.default_configuration === 'Debug')
    ms = 2 * ms;

  if (exports.isAix)
    return 2 * ms; // default localhost speed is slower on AIX

  if (process.arch !== 'arm')
    return ms;

  const armv = process.config.variables.arm_version;

  if (armv === '6')
    return 7 * ms;  // ARMv6

  if (armv === '7')
    return 2 * ms;  // ARMv7
*/
  return ms // ARMv8+
}

exports.skip = function (msg) {
  console.log(`1..0 # Skipped: ${msg}`)
}