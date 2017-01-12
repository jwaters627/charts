import React from 'react';
import classnames from 'classnames';
import DatePicker from '../react-datepicker/src/datepicker';
import DateUtil from '../react-datepicker/src/util/date';
import moment from 'moment';
import {ControllerView} from 'ch-flux';
import {isEqual} from 'lodash';
import T from '../../i18n';

require('../react-datepicker/src/stylesheets/datepicker.scss');
const dateFormat = 'YYYY-MM-DD';
const quickDates = ['Past:', '1h', '24h', '1w', '2w'];

@ControllerView({
  stores  : [['cardstore',
  state => {
    return {
      'filters': state.filters,
      'calendarOpen': state.calendarOpen,
      'hoverDate': state.hoverDate,
      'currentFocus': state.currentFocus,
      'firstDayInclusive': state.firstDayInclusive,
      'lastDayInclusive': state.lastDayInclusive
    }
  }]],
  actions : 'easyactions'
})
export default class DateFilter extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      startDate: !!props.filters.startDate ? new DateUtil().safeClone(moment(props.filters.startDate)) : null,
      endDate: !!props.filters.endDate ? new DateUtil().safeClone(moment(props.filters.endDate)) : null,
      hoverDate: null,
      currentFocus: null,
      quickDateSelected: !!props.filters.quickDate ? quickDates.indexOf(props.filters.quickDate) : null
    };
    this.maxDate = !!props.lastDayInclusive ? new DateUtil().safeClone(moment(props.lastDayInclusive)) : moment();
    this.minDate = !!props.firstDayInclusive ? new DateUtil().safeClone(moment(props.firstDayInclusive)) : moment().subtract(14, 'days');
  }

  componentWillReceiveProps(nextState) {
    let newStartDate = nextState.filters.startDate;
    let newEndDate = nextState.filters.endDate;
    let newHoverDate = nextState.hoverDate;
    let newFocus = nextState.currentFocus;
    let newQuickDate = nextState.filters.quickDate;
    if(newEndDate == null && newStartDate == null) {
      this.setState({
        startDate: newStartDate,
        endDate: newEndDate
      });
    }
    if(newEndDate != null ||
      newStartDate != null ||
      newQuickDate == null){
      this.setState({
        quickDateSelected : null
      });
    }

    if (newHoverDate != this.state.hoverDate) {
      this.setState({
        hoverDate: newHoverDate
      });
    }
    if (newFocus != this.state.currentFocus){
      this.setState({
        currentFocus: newFocus
      });
    }
  }

  handleHover(date) {
    this.props.actions.updateHoverDate({
      hoverDate: date
    });
  }

  handleChange(date, type) {
    if(date.sameDay(this.maxDate) && type == 'startDate'){
      this.props.actions.updateFilter({type: 'startDate', value: date.format(dateFormat)});
      this.props.actions.updateFilter({type: 'endDate', value: date.format(dateFormat)});
      this.props.actions.updateFocus('');
      this.setState({
        startDate: date,
        endDate: date
      });
    } else {
      this.props.actions.updateFilter({type: type, value: date.format(dateFormat)});
      if(type == 'startDate'){
        this.props.actions.updateFocus('endDate');
        this.setState({
          startDate: date
        });
      } else {
        this.setState({
          endDate: date
        });
      }
    }
  }

  handleButtonSelected(event) {
    let newValue = null;
    if(this.state.quickDateSelected == null ||
      this.state.quickDateSelected != quickDates.indexOf(event.target.innerText)) {
      let currSelected = 1;
      quickDates.map((value, index)=> {
        if(value == event.target.innerText) {
           currSelected = (this.state.quickDateSelected == index) ? null : index;
        }
      });

      this.setState({
        quickDateSelected : currSelected
      });

      newValue = event.target.innerText;

    } else {
      this.setState({
        quickDateSelected: null
      });
      newValue = null;
    }

    this.props.actions.updateFilter({
      type : 'quickDate',
      value : newValue
    });
  }

  renderQuickFilters() {
    return quickDates.map((date, index)=> {
      let buttonClass = classnames({
        'selected' : this.state.quickDateSelected == index,
        'quick-filter' : true,
        'first' : index == 0,
        'last' : index == 4,
        'quick-date' : index != 0 && index != 4
      });
      return <button className={buttonClass}
        key={'button' + index}
        onClick={index != 0 && this.handleButtonSelected.bind(this)}>
         {date}
       </button>
    });
  }

  render() {
    return (
      <div className="date_filter__container">
        <DatePicker
          placeholderTextStart={T('filters.date.startDate')}
          placeholderTextEnd={T('filters.date.endDate')}
          focus={this.state.currentFocus}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          hoverDate={this.state.hoverDate}
          calendarOpen={this.props.calendarOpen}
          onChange={this.handleChange.bind(this)}
          onHover={this.handleHover.bind(this)}
          minDate={this.minDate}
          actions={this.props.actions}
          maxDate={this.maxDate} />
        {this.renderQuickFilters()}
      </div>
    );
  }
}
