/**
 * gzip / gunzip / bunzip support
 *
 * Usage sample:
 *
 *      var compressors = require('@unitybase/compressors');
 *      compressors.unBzipM2
 *
 * @module @unitybase/compressors
 */

const dllName = 'UBCompressors.dll'
const archPath = process.arch === 'x32' ? './bin/x32' : './bin/x64'
const path = require('path')
const moduleName = path.join(__dirname, archPath, dllName)
const binding = require(moduleName)
let UBCompressors = module.exports

/**
 * Decompress files from Megapolis2(TM) bzip format(first 4 bytes are length of uncompressed files)
 * @method unBzipM2
 * @param {ArrayBuffer} buffer
 * @return ArrayBuffer
 */
UBCompressors.unBzipM2 = binding.unBzipM2

/**
 * Compress file using gzip algorithm
 * @method gzipFile
 * @param {String} fileNameFrom
 * @param {String} fileNameTo
 */
UBCompressors.gzipFile = binding.gzipFile

/**
 * Decompress file using gzip algorithm
 * @method gunzipFile
 * @param {String} fileNameFrom
 * @param {String} fileNameTo
 */
UBCompressors.gunzipFile = binding.gunzipFile
