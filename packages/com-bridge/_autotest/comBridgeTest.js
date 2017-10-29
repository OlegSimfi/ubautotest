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

let doc = word.Documents.Open(fullTestFilePath)

doc.ExportAsFixedFormat({
  ExportFormat: wdExportFormatPDF,
  OutputFileName: fullPDFFilePath
})
doc.close({SaveChanges: false})
doc = null
word.Quit()
word = null

if (!fs.existsSync(fullPDFFilePath)) throw new Error('Word -> PDF convertation fail')
