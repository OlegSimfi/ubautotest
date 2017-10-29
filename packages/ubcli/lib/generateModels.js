/*
 * Created by xmax on 16.09.2016.
 */
const fs = require('fs')
const http = require('http')
const path = require('path')
const {options, argv} = require('@unitybase/base').options

module.exports = function generateModels (cfg) {
  let session
  let conn
  let modelsDir = path.join(__dirname, '..', '..', 'node_modules')
  let fileEntityName

  console.log('generate Models')
  if (!cfg) {
    let opts = options.describe('generateModels', 'Generate models from database', 'ubcli')
      .add(argv.establishConnectionFromCmdLineAttributes._cmdLineParams)
      .add({short: 'tdb', long: 'targetDB', param: 'targetDB', defaultValue: '*', help: 'Database name as it defined in ubConfig.json'})
      .add({short: 'ftr', long: 'tableFilter', param: 'tableFilter', defaultValue: '%', help: 'Filter for tables'})
      .add({short: 'mn', long: 'modelName', param: 'modelName', defaultValue: 'newModel', help: 'New model name'})
    cfg = opts.parseVerbose({}, true)
    if (!cfg) return
  }

    // increase receive timeout to 120s - in case DB server is slow we can easy reach 30s timeout
  http.setGlobalConnectionDefaults({receiveTimeout: 120000})

  let autorun = cfg.autorun

  fileEntityName = createCommandEntity(modelsDir, cfg)
  try {
    session = argv.establishConnectionFromCmdLineAttributes(cfg)
    conn = session.connection
    try {
      if (autorun) {
        if (!session.__serverStartedByMe) {
          console.error('-autorun parameter can be used only for a server started locally. Generation stopped')
          return
        }
      }
      doGenerateModels(modelsDir, conn, cfg)
    } finally {
      if (session && session.logout) {
        session.logout()
      }
    }
  } finally {
    fs.unlinkSync(fileEntityName)
  }
}

function doGenerateModels (modelsDir, conn, options) {
  let result
  let entity
  let cModelPath = path.join(modelsDir, options.modelName)

  result = conn.post('generateModel', options)
  if (!fs.statSync(cModelPath)) {
    fs.mkdirSync(cModelPath)
  }
  result = JSON.parse(result)
  Object.keys(result).forEach(function (element, index) {
    entity = JSON.stringify(result[element], null, '\t')
    fs.writeFileSync(cModelPath + '\\' + element + '.meta', entity, {encoding: 'UTF-8'})
  })
}

function createCommandEntity (modelsDir, options) {
  'use strict'
  var modelCmd,
    entityName = 'ub_CommandEntity',
    fileName

  modelCmd = {
    'caption': entityName,
    'description': entityName,
    'connectionName': options.targetDB,
    'sqlAlias': entityName,
    'descriptionAttribute': 'ID',
    'cacheType': 'None',
    'attributes': {
    },
    'mixins': {
      'mStorage': {
        'simpleAudit': true,
        'safeDelete': false
      }
    },
    'options': {}
  }
  fileName = modelsDir + '\\ub_model_ub\\' + entityName + '.meta'

  fs.writeFileSync(fileName, JSON.stringify(modelCmd, null, '\t'), {encoding: 'UTF-8'})
    // console.log(fileName);
  return fileName
}
