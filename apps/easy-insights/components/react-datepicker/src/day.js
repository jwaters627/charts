import React from 'react';
import moment from 'moment';

export default class Day extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(event) {
    if (this.props.disabled || this.props.hidden) return;
    event.preventDefault();
    this.props.onMouseDown(event);
  }

  handleHover(event){
    if (this.props.disabled || this.props.hidden) return;
    this.props.onMouseOver(event);
  }

  isWeekend() {
    let weekday = this.props.day.moment().weekday();
    return weekday === 5 || weekday === 6;
  }

  render() {
    let classes = [ 'datepicker__day'];
    if ( this.props.disabled && !this.props.hidden )
      classes.push( 'datepicker__day--disabled' );
    if( this.props.hidden) {
      classes.push( 'datepicker__day--hidden');
    }
    if(this.props.selected && !this.props.hidden && !this.props.disabled) {
      classes.push('datepicker__day--selected');
    }
    if(this.props.startDateSelected != null && !this.props.hidden) {
      if ( this.props.day.sameDay( this.props.startDateSelected ) ){
        classes.push( 'datepicker__day--selected-start-date' );
      }
    }
    if ( this.props.day.sameDay(moment()) && !this.props.hidden)
      classes.push( 'datepicker__day--today' );
    if ( this.isWeekend() )
      classes.push( 'datepicker__day--weekend' );

    return (
      <div className={classes.join( ' ' )} onMouseDown={this.handleClick.bind(this)} onMouseOver={this.handleHover.bind(this)}>
        {this.props.day.day()}
      </div>
    );
  }
}
