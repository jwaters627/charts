var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack           = require('webpack');
var merge             = require('webpack-merge');
var path              = require('path');
var fs                = require('fs');
var alias             = require('../../config/alias');

var config = merge({
  devServer: {
      historyApiFallback: true,
      proxy: {
          '/ch/*': {
              target: 'http://54.175.165.253:8080',
              //target : 'https://ei-m1-qa.crimsonhexagon.com:8080',
              secure: true,
          },
          '/chs/*': {
              target: 'http://54.175.165.253:8080',
              //target: 'https://ei-m1-qa.crimsonhexagon.com:8080',
              secure: true,
          },
      },
  },
  entry: ['babel-polyfill', 'webpack/hot/dev-server', path.resolve(__dirname, './app.js')],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  eslint: {
    reporter: require("eslint-friendly-formatter"),
    // reporter: require("eslint/lib/formatters/stylish")
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: [
        'babel?cacheDirectory=true&presets[]=es2015&presets[]=react&presets[]=stage-0&presets[]=react-hmre&plugins[]=transform-decorators-legacy'
        // add 'eslint' if you want
      ],
      exclude: /node_modules/
    }, {
      test: /\.scss$|\.css$/,
      loader: 'style!css!sass'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.woff$|\.ttf$|\.eot$/,
      loader: 'file-loader?name=fonts/[name].[ext]'
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
      loaders: [
        'url?limit=8192&hash=sha512&digest=hex&name=[hash].[ext]',
        'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: 'true'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      inject: 'body' // Inject all scripts into the body
    })
  ],
  debug : true,
  devtool: 'eval-source-map'
  //devtool: 'eval'
}, alias);

module.exports = config;
