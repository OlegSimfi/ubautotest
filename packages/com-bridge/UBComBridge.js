/**
 * Module for working with COM objects
 *
 * Usage sample:
 *
       const wdExportFormatPDF = 17 // PDF
       const COM = require('@unitybase/com-bridge')
       const path = require('path')
       const fullTestFilePath = path.join(__dirname, 'test-doc.docx')
       const fullPDFFilePath = path.join(__dirname, 'test-doc.pdf')

       const fs = require('fs')

       if (fs.existsSync(fullPDFFilePath)) fs.unlinkSync(fullPDFFilePath)

       let word = COM.createCOMObject('Word.Application')
       word.DisplayAlerts = 0
       word.CheckLanguage = false
       word.Options.CheckSpellingAsYouType = false

       // pass a unnamed parameter
       let doc = word.Documents.Open(fullTestFilePath)

       // pass a named parameters
       doc.ExportAsFixedFormat({
         ExportFormat: wdExportFormatPDF,
         OutputFileName: fullPDFFilePath
       })
       doc.close({SaveChanges: false})
       doc = null
       word.Quit()
       word = null
 *
 * @module @unitybase/com-bridge
 */

const dllName = 'UBComBridge.dll'
const archPath = process.arch === 'x32' ? './bin/x32' : './bin/x64'
const path = require('path')
const moduleName = path.join(__dirname, archPath, dllName)
const binding = require(moduleName)
/**
 * Create JavaScript wrapper around a COM/OLE object. COM must implement IDispatch interface.
 *
 * Returning object has the same properties and methods as in original COM object.
 *
 * Names of methods and properties are **case-insensitive**. If COM object has get-properties with parameters
 * they implemented as a functions in JS-object.
 *
 * Method can take unnamed parameters(normal usage), you must use the correct order of the parameters,
 * or named parameters(in this case functioin take a {Object} with keys = parameter name and values is a parameter values)
 *
 * @param {String} objectName
 * @return {Object}
 */
module.exports.createCOMObject = binding.createCOMObject
