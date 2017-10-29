/**
 * Create service scripts containing entity definition for code insight in WebStorm or other IDE work well.
 *
 * Usage from a command line:

     ubcli createCodeInsightHelper -u admin -p admin -m UBS -cfg myConfig.json

 * Usage from a code:

     const createCodeInsightHelper = require('@unitybase/ubcli/createCodeInsightHelper')
     var options = {
          host: "http://localhost:888",
          user: "admin",
          pwd:  "admin",
          model: 'UBS'
     }
     createCodeInsightHelper(options)

 * @author pavel.mash
 * @module @unitybase/ubcli/createCodeInsightHelper
 */
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const mustache = require('mustache')
const options = require('@unitybase/base').options
const argv = require('@unitybase/base').argv

module.exports = function createCodeInsightHelper (cfg) {
  if (!cfg) {
    let opts = options.describe('createCodeInsightHelper',
      'create service scripts containing entity definition for code insight in WebStorm or other IDE work well',
      'ubcli'
    ).add(
      argv.establishConnectionFromCmdLineAttributes._cmdLineParams
    ).add({
      short: 'm',
      long: 'model',
      param: 'model',
      defaultValue: '*',
      help: 'Model name to generate helpers for. If not specified then all domain models is used'
    })
    cfg = opts.parseVerbose({}, true)
    if (!cfg) return
  }

  let configFileName = argv.getConfigFileName()
  let config = argv.getServerConfiguration()
  let configPath = path.dirname(configFileName)
  let domain = config.application.domain

  let models = domain.models
  if (!_.isArray(models)) {
    throw new Error('Domain.models configuration MUST be an array on object')
  }
  let filterByModel = cfg.model
  if (filterByModel) {
    console.log('Will generate a helpers for model', filterByModel)
    models = _.filter(models, function (modelCfg) {
      return modelCfg.name === filterByModel
    })
  }

  /**
   * Convert named collection - {name1: {}, name2: {}} to array -> [{name: name1, ...}, ...]
   * Will mutate original!
   * @param namedCollection
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

  const ub2JS = {
    Unknown: '*',
    String: 'String',
    Int: 'Number',
    BigInt: 'Number',
    Float: 'Number',
    Currency: 'Number',
    Boolean: 'Boolean',
    DateTime: 'Date',
    Text: 'String',
    ID: 'Number',
    Entity: 'Number',
    Document: 'String',
    Many: 'String',
    TimeLog: 'Number',
    Enum: 'String',
    BLOB: 'ArrayBuffer',
    Date: 'Date'
  }

  let tpl = fs.readFileSync(path.join(__dirname, 'templates', 'codeInsightHelper.mustache'))

  function processEntities (entities, folderName, modelName) {
    let res, resFileName

    if (entities.length) {
      res = mustache.render(tpl, {
        entities: entities,
        getJSType: function () {
          return '{' + (ub2JS[this.dataType] || '*') + '}'
        },
        getDefaultValue: function () {
          var res = ''
          if (this.allowNull) {
            res = 'null'
          } else {
            switch (ub2JS[this.dataType]) {
              case 'String':
                res = "''"
                break
              case 'Number':
                res = '0'
                break
              case 'Date':
                res = 'new Date()'
                break
              default:
                res = 'undefined'
            }
          }
          return res
        },
        getAccessLevel: function () {
          return (this.defaultView === false) ? 'not viewable by default' : undefined
        }
      })
      if (res) {
        resFileName = path.join(folderName, '_' + modelName + '_entities.js')
        console.log('Generate %s', resFileName)
        fs.writeFileSync(resFileName, res)
      }
    }
  }

  // function processFolder (folderName, modelName) {
  //   let files = fs.readdirSync(folderName)
  //   let entities = []
  //
  //   function validateAndParse (fileName) {
  //     let arr = /^([^_].+)\.meta$/.exec(fileName)
  //     let meta
  //
  //     if (arr && arr[1]) {
  //       try {
  //         meta = argv.safeParseJSONfile(path.join(folderName, fileName), true) // JSON.parse(content);
  //         if (!_.isArray(meta.attributes)) {
  //                       // convert attributes to array of object
  //           meta.attributes = namedCollection2Array(meta.attributes)
  //         }
  //         entities.push({name: arr[1], meta: meta})
  //       } catch (e) {
  //         console.error('Invalid JSON file ' + folderName + '\\' + fileName + ' \n' + e.toString())
  //       }
  //     } else if (/^[^_].+\\$/.test(fileName)) { // this is folder
  //       let nameOfSubModel = modelName + '_' + fileName.split('\\')[0] // remove last \ from fileName
  //       processFolder(path.join(folderName, fileName), nameOfSubModel)
  //     }
  //   }
  //   files.forEach(validateAndParse)
  //   processEntities(entities, folderName, modelName)
  // }

  mustache.parse(tpl)

  let session = argv.establishConnectionFromCmdLineAttributes(cfg)
  let realDomain = session.connection.getDomainInfo()
  let entities = []

  models.forEach(function processModel (modelCfg) {
    let currentPath = path.join(configPath, modelCfg.path)
    entities = []

    _.forEach(realDomain.entities, function (entityDef, entityName) {
      if (entityDef.modelName === modelCfg.name) {
        entityDef.attributes = namedCollection2Array(entityDef.attributes)
        entities.push({name: entityName, meta: entityDef})
      }
    })
    processEntities(entities, currentPath, modelCfg.name)
  })
}
