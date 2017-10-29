/*
 UnityBase startup script
 this script initializes working thread JavaScript context and is called by server fo each thread.
 In case UB runs in batch mode, script is called once - for main thread only
 */

/**
 * The UB namespace (global object) encapsulates some classes, singletons, and utility methods provided by UnityBase server.
 * @namespace UB
 */
UB = {};
/**
 * If we are in UnityBase server scripting (both -f or server thread) this property is true, if in browser - undefined or false.
 * Use it for check execution context in scripts, shared between client & server.
 * To check we are in server thread use process.isServer. 
 * @readonly
 */
UB.isServer = true; //Object.defineProperty(UB, 'isServer', {enumerable: true, value: true} );
(function (nativeProcess) {
    this.global = this;

    process = nativeProcess;

    // process & module function is documented inside _UBCommonGlobals.js
    function startup() {
        let require = global.require
	/**
         * Put something to log with log levels depending on method
         * @global
         * @type {Console}
         */
        console = require('console');

        let module = require('module')
        let path = require('path')

        
        process.emitWarning = console.warn;


        var EventEmitter = require('events').EventEmitter;
        // add EventEmitter to process object
        EventEmitter.call(process);
        var util = require('util');
        util._extend(process, EventEmitter.prototype);

       /**
        * Server-side Abort exception. To be used in server-side logic in case of HANDLED
        * exception. This errors logged using "Error" log level to prevent unnecessary
        * EXC log entries.
        *
        *       // UB client will show message inside <<<>>> to user (and translate it using UB.i18n)
        *       throw new UB.UBAbort('<<<textToDisplayForClient>>>');
        *       //for API methods we do not need <<<>>>
        *       throw new UB.UBAbort('wrongParameters');
        *
        * @param {String} [message] Message
        * @extends {Error}
        */
        //UB.UBAbort = Error
	
	//For SM<=45 we use a "exception class" inherit pattern below, but it stop working in SM52, so fallback to Error
	UB.UBAbort = function UBAbort(message) {
            this.name = 'UBAbort';
            this.code = 'UBAbort';
            this.message = message || 'UBAbortError';
            if (Error.captureStackTrace) {
    		// Chrome and NodeJS
    		Error.captureStackTrace(this, stackStartFunction);
  	    } else {
     		// FF, IE 10+ and Safari 6+. Fallback for others
     		let tmp_stack = (new Error).stack.split("\n").slice(1),
         	re = /^(.*?)@(.*?):(.*?)$/.exec(tmp_stack[1]); //[undef, undef, this.fileName, this.lineNumber] = re
     		this.fileName = re[2];
     		this.lineNumber = re[3];
     		this.stack = tmp_stack.join("\n");
 	    }
            // originat FF version:
	    // this.stack = (new Error()).stack;
        };
        UB.UBAbort.prototype = Object.create(Error.prototype) // new Error();
        //UB.UBAbort.prototype = new Error();
        UB.UBAbort.prototype.constructor = UB.UBAbort;
        
        if (process.isServer || process.isWebSocketServer){
            if (process.isServer) {

                // add EventEmitter to Session object
                EventEmitter.call(Session);
                util._extend(Session, EventEmitter.prototype);

                /**
                 * Called by UB.exe in server thread during Domain initialization just after all scopes for entity is created but before entities modules (entityName.js) is evaluated
                 * @private
                 */
                UB.initEventEmitter = function(){
                    var
                        ettCnt = App.domain.count, i, n, obj;
                    var __preventDefault = false;

                    //add eventEmitter to application object
                    obj = App;
                    EventEmitter.call(obj);
                    util._extend(obj, EventEmitter.prototype);
                    App.emitWithPrevent = function(type, req, resp){
                        __preventDefault = false;
                        this.emit(type, req, resp);
                        return __preventDefault;
                    };
                    /**
                     * Accessible inside app-level `:before` event handler. Call to prevent default method handler.
                     * In this case developer are responsible to fill response object, otherwise HTTP 400 is returned.
                     * @memberOf App
                     */
                    App.preventDefault = function(){
                        __preventDefault = true;
                    };

                    App.launchEndpoint = function(endpointName, req, resp){
                        __preventDefault = false;
                        this.emit(endpointName + ':before', req, resp);
                        if (!__preventDefault) {
                            appBinding.endpoints[endpointName](req, resp)
                            this.emit(endpointName + ':after', req, resp);
                        }
                    }

                    //add eventEmitter to all entities
                    for(i=0; i<ettCnt; i++){
                        //console.log(App.domain.items[i].name);
                        n = App.domain.items[i].name;
                        if (obj = global[n]){
                            // add EventEmitter to entity scope object
                            EventEmitter.call(obj);
                            util._extend(obj, EventEmitter.prototype);
                        }
                    }
                };

                var appBinding = process.binding('ub_app');
                /**
                 * Register a server endpoint. By default access to endpoint require authentication
                 * @example
                 *
                 * // Write a custom request body to file FIXTURES/req and echo file back to client
                 * // @param {THTTPRequest} req
                 * // @param {THTTPResponse} resp
                 * //
                 * function echoToFile(req, resp) {
                 *    var fs = require('fs');
                 *    fs.writeFileSync(FIXTURES + 'req', req.read('bin'));
                 *    resp.statusCode = 200;
                 *    resp.writeEnd(fs.readFileSync(FIXTURES + 'req', {encoding: 'bin'}));
                 * }
                 * App.registerEndpoint('echoToFile', echoToFile);
                 *
                 * @param {String} endpointName
                 * @param {Function} handler
                 * @param {boolean} [requireAuthentication=true]
                 * @memberOf App
                 */
                App.registerEndpoint = function(endpointName, handler, requireAuthentication) {
                    if (!appBinding.endpoints[endpointName]) {
                        appBinding.endpoints[endpointName] = handler;
                        return appBinding.registerEndpoint(endpointName, requireAuthentication === undefined ? true : requireAuthentication);
                    }
                };

                /**
                 * @param {String} methodName
                 * @method addAppLevelMethod
                 * @deprecated Use {@link App.registerEndpoint} instead
                 * @memberOf App
                 */
                App.addAppLevelMethod = function(methodName) {
                    if (!appBinding.endpoints[methodName]) {
                        appBinding.endpoints[methodName] = global[methodName];
                        return appBinding.registerEndpoint(methodName, true);
                    }
                };
                /**
                 * @param {String} methodName
                 * @method serviceMethodByPassAuthentication
                 * @deprecated Use {@link App.registerEndpoint} instead
                 * @memberOf App
                 */
                App.serviceMethodByPassAuthentication  =  function(methodName){
                    return appBinding.setEndpointByPassAuthentication(methodName);
                };

                var sessionBinding = process.binding('ub_session');
                /**
                 * Create new session for userID
                 * @deprecated use runAsUser instead this
                 * @method
                 * @param {Number} userID ID of  user
                 * @param {String} [secret] secret word. If defined then session secretWord is `JSON.parse(returns).result+secret`
                 * @returns {String} JSON string like answer on auth request
                 */
                Session.setUser = sessionBinding.switchUser;
                /**
                 * Call function as admin.
                 * Built-in "always alive"(newer expired) `admin` session is always created when the application starts,
                 * so this is very cheap method - it will not trigger Session.login event every time context is switched (Session.setUser and Session.runAsUser does)
                 * Can be used in scheduled tasks, not-authorized methods, etc. to obtain a `admin` Session context
                 * @param {Function} call Function to be called in admin context
                 * @returns {*}
                 */
                Session.runAsAdmin = function(call){
                    var result;
                    sessionBinding.switchToAdmin();
                    try {
                        result = call();
                    } finally {
                        sessionBinding.switchToOriginal();
                    }
                    return result;
                };
                /**
                 * Call function as custom user.
                 * New session will be created. Will fire `login` event.
                 * @param userID ID of  user
                 * @param call Function to be called in user's session.
                 * @returns {*}
                 */
                Session.runAsUser = function(userID, call){
                    var result;
                    sessionBinding.switchUser(userID);
                    try {
                        result = call();
                    } finally {
                        sessionBinding.switchToOriginal();
                    }
                    return result;
                };
            }
        }
    }

    /**
     * Creates namespaces to be used for scoping variables and classes so that they are not global.
     *
     *     UB.ns('DOC.Report');
     *     DOC.Report.myReport = function() { ... };
     *
     * @param {String} namespacePath
     * @return {Object} The namespace object.
     */
    UB.ns = function (namespacePath) {
        var root = global, parts, part, j, subLn;

        parts = namespacePath.split('.');

        for (j = 0, subLn = parts.length; j < subLn; j++) {
            part = parts[j];

            if (!root[part]) {
                root[part] = {};
            }
            root = root[part];
        }
        return root;
    };

    var FORMAT_RE = /\{(\d+)}/g;
    /**
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.
     * @example
     *
     *     var s = UB.format('{1}/lang-{0}.js', 'en', 'locale');
     *     // s now contains the string: ''locale/lang-en.js''
     *
     * @param {String} stringToFormat The string to be formatted.
     * @param {...*} values The values to replace tokens `{0}`, `{1}`, etc in order.
     * @return {String} The formatted string.
     */
    UB.format = function(stringToFormat, ...values) {
        return stringToFormat.replace(FORMAT_RE, function(m, i) {
            return values[i];
        });
    };



    function evalScript(name) {
        var Module = require('module');
        var path = require('path');
        var cwd = process.cwd();

        var module = new Module(name);
        module.filename = path.join(cwd, name);
        module.paths = Module._nodeModulePaths(cwd);
        var script = process._eval;
        if (!Module._contextLoad) {
            var body = script;
            script = 'global.__filename = ' + JSON.stringify(name) + ';\n' + 'global.exports = exports;\n' + 'global.module = module;\n' + 'global.__dirname = __dirname;\n' + 'global.require = require;\n' + 'return require("vm").runInThisContext(' + JSON.stringify(body) + ', ' + JSON.stringify(name) + ', true);\n';
        }
        var result = module._compile(script, name + '-wrapper');
        if (process._print_eval) console.log(result);
    }

    startup();
    /*    if (!process.isServer){
     toLog('!!!!not server - run startup')
     var Module = NativeModule.require('module');
     Module._load(process.argv[1], null, true);
     }*/


})(_process);