var UB = require('@unitybase/ub-pub')
var _ = require('lodash')

// for a unhandled rejection in bluebird-q
if (window.Q && window.Q.getBluebirdPromise) {
  window.Q.onerror = function (error) {
    window.onerror.apply(this, ['', '', '', '', error])
  }
} else {
  // for unhandled rejection in bluebird/native promises (IE 10+)
  window.addEventListener('unhandledrejection', function (e) {
    // NOTE: e.preventDefault() must be manually called to prevent the default
    // action which is currently to log the stack trace to console.warn
    e.preventDefault()
    // NOTE: parameters are properties of the event detail property
    var reason = e.detail ? e.detail.reason : e.reason
    var promise = e.detail ? e.detail.promise : e.promise
    // See Promise.onPossiblyUnhandledRejection for parameter documentation
    if (window.onerror) window.onerror.apply(this, ['', '', '', '', reason])
    console.log('UNHANDLED', reason, promise)
  })
}

UB.connect({
  host: window.location.origin,
  allowSessionPersistent: true,
  // path: window.location.pathname,
  onCredentialRequired: function (conn, isRepeat) {
    return isRepeat
      ? Promise.reject(new UB.UBAbortError('invalid password for user admin'))
      : Promise.resolve({authSchema: 'UB', login: 'admin', password: 'admin'})
  },
  onAuthorizationFail: function (reason) {
    window.alert(reason)
  }
}).then(function (conn) {
  window.$conn = conn
  var entity
  conn.get('stat').then(function (statResp) {
    document.getElementById('ubstat').innerText = JSON.stringify(statResp.data, null, '\t')
  }).catch(function (reason) {
    document.getElementById('ubstat').innerText = reason
  })

  if (conn.domain.has('ubm_enum')) {
    entity = conn.domain.get('ubm_enum')
    conn.Repository('ubm_enum')
      .attrs(
        entity.filterAttribute({defaultView: true}).map(function (attr) {
          return attr.code
        })
      )
      .selectAsArray()
      .then(function (data) {
        var tmpl = _.template(document.getElementById('repo-template').innerHTML)
        data.resultData.entity_caption = entity.caption
        document.getElementById('ubnav').innerHTML = tmpl(data.resultData)
      })
  }

  var b = document.getElementById('getODSFile')
  b.addEventListener('click', function () {
    var entity = conn.domain.get('ubm_enum')
    var query = conn.Repository('ubm_enum')
      .attrs(
        // entity.filterAttribute({defaultView: true}).map(function(attr){
        //     return attr.code;
        // })
        Object.keys(entity.attributes)
      ).ubql()
    conn.xhr({method: 'POST', url: 'ubql', data: [query], responseType: 'blob', headers: {'Content-Type': 'application/vnd.oasis.opendocument.spreadsheet'}})
      .then(function (res) {
        saveBlob(res.data, 'result.ods')
      })
  })
})

var saveBlob = (function () {
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.style = 'display: none'
  return function (blob, fileName) {
    var url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
  }
}())
