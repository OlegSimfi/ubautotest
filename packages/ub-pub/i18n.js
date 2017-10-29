/**
 * Created by pavel.mash on 01.12.2016.
 */

const _ = require('lodash')

const __i18n = {
  monkeyRequestsDetected: 'Your request has been processed, but we found that it is repeated several times. Maybe you key fuse?'
}

/**
 * Return locale-specific resource from it identifier.
 * localeString must be previously defined dy call to {i18nExtend}
 * @param {String} localeString
 * @returns {*}
 */
function i18n (localeString) {
  return __i18n[localeString] || localeString
}

/**
 * Merge localizationObject to UB.i18n. Usually called form modelPublic/locale/lang-*.js scripts
 * @param {Object} localizationObject
 */
function i18nExtend (localizationObject) {
  _.merge(__i18n, localizationObject)
}

module.exports = {
  i18n,
  i18nExtend
}
