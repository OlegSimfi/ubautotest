/**
 * OpenIDConnect client for UnityBase
 *
      const openID = require('@unitybase/openid-connect')
      let oIdEndPoint = openID.registerEndpoint('openIDConnect')
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
          return 'opener.UB.view.LoginWindow.onFinishOpenIDAuth(' + JSON.stringify(response) + '); close();'
        },
        getUserID: function(userInfo) {
          let inst = UB.Repository('uba_user').attrs(['ID'])
             .where('[name]', '=', userInfo.id).select()
          return inst.eof ? null : inst.get('ID')
        }
      })
 *
 * @module @unitybase/openid-connect
 * @tutorial security_openidconnect
 */

const btoa = require('btoa')

module.exports.registerEndpoint = registerOpenIDEndpoint

let endpoints = {}
const queryString = require('querystring')

/**
 * OpenID endpoint. Able to register providers
 * @typedef {Object} openIDEndpoint
 * @propety {function} registerProvider
 */

/**
 * Register openID connect endpoint
 * @method
 * @param {String} endpointName
 * @returns {openIDEndpoint} endpoint
 */
function registerOpenIDEndpoint (endpointName) {
  let providers = {}
  if (endpoints[endpointName]) {
    throw new Error('Endpoints already registered')
  }

  App.registerEndpoint(endpointName, openIDConnect, false)

  endpoints[endpointName] = {
    /**
     * Add provider to endpoint
     * @param {String} name
     * @param {Object} providerConfig
     * @param {String} providerConfig.authUrl Provider's authorisation url
     * @param {String} providerConfig.tokenUrl Provider's token url
     * @param {String} providerConfig.userInfoUrl provider's userinfo url
     * @param {String} [providerConfig.userInfoHTTPMethod='GET'] Http method for userinfo request. Default GET
     * @param {String} providerConfig.scope requested scopes delimited by '+' symbol
     * @param {String} [providerConfig.nonce] nonce  TODO - generate random and cache in GlobalCache with expire
     * @param {String} providerConfig.response_type response type. Must contain code. This module use code responce type.
     * @param {String} providerConfig.client_id client_id. Get it from provider
     * @param {String} providerConfig.client_secret client_secret. Get it from provider
     * @param {Function} providerConfig.getOnFinishAction Function, that returns client-side code to be run after success/fail response from OpenID provider.
     *  For example: `opener.$App.onFinishOpenIDAuth`. In case of success will be called with `{success: true, data: userData, secretWord: secretWord}`
     *  In case of fail `{success: false}`
     * @param {Function} providerConfig.getUserID Called with one 1 parameter - provider's response for userInfo request. Must return user ID from uba_user entity if user is authorised or null else
     * @memberOf openIDEndpoint
     */
    registerProvider: function (name, providerConfig) {
      // todo: check all parameters and add documentation for class
      if (providers[name]) {
        throw new Error('Provider already registered')
      }
      if (!providerConfig.getOnFinishAction) {
        throw new Error('getOnFinishAction must me be a function')
      }
      providers[name] = providerConfig
    },
    getProviderList: function () {
      return Object.keys(providers)
    },
    getProvider: function (providerName) {
      return providers[providerName]
    }
  }
  return endpoints[endpointName]
}

/**
 * OpenID endpoint implementation
 * If called as host:port[/app]/endpoint - return a list of registered openIDConnect providers,
 * If called as host:port[/app]/endpoint/provider without parameters - redirect to provider `authUrl`
 * If called as host:port[/app]/endpoint/provider with parameters `code` and `state` - call doProviderAuthHandshake method
 *
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 * @protected
 */
function openIDConnect (req, resp) {
  let providerName = req.uri
  let url = req.url.split('?')[0]
  let endpointUrl = providerName ? url.substr(0, url.length - providerName.length - 1) : url
  let endpointName = endpointUrl.substr(endpointUrl.lastIndexOf('/') - endpointUrl.length + 1)
  let endpoint = endpoints[endpointName]

  if (!endpoint) {
    returnInvalidRequest(resp, 'Endpoint is not registered')
    return
  }
  if (!providerName) {
    returnProviderList(resp, endpoint)
    return
  }

  let provider = endpoint.getProvider(providerName)
  if (!provider) {
    returnInvalidRequest(resp, 'Provider not registered')
    return
  }

  // TODO - check Refer (if any) is starts from  App.serverURL
  // redirectUrl = getValueFromHeaders(req, 'Referer');
  // if (redirectUrl) {
  //    redirectUrl = redirectUrl.substr(0, redirectUrl.lastIndexOf('/')) + '/' + endpointName + '/' + providerName;
  // }
  let redirectUrl = App.serverURL + (App.serverURL[App.serverURL.length - 1] === '/' ? '' : '/') + endpointName + '/' + providerName
  let paramStr = (req.method === 'GET') ? req.parameters : req.read()
  let params = paramStr ? queryString.parse(paramStr) : null

  if (!paramStr || params.mode === 'auth') {
    redirectToProviderAuth(req, resp, provider, redirectUrl, params)
    return
  }

  params = queryString.parse(paramStr)
  if (params.code && params.state) {
    // if (!redirectUrl)
    //    redirectUrl = atob(params.state);
    let origin = ''
    let headers = (req.headers || '').split('\r\n')
    if (headers) {
      headers.forEach(function (v) {
        if (v && v.substring(0, 7) === 'Origin:') {
          origin = v.substring(7)
          return false
        }
      })
    }
    doProviderAuthHandshake(resp, params.code, params.state, provider, redirectUrl, origin)
  } else {
    notifyProviderError(resp, provider)
  }
}

function returnProviderList (resp, endpoint) {
  resp.statusCode = 200
  resp.writeEnd(JSON.stringify(endpoint.getProviderList()))
}
/**
 *
 * @param {Object} customHeaders
 * @returns {string}
 * @private
 */
function getAuthCustomHeadersString (customHeaders) {
  if (customHeaders === null) {
    return ''
  }
  if (typeof customHeaders !== 'object') {
    throw new Error('custom headers must be an object')
  }

  let headerStringArray = []

  Object.keys(customHeaders).forEach(function (key) {
    headerStringArray.push(key + '=' + customHeaders[key])
  })

  return '&' + headerStringArray.join('&')
}

function redirectToProviderAuth (req, resp, providerConfig, redirectUrl, requestParams) {
  resp.statusCode = 302
  let customHeaders = ''

  if (typeof providerConfig.getAuthCustomHeaders === 'function') {
    customHeaders = getAuthCustomHeadersString(providerConfig.getAuthCustomHeaders(requestParams))
  }
  resp.statusCode = 302
  resp.writeEnd('')
  resp.writeHead('Location: ' + providerConfig.authUrl +
    '?state=' + btoa('fakestate') +  //TODO - get it from global cache
    (providerConfig.scope ? '&scope=' + providerConfig.scope : '') +
    (providerConfig.nonce ? '&nonce=' + providerConfig.nonce : '') +
    '&redirect_uri=' + redirectUrl +
    '&response_type=' + providerConfig.response_type +
    '&client_id=' + providerConfig.client_id +
    '&response_mode=form_post' +
    '&referer=' + redirectUrl +
    // '&referer=BACK_REDIRECT_URL' +
    customHeaders
  )
}

/**
 * @param {THTTPResponse} resp
 * @param provider
 * @private
 */
function notifyProviderError (resp, provider) {
  resp.statusCode = 200
  resp.write('<!DOCTYPE html><html>')
  resp.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge" /></head>')
  resp.write('<body><script>')
  resp.write(provider.getOnFinishAction({success: false}))
  resp.write('</script></body>')
  resp.writeEnd('</html>')
  resp.writeHead('Content-Type: text/html')
}

function doProviderAuthHandshake (resp, code, state, provider, redirectUrl, orign) {
  let http = require('http')
  let request
  let response
  let responseData
  let userID

  request = http.request(provider.tokenUrl)
  request.options.method = 'POST'
  request.setHeader('Content-Type', 'application/x-www-form-urlencoded')
  request.write('grant_type=authorization_code')
  request.write('&code=' + code)
  request.write('&client_id=' + provider.client_id)
  request.write('&client_secret=' + provider.client_secret)
  request.write('&redirect_uri=' + redirectUrl)
  response = request.end()

  if (response.statusCode === 200) {
    responseData = JSON.parse(response.read()) // response._http.responseText
    if (provider.userInfoHTTPMethod === 'POST') {
      request = http.request(provider.userInfoUrl)
      request.options.method = 'POST'
      request.write('access_token=' + responseData.access_token)
      request.write('&client_id=' + provider.client_id)
      request.write('&client_secret=' + provider.client_secret)
      request.setHeader('Content-Type', 'application/x-www-form-urlencoded')
    } else {
      request = http.request(provider.userInfoUrl + '?access_token=' + responseData.access_token)
    }
    response = request.end()
    if (response.statusCode === 200) {
      responseData = JSON.parse(response._http.responseText)
      userID = provider.getUserID(responseData)

      if (!userID) {
        notifyProviderError(resp, provider)
      } else {
        let loginResp = Session.switchUser(userID, code)
        let objConnectParam = {success: true, data: JSON.parse(loginResp), secretWord: code}
        resp.statusCode = 200
        resp.write('<!DOCTYPE html><html>')
        resp.write('<head><meta http-equiv="X-UA-Compatible" content="IE=edge" /></head>')
        resp.write('<body>')
        resp.write('<div style="display: none;"  id="connectParam" >')
        resp.write(JSON.stringify(objConnectParam))
        resp.write('</div><div id="mainElm" onClick="javascript: window.close();" style="width:100%; height:100vh" ></div><script>')
        resp.write(provider.getOnFinishAction(objConnectParam))
        resp.write('</script></body>')
        resp.writeEnd('</html>')
        resp.writeHead('Content-Type: text/html')
        resp.writeHead('Access-Control-Allow-Credentials:true')
        resp.writeHead('Access-Control-Allow-Methods:GET, OPTIONS')
        resp.writeHead('Access-Control-Allow-Origin:' + orign ? orign.trim() : 'null')
      }
    }
  } else {
    console.error('OpenIDConnect provider return invalid response', response.statusCode, '. Headers:', response.headers())
    notifyProviderError(resp, provider)
  }
}

function returnInvalidRequest (resp, message) {
  resp.statusCode = 400
  resp.writeEnd(message)
}

function getValueFromHeaders (req, headerName) {
  let result = null
  req.headers.split('\r\n').forEach(function (value) {
    let pair = value.split(': ')
    if (pair[0].toLowerCase() === headerName.toLowerCase()) {
      result = pair[1]
    }
  })
  return result
}
