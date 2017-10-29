var testData = {}
var requestNum = 100

UB.connect({
  host: window.location.origin,
  allowSessionPersistent: false,
  onCredentialRequired: function (conn, isRepeat) {
    return isRepeat
      ? Promise.reject(new UB.UBAbortError('invalid password for user admin'))
      : Promise.resolve({authSchema: 'UB', login: 'admin', password: 'admin'})
  },
  onAuthorizationFail: function (reason) {
    window.alert(reason)
  }
}).then(function (conn) {
  window.$UBConnection = conn
})

window.createLowLevelConnection = function () {
  $UBConnection.authorize().then(function (session) {
    $ws = new WebSocket('ws://' + location.host + '/ws?SESSION_SIGNATURE=' + session.signature(), 'ubNotifier')
    $ws.onmessage = function (e) {
      let msg
      try {
        msg = JSON.parse(e.data)
      } catch (err) {
        console.error('Invalid command from server:', e.data)
      }
      let command = msg.command
      let params = msg.params
      if (command === 'accepted') {
        console.log('Server accept connection with session ID=', params.connectionID)
      } else if (command === 'tst_message') {
        console.log('New message. ', params.from, 'said:', params.message)
      } else if (command === 'error') {
        console.error('Error. Details:', params.description)
      } else {
        console.error('Invalid server response. Command', command, 'is unknown')
      }
    }

    $ws.onclose = function (e) {
      console.log('Connection closed from server. Code:', e.code, 'Reason:', e.reason)
    }
  })
}

window.loadTest = function (strLen) {
  $UBConnection.authorize().then(function (session) {
    var resTable = document.getElementById('resTable')
    $session = session
    $ws = new WebSocket('ws://' + location.host + '/ws?SESSION_SIGNATURE=' + session.signature(), 'ubNotifier')

    $ws.onopen = function (e) {
      console.log('Connected to:', e.target.url, 'protocol:', e.target.protocol)
    }

    $ws.onmessage = function (e) {
      var msg, time, row
      try {
        msg = JSON.parse(e.data)
      } catch (err) {
        console.error('Invalid command from server:', e.data)
      }
      var
        command = msg.command,
        params = msg.params
      if (command === 'accepted') {
        console.log('Server accept connection with session ID=', params.connectionID)
        var strLen = strLen || 100,
          sentData = {
            requestNum: requestNum,
            testString: ('s' + requestNum).repeat(strLen)
          }
        testData['r' + requestNum] = performance.now()
        requestNum++
        $ws.send(JSON.stringify({command: 'tst_broadcast', params: sentData}))
      } else if (command === 'tst_message') {
        time = testData['r' + params.message.requestNum]
        if (time) {
          time = performance.now() - time
          testData['r' + params.message.requestNum] = time
          row = resTable.insertRow(-1)
          row.insertCell(0).innerHTML = '' + params.connCount
          row.insertCell(1).innerHTML = '' + time
          row = null
          //! !! $ws.close()
        }
        console.log('New message. ', params.from, 'said:', params.message)
      } else if (command === 'error') {
        console.error('Error. Details:', params.description)
      } else {
        console.error('Invalid server response. Command', command, 'is unknown')
      }
    }

    $ws.onclose = function (e) {
      console.log('Connection closed from server. Code:', e.code, 'Reason:', e.reason)
    }
  })
}
