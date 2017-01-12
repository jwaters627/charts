import React from 'react';
import DateUtil from './util/date';
import Calendar from './calendar';
import DateInput from './date_input';
import moment from 'moment';
import {isEqual} from 'lodash';
import classNames from 'classnames';
import Icon from '../../../../../common/icons';


export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.switchInputFocus = false;
  }

  handleInputClick(dateType) {
    if(!this.props.calendarOpen) {
      this.openCalendar();
    }
    this.props.actions.updateFocus(dateType);
  }

  handleBlur(){
    if (!this.switchInputFocus) {
      this.closeCalendar();
    }else{
      this.switchInputFocus = false;
    }
  }

  openCalendar(){
    this.props.actions.updateCalendarDropdown(true);
  }

  closeCalendar(){
    this.props.actions.updateCalendarDropdown(false);
    this.switchInputFocus = false;
  }

  handleSelect(date) {
    this.props.onChange(date, this.props.focus);
    if (this.props.focus == 'startDate') {
      this.switchInputFocus = true;
      this.props.actions.updateFocus('endDate');
    } else {
      this.closeCalendar();
    }
  }

  handleHover(date) {
    this.props.onHover(date);
  }

  safeDateFormat(date) {
    return !!date ? date.format( this.props.dateFormat ) : null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate === null && nextProps.endDate === null) {
      this.switchInputFocus = false;
    }
  }

  calendar() {
    if ( this.props.calendarOpen) {
      return (
        <Calendar
          focus={this.props.focus}
          weekdays={this.props.weekdays}
          locale={this.props.locale}
          moment={this.props.moment}
          dateFormat={this.props.dateFormatCalendar}
          onHover={this.handleHover.bind(this)}
          onSelect={this.handleSelect.bind(this)}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          hoverDate={this.props.hoverDate}
          excludeDates={this.props.excludeDates}
          weekStart={this.props.weekStart} />
      );
    }
  }

  render() {
    return (
      <div>
        <div className='datepicker__input-container'>
            <Icon name="calendar" className="calendarButton"/>
            <DateInput
              id={'date_input_start'}
              name={this.props.name}
              date={this.safeDateFormat(this.props.startDate)}
              dateType={'startDate'}
              focus={this.props.focus == 'startDate' ? true : false}
              onBlur={this.handleBlur.bind(this)}
              handleClick={this.handleInputClick.bind(this, 'startDate')}
              placeholderText={this.props.placeholderTextStart}
              title={this.props.title}
              safeDateFormat={this.safeDateFormat.bind(this)}
             />
            <DateInput
              id={'date_input_end'}
              name={this.props.name}
              date={this.safeDateFormat(this.props.endDate)}
              dateType={this.props.dateType}
              focus={this.props.focus == 'endDate' ? true : false}
              handleClick={this.handleInputClick.bind(this, 'endDate')}
              onBlur={this.handleBlur.bind(this)}
              placeholderText={this.props.placeholderTextEnd}
              title={this.props.title}
              safeDateFormat={this.safeDateFormat.bind(this)}
             />
        </div>
        <div className='datepicker__container'>
          {this.calendar()}
        </div>
      </div>

    );
  }
}

DatePicker.propTypes = {
  weekdays: React.PropTypes.arrayOf( React.PropTypes.string ),
  locale: React.PropTypes.string,
  dateFormatCalendar: React.PropTypes.string,
  weekStart: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func,
  onFocus: React.PropTypes.func
};

DatePicker.defaultProps = {
  weekdays: [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ],
  locale: 'en',
  dateFormatCalendar: 'MMMM YYYY',
  dateFormat: 'YYYY-MM-DD',
  moment: moment,
  onChange: function() {},
  disabled: false,
  onFocus: function() {}
};
