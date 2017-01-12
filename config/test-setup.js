var jsdom = require('jsdom').jsdom;
var sinon = require('sinon');
var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

global.document = jsdom({
  html : '<!doctype html><html><body></body></html>',
  url  : 'http://crimsonhexagon.com'
});
global.window = document.defaultView;
global.navigator = global.window.navigator;
/*
jsdom.env({
  html : '<!doctype html><html><body></body></html>',
  url  : 'http://crimsonhexagon.com',
  done : function () {
    console.log('jsdom created');
  }
});*/
