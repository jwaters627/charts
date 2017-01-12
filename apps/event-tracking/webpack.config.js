var path = require('path');

var config = {
  entry: {
    eventTrackingPortal: [
      'babel-polyfill',
      path.resolve(__dirname, './entry.js')
    ]
  }
};

module.exports = config;
