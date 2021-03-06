/**
 * Created by pavel.mash on 04.09.2016.
 */
const webpack = require('webpack')
const path = require('path')

/**
Set NODE_ENV=production for production build
in windows set NODE_ENV=production && webpack reate a "production " var value
*/
if (process.env.NODE_ENV) process.env.NODE_ENV = process.env.NODE_ENV.trim()
var PRODUCTION = (process.env.NODE_ENV === 'production')

module.exports = {
  entry: {
    app: './adminui.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    //filename: 'adminui.min.js',
    //filename: '[name].[hash].js',
    filename: 'adminui.[name].min.js',
    publicPath: '/clientRequire/@unitybase/adminui-pub/dist/'
  },
  resolve: {
    alias: {
      lodash: require.resolve('lodash')
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: [/node_modules/],
      query: {
        // MPV - IMPORTANT to remove a 'use strict' in boundle, in other case Ext.callParent not work,
        // because in strict mode Fintion.calle in undefined, but this technic in used internalty by Ext.callParent
        presets: ['es2015-without-strict']
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: require.resolve('tinymce/tinymce'),
      use: [
        'imports-loader?this=>window',
        'exports-loader?window.tinymce'
      ]
    }, {
      // this option is required for tinyMCE, see https://github.com/tinymce/tinymce/issues/2836
      test: /tinymce[\\/](themes|plugins)[\\/]/,
      use: [
        'imports-loader?this=>window'
      ]
    }]
  },
  // devtool: 'eval',
  //devtool: 'source-map',
  // devtool: 'cheap-module-source-map',
  devtool: PRODUCTION ? 'cheap-source-map' : 'eval',

  plugins: [
    new webpack.DefinePlugin({
      BOUNDLED_BY_WEBPACK: true
    }),

    new webpack.optimize.CommonsChunkPlugin({
      children: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      'screw-ie8': true,
      sourceMap: !PRODUCTION,
      compress: PRODUCTION
          ? {
            sequences: true,
            booleans: true,
            loops: true,
            unused: false, // true
            warnings: !PRODUCTION, // false,
            drop_console: false, // true,
            unsafe: true
          }
          : false,
      output: {
        ascii_only: true // for TinyMCE
      }
    })
  ]
}
