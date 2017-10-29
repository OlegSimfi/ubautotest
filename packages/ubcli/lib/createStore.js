/**
 * Create internal BLOB store structure (folders) for specifies FileSystem store.
 *
 * Must be used on the same computer where UnityBase server installed ( remote server connection is not supported).
 *
 * Usage from a command line:

    ubcli createStore -?

 * Usage from a script:

     const storeCreator = require('@unitybase/ubcli/createStore')
     let options = {
        store: "*"
     };
     storeCreator(options)

 * @author pavel.mash
 * @module @unitybase/ubcli/createStore
 */

const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const cmdLineOpt = require('@unitybase/base').options
const argv = require('@unitybase/base').argv

module.exports = function createStore (options) {
  let
    configFileName,
    configPath,
    config,
    app,
    storeNames,
    selectedStores

  if (!options) {
    let opts = cmdLineOpt.describe('createStore',
          'Create internal store structure (folders) for specifies FileSystem store. Must be used on the same computer where UnityBase server installed',
          'ubcli'
      )
      .add({short: 'cfg', long: 'cfg', param: 'serverConfig', defaultValue: 'ubConfig.json', help: 'Server config'})
      .add({short: 'store', long: 'store', param: 'storesList', defaultValue: '*', help: 'Comma separated blob stores list'})
    options = opts.parseVerbose({}, true)
    if (!options) return
  }
  storeNames = options.store
  configFileName = argv.getConfigFileName()

  if (!configFileName) {
    throw new Error('Invalid server config path')
  }

  config = argv.getServerConfiguration()
  app = config.application

  if (!app.blobStores) {
    throw new Error('No "blobStores" section inside application config')
  }
  if (!Array.isArray(app.blobStores) || !app.blobStores.length) {
    throw new Error('"blobStores" config section must be in 1.11 format - an non-empty ARRAY of named object')
  }

  if (storeNames) {
    storeNames = storeNames.split(',')
    selectedStores = _.filter(app.blobStores, function (store) {
      return (storeNames.indexOf(store.name) !== -1)
    })
    if (!selectedStores.length) {
      throw new Error('No store with names, passed in "-store" cmd line switch found')
    }
  } else {
    selectedStores = app.blobStores
  }

  configPath = path.dirname(configFileName)

  function createOneStore (cStore) {
    let
      cStorePath,
      tmp

    function createSubFolders (startFromPath, level) {
      if (level) {
        for (let i = 100; i < 501; i++) {
          let fld = startFromPath + i.toString(10) + '\\'
          if (!fs.isDir(fld)) {
            fs.mkdirSync(fld)
          }
          if (level - 1) {
            createSubFolders(fld, level - 1)
          } else {
            if (i % Math.pow(10, level + 1) === 0) {
              process.stdout.write('.')
            }
          }
        }
      }
    }
    console.log('Start handle blobStore "%s"', cStore.name)
    if (cStore['storeType'] === 'Virtual' || cStore['storeType'] === 'Database') {
      console.log('\t Skip. For storeType %s there is no need to create folder structure', cStore['storeType'])
    } else {
      if (!cStore['storeType']) {
        cStore['storeType'] = 'FileSystem'
      }
      if (cStore['storeType'] !== 'FileSystem') {
        throw new Error('Unknown storeType', cStore['storeType'])
      }
      cStorePath = path.join(configPath, cStore.path)
      if (!/\\$/.test(cStorePath)) {
        cStorePath += '\\'
      }
      console.log('\t Resolved to path', cStorePath)
      if (!fs.isDir(cStorePath)) {
        console.log('\t Resolved path not exists. Do force directory')
        fs.mkdirSync(cStorePath)
      }
      tmp = cStorePath + '_temp\\'
      if (!fs.isDir(tmp)) {
        console.log('\t Create temp directory %s', tmp)
        fs.mkdirSync(tmp)
      }

      switch (cStore['storeSize']) {
        case 'Simple':
          break
        case 'Medium':
          createSubFolders(cStorePath, 1)
          break
        case 'Large':
          createSubFolders(cStorePath, 2)
          break
        default:
          throw new Error('Unknown store size ' + cStore['storeSize'])
      }
      console.log('Done!')
    }
  }

  selectedStores.forEach(createOneStore)
}
