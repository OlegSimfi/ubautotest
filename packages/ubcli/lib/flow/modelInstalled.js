/**
 * Model postinstall script - to be used in the package.json postinstall for a modules what actually a UB model.
 * Will configure a `ubConfig.json` application settings by adding currently installed model to the
 * @author pavel.mash on 07.11.2016.
 */
const path = require('path')
const fs = require('fs')
const argv = require('@unitybase/base').argv
const _ = require('lodash')

// package.json contains a config: {ubmodel: ...}} section
const modelName = process.env.npm_package_config_ubmodel
// model contains only public (web) part
const publicOnly = process.env.npm_package_config_ubmodelispublic
// if (!modelName) return;
const packageName = process.env.npm_package_name
const packageNameParts = packageName.split('/')
// console.log('packageNameParts', packageNameParts)

// process.cwd() is actually a package folder.
let cfgPath = process.cwd()
for (let k = 0; k < packageNameParts.length + 1; k++) {  // +1 for node_modules folder
  cfgPath = path.join(cfgPath, '..')
}
cfgPath = path.join(cfgPath, 'ubConfig.json')
if (fs.existsSync(cfgPath)) {
  let cfg = argv.safeParseJSONfile(cfgPath)
  if (!cfg.application) {
    cfg.application = {}
  }
  if (!cfg.application.domain.models) {
    cfg.application.domain.models = []
  }
  let currentModels = cfg.application.domain.models
  if (!_.find(currentModels, {name: modelName})) {
    let modelCfg
    if (publicOnly) {
      modelCfg = {
        name: modelName,
        publicPath: './node_modules/' + process.env.npm_package_name,
        path: '_public_only_'
      }
    } else {
      modelCfg = {
        name: modelName,
        path: './node_modules/' + process.env.npm_package_name
      }
    }
    currentModels.push(modelCfg)
    fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, '\t'))
    console.info(`Model "${modelName}" is added to application domain`)
  } else {
    console.info(`Model "${modelName}" is already added to application domain - check model path manually`)
  }
} else {
  console.warn('ubConfig.json not found on', cfgPath)
  console.warn(`To use a installed model in your application add the model "${modelName}" to the config application.domain.models collection manually`)
}
