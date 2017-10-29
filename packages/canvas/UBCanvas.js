/**
 * Canvas (draw text/pictures on PNG)
 *
 *        const UBCanvas = require('@unitybase/canvas')
 *        let canvasWidth = 1200
 *        let canvasHeight = 300
 *        let canvas = new UBCanvas(canvasWidth, canvasHeight)
 *
 *        canvas.setFont('Times New Roman', {r: 0, g: 0, b: 0}, 22, [UBCanvas.FontStyles.Bold])
 *        canvas.drawText(0, 0, 'Text on the center', canvasWidth - 950, canvasHeight,
 *           [UBCanvas.TextFormats.Center, UBCanvas.TextFormats.WordBreak]
 *        )
 *        canvas.setFont('Times New Roman', {r: 255, g: 0, b: 0}, 18)
 *        canvas.drawText(300, 0, 'Text on the left, canvasWidth, canvasHeight,
 *           [UBCanvas.TextFormats.Left, UBCanvas.TextFormats.WordBreak]
 *        )
 *        let base64Content = canvas.getContent('bin2base64'); // PNG image encoded as base64
 *
 * @module @unitybase/canvas
 */
const dllName = 'UBCanvas.dll'
const archPath = process.arch === 'x32' ? './bin/x32' : './bin/x64'
const path = require('path')
const moduleName = path.join(__dirname, archPath, dllName)
const binding = require(moduleName)
module.exports = UBCanvas

/**
 * Create new Canvas and fill it by provided color.
 * @param {Number} width
 * @param {Number} height
 * @param {Number|Object} [fillColor=0] Either a result of UBCanvas#createColor or object {r: Number, g: number, b: Number}
 * @constructor
 */
function UBCanvas (width, height, fillColor) {
  // noinspection JSUnresolvedFunction
  this._nativeCanvas = new binding.TubCanvas()
  this.createNew(width, height, fillColor)
}

function createByteMask (byteArray) {
  let result = 0
  if (byteArray && byteArray.length) {
    byteArray.forEach(function (byteVal) {
      result = result | 1 << byteVal
    })
  }
  return result
}

/**
 * Possible font style for setFont
 * @type {{Bold: number, Italic: number, Underline: number, StrikeOut: number}}
 */
UBCanvas.FontStyles = binding.TFontStyle
/**
 * Possible text drawing options for drawText
 * @type {{Bottom: number, CalcRect: number, Center: number, EditControl: number, EndEllipsis: number, PathEllipsis: number, ExpandTabs: number, ExternalLeading: number, Left: number, ModifyString: number, NoClip: number, NoPrefix: number, Right: number, RtlReading: number, SingleLine: number, Top: number, VerticalCenter: number, WordBreak: number, HidePrefix: number, NoFullWidthCharBreak: number, PrefixOnly: number, TabStop: number, WordEllipsis: number, Composited: number}}
 */
UBCanvas.TextFormats = binding.TTextFormats
/**
 * Class method. Create an RGB color to use in setFont
 * @memberOf UBCanvas
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 */
UBCanvas.createColor = function (r, g, b) {
  return 0 | (+r) | (+g << 8) | (+b << 16)
}

UBCanvas.imageTypes = {
  BMP: 0,
  PNG: 1,
  JPEG: 2,
  GIF: 3
}

UBCanvas.prototype = {
  /**
   * Set Canvas width and height in pixels & fill it by provided color.
   * In case color is 0 or omitted, fill with white.
   *
   * It is mandatory to call createNew before any other Canvas operation.
   *
   * @param {Number} width
   * @param {Number} height
   * @param {Number|Object} [fillColor=0] Either a result of UBCanvas#createColor or object {r: Number, g: number, b: Number}
   */
  createNew: function (width, height, fillColor = 0) {
    let color
    if (typeof fillColor === 'number') {
      color = fillColor || 0
    } else {
      color = UBCanvas.createColor(fillColor['r'], fillColor['g'], fillColor['b'])
    }
    return this._nativeCanvas.createNew(width, height, color)
  },

  /**
   * Set a font for future UBCanvas#drawText operations
   * @param {String} fontName Name of font as it displayed in the OS
   * @param {Number|Object} fontColor Either a result of UBCanvas#createColor or object {r: Number, g: number, b: Number}
   * @param {Number} fontSize Font size in punkts
   * @param {Array<{UBCanvas.FontStyle}>} [fontStyles] Default is []
   */
  setFont: function (fontName, fontColor = 0, fontSize, fontStyles) {
    let color
    if (typeof fontColor === 'number') {
      color = fontColor || 0
    } else {
      color = UBCanvas.createColor(fontColor['r'], fontColor['g'], fontColor['b'])
    }
    let style = createByteMask(fontStyles)
    return this._nativeCanvas.setFont(fontName, color, fontSize, style)
  },

  /**
   * Draw a text on the Canvas using previously defined Font
   * @param {Number} x
   * @param {Number} y
   * @param {String} text
   * @param {Number} clipWidth
   * @param {Number} clipHeight
   * @param {Array<{UBCanvas.TextFormat}>} [drawOptions]
   * return {{width: Number, height: Number}} text rectangle
   */
  drawText: function (x, y, text, clipWidth, clipHeight, drawOptions) {
    const opt = createByteMask(drawOptions)
    return this._nativeCanvas.drawText(x, y, text, clipWidth, clipHeight, opt)
  },

  /**
   *
   * @param {String} text
   * @return {{width: Number, height: Number}}
   */
  measureText: function (text) {
    return this._nativeCanvas.measureText(text)
  },

  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {ArrayBuffer} image
   * @param {Number} [width=0] 0 - image width or calculated proportionally
   * @param {Number} [height=0] 0 - image height or calculated proportionally
   * @param {Number} [imageType=UBCanvas.imageTypes.PNG]  UBCanvas.imageTypes (0 - BMP, 1 - PNG, 2 - JPEG, 3 - GIF)
   */
  drawImage: function (x, y, image, width, height, imageType) {
    return this._nativeCanvas.drawImage(x, y, width || 0, height || 0, image, imageType || 1)
  },

  /**
   * Save Canvas content to file in PNG format
   * @param {String} fileName
   */
  saveToFile: function (fileName) {
    return this._nativeCanvas.saveToFile(fileName)
  },

  /**
   * Get Canvas content. See {@link UBReader#read}
   */
  getContent: function (encoding) {
    return this._nativeCanvas.getContent(encoding)
  },

  /**
   * Release all internal resources.
   * Do not use this object after call to freeNative!
   */
  freeNative: function () {
    this._nativeCanvas.freeNative()
    this._nativeCanvas = null
  }
}
