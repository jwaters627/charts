'use strict';

import React from 'react';
import classNames from 'classNames';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { DateRange } from 'react-date-range';
import Schedule from 'react-material-icons/icons/action/today';
require('./dateRange.scss');




class DateRangePicker extends React.Component {


     static childContextTypes =
    {
        muiTheme: React.PropTypes.object
    }

    getChildContext()
    {
        return {
            muiTheme: getMuiTheme()
        }
    }



    constructor(props) {
        super(props);
        this.state = {
                   open: false,
                   openCalendar: false,
                   startDate: 'Start Date',
                   endDate: 'End Date',
        };
        this.handleChange = this.handleChange.bind(this);
        this.showCalendar = this.showCalendar.bind(this);
    }


     handleChange(range){
        if(this.state.checked){
             this.setState({checked: !this.state.checked})
        }
        let start = range.startDate._d.toString().slice(0,10) + ', ' + range.startDate._d.toString().slice(11,15)
        let end = range.endDate._d.toString().slice(0,10) + ', ' + range.endDate._d.toString().slice(11,15)
        this.setState({startDate: start})
        this.setState({endDate: end}) 
        if(start != end){
          this.showCalendar()
        }
    }

    showCalendar(){
        this.setState({openCalendar: !this.state.openCalendar})
    }


render(){
    let showClass = classNames(
        'dateRangeContainer',
        {
            "greyed": this.props.selectedChartType || this.props.selectedChartType === 0,
        }
        );

        let dateRange = (<div></div>)
        if(this.state.openCalendar && (this.props.selectedViz || this.props.selectedViz === 0)){
            dateRange = (
                <div className='calendarComponentContainer'>
                    <DateRange 
                        linkedCalendars={true} 
                        onChange={this.handleChange} 
                        style={{'boxShadow': '2px 2px 2px 1px rgba(0,0,0,0.2', 'zIndex': '100000', 'display': 'inline-block', 'marginTop': '16px'}} 
                        theme={{
                            MonthAndYear: {background: '#ffffff', color: '#00BCD4', fontWeight: '500'}, 
                            Calendar:{background: '#ffffff'},
                            Weekday:{color: '#00BCD4'},
                            DaySelected:{background: '#00BCD4'},
                            DayHover:{background: '#00BCD4', color: '#ffffff'},
                            DayActive:{background: '#00BCD4'}
                        }}
                    />
                </div>
                )
        }
        return(
            <div className={showClass}>
                <div className='dateContainer' onClick={this.showCalendar} >
                   <Schedule style={{'display': 'inline-block', 'color': '#ffffff', 'verticalAlign': 'middle'}}/>
                   <p className='dateRangeLabel' >Date Range</p>
                   {dateRange}
                </div>
            </div>
            )
    }
}



export default DateRangePicker;