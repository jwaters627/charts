import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import classnames from 'classnames';

import style from './modal.css';

export default class TrackingEventModal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newEventLabel: '',
      newEventType: '',
      newEventSelector: '',
      newEventActive: true,
      labelError: '',
      typeError: '',
      selectorError: '',
      statusMessage: '',
      statusTitle: '',
      statusActiveFlag: false
    };
    this.newEventTypeChange = this.newEventTypeChange.bind( this );
    this.newEventSelectorChange = this.newEventSelectorChange.bind( this );
    this.newEventLabelChange = this.newEventLabelChange.bind( this );
    this.onFormSubmit = this.onFormSubmit.bind( this );
    this.onKeyDown = this.onKeyDown.bind( this );
    this.onAfterOpen = this.onAfterOpen.bind( this );
    this.newEventActiveChange = this.newEventActiveChange.bind( this );
    this.clearNotification = this.clearNotification.bind( this );
  }
  newEventTypeChange (e) {
    let inputValue = e.target.value;
    this.setState({'newEventType':inputValue});
    if ( inputValue.trim().length )
      this.setState({typeError:""});
  }
  newEventSelectorChange (e) {
    let inputValue = e.target.value;
    this.setState({'newEventSelector':inputValue});
    if ( inputValue.trim().length )
      this.setState({selectorError:""});
  }
  newEventLabelChange (e) {
    let inputValue = e.target.value;
    this.setState({'newEventLabel':inputValue});
    if ( inputValue.trim().length )
      this.setState({labelError:""});
  }
  newEventActiveChange (e) {
    let inputValue = e.target.checked;
    this.setState({'newEventActive':inputValue});
  }
  onAfterOpen(){
    //reset validation error labels
    this.setState({
      labelError:'',
      typeError:'',
      selectorError:''
    });
    //if we were passed an event, pre-populate fields.
    //otherwise, reset form.
    if ( this.props.event.id ) {
      this.setState({
        newEventLabel: this.props.event.event_label,
        newEventType: this.props.event.event_type,
        newEventSelector: this.props.event.event_selector,
        newEventActive: this.props.event.active
      });
    } else {
      this.setState({
        newEventLabel: '',
        newEventType: '',
        newEventSelector: '',
        newEventActive: true
      });
    }
    //set focus to top input
    
    ReactDOM.findDOMNode( this.refs.labelInput ).focus();
  }
  onFormSubmit ( e ) {
    let valid = true,
        event_label = this.state.newEventLabel.trim(),
        event_selector = this.state.newEventSelector.trim(),
        event_type = this.state.newEventType.trim(),
        event_active = this.state.newEventActive;

    if ( e ) {
      e.preventDefault();
    }
    
    //reset validation labels
    this.setState({
      labelError:'',
      selectorError:'',
      typeError:''
    });
    
    if ( !event_label.length ) {
      valid = false;
      this.setState({
        labelError: "• Required"
      });
    }
    if ( !event_type.length ) {
      valid = false;
      this.setState({
        typeError: "• Required"
      });
    }
    if ( !event_selector.length ) {
      valid = false;
      this.setState({
        selectorError: "• Required"
      });
    }

    if ( valid ) {
      if ( this.props.event.hasOwnProperty( 'id' ) ){
        this.props.updateEvent({
          id: this.props.event.id,
          event_label,
          event_type,
          event_selector,
          active: event_active
        });

      } else {
        this.props.addNewEvent({
          event_label,
          event_type,
          event_selector,
          active: event_active
        });
      }
   }

    ReactDOM.findDOMNode( this.refs.labelInput ).focus();
  }
  onKeyDown(event){
    if ( event.keyCode == 13 ) {
      this.onFormSubmit();
    } else if ( event.keyCode == 27 ) {
      this.props.closeNewEventModal();
    }
  }  
  componentWillReceiveProps ( nextProps ) {

    let statusTitle = "", statusMessage = "", statusActiveFlag = false, loading = false;
    if ( this.props.updateEventStatus.loading && !nextProps.updateEventStatus.loading ) {
      //our call finished.  check newProps and set appropriate status fields.
        if ( nextProps.updateEventStatus.code == 200 ) {
          statusTitle = "Success";
          statusMessage = "Event Saved."
        } else {
          statusTitle = "Error";
          statusMessage = "Unable to save";
        }
        statusActiveFlag = true;
        if ( !this.props.event.hasOwnProperty('id') ) {
          //if this was the "add" modal
          //clear fields and focus top input
          this.setState({
            newEventLabel: "",
            newEventSelector: "",
            newEventType: "",
            newEventActive: true
          });
          if ( this.props.isOpen ) 
            this.refs.labelInput.focus();
        }
    }
    this.setState({
        statusTitle:statusTitle,
        statusMessage:statusMessage,
        statusActiveFlag:statusActiveFlag
    });
    if ( statusActiveFlag ) 
      setTimeout( this.clearNotification.bind( this ), 2500 );
  }
  clearNotification () {
    this.setState({
      statusActiveFlag: false
    });
  }
  render () {
    let {isOpen, addNewEvent, closeNewEventModal, event, updateEventStatus} = this.props,
        {labelError, typeError, selectorError, statusTitle, statusMessage, statusActiveFlag } = this.state,
        labelClass = classnames({"form-group":true, "has-error":labelError.length}),
        selectorClass = classnames({"form-group":true, "has-error":selectorError.length}),
        typeClass = classnames({"form-group":true, "has-error":typeError.length}),
        saveButton = updateEventStatus.loading
                      ? <button className="button secondary save" disabled><i className="fa fa-spin fa-spinner"></i></button>
                      : <button className="button secondary save" onClick={this.onFormSubmit}>{event.id ? 'Save Changes' : 'Save'}</button>;
        
    const modalStyleOverrides = {
      content: {
        zIndex: 6,
        top: "20%",
        left: "20%",
        right: "20%",
        bottom: "20%",
        height: "270px"
      },
      overlay: {
        zIndex: 5,
        backgroundColor: "rgba( 225, 225, 225, 0.8 )"
      }
    }
    return (
      <Modal
        isOpen={isOpen}
        onAfterOpen={this.onAfterOpen}
        onRequestClose={closeNewEventModal}
        style={ modalStyleOverrides } >
          <div className="modal-header">
            <button className="button secondary close"onClick={closeNewEventModal}><span aria-hidden="true">&times;</span></button>
            <h1 className="modal-title">{event.id ? "Edit Event: " + event.id.toString() : "Add New Event"}</h1>
          </div>
          <div className="modal-body">
            <form className="form" onSubmit={this.onFormSubmit}>
              <div className={labelClass}>
                <label>Event Label: </label>
                <input 
                  ref="labelInput"
                  className="form-control"
                  type="text"
                  placeholder="e.g. 'Survey Complete'"
                  onChange={this.newEventLabelChange}
                  onKeyDown={this.onKeyDown}
                  value={this.state.newEventLabel}/>
                  <span className="help-block">{labelError}</span>
              </div>
              <div className={typeClass}>
                <label>Event Type: </label>
                <input 
                  className="form-control"
                  type="text"
                  placeholder="e.g. 'click' or 'mousedown'"
                  onChange={this.newEventTypeChange}
                  onKeyDown={this.onKeyDown}
                  value={this.state.newEventType}/>
                  <span className="help-block">{typeError}</span>
              </div>
              <div className={selectorClass}>
                <label>Event Selector: </label>
                <input 
                  className="form-control"
                  type="text"
                  placeholder="e.g. 'button#buttonID' or 'a.anchorClass', etc."
                  onChange={this.newEventSelectorChange}
                  onKeyDown={this.onKeyDown}
                  value={this.state.newEventSelector}/>
                  <span className="help-block">{selectorError}</span>
              </div>
              <div className="form-group">
                <label><input 
                        type="checkbox"
                        checked={this.state.newEventActive}
                        onChange={this.newEventActiveChange}
                      /> Active?
                </label>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            {saveButton}
            <span className="modal-status">{statusActiveFlag ? statusMessage : ''}</span>
          </div>
        </Modal>
      );
    }
  };