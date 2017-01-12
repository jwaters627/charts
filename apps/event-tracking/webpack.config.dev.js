
var webpack = require( 'webpack' ),
    path = require( 'path' );

module.exports = {
  entry: {
    "eventTrackingPortal":path.resolve(__dirname, "./entry.js")
  },
  output: {
    path: path.resolve('../../../../war/chs/dist/bundles'),
    filename: '[name].js',
    publicPath: '/chs/dist/bundles/'
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['transform-decorators-legacy']
        }
      },
      {
        test: /\.css$/,
        loader: "style!css"
      }
    ]
  }
};
 