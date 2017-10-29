/**
 * Created by pavel.mash on 04.09.2016.
 */
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    app: './index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'xlsx-all.min.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015']
      }
    }, { 
      test: /\.css$/, 
      loader: "style-loader!css-loader" 
      //loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' 
    }]
  },
  //devtool: 'eval',
  //devtool: 'source-map',
  devtool: 'cheap-module-source-map',

  plugins: [
        // new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'q-lodash-crypto.min.js'),
    /*new webpack.optimize.CommonsChunkPlugin({
	  name: 'vendor', filename: 'q-lodash-crypto.min.js',
	  minChunks: function (module) {
      		return isExternal(module)
    	  }
  	}),*/

    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
     'screw-ie8': true,
      // compress: false
      compress: {
        sequences: true,
        booleans: true,
        loops: true,
        unused: false, // true
        warnings: true, // false,
        drop_console: false, // true,
        unsafe: true
      }
    })
  ]
}
