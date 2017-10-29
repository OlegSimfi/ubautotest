/**
 * Command line module. Generate domain documentation into single HTML file.
 * Command line usage:

       ubcli generateDoc -?

 * @author pavel.mash 04.02.14
 * @module @unitybase/ubcli/generateDoc
 */
const fs = require('fs')
const argv = require('@unitybase/base').argv
const options = require('@unitybase/base').options
const _ = require('lodash')
const http = require('http')
const path = require('path')
const mustache = require('mustache')

module.exports = function generateDoc (cfg) {
  let
    session, conn,
    outputFileName, userLang,
    domainI18n,
    i, j, len, lenj, k, lenk

  console.time('Generate documentation')
  if (!cfg) {
    let opts = options.describe('generateDoc',
      'Generate domain documentation into single HTML file\nDocumentation generated using default language for user, specified in -u',
      'ubcli'
    )
      .add(argv.establishConnectionFromCmdLineAttributes._cmdLineParams)
      .add({
        short: 'out',
        long: 'out',
        param: 'outputFileName',
        defaultValue: './domainDocumentation.html',
        help: 'Output file path'
      })
    cfg = opts.parseVerbose({}, true)
    if (!cfg) return
  }
    // increase receive timeout to 120s - in case DB server is slow we can easy reach 30s timeout
  http.setGlobalConnectionDefaults({receiveTimeout: 120000})
  session = argv.establishConnectionFromCmdLineAttributes(cfg)

    // must be required for translation
  require('@unitybase/ub/i18n')

  console.log('Session.uData: ', session.uData, typeof session.uData)

  userLang = session.uData ? (session.uData.lang || 'en') : 'en'
  conn = session.connection
  outputFileName = cfg.out

  try {
    domainI18n = conn.getDomainInfo().entities

    // add entityCode for each entity in domain
    _.each(domainI18n, function (entity, entityCode) {
      entity.entityCode = entityCode
    })

    domainI18n = _.groupBy(domainI18n, 'modelName')
        // add modelCode for each model in domain
    _.each(domainI18n, function (value, key) {
      value.modelCode = key
      value.entities = []
    })
        // transform domain to array of entity
    let domainAsArray = _.values(domainI18n)

    for (i = 0, len = domainAsArray.length; i < len; ++i) {
      for (j = 0, lenj = domainAsArray[i].length; j < lenj; ++j) {
        domainAsArray[i].entities[j] = domainAsArray[i][j]
        _.each(domainAsArray[i].entities[j].attributes, function (value, key) {
          value.attrCode = key
        })
        domainAsArray[i].entities[j].attributes = _.values(domainAsArray[i].entities[j].attributes)
        for (k = 0, lenk = domainAsArray[i].entities[j].attributes.length; k < lenk; ++k) {
          if (domainAsArray[i].entities[j].attributes[k].associatedEntity === '') {
            domainAsArray[i].entities[j].attributes[k].associatedEntity = null
          }
        }

        _.each(domainAsArray[i][j].mixins, function (value, key) {
          value.mixinCode = key
        })
        domainAsArray[i].entities[j].mixins = _.values(domainAsArray[i].entities[j].mixins)
      }
    }

    let tpl = fs.readFileSync(path.join(__dirname, 'templates', 'generateDoc_template.mustache'))

    let rendered = mustache.render(tpl, {
      domain: domainAsArray,
      i18n: function () {
        return function (word) {
          // console.log('translate for ', word, 'to', userLang);
          return UB.i18n(word, userLang)
        }
      }
    })
    if (!fs.writeFileSync(outputFileName, rendered)) {
      console.error('Write to file ' + outputFileName + ' fail')
    }
    console.timeEnd('Generate documentation')
    console.info('Result file', outputFileName)
  } finally {
    if (session && session.logout) {
      session.logout()
    }
  }
}
