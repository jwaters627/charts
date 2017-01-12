var nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  devtool: 'cheap-module-source-map',
  output: {
    // sourcemap support for IntelliJ/Webstorm
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  module: {
      loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel?presets[]=airbnb&presets[]=es2015&presets[]=react&presets[]=stage-0&plugins[]=transform-decorators-legacy&plugins[]=transform-runtime'
      },{
        test: /\.css$/,
        loader: "style!css"
      },{
          test: /\.scss$/,
          loader: 'style!css!sass'
      },{
          test: /\.json$/,
          loader: 'json-loader'
      },{
        test: /\.woff$|\.ttf$|\.eot$/,
        loader: 'null-loader'
      },{
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
        loader: 'null-loader'
      }
    ]
  }
};
