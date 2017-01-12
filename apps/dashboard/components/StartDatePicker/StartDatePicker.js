'use strict';

import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import { Calendar } from 'react-date-range';
import CalendarIcon from 'react-material-icons/icons/action/today';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./startDatePicker.scss');

class StartDatePicker extends React.Component {


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
            dateInput: new Date().toString().slice(4,10) + ', ' + new Date().toString().slice(11,15),
            dateWithDay: new Date().toString().slice(0,10) + ', ' + new Date().toString().slice(11,15)
        };
        this.showCalendar = this.showCalendar.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }



    showCalendar(){
        this.setState({open: !this.state.open})
    }


    handleChange(date){
        let start = date._d.toString().slice(0,10) + ', ' + date._d.toString().slice(11,15)
        this.setState({dateInput: start})
        this.showCalendar()
    }


    submitted(){
        alert("you scheduled a report")
    }


render(){

      let calendar = (<div></div>)

      if(this.state.open == true){
        calendar =  (<div>
                   <Calendar onChange={this.handleChange}
                             style={{'boxShadow': '2px 2px 2px 1px rgba(0,0,0,0.2', 'display': 'inline-block'}} 
                            theme={{
                            MonthAndYear: {background: '#ffffff', color: '#00BCD4', fontWeight: '500'}, 
                            Calendar:{background: '#ffffff'},
                            Weekday:{color: '#00BCD4'},
                            DaySelected:{background: '#00BCD4'},
                            DayHover:{background: '#00BCD4', color: '#ffffffs'},
                            DayActive:{background: '#00BCD4'}
                        }}
                    />
                  </div>)
      }


        return (
            <div className="datePickerContainer">
                 <h3>Start Date</h3>
                 <CalendarIcon style={{'color': '#4C4C4C', 'height': '38px'}} className="calendarIcon"/>
                 <textarea rows={1} readOnly value={this.state.dateInput} className="dateInput" onClick={this.showCalendar}></textarea>
                 {calendar}
                 <h3><span className='bold'>Summary</span></h3>
                 <h3>This report will run <span className='bold'>just once</span> on <span className='bold'>{this.state.dateInput}</span></h3>
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


export default StartDatePicker;