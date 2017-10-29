/*
  Purpose of this file is to describe objects and functions added to server-side JavaScript thread(s) by UnityBase server.
  All described here is native UB objects imported to SpiderMonkey (i.e. realisation is in Pascal or C).
  This file provide correct syntax check, code insight and documentation if we edit models in IDE like JetBrains, eclipse e.t.c.
  Also server-side documentation generated based on this file.

  Author: pavel.mash
  Date: 10.08.13
*/

/**
 * UnityBase application. Accessible via singleton instance App.
 *
 * This documentation describe `native` (implemented inside ub.exe) methods,
 * but developer can add his own (custom) application level methods using {@link App.registerEndpoint App.registerEndpoint}
 * and take a full control on HTTP request & response.
 *
 * Mixes EventEmitter, and server will emit:
 *
 *  - `endpointName + ':before'` event before endpoint handler  execution
 *  - `endpointName + ':after'` event after success (no exception is raised, no App.preventDefault() is called) endpoint handler execution
 *
 * This happens for both native and custom methods.
 *
 * @Example:
 *
     //Before getDocument requests
     //@param {THTTPRequest} req
     //@param {THTTPResponse} resp
     function doSomethingBeforeGetDocumentCall(req, resp){
        console.log('User with ID', Session.userID, 'try to get document');
     }
     App.on('getDocument:before', doSomethingBeforeGetDocumentCall);

     const querystring = require('querystring')
     //
     //After getDocument requests
     //@param {THTTPRequest} req
     //@param {THTTPResponse} resp
     function doSomethingAfterGetDocumentCall(req, resp){
       params = querystring.parse(req.parameters)
       console.log('User with ID', Session.userID, 'obtain document using params',  params)
     }
     App.on('getDocument:after', doSomethingAfterGetDocumentCall);

 * To prevent endpoint handler execution App.preventDefault() can be used inside `:before` handler.
 *
 * @global
 * @namespace
 * @type {Object}
 * @mixes EventEmitter
 */
const App = {
  /**
   * Fires for an {@link App App} just after all domain entities (all *.meta) are in server memory, and all server-side js are evaluated.
   *
   * On this stage you can subscribe on a cross-model handles.
   *
   * Example:
   *
       App.once('domainIsLoaded', function(){
         for (eName in App.domainInfo.entities) {
            // if entity have attribute mi_fedUnit
            if (App.domainInfo.entities[eName].attributes.mi_fedUnit) {
              let entityObj = global[eName]
              entityObj.on('insert:before', fedBeforeInsert) // add before insert handler
            }
         }
       })
   *
   * @event domainIsLoaded
   */

  /**
   * Application name
   * @type {String}
   * @readonly
   */
  name: 'appName',
  /**
   * Full path to application static folder if any, '' if static folder not set
   * @type {String}
   * @readonly
   */
  staticPath: 'fullPathToStaticFolder',

  /**
   * Full URl HTTP server is listen on (if HTTP server enabled, else - empty string)
   * @type {String}
   * @readonly
   */
  serverURL: 'http://myserver:myPort/myPath',
  /**
   * List of a local server IP addresses CRLF (or CR for non-windows) separated
   */
  localIPs: '127.0.0.1\r\n::1',
  /**
   *  Resolve aRequestedFile to real file path.
   *  Internally analyse request and if it start with `model/` - resolve it to model public folder
   *  else - to `inetPub` folder.
   *  Will return '' in case of error (filePath not under `inetPub` or `model/`) to prevent ../../ attack
   * @param {String} aRequestedFile
   * @returns {String}
   * @protected
   */
  resolveStatic: function (aRequestedFile) { return '' },
  /**
   * First check in global cache for a entry "UB_GLOBAL_CACHE_CHECKSUM + filePath"
   * and if not exists - calculate a checksum using algorithm defined in
   * CONTROLLER.serverConfig.HTTPServer.watchFileChanges.hashingStrategy
   * if server in dev mode always return current timestamp
   * values from cache will be cleared in directoryNotifiers
   * @param {String} pathToFile
   * @returns {string}
   */
  fileChecksum: function (pathToFile) { return '' },
  /**
   * A folder checksum (see fileChecksum for algorithm details)
   * @param pathToFolder
   * @returns {string}
   */
  folderChecksum: function (pathToFolder) { return '' },
  /**
   * Current application Domain
   * @deprecated UB >=4 use a App.domainInfo - a pure JS domain representation
   * @type {TubDomain}
   * @readonly
   */
  domain: new TubDomain(),
  /**
   * A domain model (metadata) definition for current application
   * @type {UBDomain}
   */
  domainInfo: new UBDomain(),

  /**
   * Default database connection
   * @type {TubDatabase}
   */
  defaultDatabase: null,
  /**
   * Get value from global cache. Global cache shared between all threads.
   *
   * Return '' (empty string) in case key not present in cache.
   *
   * @param {String} key Key to retrive
   * @return {String}
   */
  globalCacheGet: function (key) {},
  /**
   * Put value to global cache.
   * @param {String} key  Key to put into
   * @param {String} value Value To put into this key
   */
  globalCachePut: function (key, value) {},

  /**
   * Try retrieve  or create new session from request header
   *
   * Return true if success
   *
   * @return {Boolean}
   */
  authFromRequest: function () {},

  /**
   * Check Entity-Level-Security for specified entity/method
   *
   *      if App.els('uba_user', 'insert'){
   *          // do something
   *      }
   *
   * @param {String} entityCode
   * @param {String} methodCode
   * @return {boolean}
   */
  els: function (entityCode, methodCode) { return false },

  /**
   * Return JSON specified in serverConfig.uiSettings
   * @return {string}
   */
  getUISettings: function () { return '{}' },

  /**
   * Custom settings for application from ubConfig.app.customSettings
   * @type {String}
   */
  customSettings: '',
  /**
   * Is event emitter enabled for App singleton. Default is false
   * @deprecated Starting from 1.11 this property ignored (always TRUE)
   * @type {Boolean}
   */
  emitterEnabled: true,

  /**
   * Delete row from FTS index for exemplar with `instanceID` of entity `entityName` (mixin `fts` must be enabled for entity)
   * @param {String} entityName
   * @param {Number} instanceID
   */
  deleteFromFTSIndex: function (entityName, instanceID) {},
  /**
   * Update FTS index for for exemplar with `instanceID` of entity `entityName` (mixin `fts` must be enabled for entity).
   * In case row dose not exist in FTS perform insert action automatically.
   *
   * @param {String} entityName
   * @param {Number} instanceID
   */
  updateFTSIndex: function (entityName, instanceID) {},

  /**
   * Check database are used in current endpoint context and DB transaction is already active
   * @param {String} connectionName
   * @return {Boolean}
   */
  dbInTransaction: function (connectionName) {},
  /**
   * Commit active database transaction if any.
   * In case `connectionName` is not passed will commit all active transactions for all connections.
   * Return `true` if transaction is comitted, or `false` if database not in use or no active transaction.
   * @param {String} [connectionName]
   * @return {Boolean}
   */
  dbCommit: function (connectionName) {},
  /**
   * Rollback active database transaction if any.
   * In case `connectionName` is not passed will rollback all active transactions for all connections.
   * Return `true` if transaction is rollback'ed, or `false` if database not in use or no active transaction.
   * @param {String} [connectionName]
   * @return {Boolean}
   */
  dbRollback: function (connectionName) {},
  /**
   * Start a transaction for a specified database. If database is not used in this context will
   * create a connection to the database and start transaction.
   *
   * For Oracle with DBLink first statement to DBLink'ed table must be
   * either update/insert/delete or you MUST manually start transaction
   * to prevent "ORA-01453: SET TRANSACTION be first statement"
   *
   * @param {String} connectionName
   * @return {Boolean}
   */
  dbStartTransaction: function (connectionName) {},

  /**
   * Defense edition only,
   * Base64 encoded public server certificate
   *
   * Contains non empty value in case security.dstu.trafficEncryption === true and
   * key name defined in security.dstu.novaLib.keyName
   *
   * @type {string}
   */
  serverPublicCert: ''
}

/**
 * @enum TubLoadContentBody
 */
const TubLoadContentBody = {
  Default: 0,
  Yes: 1,
  No: 2
}

/**
 * Contains information about the logged in user. Server recreate this object each time `endpoint` handler are executed
 *
 * Implements {@link EventEmitter} and will emit `login` event each time user logged in
 * or `loginFailed` event whith 2 parameters(userID, isLocked) when user UB authentification failed by wrong password
 * @namespace
 * @global
 * @mixes EventEmitter
 */
const Session = {
  /**
   * Current session identifier. === 0 if session not started, ===1 in case authentication not used, >1 in case user authorized
   * @type {Number}
   * @readonly
   */
  id: 0,
  /**
   * Logged-in user identifier (from uba_user.ID). Undefined if Session.id is 0 or 1 (no authentication running)
   * @type {Number}
   * @readonly
   */
  userID: 12,
  /**
   * Logged-in user role IDs in CSV format. ==="" if no authentication running
   * @type {String}
   * @readonly
   */
  userRoles: '1,2,3',
  /**
   * Logged-in user role names in CSV format. ==="" if no authentication running
   * @type {String}
   * @readonly
   */
  userRoleNames: 'admins,operators',
  /**
   * Logged-in user language. ==="" if no authentication running
   * @type {String}
   * @readonly
   */
  userLang: 'en',
  /**
   * Custom properties, defined in {@link Session.login Session.on('login')} handlers for logged-in user.
   *
   * Starting from UB 1.9.13 this is a JavaScript object (before is {TubList} ).
   *
   * If modified inside Session.on('login'), value of this object is persisted into global server Sessions (via JSON.stringify)
   * and restored for each call (via JSON.parse).
   *
   * Never override it using `Session.uData = {...}`, in this case you delete uData properties, defined in other application models.
   * Instead define or remove properties using `Session.uData.myProperty = ...` or `delete Session.uData.myProperty`;
   *
   * We strongly recommend to **not modify** value of uData outside the `Session.on('login')` handler.
   * Such modification is not persisted between calls.
   * @type {Object}
   * @readonly
   */
  uData: {},
  /**
   * IP address of a user. May differ from IP address current user login from. May be empty if request come from localhost.
   * @type {String}
   * @readonly
   */
  callerIP: ''
  /**
   * Fires just after user successfully logged-in but before auth response is written to client.
   * Inside models initialization script you can subscribe to this event and add some data to Session.uData.
   * No parameter is passed to this event handler. Example below add `someCustomProperty` to Session.uData
   * and this value is accessible on client via $App.connection.userData(`someCustomProperty`):
   *
   *      // @param {THTTPRequest} req
   *      Session.on('login', function (req) {
   *          var uData = Session.uData
   *          uData.someCustomProperty = 'Hello!'
   *      })
   *
   * See real life example inside `\models\ORG\org.js`.
   * @event login
   */

  /**
   * Fires in case new user registered in system and authentication schema support
   * "registration" feature.
   *
   * Currently only CERT and UB schemas support this feature
   *
   * For CERT schema user registered means `auth` endpoint is called with registration=1 parameter.
   *
   * For UB schema user registered means 'publicRegistration' endpoint has been called and user confirmed
   * registration by email otp
   *
   * Inside event handler server-side Session object is in INCONSISTENT state and you must not use it!!
   * Only parameter (stringified object), passed to event is valid user-relative information.
   *
   * For CERT schema parameter is look like
   *      {
   *          "authType": 'CERT',
   *          "id_cert": '<id_cert>',
   *          "user_name": '<user_name>',
   *          "additional": '',
   *          "certification_b64": '<certification_b64>'
   *      }
   *
   * For UB schema parameter is look like
   *      {
   *          "authType": 'UB',
   *          "publicRegistration": true,
   *          userID,
              userOtpData
   *      }
   *
   * Each AUTH schema can pass his own object as a event parameter, but all schema add `authType`.
   * Below is a sample code for CERT schema:
   *
   *      Session.on('registration', function(registrationParams){
   *
   *      }
   *
   * @event registration
   */

  /**
   * Fires in case new user registered in system and authentication schema support
   * "registration" feature.
   *
   * Currently only CERT schemas
   *
   * For CERT schema user registered means `auth` endpoint is called with registration=1 parameter.
   *
   * Called before start event "registration" and before starting check the user. You can create new user inside this event.
   *
   * Parameter is look like
   *
   *      {
   *          "authType": 'CERT',
   *          "serialSign": '<serialSign>',
   *          "name": '<user name>',
   *          "additional": '',
   *          "issuer": '<issuer>',
   *          "serial": '<serial>',
   *          "certification_b64": '<certification_b64>'
   *      }
   *
   * Below is a sample code for CERT schema:
   *
      const iitCrypto = require('iitCrypto')
      iitCrypto.init()

      Session.on('newUserRegistration', function (registrationParams) {
        let params = JSON.parse(registrationParams)
        Session.runAsAdmin(function () {
          var
            storeCert, certData, certInfo,
            certID, userID,
            certParams, connectionName, roleStore,
            certExist

          let storeUser = UB.Repository('uba_user')
            .attrs(['ID', 'name', 'mi_modifyDate'])
            .where('name', '=', params.name).select()
          let userExist = !storeUser.eof

          if (userExist) {
            userID = storeUser.get('ID')
          }
          storeCert = UB.Repository('uba_usercertificate')
            .attrs(['ID', 'userID.name', 'disabled', 'revoked'])
            .where('serial', '=', params.serialSign)
          try {
            if (!App.serverConfig.security.dstu.findCertificateBySerial) {
              storeCert = storeCert.where('issuer_serial', '=', params.issuer)
            }
            storeCert = storeCert.select()
            certExist = !storeCert.eof
            if (certExist && ((storeCert.get('disabled') === 1) || (storeCert.get('revoked') === 1))) {
              throw new Error('Certificate is disabled')
            }
            if (!userExist && certExist) {
              throw new Error('Certificate already registered by another user')
            }

            if (certExist) {
              throw new Error('Certificate already registered')
              // throw new Error('User ' + params.name + ' already registred');
            }
          } finally {
            storeUser.freeNative()
            storeCert.freeNative()
          }

          certData = Buffer.from(params.certificationB64, 'base64')
          certInfo = iitCrypto.parseCertificate(certData.buffer)

          if (!userExist) {
            storeUser = new TubDataStore('uba_user')
            storeUser.run('insert', {
              fieldList: ['ID'],
              execParams: {
                name: params.name,
                email: certInfo.SubjEMail,
                disabled: 0,
                isPending: 0,
                // random
                uPasswordHashHexa: (new Date()).getTime().toString(27) + Math.round(Math.random() * 10000000000000000).toString(28),
                // phone
                // description:
                firstName: certInfo.SubjFullName // certInfo.SubjOrg
              }
            })
            userID = storeUser.get('ID')

            roleStore = UB.Repository('uba_role')
              .attrs(['ID', 'name'])
              .where('name', 'in', ['Admin']).select()
            while (!roleStore.eof) {
              storeUser.run('insert', {
                entity: 'uba_userrole',
                execParams: {
                  userID: userID,
                  roleID: roleStore.get('ID')
                }
              })
              roleStore.next()
            }
          }
          storeCert = new TubDataStore('uba_usercertificate')
          certID = storeCert.generateID()

          certParams = new TubList()
          certParams.ID = certID
          certParams.userID = userID
          certParams.issuer_serial = params.issuer
          certParams.serial = params.serialSign
          certParams.setBLOBValue('certificate', params.certificationB64)
          // issuer_cn: certInfo.issuerCapt,
          certParams.disabled = 0
          certParams.revoked = 0

          storeCert.run('insert', {
            fieldList: ['ID'],
            execParams: certParams
          })

          connectionName = App.byName('uba_user').connectionName
          if (App.dbInTransaction(connectionName)) {
            App.dbCommit(connectionName)
          }
          throw new Error('<UBInformation><<<Регистрация прошла успешно.>>>')
        })
      })
   *
   * @event newUserRegistration
   */

  /**
   * Fires in case `auth` endpoint is called with authentication schema UB and userName is founded in database,
   * but password is incorrect.
   *
   * If wrong passord is entered more  than `UBA.passwordPolicy.maxInvalidAttempts`(from ubs_settings) times
   * user will be locked
   *
   * 2 parameters passes to this event userID(Number) and isUserLocked(Boolean)
   *
   *      Session.on('loginFailed', function(userID, isLocked){
   *          if (isLocked)
   *              console.log('User with id ', userID, 'entered wrong password and locked');
   *          else
   *              console.log('User with id ', userID, 'entered wrong password');
   *      })
   *
   * @event loginFailed
   */

  /**
   * Fires in case of any security violation:
   *
   *  - user is blocked or not exists (in uba_user)
   *  - user provide wrong credential (password, domain, encripted secret key, certificate etc)
   *  - for 2-factor auth schemas - too many sessions in pending state (max is 128)
   *  - access to endpoint "%" deny for user (endpoint name not present in uba_role.allowedAppMethods for eny user roles)
   *  - password for user is expired (see ubs_settings UBA.passwordPolicy.maxDurationDays key)
   *  - entity method access deny by ELS (see rules in uba_els)
   *
   * 1 parameter passes to this event `reason: string`
   *
   *      Session.on('securityViolation', function(reason){
   *          console.log('Security violation for user with ID', Session.userID, 'from', Session.callerIP, 'reason', reason);
   *      })
   *
   * @event securityViolation
   */
}

/**
 * @classdesc Properties of a database connection
 * @class TubConnectionConfig
 * @deprecated
 */
function TubConnectionConfig () {}
TubConnectionConfig.prototype = {
  isDefault: false,
  statementCacheSize: 30,
  driver: TubSQLDriver.sqdrMSSQL2008OleDB,
  /**
  * @type {TubSQLDialect}
  */
  dialect: TubSQLDialect.AnsiSQL,
  serverName: '',
  property: '',
  userID: '',
  password: '',
    /**
     * Languages, supported by this connection
     * @type {Array<String>}
     */
  supportLang: [''],
  advSettings: '',
  executeWhenConnected: ''
}

/*
 * Entity attribute definition
 * @class TubEntityAttribute
 * @property {TubAttrDataType} dataType Attribute data type
 * @property {Number} size For String type attribute - max length in character
 * @property {String} associatedEntity
 * @property {String} associationManyData
 * @property {String} caption
 * @property {String} description
 * @property {Boolean} allowNull default True;
 * @property {Boolean} allowSort default True
 * @property {Boolean} isUnique
 * @property {String} defaultValue
 * @property {Boolean} defaultView
 * @property {Boolean} readOnly
 * @property {Boolean} isMultiLang
 * @property {Boolean} generateFK
 * @property {String} documentation
 * @property {String} storeName
 * @property {String} enumGroup
 * @property {Boolean} cascadeDelete
 * @property {Object} mapping actual type is TubEntityAttributeSQLExprList
 */

/**
 * UnityBase Domain definition.
 * @class
 * @extends {TubNamedCollection}
 * @deprecated
 */
function TubEntityAttributeList () {}
// TubDomain.prototype = {
//     /**
//      * @override
//      * @param {String} name
//      * @return {TubEntityAttribute}
//      */
//   byName: function (name) {},
//
//     /**
//      * Create a new attribute for entity. Accessible only iside mixin initializetion methods.
//      * jsonString is a JSON representation of a newly created attribute (with name),
//      * optional position is a position in attribte list to be inserted into.
//      *
//             var entity = App.domain.byName('uba_user');
//             var attrs = entity.attributes;
//             var attr = attrs.newFromJSON(JSON.stringify({name: 'custom1', dataType: 'String', size: 10}), -1);
//
//      * @param {String} jsonString
//      * @param {Number} [position]
//      */
//   newFromJSON: function (jsonString, position) {},
//     /**
//      * @override
//      * @type {Array<TubEntityAttribute>}
//      */
//   items: []
// }

/**
 * @classdesc
 * In-memory representation of Entity metadata definition (meta file).
 * Meta file must be created in accordance with the [entity definition JSON scheme](../models/UB/docson/index.html#../schemas/entity.schema.json)
 *This server-side class contain more properties when client-side UBEntity class or {@link TubApp#getDomainInfo} method result,
 * since server pass to client only part of Entity definition information.
 *
 * The most useful method is {@link TubEntity#addMethod addMethod} witch allow to add public (accessible from client) JavaScript methods to entity.
 *
 * @class TubEntity
 * @aside guide entities
 * @deprecated Startuing from UB4 use a pure JS version {@link module:@unitybase/base/UBDomain UBDomain}
 */
function TubEntity () {}
TubEntity.prototype = {
    /**
     * The name of the entity
     * @type {String}
     */
  name: '',
    /**
     * Model entity assigned to. To get model configuration use following code:
     *
     *      var modelConfig = App.domain.config.models.byName('UBA'); // UBA is a modelName
     *      var publicPath = modelConfig.publicPath;
     *
     * @type {String}
     */
  modelName: '',
    /**
     * Caption
     * @type {String}
     */
  caption: 'entity caption',
    /**
     * Description
     * @type {String}
     */
  description: 'entity description',
    /**
     * Name of the database connection entity assotiated wiith. Connections defined in application config.
     * @type {String}
     */
  connectionName: '',

    /**
     * Database connection configuration
     * @type {TubConnectionConfig}
     */
  connectionConfig: null,

    /**
     * Database connection
     * @deprecated `undefined` since 1.11. Use a connectionConfig
     */
  connection: null,
    /**
     * Caching type
     * @type {TubCacheType}
     */
  cacheType: TubCacheType.None,
    /**
     * type of data entity mapped to
     * @type {TubEntityDataSourceType}
     */
  dsType: TubEntityDataSourceType.Normal,
    /**
     * Short string using as SQL alias while building SQL query and DDL statements
     * If empty - entity name used
     * @type {String}
     */
  sqlAlias: '',
    /**
     * Name of attribute what describe element
     * This attribute is used for example in comboBox as display field
     * @type {String}
     */
  descriptionAttribute: '',
    /**
     * entity documentation
     */
  documentation: '',
    /**
     * Name of idGenerator used for generating ID's for this entity. Default generator ('main') is created automatically.
     * @type {String}
     */
  idGenerator: '',
    /**
     * Entity attributes
     * @type {TubEntityAttributeList}
     */
  attributes: new TubEntityAttributeList(),
  mapping: {},
  filters: {},
  mixins: {},
  options: {},
  dbKeys: {},
  dbExtensions: {},

    /**
     * @type {Boolean}
     */
  existSequence: false,
    /**
     * @type {String}
     */
  refSequenceName: '',
    /**
     * @type {Boolean}
     */
  allowGenSequence: false,
    /**
     * @type {Boolean}
     */
  allowUseSequence: false,
    /**
     * Add entity level method.
     *
     * Method itself must be a function type property of entity with single parameter of type {ubMethodParams}
     * Client able to call such methods remotely. Also such methods is a subject of ELS security.
     *
     * You do not need to add methods what do not called from client using {TubEntity#addMethod}
     *
     * Warning: do not call entity.addMethod from inside function or conditions. This code evaluated during thread initialization and each thread must add method in the same manner.
     *
     * @example
     *
     * //consider we have entity my_entity. Code below is inside my_entity.js file):
       "use strict";
        var me = my_entity;
        me.entity.addMethod('externalMethod');
        // @param {ubMethodParams} ctx <- here must be JSDoc comment format
        me.externalMethod = function(ctx){
            var
                params = ctx.mParams, a = params.a || 1, b = params.b || 1;
            params.multiplyResult = a*b;
        }

        // now from client side you can call
        $App.connection.run({entity: 'my_entity', method: 'externalMethod', a: 10, b:20}).done(function(result){
            console.log(' 10 * 20 = ', result.multiplyResult); // will put to log "10 * 20 = 200"
        });
     *
     * @param {String} methodName
     */
  addMethod: function (methodName) {}
}

/**
 * @classdesc
 * Entity communication class. Use it to:
 *
 *  - execute any entity method using {@link TubDataStore#run}
 *  - execute any SQL statement using {@link TubDataStore#runSQL} or {@link TubDataStore.execSQL} (we strongly recommend usage of ORM instead SQL)
 *  - store several named data collection using {@link TubDataStore#currentDataName} (data stored inside server memory, not in JS, this is very good for GC)
 *  - iterate other collection rows using {@link TubDataStore#next}, eof, e.t.c and retrieve row data using TubDataStore.get
 *  - serialize data to XML or JSON
 *
 *  To retrieve data from database using build-in ORM (to execute entity `select` method) preffered way is to use {@link UB.Repository} fabric function.
 *
 * @class TubDataStore
 * @param {String|TubEntity} entity
 * @constructor
 */
function TubDataStore (entity) {}
TubDataStore.prototype = {
    /**
     * Run any entity method.
     * @example
     *
     * var store = new TubDataStore('doc_attachment');
     * store.run('update', {execParams: {
     *          ID: 1,
     *          approved: 0
     *      }
     * });
     *
     * store.run('anyEntityMethod', {param1: 'valueOfParam1', ...});
     *
     * @param {String} methodName
     * @param {Object|TubList} params
     * @return {Boolean} True in case of success, else raise exception
     */
  run: function (methodName, params) {},
    /**
     * Execute SQL with parameters and place result into dataStore. This method expect SQL statement have **result**.
     *
     * To execute SQL statement without result (`insert` for example) - use TubDataStore.execSQL instead.
     *
     * @param {String} sql SQL statement to run
     * @param {Object|TubList} params SQL parameters list
     */
  runSQL: function (sql, params) {},
    /**
     * Execute SQL with parameters. Not wait result data
     * @param {String} sql SQL statement to run
     * @param {Object|TubList} params SQL parameters list
     */
  execSQL: function (sql, params) {},
    /**
     * init dataStore content from JSON string
     * If you need to init dataStore w/o rows:
     *
     *      var ds = new TubDataStore('myEntityCode');
     *      ds.initFromJSON({"fieldCount":1,"values":["ID"],"rowCount":0});
     *      console.log(ds.initialized); // TRUE
     *
     * WARNING!!! during initFromJSON UnityBase determinate field types from vield values,
     *  so if some data column contain only numeric values it becode Number (even if in source it String).
     *
     * @param source
     */
  initFromJSON: function (source) {},

    /**
     * Return zero based index of fieldName from current data store (-1 if not found)
     * @example

            var r = UB.Repository('cdn_organization').attrs(['ID', 'mi_owner.name']).where('[ID]', '=', 3000000002801).select();
            console.log(r.fieldIndexByName('mi_owner.name')); // 1
            console.log(r.fieldIndexByName('unexistedAttr')); // -1

     * @param {String} fieldName
     */
  fieldIndexByName: function (fieldName) {},
    /**
     * Return value of attribute.
     *
     * In case store initialized using TubDataStore.run style we can return Number or String type,
     * but in case it initialized using runSQL columns data types is unknown and you must cast value do required type directly.
     *
     * @param {Number|String} attrib attribute index or name. Index is faster but less readable.
     * @return {Number|String}
     */
  'get': function (attrib) {},
    /**
     * Return value of attribute as ArrayBuffer.
     *
     * You can apply this method to blob fields only
     *
     * @param {Number|String} attrib attribute index or name. Index is faster but less readable.
     * @return {ArrayBuffer}
     */
  'getAsBuffer': function (attrib) {},
    /** Move next */
  next: function () {},
    /** Move prev */
  prev: function () {},
    /** Move first */
  first: function () {},
    /** Move last */
  last: function () {},
    /**
     * Indicate current position in data collection is on the begining of collection
     * @type {Boolean}
     */
  bof: true,
    /**
     * Indicate current position in data collection is on the end of collection.
     * @type {Boolean}
     */
  eof: true,

    /**
     * Generate a new identifier (int64)
     * @return {Number}
     */
  generateID: function () {},

    /**
     * Entity repository created with
     * @readonly
     * @type {TubEntity}
     */
  entity: new TubEntity(),

    /**
     * Is store initialized
     * @type {Boolean}
     */
  initialized: false,
    /**
     * Return string representation of Instance in format `[{attr1: value1, attr2: value2},... ]`
     * @type {String}
     */
  asJSONObject: '[{attr1: value1, attr2: value2},... ]',
    /**
     * Return string representation of Instance in `Array of array` format
     * @type {String}
     */
  asJSONArray: '[[value1, value2,..],..[]]',
    /**
     * Return XML representation of Instance in MS DataSet format
     * @type {String}
     */
  asXMLPersistent: 'MS dataset xml format',
  /**
   * Active dataset name we work with. There is some predefined dataNames - see mixin documentation for details
	 *
	 * Predefined values:
   *
	 *  - selectBeforeUpdate
	 *  - selectAfterUpdate
	 *  - selectAfterInsert
	 *  - selectBeforeDelete
   *
   * @type {String}
   */
  currentDataName: '',
  /**
   * Record count. If DataStore is not initialized or empty will return 0.
   * @type {Number}
   */
  rowCount: 0,
  /**
   * Total record count if store are filled with withTotal() option.
   * If DataStore is not initialized or empty or inited without withTotal() will return -1.
   * @type {Number}
   */
  totalRowCount: 0,
  /**
   * Row position inside currentDataName dataset. Read/write
   * @type {Number}
   */
  rowPos: 0,
  /**
   * Release all internal resources. Store became unusable after call to `freeNative()`
   */
  freeNative: function () {}
}

/**
 * Collection of named items
 * @class TubNamedCollection
 */
function TubNamedCollection () {}
TubNamedCollection.prototype = {
  /**
   * Get list element by name
   * @param name
   * @returns {Number|String|TubList}
   */
  byName: function (name) {},

  /**
   * Stringified JSON representation of named collection
   * @type {String}
   */
  asJSON: '',
  /**
   * Number of named collection items
   * @type {Number}
   */
  count: 0,
  /**
   * Array of collection items
   * @type {Array}
   */
  items: [],
  /**
   * Array of collection item names
   * @type {Array}
   */
  strings: []
}

/**
 * @classdesc
 * Structure passed as parameter to all entity level scripting methods
 * @class ubMethodParams
 */
function ubMethodParams () {}
ubMethodParams.prototype = {
  /**
   * Do not call methods of other mixins with <b>the same method name</b>.
   * This mean if preventDefault() is called in the overridden `beforeselect`, only `beforeselect` of mixin method will not be called.
   * Useful if we want to override original method implementation by our own implementation.
   *
   * See ubm_form.update implementation for usage sample.
   */
  preventDefault: function () {},
  /**
   * Do not check row modification date while execute statement.
   * @type {Boolean}
   */
  skipOptimisticLock: false,
  /**
   * Data Store associated with current method execution context. If initialized - will be added to client response
   * @type {TubDataStore}
   * @readonly
   */
  dataStore: new TubDataStore(),
  /**
   * Params caller pass to HTTP request.
   * @type {TubList}
   */
  originalParams: null,
  /**
   * In/Out method parameters. All parameters added or modified in this object is passed back to client
   * @type {TubList}
   */
  mParams: null,
  /**
   * Indicate current method execution initiated by external caller (client). If false - this method is called from server.
   * @type {Boolean}
   * @readonly
   */
  externalCall: true
}

/** Structure for direct read HTTP request properties. Passed as parameter to endpoints handler.
 * Also accessible in in entity level scripting methods while in rest mode
 * @class
 * @implements {UBReader}
 */
function THTTPRequest () {}
THTTPRequest.prototype = {
  /** HTTP request headers
   * @type {String}
   * @readonly
   */
  headers: '{header:value\\n\\r}',
  /** HTTP request method GET|POST|PUT......
   * @type {String}
   * @readonly
   */
  method: 'POST',
  /** full request URL with app name, method name and parameters
   * for request http://host:port/ub/rest/doc_document/report?id=1&param2=asdas
   * - return ub/rest/doc_document/report?id=1&param2=asdas
   * @type {String}
   * @readonly
   */
  url: 'URL',

  /** request URI - URL WITHOUT appName and method name
   * - return doc_document/report
   * @type {String}
   * @readonly
   */
  uri: 'uri',
  /**
   * The same as uri, but URLDecode'd
   *
   *      req.uri === "TripPinServiceRW/My%20People"
   *      //
   *      req.decodedUri === "TripPinServiceRW/My People"
   *
   * @type {String}
   * @readonly
   */
  decodedUri: 'URLDEcoded uri',

  /** request parameters if any
   * - return id=1&param2=asdas
   * @type {String}
   * @readonly
   */
  parameters: '',
  /**
   * URLDecoded request parameters if any
   *
   *      req.parameters === "$filter=Name%20eq%20%27John%27"
   *      //
   *      req.decodedParameters === "$filter=Name eq 'John'"
   *
   * @type {String}
   * @readonly
   */
  decodedParameters: 'params',
  /** @inheritdoc
   * @param {String} [encoding]
   */
  read: function (encoding) {},
  /** HTTP request body
   * @type {String}
   * @deprecated Since 1.8 use {@link THTTPRequest#read} instead
   */
  body: ''
}

/** Structure for direct write HTTP response. Passed as parameter to application level scripting methods (see App.registerEndpoint )
 * also accessible in in entity level scripting methods while in rest mode.
 *
 * Implements string writer.
 *
 * Caller MUST call writeEnd once in the end and set response statusCode
 *
 * To send file content as a response without loading file into memory the following code can be used:
 *
      // Replace this comments by JSDocs style comment
      // param {THTTPRequest} req
      // param {THTTPResponse} resp
      function getPublicDocument(req, resp){
        resp.statusCode = 200;
        resp.writeHead('Content-Type: !STATICFILE\r\nContent-Type: text/plain'); // !STATICFILE is a special content type - will be removed from headers by server during sending
        resp.writeEnd('c:\\myFilesWithPasswords.txt');
      }

 * @class
 * @implements {UBWriter}
 */
function THTTPResponse () {}
THTTPResponse.prototype = {
  /** Add response header(s). Can be called several times for DIFFERENT header
   *
   *    resp.writeHead('Content-Type: text/css; charset=UTF-8\r\nOther-header: value')
   *
   * @param {String} header one header or #13#10 separated headers
   */
  writeHead: function (header) {},
  /**
   * @inheritdoc
   */
  write: function (data, encoding) {},
  /**
   * Write base64 encoded data as a binary representation (will decode from base64 to binary before write to response)
   * @param {String} base64Data
   */
  writeBinaryBase64: function (base64Data) {},
  /** Write to internal buffer and set buffer content as HTTP response.
   * See {UBWriter.wrote} for parameter details
   * @param {ArrayBuffer|Object|String} data
   * @param {String} [encoding]
   */
  writeEnd: function (data, encoding) {},
   /** response HTTP status code
   * @type {Number} */
  statusCode: 400,
  /**
   * Perform a ETag based HTTP response caching.
   * Must be called after writeEnd called and and statusCode is defined.
   *
   * In case statusCode === 2000 and response body length > 64 will
   *  - if request contains a IF-NONE-MATCH header, and it value equal to response crc32
   * will mutate a statusCode to 304 (not modified) and clear the response body
   *  - in other case will add a ETag header with value = hex representation of crc32(responseBody).
   */
  validateETag: function () {}
}

/**
 * Class for store meta information (not content) about content for adtDocument attribute. Serialized representation are stored in the adtDocumnet attribute.
 * Actual content (file) is stored elsewhere (in store)!.
 * @class TubDocumentContent
 * @property {String} fName actual file name
 * @property {String} origName Original file name
 * @property {String} relPath Can be one of follow: - relative path of document in medium/large store - record ID for DB store - any data for virtual store
 * @property {String} ct Content type
 * @property {Number} size Content size
 * @property {String} md5 Content md5 checksum
 * @property {Number} revision Content revision
 * @property {Boolean} isDirty
 * @property {Boolean} deleting
 */

/**
 * Container for raw document data extracted from incoming HTTP request for setDocument/setDocumentMultipart app level methods
 *
 * @class TubDocumentRequest
 * @param {THTTPRequest} [httpReq] Optional HTTP request. In case passed content will be loaded from request body during constructor call
 * @constructor
 */
function TubDocumentRequest (httpReq) {}
TubDocumentRequest.prototype = {
  /**
   * Entity code
   * @type {String}
   */
  entity: '',
  /**
   * Entity attribute code
   * @type {String}
   */
  attribute: '',
  /**
   * @type {Number}
   */
  id: 0,
  /**
   * If `true` - content is stored in the temporary store
   * @type {Boolean}
   */
  isDirty: false,
  /**
   * MIME type to force convertion to (in case blob store sonfigured to support MIME convetration)
   * @type {String}
   */
  forceMime: '',
  /**
   * Name of file as it in the store
   * @type {String}
   */
  fileName: '',

  /**
   * @param {boolean} AEstablishStoreFromAttribute
   * @returns TubDocumentHandlerCustom
   */
  createHandlerObject: function (AEstablishStoreFromAttribute) {},
  /**
   * Save request body to file
   * @param {String} fileName name of file to save request body to
   * @returns {boolean}
   */
  saveBodyToFile: function (fileName) { return true },
  /**
   * @param {String} fileName
   * @return {boolean}
   */
  loadBodyFromFile: function (fileName) { return true },
  /**
   * @return {string}
   */
  getBodyAsUnicodeString: function () { return '' },
  /**
   * Transform unicode string to internal UFT8 buffer
   * @param {String} bodyAsString
   */
  setBodyAsUnicodeString: function (bodyAsString) {},
  /**
   * Read request body from array buffer and call TubDocumentRequest.writeToTemp method.
   * @param {ArrayBuffer} buffer
   * @returns {String} Document content (JSON, contain meta information about file) to be stored to Document type attribute
   */
  setBodyFromArrayBuffer: function (buffer) {},
  /**
   * @returns {String} base64 encoded body representation
   */
  getBodyAsBase64String: function () { return '' },
  /**
   * @returns {boolean}
   */
  getIsBodyLoaded: function () { return false },

  /**
   * Set document content to internal request buffer (in-memory). Function implement {@link UBWriter#write}
   * Call to this function not perform actual writing of document to store,
   * to save document to store call {@link TubDocumentRequest#writeToTemp}
   */
  setContent: function (data, encoding) {},

  /**
   * Read document content. Content must be previously loaded. Function implement {@link UBReader#read}
   */
  getContent: function () {},

  /**
   * Write passed body to temporary store. If body is loaded it is possible to call writeToTemp without parameters.
   *
   * @example
   *
   *      var
   *          pdfRequest = new TubDocumentRequest(),
   *          docContent;
   *      pdfRequest.entity = "rep_reportResult";
   *      pdfRequest.attribute = 'generatedDocument';
   *      pdfRequest.id = reportResultID;
   *      pdfRequest.fileName = reportResultID.toString() + '.pdf';
   *
   *      docHandler = docReq.createHandlerObject(true);
   *      docHandler.loadContent(TubLoadContentBody.Yes);
   *
   *      docContent = pdfRequest.writeToTemp(pdfDocument.pdf.output(), 'bin');
   *
   * @param {TubDocumentRequest|String} [body] Body to write. Can be copied from existing TubDocumentRequest or from string. In case body is loaded using TubDocumentRequest#write, it can be omitted
   * @param {String} [encoding] Optional. In case parameter exist and first parameter type is string - perform decode of body before write to store. Possible values: "bin", "base64"
   * @returns {String} Document content (JSON, contain meta information about file) to be stored to Document type attribute
   */
  writeToTemp: function (body, encoding) { return '' }
}

/**
 * Class to work with stored content of `Document` attribute (files/BLOB/Virtual)
 * @class TubDocumentHandlerCustom
 * @constructor
 */
function TubDocumentHandlerCustom () {}
TubDocumentHandlerCustom.prototype = {
  /**
   * Load file/BLOB into memory
   * @param {TubLoadContentBody} loaderType
   */
  loadContent: function (loaderType) {},

  /**
   * Reference to attribute definition
   * @type {TubEntityAttribute}
   * @readonly
   */
  attribute: null,
  /**
   * @type {TubDocumentRequest}
   */
  request: null,
  /**
   * @type {TubStoreConfig}
   * @readonly
   */
  storeConfig: null,

  /**
   * Actual content
   * @type {TubDocumentContent}
   */
  content: null
}

/**
 * Structure for calling WebSocket handlers
 * @class
 */
function WebSocketConnection () {}
WebSocketConnection.prototype = {
  /**
   * Current logged in user session
   * @type {Session}
   * @readonly
   */
  session: null,
  /**
   * Send message to caller
   * @param {String|Object|ArrayBuffer} data
   */
  send: function (data) {},
  /**
   * Close caller connection
   * @param {String} [reason]
   */
  close: function (reason) {}
}

/**
 * Entity attributes data type
 * @enum {Number}
 * @readonly
 */
TubAttrDataType = {Unknown: 0,
  String: 1,
  Int: 2,
  BigInt: 3,
  Float: 4,
  Currency: 5,
  Boolean: 6,
  DateTime: 7,
  Text: 8,
  ID: 9,
  Entity: 10,
  Document: 11,
  Many: 12,
  TimeLog: 13,
  Enum: 14,
  BLOB: 15,
  Date: 16}

/**
 * Entity cache type
 * @enum {Number}
 * @readonly
 */
TubCacheType = {None: 0, SessionEntity: 1, Entity: 2, Session: 3}

/**
 * Supported SQL dialects
 * @enum {Number}
 * @readonly
 */
TubSQLDialect = {AnsiSQL: 0,
  Oracle: 1,
  Oracle9: 2,
  Oracle10: 3,
  Oracle11: 4,
  MSSQL: 5,
  MSSQL2008: 6,
  MSSQL2012: 7,
  SQLite3: 8,
  PostgreSQL: 9,
  Firebird: 10}

/**
 * Entity dataSource types
 * @enum {Number}
 * @readonly
 */
TubEntityDataSourceType = {Normal: 0, External: 1, System: 2, Virtual: 3}

/**
 * SQL expression types
 * @enum {Number}
 * @readonly
 */
TubSQLExpressionType = {Field: 0, Expression: 1}
