var path = require('path');

var config = {
  entry: { 'error-app': ['babel-polyfill', path.resolve(__dirname, './main.js')]},
};

module.exports = config;
