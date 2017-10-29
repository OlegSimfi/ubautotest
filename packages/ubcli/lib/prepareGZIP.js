/**
 * GZIP `staticFolder` files according to `usePreparedGzip` `headersPostprocessors` for specified application
 *
 * Usage:
 *
     ubcli prepareGZIP -?
 *
 * For example during deploy UnityBase documentation to {@link https://unitybase.info/api/server/} we execute:

     ubcli prepareGZIP -cfg pathToDocumentationConfig.json

 * @author pavel.mash
 * @module @unitybase/ubcli/prepareGZIP
 */
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const options = require('@unitybase/base').options
const argv = require('@unitybase/base').argv
const util = require('util')
const gzipFile = require('@unitybase/compressors').gzipFile

module.exports = function prepareGZIP (cfg) {
  if (!cfg) {
    let opts = options.describe('prepareGZIP', 'GZIP `staticFolder` files according to `usePreparedGzip` `staticRules` for specified application', 'ubcli')
      .add({short: 'cfg', long: 'cfg', param: 'localServerConfig', defaultValue: 'ubConfig.json', searchInEnv: false, help: 'Path to server config'})
      .add({short: 'd', long: 'deleteOriginals', defaultValue: false, help: 'Delete source files we compress(not recommended if you have a client what not support compression'})
      .add({short: 'largeWhen', long: 'largeWhen', param: 'size', defaultValue: 3 * 1024, help: 'ompress only files with size > largeWhen bytes'})
    cfg = opts.parseVerbose({}, true)
    if (!cfg) return
  }
  let deleteOriginals = cfg.deleteOriginals
  let largeWhen = cfg.largeWhen

  let config = argv.getServerConfiguration()

  if (!config.httpServer || !config.httpServer.inetPub) {
    console.warn('config.httpServer.inetPub not configured')
    return
  }
  let inetPub = config.httpServer.inetPub
  let headersPostprocessors = config.httpServer.headersPostprocessors

  let gzipRules = _.filter(headersPostprocessors, {usePreparedGzip: true})
  if (!gzipRules.length) {
    console.warn('header post-processors with `usePreparedGzip: true` option not found')
    return
  }

    // create regular expressions file name must be test with
  gzipRules.forEach(function (rule) {
    console.log('Apply rule:', rule.location, 'for files large when', largeWhen, 'bytes')
    rule.re = new RegExp(rule.location)
  })

  let configFileName = argv.getConfigFileName()
  let configPath = path.dirname(configFileName)
  let startFrom = path.isAbsolute(inetPub)
    ? inetPub
    : path.join(configPath, inetPub)
  let endWith = startFrom.charAt(startFrom.length - 1)
  if ((endWith !== '\\') && (endWith !== '/')) {
    startFrom += '/'
  }
  if (!fs.isDir(startFrom)) {
    console.warn('inetPub root "%s" dose not exists', startFrom)
    return
  } else {
    console.debug('Start scanning folder', startFrom)
  }

  let totalSize = 0
  let totalGZSize = 0
  let totalCount = 0
  let totalGZCount = 0

  function gzipFolder (startFromPath) {
    let fullFileName, folderContent, sz

    folderContent = fs.readdirSync(startFromPath)

    folderContent.forEach(function (fileName) {
      fullFileName = startFromPath + fileName
      if (fs.isDir(fullFileName)) {
        gzipFolder(fullFileName + '\\')
      } else {
        ++totalCount; util.print('.')
                // console.debug('Try', fullFileName);
        if (_.some(gzipRules, function (rule) { return rule.re.test(fullFileName) })) { // some of usePreparedGzip rule is applied to this file
          sz = fs.statSync(fullFileName).size; totalSize += sz
          if (sz > largeWhen) { // more when 3kb
            gzipFile(fullFileName, fullFileName + '.gz')
            totalGZSize += fs.statSync(fullFileName + '.gz').size
            ++totalGZCount
            if (deleteOriginals) {
              fs.unlinkSync(fullFileName)
            }
          }
        }
      }
    })
  }

  gzipFolder(startFrom)
  util.print('\n')
  console.log('Compress %d of %d files from %d to %d bytes (%d bytes traffic savings)',
    totalGZCount, totalCount, totalSize, totalGZSize, totalGZSize ? totalGZSize - totalSize : 0
  )
}
