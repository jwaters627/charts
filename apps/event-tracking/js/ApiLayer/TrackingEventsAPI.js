import {chFetch} from 'ch-ui-lib';

export default class TrackingEventService {
  
  constructor() {
    this.baseUrl = "/ch/eventtracking";
  }

  getEvents( success, fail ) {
    chFetch.get( this.baseUrl + "?noCache=true" )
      .then( res => {
        if ( res.status == 200 && res.body ) {
          success( res.body );
        }
      })
      .catch( res => fail( res ) );
  }
  
  getEvent( id, success, fail ) {}
  
  newEvent ( event, success, fail ) {
    chFetch.post( this.baseUrl, event )
      .then( res => {
        if ( res.status == 200 && res.body ) {
          success( res.body );
        }
      })
      .catch( res => fail( res ) );
  }
  
  saveEvent( event, success, fail ) {
    chFetch.put( this.baseUrl + '/' + event.id, event )
      .then( res => {
        if ( res.status == 200 && res.body ) {
          success( res.body );
        }
      })
      .catch( res => fail( res ) );
  }
  
  deleteEvent( id, success, fail ) {
    chFetch.delete( this.baseUrl + '/' + id )
      .then( res => {
        if ( res.status == 200 ) {
          success( id );
        }
      })
      .catch( res => fail( res ) );
  }
  
}