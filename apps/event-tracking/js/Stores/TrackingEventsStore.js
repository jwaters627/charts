'use strict';
import {ActionObserver} from 'ch-flux';
import TrackingEventService from '../ApiLayer/TrackingEventsAPI';
import _ from 'lodash';
@ActionObserver
class TrackingEventStore {
  constructor() {
    this.state = {
      events: [],
      loading: false,
      updateEventStatus: {
        response: '',
        code: null,
        loading: false
      }
    };
  }
  init( actions ) {
    this.dataLayer = new TrackingEventService();
    this.actions = actions;
    this.observe([
      [ actions.fetchEvents, this.fetchEvents ],
      [ actions.fetchEventsFail, this.fetchEventsFail ],
      [ actions.fetchEventsSuccess, this.fetchEventsSuccess ],

      [ actions.newEvent, this.newEvent ],
      [ actions.newEventSuccess, this.newEventSuccess ],
      [ actions.newEventFail, this.newEventFail ],

      [ actions.updateEventFail, this.updateEventFail ],
      [ actions.updateEvent, this.updateEvent ],
      [ actions.updateEventSuccess, this.updateEventSuccess ],

      [ actions.deleteEvent, this.deleteEvent ],
      [ actions.deleteEventSuccess, this.deleteEventSuccess ],
      [ actions.deleteEventFail, this.deleteEventFail ],

      [ actions.toggleEventActive, this.toggleEventActive ],
      [ actions.toggleEventActiveFail, this.toggleEventActiveFail ],
      [ actions.toggleEventActiveSuccess, this.toggleEventActiveSuccess ],

      [ actions.clearUpdateEventStatus, this.clearUpdateEventStatus ]
      ]);
  }
  getState () {
    return this.state;
  }
  setState( newState ){
    this.state = _.assign({}, this.state, newState );
    this.emitChange();
  }
  handleError ( response ) {
    
    if ( typeof response != "undefined" ){
      this.setState({
        updateEventStatus: {
          loading: false,
          code: response.statusCode,
          response: response.statusText
        } 
      }); 
    } else {
      this.setState({
        updateEventStatus: {
          loading: false,
          code: -1,
          response: "Unable to communicate with server."
        }
      });
    }
    
  }
  fetchEvents () {
    this.setState( { loading: true } );
    this.dataLayer.getEvents(
      this.actions.fetchEventsSuccess,
      this.actions.fetchEventsFail
    );
  }
  fetchEventsSuccess ( data ) {
    this.setState({ events: data.payload, loading: false });
  }
  fetchEventsFail ( data ) {

  }
  newEvent( data ){
    this.setState( {
      updateEventStatus: {
        loading: true,
        code:0,
        response:""
      }
    });
    this.dataLayer.newEvent( data.payload,
      this.actions.newEventSuccess,
      this.actions.newEventFail
    );
  }
  newEventSuccess( data ) {
    
    this.setState( {
      updateEventStatus: {
        response: 'Success!',
        code: 200,
        loading: false
      }
    });
    this.actions.fetchEvents();
  }

  newEventFail( data ) {
    
    this.handleError( data.payload.response );
  }
  updateEvent( data ){
    const event = data.payload;
    this.setState({
      updateEventStatus: {
        response:'',
        code: 0,
        loading: true
      }
    });
    this.dataLayer.saveEvent( event,
      this.actions.updateEventSuccess,
      this.actions.updateEventFail
    );
  }
  updateEventSuccess( data ){

    this.setState({
      updateEventStatus: {
        code: 200,
        response: "Saved!",
        loading: false
      }
    });

    this.actions.fetchEvents();
  }
  updateEventFail( data ){
    this.handleError( data.payload.response );
  }
  clearUpdateEventStatus(){
    this.setState({
      updateEventStatus: {
        loading: false,
        code: 0,
        response: ''
      }
    });
  }
  deleteEvent( data ){
    const eventId = data.payload;

    this.setState( { loading: true } );
    this.dataLayer.deleteEvent( eventId,
      this.actions.deleteEventSuccess,
      this.actions.deleteEventFail
    );
  }
  deleteEventSuccess( data ) {
    this.setState( { loading: false } );
    this.actions.fetchEvents();
    
  }
  deleteEventFail( data ) {
    this.setState( { loading: false } );
  }
  getEventById ( id ) {
    return _.find( this.state.events, event => event.id === id );
  }
  getEventIndexById ( id ) {
    return _.findIndex( this.state.events, event => event.id === id );
  }
  toggleEventActive( data ){
    let eventId = data.payload,
        _event = _.assign( {}, this.getEventById( eventId ) );

    _event.active = !_event.active;

    this.dataLayer.saveEvent( _event,
      this.actions.toggleEventActiveSuccess,
      this.actions.toggleEventActiveFail
    );

  }
  toggleEventActiveSuccess(){

  }
  toggleEventActiveFail(){

  }

}

export default TrackingEventStore;