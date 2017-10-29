/**
 * Created by pavel.mash on 10.10.2014.
 */
App.registerEndpoint('echoToFile', echoToFile, false)

App.registerEndpoint('echoFromFile', echoFromFile, false)

if (process.isServer) {}

// disable ORG login handler for test purpose
if (global.ORG && ORG.checkOrgUnitRequired) {
  ORG.checkOrgUnitRequired = false
}

const path = require('path')
const GS_PATH = App.domain.config.models.byName('TST').path
const FIXTURES = path.join(GS_PATH, '_autotest', 'fixtures')
/**
 * write custom request body to file FIXTURES/req and echo file back to client
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function echoToFile (req, resp) {
  var fs = require('fs')
  fs.writeFileSync(path.join(FIXTURES, 'req'), req.read('bin'))
  resp.statusCode = 200
  resp.writeEnd(fs.readFileSync(path.join(FIXTURES, 'req'), {encoding: 'bin'}))
}

/**
 * Return content of respD.txt (TExtWriter buffer bug test)
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function echoFromFile (req, resp) {
  var fs = require('fs')
  var str = fs.readFileSync(path.join(FIXTURES, 'respD.txt'))
  resp.statusCode = 200
  resp.writeEnd(str)
}

// for event emitter test
tst_clob.on('insert:before', function () {
  App.globalCachePut('eventEmitterLog', App.globalCacheGet('eventEmitterLog') + 'insert:before;')
  console.log('insert:before fired on the tst_clob')
})
tst_clob.on('insert:after', function () {
  App.globalCachePut('eventEmitterLog', App.globalCacheGet('eventEmitterLog') + 'insert:after;')
})
tst_service.on('multiply:before', function (ctxt) {
  App.globalCachePut('eventEmitterLog', App.globalCacheGet('eventEmitterLog') + 'multiply:before;')
})
tst_service.on('multiply:after', function (ctxt) {
  App.globalCachePut('eventEmitterLog', App.globalCacheGet('eventEmitterLog') + 'multiply:after;')
})

/**
 * Perform logging of getDocumnet requests
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function getDocumentLog (req, resp) {
  var querystring = require('querystring'),
    params = querystring.parse(req.parameters)
  console.log('User with ID', Session.userID, 'obtain document using params', params)
}
App.on('getDocument:before', function (req, resp) { console.log('User with ID', Session.userID, 'try to obtain document') })
App.on('getDocument:after', getDocumentLog)

App.on('timeStamp:before',
    /**
     * @param {THTTPRequest} req
     * @param {THTTPResponse} resp
     */
    function (req, resp) {
      console.log('timeStamp!')
      App.preventDefault()
      resp.statusCode = 200
    }
)
App.on('timeStamp:after', function (req, resp) { console.log('timeStamp after!') })

// require('http').setGlobalProxyConfiguration('proxy3.softline.main:3249', 'localhost');
var oID = require('@unitybase/openid-connect'),
  oIdEndPoint = oID.registerEndpoint('openIDConnect')

oIdEndPoint.registerProvider('IdentityServer', {
  authUrl: 'https://biztech-prototype.dev.softengi.com:4450/connect/authorize',
  tokenUrl: 'https://biztech-prototype.dev.softengi.com:4450/connect/token',
  userInfoUrl: 'https://biztech-prototype.dev.softengi.com:4450/connect/userinfo',
  userInfoHTTPMethod: 'POST',
  scope: 'openid+profile+roles+environments+apps',
  nonce: '123',
  response_type: 'code',
  client_id: 'ub',
  client_secret: 'ub_secret',
  getOnFinishAction: function (response) {
    return '(function (response) { opener.postMessage(+ JSON.stringify(response), "*")})'
  },
  getUserID: function (userInfo) {
    var inst = UB.Repository('uba_user').attrs(['ID'])
            .where('[name]', '=', userInfo.id).select()
    return inst.eof ? null : inst.get('ID')
  }
})

oIdEndPoint.registerProvider('Google', {
  authUrl: 'https://accounts.google.com/o/oauth2/auth',
  tokenUrl: 'https://accounts.google.com/o/oauth2/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v1/userinfo',
  userInfoHTTPMethod: 'GET',
  scope: 'openid',
  nonce: '123',
  response_type: 'code',
  client_id: '350085411136-lpj0qvr87ce0r0ae0a3imcm25joj2t2o.apps.googleusercontent.com',
  client_secret: 'dF4qmUxhHoBAj-E1R8YZUCqA',
  getOnFinishAction: function (response) {
    return 'opener.UB.view.LoginWindow.onFinishOpenIDAuth'
  },
  getUserID: function (userInfo) {
    let inst = UB.Repository('uba_user').attrs(['ID'])
      .where('[name]', '=', userInfo.id).select()
    return inst.eof ? null : inst.get('ID')
  }
})

App.registerEndpoint('getIDTest', getIDTest, false)
/**
 * Test daw
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
var __testIDStore = new TubDataStore('tst_IDMapping')
function getIDTest (req, resp) {
  resp.statusCode = 200
  resp.writeEnd(__testIDStore.generateID())
}

App.registerEndpoint('testTimeout', testTimeout, false)
/**
 * Test http timeout
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function testTimeout (req, resp) {
  sleep(40000)
  resp.statusCode = 200
  resp.writeEnd('OK')
}

function testDocHandler (req, resp) {
  var docReq = new TubDocumentRequest() // starting from UB 1.11 handler is a singleton inside request
  docReq.entity = 'tst_document'
  docReq.attribute = 'fileStoreSimple'
  docReq.id = 3000000003738
  let docHandler = docReq.createHandlerObject(true)
  docHandler.loadContent(TubLoadContentBody.Yes)
//    var content = docReq.getBodyAsBase64String();
//    console.log(content.length);
  docHandler.freeNative()
  docReq.freeNative()
  resp.statusCode = 200
  resp.writeEnd('OK')
}
App.registerEndpoint('testDocHandler', testDocHandler, false)

const HttpProxy = require('@unitybase/http-proxy')
let proxy = new HttpProxy({
  endpoint: 'cms',
  targetURL: 'http://localhost:889/',
  nonAuthorizedURLs: [/./]
})
