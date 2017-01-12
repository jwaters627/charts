//external reqs
import React from 'react';
import ReactDOM from 'react-dom';


//internal reqs
import {App, Flux} from 'ch-flux';
import EventTrackingPortal from './js/Controllers/EventTrackingPortal';

import TrackingEventsActions from './js/Actions/TrackingEventsActions';
import TrackingEventsStore from './js/Stores/TrackingEventsStore';

//for more context: https://www.npmjs.com/package/react-tap-event-plugin
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

if ( module.hot )
  module.hot.accept();
 
const appFlux = new Flux();

appFlux.createActions( 'tracking-events-actions', TrackingEventsActions );
const actions = appFlux.getActions('tracking-events-actions');

appFlux.createStore( TrackingEventsStore, 'tracking-events-stores' ).init( actions );
const AppContext = App({ flux:appFlux });


ReactDOM.render( <AppContext><EventTrackingPortal /></AppContext>, document.getElementById( 'app' ) );