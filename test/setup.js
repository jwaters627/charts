import {jsdom} from 'jsdom'

global.teamID = 1;
global.userID = 282627006;
global.document = jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView
global.navigator = global.window.navigator