/**
 * Fill domain entities by it initial values: enumerate all (or specified in -m switch) models `_initialData` folders  and execute all `*.js` from there.
 *
 * Requirements:
 *
 *  - database must exist - see {@link module:@unitybase/ubcli/initDB initDB}
 *  - all tables must exist - see {@link module:@unitybase/ubcli/generateDDL generateDDL}
 *
 * Usage:

      ubcli initialize -?

 * @author pavel.mash
 * @module @unitybase/ubcli/initialize
*/
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const {options, argv} = require('@unitybase/base')

module.exports = function initialize (cfg) {
  let session

  if (!cfg) {
    let opts = options
      .describe('initialize', 'Fill domain entities by it initial values using scripts from models `_initialData` folders', 'ubcli')
      .add(argv.establishConnectionFromCmdLineAttributes._cmdLineParams)
      .add({short: 'm', long: 'model', param: 'modelName', defaultValue: '*', help: 'Name of model to initialize'})
    cfg = opts.parseVerbose({}, true)
    if (!cfg) return
  }
  if (cfg.model === '*') cfg.model = ''

  session = argv.establishConnectionFromCmdLineAttributes(cfg)

  try {
    let oneModel = cfg.model

    let configFileName = argv.getConfigFileName()
    let configDir = path.dirname(configFileName)
    let config = argv.getServerConfiguration()
    let appConfig = config.application
    let domainConfig = appConfig.domain

    console.info('Scan models `_initialData` folders for initialization scripts')
    if (!_.isArray(domainConfig['models'])) {
      throw new Error('Domain.models configuration MUST be an array on object')
    }
    _.forEach(domainConfig['models'], function (modelConfig) {
      let folderName = path.join(configDir, modelConfig.path, '_initialData')

      if ((!oneModel || (modelConfig.name === oneModel)) && fs.isDir(folderName)) {
        let files = fs.readdirSync(folderName)
        files = _.filter(files, function (item) { return /\.js$/.test(item) }).sort()
        if (files.length) {
          files.forEach(function (file) {
            requireAndRun(folderName, modelConfig.name, file)
          })
        }
        // check localization
        let localeFolderName = path.join(folderName, 'locale')
        if (fs.isDir(localeFolderName)) {
          let allLocalefiles = fs.readdirSync(localeFolderName)
          _.forEach(session.appInfo.supportedLanguages, function (lang) {
            let langFileRe = new RegExp(lang + '\\^.*\\.js$')
            files = _.filter(allLocalefiles, (item) => langFileRe.test(item)).sort()
            if (files.length) {
              files.forEach((file) => requireAndRun(localeFolderName, modelConfig.name, file))
            }
          })
        }
      }
    })
  } finally {
    if (session && session.logout) {
      session.logout()
    }
  }

  function requireAndRun (folderName, modelName, file) {
    if (file.charAt(0) !== '_') {
      let filler = require(path.join(folderName, file))
      if (typeof filler === 'function') {
        console.info('\tmodel:', modelName, 'file:', file)
        filler(session)
      } else {
        console.warn('File', folderName + file, 'not export function')
      }
    } else {
      console.info('File', folderName + file, 'ignored because it name start from "_"')
    }
  }
}
