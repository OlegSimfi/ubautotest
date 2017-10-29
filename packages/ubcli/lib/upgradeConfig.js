/**
 * Command line tool for converting UnityBase config from version <=1.11 to version 1.11
 * Usage:
 *
 *    ubcli upgradeConfig -help
 *
 * @author pavel.mash on 22.12.2015.
 * @module @unitybase/ubcli/upgradeConfig
 */
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const argv = require('@unitybase/base').argv
const options = require('@unitybase/base').options

module.exports = function upgradeConfig (cfg) {
  if (!cfg) {
    let opts = options.describe('upgradeConfig', 'Convert UnityBase config to up-to-date version', 'ubcli')
      .add({short: 'cfg', long: 'cfg', param: 'oldFormatConfigFileName', defaultValue: 'ubConfig.json', searchInEnv: true, help: 'UnityBase config in old format'})
      .add({short: 'app', long: 'app', param: 'NameOfApplicationForNewConfig', help: 'For config from version <=1.11 - application name to be converted'})
    cfg = opts.parseVerbose({}, true)
    if (!cfg) return
  }
  let cfgFile = cfg.cfg

  let old = require(path.join(process.cwd(), cfgFile))
  let n

  if (old.appConfigs) {
    n = convert110To111(old)
  } else {
    console.error('Can\'t understand config version. Convert it manually')
    return
  }

  let oldContent = fs.readFileSync(path.join(process.cwd(), cfgFile))
  fs.writeFileSync(path.join(process.cwd(), cfgFile + '.old'), oldContent)
  fs.writeFileSync(path.join(process.cwd(), cfgFile), JSON.stringify(n, null, '\t'))
}

/**
 * Convert named collection - {name1: {}, name2: {}} to array -> [{name: name1, ...}, ...]
 * Will mutate original!
 * @param namedCollection
 * @private
 */
function namedCollection2Array (namedCollection) {
  let result = []
  let item
  _.forEach(namedCollection, function (value, key) {
    item = {name: key}
    item = _.defaults(item, value)
    result.push(item)
  })
  return result
}

function convert110To111 (old) {
  let n = {
    httpServer: {
    },
    logging: {
    }
  }

    // httpServer section
  if (old.HTTPServerType && old.HTTPServerType !== 'stHTTPSys' && old.HTTPServerType !== 'HTTPSys') n.httpServer.serverType = old.HTTPServerType
  if (old.useHTTPS) n.httpServer.protocol = 'https'
  n.httpServer.host = old.serverDomainNames
  n.httpServer.port = old.serverPort || '888'

  let oldApps = Object.keys(old.appConfigs)
  let appName

  if (oldApps.length !== 1) {
    appName = argv.findCmdLineSwitchValue('app')
    if (!appName) throw new Error('Old config contain several applications. Please, specify application name using `-app` switch')
  } else {
    appName = oldApps[0]
  }
  let oApp = old.appConfigs[appName]
  if (!oApp) throw new Error('App with name ' + appName + ' not found in old config')
  n.httpServer.path = appName // old config always contain app
  if (old.threadPoolSize) n.httpServer.threadPoolSize = old.threadPoolSize
  if (oApp.staticFolder) n.httpServer.inetPub = oApp.staticFolder
  if (oApp.staticRules) n.httpServer.headersPostprocessors = namedCollection2Array(oApp.staticRules)

  if (old.hasOwnProperty('enableFolderObservation') || old.hasOwnProperty('folderHashAlgorithm')) {
    n.httpServer.watchFileChanges = {
      enabled: old.enableFolderObservation || false,
      hashingStrategy: old.hasOwnProperty('folderHashAlgorithm') || 'ModifyDate'
    }
  }
  if (old.HTTPQueueLength && old.HTTPQueueLength !== 1000) n.httpServer.requestQueueLength = old.HTTPQueueLength
  if (old.HTTPMaxBandwidth) n.httpServer.maxBandwidth = old.HTTPMaxBandwidth
  if (old.HTTPMaxConnections) n.httpServer.maxConnections = old.HTTPMaxConnections
  if (old.HTTPAllowOrigin) n.httpServer.allowCORSFrom = old.HTTPAllowOrigin
  if (old.compression && old.compression === 'zip') {
    n.httpServer.compression = old.compression
  }

    // logging section
  if (old.logLevel) {
    if (old.logLevel.length === 26) {
      n.logging.levels = ['*']
    } else {
      n.logging.levels = old.logLevel.map(function (item) {
        return item.charAt(0) === 's' ? item.slice(3, 100) : item
      })
    }
  }

  n.logging.path = old.logPath || '.\\logs'
  n.logging.rotationSizeInMB = old.logRotationSizeInMB || 100
  if (old.logSlowQueryTime) n.logging.slowQueryThreshold = old.logSlowQueryTime
  if (old.logAutoFlushTimeOut) n.logging.flushTimeOut = old.logAutoFlushTimeOut
  if (old.logStackTraceLevel) n.logging.stackTrackDepth = old.logStackTraceLevel
  if (oApp.enabledPerformanceCounters === false) n.logging.performanceCounters = false

    // javascript section
  if (oApp.fullGCPeriod || old.contextRecyclingIntervalInMinutes) {
    n.javascript = {}
    if (old.scriptingTimeout) n.javascript.timeout = old.scriptingTimeout
    if (oApp.hasOwnProperty('contextRecyclingIntervalInMinutes')) n.javascript.lifetimeInMinutes = old.contextRecyclingIntervalInMinutes
    if (oApp.fullGCPeriod) n.javascript.fullGCPeriod = oApp.fullGCPeriod
  }

    // security section
  if (oApp.authMethods) {
    n.security = {
      authenticationMethods: oApp.authMethods
    }
    if (old.authDomainsConfig) {
      n.security.ldapCatalogs = namedCollection2Array(old.authDomainsConfig)
      _.forEach(n.security.ldapCatalogs, function (catalog) { delete catalog.domainType; catalog.catalogType = 'LDAP' })
    }
    if (old.jsonRequestsOnly) n.security.jsonRequestsOnly = true
    if (old.iitKeyInfo || old.keyStorage) {
      n.security.dstu = {}
    }
    if (old.iitKeyInfo) {
      n.security.dstu.iit = old.iitKeyInfo
    }
    if (oApp.hasOwnProperty('findCertificateBySerial')) n.security.dstu.findCertificateBySerial = oApp.findCertificateBySerial

    if (old.keyStorage) {
      n.security.dstu.novaLib = {
        keyStorage: old.keyStorage,
        keyStoragePin: old.keyStoragePin,
        keyName: old.encryptKeyName
      }
    }
    if (oApp.encryptContent) n.security.dstu.trafficEncryption = true
    if (oApp.nonEncryptedIPs) n.security.dstu.nonEncryptedIPs = oApp.nonEncryptedIPs
    if (old.sessionKeyLifeTime) n.security.dstu.encryptionKeyLifeTime = old.sessionKeyLifeTime
  }

    // application section
    //  domain
  if (!old.domainConfigs[oApp.domainName]) throw new Error('Domain definition for domain ' + oApp.domainName + ' not found in old config domainConfigs section')
  if (old.domainConfigs[oApp.domainName].models && Object.keys(old.domainConfigs[oApp.domainName].models).length) { // application have models defined
    var nApp = n.application = {}
    if (oApp.defaultStaticIndex) nApp.rootHandler = oApp.defaultStaticIndex
    if (oApp.defaultLang) nApp.defaultLang = oApp.defaultLang

    nApp.domain = {
      models: namedCollection2Array(old.domainConfigs[oApp.domainName].models)
    }
    if (oApp.implicitlyAddedMixins) nApp.domain.implicitlyAddedMixins = oApp.implicitlyAddedMixins

        //  connections
    if (oApp.connections) {
      nApp.connections = namedCollection2Array(oApp.connections)
      _.forEach(nApp.connections, function (conn) {
        var eoc
        if (conn.executeOnConnect) {
          eoc = conn.executeOnConnect
          delete conn.executeOnConnect
          conn.executeWhenConnected = eoc
        }
      })
    }

        // blobStores
    if (oApp.storeConfigs) {
      nApp.blobStores = namedCollection2Array(oApp.storeConfigs)
      _.forEach(nApp.blobStores, function (store) {
        var eoc
        if (store.hasOwnProperty('useOriginalFileName')) {
          eoc = store.useOriginalFileName
          delete store.useOriginalFileName
          store.keepOriginalFileNames = eoc
        }
      })
    }

        //  customSettings
    if (oApp.customSettings) {
      nApp.customSettings = oApp.customSettings
    }

        //  fts
    if (oApp.fts) {
      nApp.fts = {
        enabled: oApp.fts.enabled || false, async: oApp.fts.async || false
      }
    }
  }

  n.uiSettings = {}
    // uiSettings
  if (oApp.ubAppConfig) oApp.UBAppConfig = oApp.ubAppConfig
  if (oApp.UBAppConfig) {
    n.uiSettings.adminUI = oApp.UBAppConfig
    n.uiSettings.adminUI.themeName = 'UBGrayTheme'
  } else {
    n.uiSettings.adminUI = {themeName: 'UBGrayTheme'}
  }

  if (old.licenseFilePath) n.licenseFilePath = old.licenseFilePath

  return n
}
