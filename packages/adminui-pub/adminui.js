/**
 * Created by pavel.mash on 03.12.2016.
 */

const UB = require('@unitybase/ub-pub')
const Q = require('bluebird-q')
const _ = require('lodash')
const UBDomain = require('@unitybase/base/UBDomain')
const LocalDataStore = require('@unitybase/base/LocalDataStore')

// const ClientRepository = require('./../ClientRepository')
// const UBConnection = require('./../UBConnection')
// const UBNativeMessage = require('./../UBNativeMessage')
// const UBNativeDocEdit = require('./../UBNativeDocEdit')
// const UBNativeDSTUCrypto = require('./../UBNativeDSTUCrypto')
// const UBNativeIITCrypto = require('./../UBNativeIITCrypto')
// const UBNativeScanner = require('./../UBNativeScanner')
// const UBNativePDFSign = require('./../UBNativePDFSign')

/** @global */
window.UB = UB
/** @global */
window._ = _
// window.UB.ClientRepository = core.ClientRepository
window.UB.LocalDataStore = LocalDataStore

// window.UBConnection = UBConnection
window.Q = Q
// window.CryptoJS = CryptoJS
window.UBDomain = UBDomain // used as UBDomain.getPhysicalDataType && UBDomain.ubDataTypes
// window.UBNativeMessage = UBNativeMessage
// window.UBNativeDocEdit = UBNativeDocEdit
// window.UBNativeDSTUCrypto = UBNativeDSTUCrypto
// window.UBNativeIITCrypto = UBNativeIITCrypto
// window.UBNativeScanner = UBNativeScanner
// window.UBNativePDFSign = UBNativePDFSign

if (!Promise.prototype.fin) {
  // noinspection Eslint
  Promise.prototype.fin = function (cb) {
    const res = () => this
    const fin = () => Promise.resolve(cb()).then(res)
    return this.then(fin, fin)
  }
}

if (!Promise.prototype.done) {
  // noinspection Eslint
  Promise.prototype.done = Promise.prototype.then
}

window.JSZip = require('jszip/dist/jszip.js') // for xlsx-pub. require('jszip') dose not work
window.saveAs = require('file-saver/FileSaver.js').saveAs //not work require('file-saver').saveAs
//window.Mustacthe = require('mustache')

// require('./ub-css-all.css') TODO - add icons to this module

Ext.Loader.setConfig({
  enabled: true,
  disableCaching: false,
  paths: {
    // 'Ext.ux': 'models/adminui-pub/_src/ux',
    // 'UB': 'models/adminui-pub/_src/app'
    'Ext.ux': '@unitybase/adminui-pub/_src/ux',
    'UB': '@unitybase/adminui-pub/_src/app'
  }
})

let launcher = require('./_src/app.js')
launcher()

module.exports = {
  UB: UB
}
