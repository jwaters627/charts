'use strict';

import React from 'react';

import Close from 'react-material-icons/icons/navigation/close';
import RadioButton from '../RadioButton/RadioButton'
import StartDatePicker from '../StartDatePicker/StartDatePicker';
import RepeatScheduler from '../RepeatScheduler/RepeatScheduler';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

require('./scheduler.scss');


class Scheduler extends React.Component {


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
            radioOpen: false
        };

        this.handleJustOnceClick = this.handleJustOnceClick.bind(this);
        this.handleRepeatClick = this.handleRepeatClick.bind(this);
    }


    handleJustOnceClick(){
       this.setState({radioOpen: false})
    }

    handleRepeatClick(){
        this.setState({radioOpen: true})
    }





render(){

        let scheduleOpen = (<StartDatePicker finishedSchedulerClick={this.props.finishedSchedulerClick} />)
        let schedule = (<div className="scheduler closed"></div>);
        if(this.state.radioOpen == true){
            scheduleOpen = (
                    <RepeatScheduler finishedSchedulerClick={this.props.finishedSchedulerClick}/>
                )
        }
        if(this.props.scheduler == true){
            schedule = (<div className="scheduler open">
                <div className="headContainer">
                    <div className="headerTextContainer">
                        <h2>Schedule and Email</h2>
                        <p>This report will run using the data and critera you selected.</p>
                    </div>
                    <div id="xOut" className="menu-button" onClick={this.props.schedulerClick}>
                        <span aria-hidden="true"><Close style={{'color': 'white', 'height': '30px', 'width': '30px'}}/></span>
                    </div>
                </div>
                <div className="bodyContainer">
                    <RadioButton handleRepeatClick={this.handleRepeatClick} handleJustOnceClick={this.handleJustOnceClick}/>
                    {scheduleOpen}
                </div>
            </div>)
        }
        return (
            <div>
                {schedule}
            </div>
        );
    }
}


export default Scheduler;