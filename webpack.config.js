var webpack = require('webpack');
var merge = require('webpack-merge');
var path = require('path').join.bind(this,__dirname);
var apps = require('./config/apps');
var alias = require('./config/alias');
var SvgStore = require('webpack-svgstore-plugin');

var plugins = [
  new webpack.optimize.CommonsChunkPlugin('common.js'),
  new webpack.optimize.OccurenceOrderPlugin(),
  new SvgStore({
    svgoOptions: {
      plugins: [{ removeTitle: true }]
    }
  }),
     new webpack.DefinePlugin({
         'process.env': {
             'NODE_ENV': JSON.stringify('production')
          }
    })
];

if (!process.env.CH_ENV || ['tunnel', 'local'].indexOf(process.env.CH_ENV) === -1) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  }));
}

module.exports = merge.apply(this, [{
    entries: ['babel-polyfill'],
    output: {
        path: path('dist/bundles'),
        filename: '[name].js',
        publicPath: 'dist/bundles/'
    },
    plugins: plugins,
    module: {
        /*preLoaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint?{rules:{"no-unused-vars": [0]}}'
        }],*/
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel?presets[]=es2015&presets[]=react&presets[]=stage-0&plugins[]=transform-decorators-legacy&plugins[]=transform-runtime'
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
            test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$|\.ttf(\?v=\d+\.\d+\.\d+)?$|\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader?name=fonts/[name]-[hash].[ext]'
        },{
            test: /\.jpe?g$|\.gif$|\.png$|\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loaders: [
                'url?limit=8192&hash=sha512&digest=hex&name=img/[hash].[ext]',
                'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
        }
      ]
    },
    bail: true
}]
.concat(apps, alias) );
