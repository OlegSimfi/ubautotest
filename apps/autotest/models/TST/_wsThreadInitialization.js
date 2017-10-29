// Subscribe to some messages from client using {UB#getWSNotifier UB.getWSNotifier}
//
// For client-side usage sample go to http://127.0.0.1:888/autotest/models/TST/wsClient/index.html
//

const _ = require('lodash')
const WebSockets = require('@unitybase/ub/modules/web-sockets')
const wsNotifier = WebSockets.getWSNotifier()

if (wsNotifier) {
  var connCount = 0
  console.debug('Start subscribing to wsNotifier tsts_* events')
  wsNotifier.on('tst_echo', function (connection, params) {
    connection.send({
      command: 'tst_message', params: {from: connection.session.userID, message: params}
    })
  })

  wsNotifier.on('tst_message', function (connection, params) {
    if (!_.isNumber(params.recipient) || !wsNotifier.sendCommand('tst_message', params.recipient, {
      from: connection.session.userID,
      message: params.message
    })) {
      connection.send({
        command: 'error', params: {description: 'Can\'t send params to recipient'}
      })
    }
  })

  wsNotifier.on('tst_selfClose', function (connection, params) {
    if (params && params.reason) {
      connection.close(params.reason)
    } else {
      connection.close()
    }
  })

  wsNotifier.on('tst_sendToAllMySession', function (connection, params) {
    var mySessions = wsNotifier.getUserSessions(connection.session.userID)
    for (var i = 0, l = mySessions.length; i < l; i++) {
      wsNotifier.sendCommand('tst_message', mySessions[i], {
        from: 'me', message: params.message
      })
    }
  })

  wsNotifier.on('tst_broadcast', function (connection, params) {
    wsNotifier.broadcast(
            'tst_message', {from: 'broadcast' + connection.session.userID, message: params, connCount: connCount}
        )
  })

  wsNotifier.on('connect', function (connection) {
    connCount += 1
  })

  wsNotifier.on('disconnect', function (connection, reason, status) {
    connCount -= 1
  })
} else {
  console.error(' wsNotifier is ', wsNotifier)
}
