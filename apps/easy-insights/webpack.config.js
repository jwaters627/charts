var path = require('path');

var config = {
  entry: { easyinsights: ['babel-polyfill', 'blueimp-canvas-to-blob', path.resolve(__dirname, './app.js')]},
};

module.exports = config;
