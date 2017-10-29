const fs = require('fs')
const path = require('path')
const UBCanvas = require('@unitybase/canvas')

if (!process.isServer) {
  // in case we run from console - execute test immediately
  testUBCanvas()
} else {
  // `Autotest` application require and execute this script during multi-thread tests from
  // tst_PDFSign.doTest method
  module.exports = testUBCanvas
}

function testUBCanvas () {
  testUBCanvasFile()
  testUBCanvasMem()
}

function testUBCanvasFile () {
  let canvasWidth = 100
  let canvasHeight = 80
  let canvas = new UBCanvas(canvasWidth, canvasHeight)

  canvas.setFont('Times New Roman', {r: 84, g: 141, b: 212}, 8)
  canvas.drawText(1, 1, 'test ЮТФ8 №22/іїї и перенос слов',
        canvasWidth, canvasHeight, [UBCanvas.TextFormats.WordBreak])
  let imageData = canvas.getContent('bin2base64')
  let fileName = path.join(__dirname, 'fixtures', 'imgBase64.png')
  if (!process.isServer) { fs.writeFileSync(fileName, imageData) }

  imageData = canvas.getContent('bin')
  fileName = path.join(__dirname, 'fixtures', 'img.png')
  if (!process.isServer) { fs.writeFileSync(fileName, imageData) }

  canvas.freeNative()
}

function testUBCanvasMem () {
  let canvasWidth = 500
  let canvasHeight = 80
  let canvas = new UBCanvas(canvasWidth, canvasHeight)

  canvas.setFont('Times New Roman', {r: 84, g: 141, b: 212}, 8)
  canvas.drawText(1, 1, 'Перевірка of signature',
        canvasWidth, canvasHeight, [UBCanvas.TextFormats.WordBreak]
  )
  canvas.getContent('bin')
  canvas.freeNative()
}
