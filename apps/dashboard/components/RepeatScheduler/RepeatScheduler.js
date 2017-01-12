'use strict';

import React from 'react';

import Choice from '../Choice/Choice';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { DateRange } from 'react-date-range';
import Calendar from 'react-material-icons/icons/action/today';


injectTapEventPlugin();

require('./repeatScheduler.scss');

class RepeatScheduler extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            open: false,
            startDate: 'Start Date',
            endDate: 'End Date',
            checked: false,
            frequency: 'Weekly',
            frequencyOptions: [{id: 0, text: "Daily", selected: false, key: 1}, {id: 1, text: "Weekly", selected: true, key: 2}, {id: 2, text: "Monthly", selected: false, key: 3},{id: 3, text: "Quarterly", selected: false, key: 4},{id: 4, text: "Yearly", selected: false, key: 5}],
            dayOptions: [{id: 0, text: "Sun", selected: false, key: 1}, {id: 1, text: "Mon", selected: false, key: 2}, {id: 2, text: "Tues", selected: false, key: 3},{id: 3, text: "Wed", selected: true, key: 4},{id: 4, text: "Thurs", selected: false, key: 5},{id: 5, text: "Fri", selected: false, key: 6},{id: 6, text: "Sat", selected: false, key: 7}]
        
        };
        this.showCalendar = this.showCalendar.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectFrequencyClick = this.handleSelectFrequencyClick.bind(this);
        this.handleSelectDayClick = this.handleSelectDayClick.bind(this);
        this.indefiniteClick = this.indefiniteClick.bind(this);
    }



    showCalendar(){
        this.setState({open: !this.state.open})
    }

    submitted(){
        alert("you scheduled a report")
    }

    handleSelectFrequencyClick(event){
        for(var i = 0; i < this.state.frequencyOptions.length; i++){
            if(i == event.target.id){
                this.state.frequencyOptions[i].selected = true
                this.setState({frequency: this.state.frequencyOptions[i].text})
            }
            else{this.state.frequencyOptions[i].selected = false}
        }
        this.setState({frequencyOptions: this.state.frequencyOptions})
    }

       handleSelectDayClick(event){
        for(var i = 0; i < this.state.dayOptions.length; i++){
            if(i == event.target.id){
                this.state.dayOptions[i].selected = true
            }
            else{this.state.dayOptions[i].selected = false}
        }
        this.setState({dayOptions: this.state.dayOptions})
    }

    handleChange(range){
        if(this.state.checked){
             this.setState({checked: !this.state.checked})
        }
        let start = range.startDate._d.toString().slice(0,10) + ', ' + range.startDate._d.toString().slice(11,15)
        let end = range.endDate._d.toString().slice(0,10) + ', ' + range.endDate._d.toString().slice(11,15)
        console.log(end)
        console.log(start)
        this.setState({startDate: start})
        this.setState({endDate: end}) 
        if(start != end){
          this.showCalendar()
        }
    }

    indefiniteClick(){
        this.setState({checked: !this.state.checked})
        this.setState({open: false})
        if(this.state.checked){
            this.setState({endDate: 'End Date'})
        }
        else{ this.setState({endDate: 'Indefinite'})}
    }


render(){

        let dateRange = (<div></div>)
        if(this.state.open){
            dateRange = (
                <div>
                    <DateRange 
                        linkedCalendars={true} 
                        onChange={this.handleChange} 
                        style={{'boxShadow': '2px 2px 2px 1px rgba(0,0,0,0.2', 'display': 'inline-block'}} 
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

        let frequency = (<div></div>)
        if(this.state.frequencyOptions[1].selected){
            frequency = (
                    <div>
                     <h3><span className="bold">Day of the week</span></h3>
                     <Choice options={this.state.dayOptions} handleSelectClick={this.handleSelectDayClick} />
                    </div>
                )
        }

        return (
                <div className="datePickerContainer">
                     <h3><span className="bold">Frequency</span></h3>
                     <Choice options={this.state.frequencyOptions} handleSelectClick={this.handleSelectFrequencyClick}/>
                     {frequency}
                     <h3><span className="bold">Start and end date</span></h3>
                     <div className="dateSelectionContainer">
                         <Calendar style={{'color': '#4C4C4C', 'height': '38px'}} className="calendarIcon"/>
                         <div className='selectedDate' onClick={this.showCalendar} >
                             <p>{this.state.startDate}</p>
                             <p className='greyed'>to</p>
                             <p>{this.state.endDate}</p>
                         </div>
                         <Checkbox style={{'display': 'inline-block', 'width': '110px', 'top': '8px', 'marginLeft': '14px'}} label="Indefinite" onClick={this.indefiniteClick} checked={this.state.checked} />
                         {dateRange}
                        
                     </div>
                     <h3><span className='bold'>Summary</span></h3>
                     <h3>This report will run <span className='bold'>{this.state.frequency}</span> starting on <span className='bold'>{this.state.startDate}</span> until <span className='bold'>{this.state.endDate}</span></h3>
                     <hr />
                     <h3><span className='bold'>Share report</span> <span className="greyed">(optional)</span></h3>
                     <textarea rows={1} placeholder="email" className="emailInput"></textarea>
                     <h3><span className='bold'>Export Format</span></h3>
                     <div className="checkboxContainer">
                         <Checkbox style={{'display': 'inline-block', 'width': '110px', 'marginBottom': '20px', 'marginTop': '20px'}}label="PDF" />
                         <Checkbox style={{'display': 'inline-block', 'width': '110px', 'marginBottom': '20px', 'marginTop': '20px'}} label="XSL" />
                         <Checkbox label="Send a copy to myself" />
                    </div>
                    <h2 className="submitButton" onClick={this.props.finishedSchedulerClick}>SCHEDULE REPORT</h2>
                </div>
        );
    }
} 


export default RepeatScheduler;