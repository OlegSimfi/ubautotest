/**
 * HTTP client.
 * @example
 *
 var http = require('http');
 var request = http.request({
    //alternative to host/port/path is
    //URL: 'http://localhost:888/getAppInfo',
    host: 'localhost', port: '80', path: '/getAppInfo',
    method: 'POST',
    sendTimeout: 30000, receiveTimeout: 30000,
    keepAlive: true,
    compressionEnable: true
 });
 request.write('Add string to response');
 var fileContent = fs.readFileSync('d:\binaryFile.txt'); // return ArrayBuffer, since encoding not passed
 request.write(fileContent, 'base64'); // write file content as base64 encoded string
 var response = request.end();

 var http = require('http');
 var assert = require('assert');
 var DOMParser = require('xmldom').DOMParser;
 // set global proxy settings if client is behind a proxy
 // http.setGlobalProxyConfiguration('proxy.main:3249', 'localhost');
 var resp = http.get('https://synopse.info/fossil/wiki/Synopse+OpenSource');
 // check we are actually behind a proxy
 // assert.ok(resp.headers('via').startsWith('1.1 proxy.main'), 'proxy used');
 var index = resp.read();
 console.log(index);
 // var doc = new DOMParser().parseFromString(index);
 // assert.ok(doc.documentElement.textContent.startsWith('mORMot'), 'got mORMot from mORMot');
 *
 * @module http
 */
const CRLF = '\r\n'
const url = require('url')
const EventEmitter = require('events').EventEmitter
const util = require('util')
const THTTPClient = process.binding('synode_http').THTTPClient

/* Global http proxy configuration */
var
  proxyConfig = {
    server: '',
    bypass: ''
  },
  connectionDefaults = {
    useHTTPS: false,
    useCompression: true,
    keepAlive: false,
    connectTimeout: 60000,
    sendTimeout: 30000,
    receiveTimeout: 30000
  }

/**
 *  Configure global ( on the `http` module level) proxy server in case you can't configure it using
 *  either **`proxycfg.exe -u`** on Windows XP or **`netsh winhttp import proxy source=ie`** for other win version
 *  or by pass `options.proxyName` parameter.
 *
 *  Settings applied only for  newly created {ClientRequest} instances.
 *
 *  See for details <a href="http://msdn.microsoft.com/en-us/library/windows/desktop/aa383996(v=vs.85).aspx">this MS article</a>
 *
 * @param {String} proxy     name of the proxy server to use in format `[[http|https]://]host[:port]` For example 'http://proxy.my.domain:3249'
 * @param {String|Array} [bypass]  semicolon delimited list jr array of host names or IP addresses, or host masks or both, that should not be routed through the proxy
 */
exports.setGlobalProxyConfiguration = function setGlobalProxyConfiguration (proxy, bypass) {
  proxyConfig.proxy = proxy || ''
  if (Array.isArray(bypass)) {
    bypass = bypass.join(';')
  }
  proxyConfig.bypass = bypass || ''
}

/**
 *  Override global ( on the `http` module level) connectiuon defaults.
 *
 *  Settings applied only for  newly created {ClientRequest} instances.
 *
 *          var http = require('http');
 *          http.setGlobalConnectionDefaults({receiveTimeout: 60000}); // set receive timeout to 60 sec.
 *
 * @param {Object} defaults
 * @param {Boolean} [defaults.useHTTPS=false]
 * @param {Boolean} [defaults.useCompression=true] Send 'Accept-encoding: gzip' header to server & unzip zipper responses
 * @param {Boolean} [defaults.keepAlive=false] Use keep Alive HTTP protocol feature if server support it.
 * @param {Number} [defaults.sendTimeout=30000] Send timeout in ms.
 * @param {Number} [defaults.receiveTimeout=30000] Receive timeout in ms.
 * @param {Number} [defaults.connectTimeout=60000] Connect timeout in ms.
 */
exports.setGlobalConnectionDefaults = function setGlobalConnectionDefaults (defaults) {
  defaults = defaults || {}
  Object.keys(connectionDefaults).forEach(function (key) {
    if (defaults.hasOwnProperty(key)) {
      connectionDefaults[key] = defaults[key]
    }
  })
}

/**
 * Create new HTTP server connection. In case server behind the proxy - see {@link http.setGlobalProxyConfiguration} function.
 * @param {Object|String} options Either URL string in format `protocol://host:port/path` or config
 * @param {String} [options.URL] Service URL in format `protocol://host:port/path`. Will override `useHTTPS`, `server`, `host`, `port` and `path` if passed
 * @param {String} [options.server] DEPRECATED. Server to connect in format 'host:port' or 'host' in case port == 80.
 * @param {String} [options.host] Host to connect. If `server` not specified this value used
 * @param {String} [options.port] Port. Default is 80 for HTTP or 443 for HTTPS
 * @param {String} [options.path='/'] Request path. Defaults to '/'. Should include query string if any. E.G. '/index.html?page=12'
 * @param {String} [options.method='GET'] HTTP method to use for request
 * @param {Object<string, string>} [options.headers] An object containing request headers
 * @param {Boolean} [options.useHTTPS=false]
 * @param {Boolean} [options.useCompression=true] Send 'Accept-encoding: gzip' header to server & unzip zipper responses
 * @param {Boolean} [options.keepAlive=false] Use keep Alive HTTP protocol feature if server support it.
 * @param {Number} [options.sendTimeout=30000] Send timeout in ms.
 * @param {Number} [options.receiveTimeout=30000] Receive timeout in ms.
 * @param {Number} [options.connectTimeout=30000] Connect timeout in ms.
 * @return {ClientRequest}
 */
exports.request = function request (options) {
  var
        parsedURL
  if (typeof options === 'string') {
    options = url.parse(options)
    options.host = options.hostname
  } else if (options.URL) {
    parsedURL = url.parse(options.URL)
    Object.assign(options, parsedURL)
    options.host = options.hostname
  } else if (options.server) {
    var host_port = options.server.split(':')
    options.host = host_port[0]

    options.port = host_port[1]
  }
  if (!options.host) {
    throw new Error('server host is mandatory')
  }
  if (!options.hostname) { options.hostname = options.host }

  options.path = options.path || '/'
  if (options.path.charAt(0) !== '/') options.path = '/' + options.path // need valid url according to the HTTP/1.1 RFC
  options.headers = options.headers || {}
  if (options.protocol) {
    options.useHTTPS = (options.protocol === 'https:')
  } else {
    options.useHTTPS = options.useHTTPS == null ? connectionDefaults.useHTTPS : options.useHTTPS
  }
  options.port = options.port || (options.useHTTPS ? '443' : '80')
  options.useCompression = options.useCompression == null ? true : options.useCompression
  options.keepAlive = (options.keepAlive === true) ? 1 : connectionDefaults.keepAlive
  options.sendTimeout = options.sendTimeout || connectionDefaults.sendTimeout
  options.receiveTimeout = options.receiveTimeout || connectionDefaults.receiveTimeout
  options.connectTimeout = options.connectTimeout || connectionDefaults.connectTimeout
  options.method = options.method || 'GET'
  return new ClientRequest(options)
}
var request = exports.request

function forEachSorted (obj, iterator, context) {
  var keys = Object.keys(obj).sort()
  keys.forEach(function (key) {
    iterator.call(context, obj[key], key)
  })
  return keys
}

/**
 * Add parameters to URL
 *
 *      http.buildURL('/myMethod', {a: 1, b: "1212"}; // '/myMethod?a=1&b=1212
 *
 * @param {String} url
 * @param {Object} params
 * @returns {String}
 */
exports.buildURL = function buildURL (url, params) {
  if (!params) {
    return url
  }
  var parts = []
  forEachSorted(params, function (value, key) {
    if (value == null) {
      return
    }
    if (!Array.isArray(value)) {
      value = [value]
    }

    value.forEach(function (v) {
      if (typeof v === 'object') {
        v = JSON.stringify(v)
      }
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(v))
    })
  })
  return url + ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&')
}

var buildUrl = exports.buildURL

/**
 * Since most requests are GET requests without bodies, we provides this convenience method.
 * The two difference between this method and http.request() is that
 *
 *   - it sets the method to GET and calls req.end() automatically
 *   - can optionally take URLParams Object {paramName: paramValue, ..} and add parameters to request path
 *
 * @param {Object} options Request options as described in {@link http.request}
 * @param {Object} [URLParams] optional parameters to add to options.path
 * @returns {IncomingMessage}
 */
exports.get = function get (options, URLParams) {
  var req = request(options)
  if (URLParams) {
    req.setPath(buildUrl(req.options.path, URLParams))
  }
  req.setMethod('GET')
  return req.end()
}

/**
 * This object is created internally and returned from {@link http.request}
 * It represents an in-progress request whose header has already been queued.
 * The header is still mutable using the {@link ClientRequest.setHeader setHeader(name, value)},
 *   {@link ClientRequest#getHeader getHeader(name)}, {@link ClientRequest#removeHeader removeHeader(name)} API.
 * The actual header will be sent along with the {@link ClientRequest#end end()}.
 *
 * `path` & `method` parameter is still mutable using {@link ClientRequest#setPath setPath(path)} & {@link ClientRequest#setMethod setMethod(HTTPMethod)}

 * @class ClientRequest
 * @implements {UBWriter}
 * @protected
 * @param {Object} options
 */
function ClientRequest (options) {
  this.options = Object.assign({}, options)
  const _http = this.connection = new THTTPClient()
  _http.initialize(options.host, options.port, options.useHTTPS, options.useCompression,
        proxyConfig.proxy, proxyConfig.bypass, options.connectTimeout, options.sendTimeout, options.receiveTimeout
    )
  _http.keepAlive = options.keepAlive ? 1 : 0

    // add EventEmitter to process object
  EventEmitter.call(this)
  util._extend(this, EventEmitter.prototype)

  Object.defineProperty(this, 'path', {
    get: function () { return this.options.path },
    set: function (val) { this.options.path = val }
  })
}

/**
 * Write a chunk of data to request. Actual sending performed by `end()` call.
 * @inheritDoc
 */
ClientRequest.prototype.write = function (data, encoding) {
  this.connection.write(data, encoding)
}

/**
 * Set all headers delimited by CRLF by once
 * @param {String} allHeaders
 */
ClientRequest.prototype.setHeadersAsString = function (allHeaders) {
  this.options._headersAsString = allHeaders
}

function makeRequestHeaders (request) {
  if (request.options._headersAsString) return request.options._headersAsString
  
  let arr = []
  let head = request.options.headers
  for (let prop in head) {
    arr.push(prop + ': ' + head[prop])
  }
  return arr.join(CRLF)
}
/**
 * End request by writing a last chunk of data (optional) and send request to server.
 * See {@link UBWriter#write} for parameters
 * @returns {IncomingMessage}
 */
ClientRequest.prototype.end = function (data, encoding) {
  var
    _http = this.connection,
    rUlr
  _http.writeEnd(data, encoding)
  _http.method = this.options.method
  _http.headers = makeRequestHeaders(this)
  try {
    _http.doRequest(this.options.path)
  } catch (e) {
    rUlr = (this.options.protocol || 'http:') + '//' + this.options.hostname + ':' + this.options.port + this.options.path
    throw new Error('Request to ' + rUlr + ' fail. Message: ' + e.message)
  }
  let msg = new IncomingMessage(_http)
  if (!this.emit('response', msg) ||
        !msg.emit('data', new Buffer(msg.read(msg.encoding === 'binary' ? 'bin' : msg.encoding === 'utf8' ? 'utf-8' : msg.encoding)).toString(msg.encoding)) ||
        !msg.emit('end')) {
    return msg
  }
}

/**
 * Set new path for request. Usually used during several request to the same server to avoid socket recreation.
 * @param {String} path New path. Should include query string if any. E.G. '/index.html?page=12'
 */
ClientRequest.prototype.setPath = function (path) {
  this.options.path = path
}

/**
 * Set new HTTP method for request. Usually used during several request to the same server to avoid socket recreation.
 * @param {String} method
 */
ClientRequest.prototype.setMethod = function (method) {
  this.options.method = method
}

/**
 * Sets a single header value for implicit headers.
 * If this header already exists in the to-be-sent headers, its value will be replaced.
 * Use an array of strings here if you need to send multiple headers with the same name
 *
 *      request.setHeader('Content-Type', 'text/html');
 *      request.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
 *
 * @param {String} name
 * @param {String|Array} value
 */
ClientRequest.prototype.setHeader = function (name, value) {
  this.options.headers[name] = Array.isArray(value) ? value.join(';') : value
}

/**
 * Reads out a header that's already been queued but not sent to the client.
 * @param {String} name
 * @returns {String}
 */
ClientRequest.prototype.getHeader = function (name) {
  if (arguments.length < 1) {
    throw new Error('`name` is required for getHeader().')
  }
  return this.options.headers[name]
}

/**
 * Removes a header that's queued for implicit sending
 * @param {String} name
 */
ClientRequest.prototype.removeHeader = function (name) {
  if (arguments.length < 1) {
    throw new Error('`name` is required for removeHeader().')
  }
  delete this.options.headers[name]
}

/**
 * Result of HTTP request
 * @class IncomingMessage
 * @implements {UBReader}
 * @param {THTTPClient} httpClient
 * @protected
 */
function IncomingMessage (httpClient) {
  this._http = httpClient
    /**
     * Default encoding for read call
     * @type {String}
     */
  this.encoding = 'utf-8'
    /** @private */
  this._parsedHeaders = null
    /**
     * HTTP status code. See also {STATUS_CODES}
     * @type {Number}
     * @readonly
     */
  this.statusCode = this._http.responseStatus

    // add EventEmitter to IncomingMessage object
  EventEmitter.call(this)
  util._extend(this, EventEmitter.prototype)

    /**
     * Response headers, transformed to JS object. Headers name is a keys in lower case
     */
  Object.defineProperty(this, 'headers', {
    get: () => this._parsedHeaders ? this._parsedHeaders : this.__doParseHeaders()
  })
}

/**
 * Change default encoding for read request
 * @param {String} encoding
 */
IncomingMessage.prototype.setEncoding = function (encoding) {
  this.encoding = encoding
}

/**
 * Read a response body. See {@link UBReader#read} for parameters
 * @param {String} [encoding] If omitted `this.encoding` in used
 */
IncomingMessage.prototype.read = function (encoding) {
  return this._http.read(encoding || this.encoding)
}

/**
 * Internal function for parse response headers
 * TODO - improve node compatibility - some headers MUST me merged. See https://nodejs.org/api/http.html#http_message_headers
 * @private
 */
IncomingMessage.prototype.__doParseHeaders = function () {
  var
        h, hObj, hPart

  if (!this._parsedHeaders) {
    h = this._http.responseHeaders.split(CRLF)
    hObj = {}
    h.forEach(function (header) {
      if (header) {
        hPart = header.split(': ', 2)
        if (hPart.length = 2) { hObj[hPart[0].toLowerCase()] = hPart[1] }
      }
    })
    this._parsedHeaders = hObj
  }

  return this._parsedHeaders
}

/**
 * HTTP status codes.
 * @type {Object.<number, string>}
 */
exports.STATUS_CODES = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',                 // RFC 2518, obsoleted by RFC 4918
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',               // RFC 4918
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Moved Temporarily',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a teapot',              // RFC 2324
  422: 'Unprocessable Entity',       // RFC 4918
  423: 'Locked',                     // RFC 4918
  424: 'Failed Dependency',          // RFC 4918
  425: 'Unordered Collection',       // RFC 4918
  426: 'Upgrade Required',           // RFC 2817
  428: 'Precondition Required',      // RFC 6585
  429: 'Too Many Requests',          // RFC 6585
  431: 'Request Header Fields Too Large', // RFC 6585
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',    // RFC 2295
  507: 'Insufficient Storage',       // RFC 4918
  509: 'Bandwidth Limit Exceeded',
  510: 'Not Extended',               // RFC 2774
  511: 'Network Authentication Required' // RFC 6585
}
