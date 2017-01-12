import React from 'react';
import DateUtil from './util/date';
import Day from './day';
import {some, map} from 'lodash';
import moment from 'moment';
import {ControllerView} from 'ch-flux';

@ControllerView({
  stores  : [
    ['cardstore', state => _.pick(state, ['filters'])]
  ],
  actions : 'easyactions'
})

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.minDate,
      secondDate: this.props.minDate.addMonth(),
      focus: this.props.focus
    }
  }

  componentWillMount() {
    this.initializeMomentLocale();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected === null) { return; }

    // When the selected date changed
    if ( nextProps.selected !== this.props.selected ) {
      this.setState( {
        date: new DateUtil(nextProps.selected).clone()
      });
    }

    if(nextProps.focus !== this.props.focus){
      this.setState({
        focus: nextProps.focus
      });
    }
  }

  initializeMomentLocale() {
    let weekdays = this.props.weekdays.slice( 0 );
    weekdays = weekdays.concat( weekdays.splice( 0, this.props.weekStart ) );

    this.props.moment.locale( this.props.locale, {
      week: {
        dow: this.props.weekStart
      },
      weekdaysMin: weekdays
    } );
  }

  increaseMonth(event) {
    event.preventDefault();
    this.setState( {
      date: this.state.date.addMonth(),
      secondDate: this.state.secondDate.addMonth()
    } );
  }

  decreaseMonth(event) {
    event.preventDefault();
    this.setState( {
      date: this.state.date.subtractMonth(),
      secondDate: this.state.secondDate.subtractMonth()
    } );
  }

  handleClearDates(){
    this.props.actions.updateFilter('cleardates');
  }

  handleDayClick(day) {
    this.props.onSelect(day);
  }

  handleDayHover(day) {
    this.props.onHover(day);
  }

  weeks(currDate) {
    let month = null;
    if(currDate == this.state.date){
      month = this.state.date.mapWeeksInMonth(this.renderWeek.bind(this));
    } else {
      month = this.state.secondDate.mapWeeksInMonth(this.renderWeek.bind(this));
    }
    return month;
  }

  renderWeek(weekStart, key, currDate, currMonth) {
    if(currDate == this.state.date._date){
      if (!weekStart.weekInMonth(this.state.date)){
        return;
      }
    } else if (currDate == this.state.secondDate._date) {
      if(!weekStart.weekInMonth(this.state.secondDate)){
        return;
      }
    }

    return (
      <div key={key}>
        {this.days(weekStart, currDate, currMonth)}
      </div>
    );
  }

  renderDay(day, key, currDate, currMonth) {
    let minDate = this.props.minDate,
        maxDate = this.props.maxDate,
        hoverDate = this.props.hoverDate,
        excludeDates,
        disabled,
        hidden,
        selected = false,
        inRange = false;

    if(this.props.focus == 'endDate' && !!this.props.startDate) {
      minDate = this.props.startDate;
    }

    if ( this.props.excludeDates && Array.isArray( this.props.excludeDates ) ) {
      excludeDates = map( this.props.excludeDates, function( date ) {
        return new DateUtil( date ).safeClone();
      } );
    }

    disabled = day.isBefore( minDate ) || day.isAfter( maxDate ) ||
      some( excludeDates, function( xDay ) { return day.sameDay( xDay ); } );

    hidden = day._date._d.getMonth() != currMonth ? true : false;

    if(this.props.focus == 'endDate' && !!hoverDate && !!this.props.startDate){
      selected = day.sameDay(this.props.startDate) || day.isBefore(hoverDate) ||
                  day.sameDay(hoverDate) ? true : false;
    }

    if(this.props.focus == 'startDate' && !!this.props.startDate && !!hoverDate && !!this.props.endDate){
      selected = day.sameDay(this.props.startDate) || day.isBefore(this.props.endDate) &&
                  day.isAfter(this.props.startDate) ||
                  day.sameDay(hoverDate) ? true : false;
    }

    if(this.props.focus == 'startDate' && this.props.startDate == null && !!hoverDate && !!this.props.endDate){
      selected = day.sameDay(this.props.endDate) ||
                  day.sameDay(hoverDate) ? true : false;
    }

    return (
      <Day
        key={key}
        day={day}
        date={currDate}
        onMouseDown={this.handleDayClick.bind(this, day)}
        onMouseOver={this.handleDayHover.bind(this, day)}
        startDateSelected={this.props.startDate}
        endDateSelected={this.props.endDate}
        inRange={inRange}
        hidden={hidden}
        selected={selected}
        disabled={disabled} />
    );
  }

  days(weekStart, currDate, currMonth) {
    return weekStart.mapDaysInWeek(this.renderDay.bind(this), currMonth);
  }

  header() {
    return this.props.moment.weekdaysMin().map( function( day, key ) {
      return <div className='datepicker__day header-day' key={key}>{day}</div>;
    } );
  }

  render() {
    return (
      <div className='outer__datepicker'>
        <div className='table-header'>
          <p><a onMouseDown={this.handleClearDates.bind(this)}>Clear All</a></p>
        </div>
        <div className='table-content'>
          <div className='side-panel'>
            <a className='datepicker__navigation datepicker__navigation--previous'
                onMouseDown={this.decreaseMonth.bind(this)}>
            </a>
          </div>

          {/* Left Calendar Panel*/}
          <div className='datepicker left'>
            <div className='datepicker__triangle'>
            </div>
            <div className='datepicker__header'>
              <div className='datepicker__month-header'>
                <span className='datepicker__current-month'>
                  {this.state.date.localeFormat( this.props.locale, this.props.dateFormat )}
                </span>
              </div>
              <div>
                {this.header()}
              </div>
            </div>
            <div className='datepicker__month'>
              {this.weeks(this.state.date)}
            </div>
          </div>

          {/* Right Calendar Panel*/}
          <div className='datepicker right hidden-xs'>
            <div className='datepicker__triangle'></div>
            <div className='datepicker__header'>
              <div className='datepicker__month-header'>
                <span className='datepicker__current-month'>
                  {this.state.secondDate.localeFormat( this.props.locale, this.props.dateFormat )}
                </span>

              </div>
              <div>
                {this.header()}
              </div>
            </div>
            <div className='datepicker__month'>
              {this.weeks(this.state.secondDate)}
            </div>
          </div>

          <div className='side-panel right'>
            <a className='datepicker__navigation datepicker__navigation--next'
                onMouseDown={this.increaseMonth.bind(this)}>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  weekdays: React.PropTypes.array.isRequired,
  locale: React.PropTypes.string,
  moment: React.PropTypes.func.isRequired,
  dateFormat: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  minDate: React.PropTypes.object,
  maxDate: React.PropTypes.object,
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,
  excludeDates: React.PropTypes.array,
  weekStart: React.PropTypes.string.isRequired
};

Calendar.defaultProps = {
  weekStart: '1'
};
