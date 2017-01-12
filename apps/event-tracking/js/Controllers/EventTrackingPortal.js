import React from 'react';

import {Statics, ControllerView} from 'ch-flux';


import EventTable from '../Views/EventTable';
import TrackingEventsModal from '../Views/TrackingEventsModal';

//this is our HOC.
@ControllerView({
  stores: ['tracking-events-stores'],
  actions: ['tracking-events-actions']
})
@Statics({
    contextTypes: {
        flux: React.PropTypes.object.isRequired
    }
})
export default class EventTrackingPortal extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      events: [],
      query: '',
      event:{}
    };
    this.actions = this.context.flux.getActions('tracking-events-actions');
    this.handleQueryChange = this.handleQueryChange.bind( this );
    this.showNewEventModal = this.showNewEventModal.bind( this );
    this.addNewEvent = this.addNewEvent.bind( this );
    this.closeNewEventModal = this.closeNewEventModal.bind( this );
    this.deleteEvent = this.deleteEvent.bind( this );
    this.updateEvent = this.updateEvent.bind( this );
    this.editEvent = this.editEvent.bind( this );
  }

  componentWillMount() {
    this.actions.fetchEvents();
  }

  addNewEvent( newEvent ){
    this.actions.newEvent( newEvent );
  }

  showNewEventModal () {
    this.actions.clearUpdateEventStatus();
    this.setState({
      newEventModal: true,
      event: {}
    });
  }

  closeNewEventModal () {
    this.setState({
      newEventModal: false,
      event: {}
    });
  }

  handleQueryChange( e ) {
    this.setState({
      query: e.target.value
    });
  }

  toggleActive( eventId ){
    this.actions.toggleEventAction( eventId );   
  }

  updateEvent( event ) {
    this.actions.updateEvent( event );
  }

  deleteEvent( eventId ){
    this.actions.deleteEvent( eventId );
  }

  editEvent( event ){
    this.actions.clearUpdateEventStatus();
    this.setState({
      newEventModal: true,
      event: event
    });
  }
  componentWillReceiveProps(nextProps){
    if ( nextProps.updateEventStatus.loading == false && nextProps.updateEventStatus.code == 200 ) {
      //we have succesfully saved or edited a modal.
      if ( !this.state.event.id ) {
        //sucessfull save...reset form
        this.setState({event:{}});
      } 

    }
  }
  render() {
    const query = this.state.query,
          rxp = new RegExp('\\b' + query,"i"),
          events = query.length == 0
                    ? this.props.events
                    : this.props.events.filter( ( evt ) => {
                        return rxp.test(evt.event_label)
                          || rxp.test(evt.event_type)
                          || rxp.test(evt.event_selector);
                        });

    const table = <EventTable
                    onEditEvent={this.editEvent}
                    onDeleteEvent={this.deleteEvent}
                    onToggleEventActive={this.toggleActive}
                    events={events} />;
    const inputGroupStyle = {
      "display": "inline-table",
      "verticalAlign": "middle",
      "position":"relative",
      "borderCollapse":"separate"
    };
    const inputStyle = {
      "display":"table-cell",
      "position":"relative",
      "height": "34px",
      "width": "320px",
      "padding": "6px 12px",
      "marginBottom": 0,
      "zIndex":2,
      "float":"left",
      "fontSize": "14px",
      "lineHeight": "1.42857143",
      "color": "#555",
      "backgroundColor": "#fff",
      "backgroundImage": "none",
      "border": "1px solid #ccc",
      "borderRadius": "4px",
      "borderTopRightRadius": 0,
      "borderBottomRightRadius": 0
    }
    const inputGroupAddonStyle = {
      "display": "table-cell",
      "padding": "6px 12px",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": "1",
      "color": "#555",
      "textAlign": "center",
      "backgroundColor": "#eee",
      "border": "1px solid #ccc",
      "borderRadius": "4px",
      "whiteSpace": "nowrap",
      "verticalAlign": "middle",
      "borderTopLeftRadius": 0,
      "borderBottomLeftRadius": 0,
      "borderLeft": 0
    }
      return ( 
        <div>
          <button className="button primary create-button" onClick={this.showNewEventModal}>Create New Event</button>
          <h1>Manage Tracking Events</h1>
          <div style={ {margin: '12px 15px 12px 0px',float: 'right'} }>
            <div style={ inputGroupStyle }>
              <input style={inputStyle} placeholder="Filter Events by Label, Type or Selector" value={this.state.query}
            onChange={this.handleQueryChange} />
              <span style={inputGroupAddonStyle}><i className="fa fa-search"></i></span>
            </div>
          </div>
          {table}
          <TrackingEventsModal
            isOpen={this.state.newEventModal}
            addNewEvent={this.addNewEvent}
            updateEvent={this.updateEvent}
            closeNewEventModal={this.closeNewEventModal}
            event={this.state.event}
            updateEventStatus={this.props.updateEventStatus}
            clearUpdateEventStatus={this.actions.clearUpdateEventStatus}/>
        </div>
    );
  }

}