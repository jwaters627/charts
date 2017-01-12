'use strict';

import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import Close from 'react-material-icons/icons/navigation/close';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./radioButton.scss');

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
            
        };
    }


render(){
        return (
            <div>
                <RadioButtonGroup name="frequency" defaultSelected="not_light" style={{'display': 'inline-block', 'marginTop': '20px', 'marginLeft': '100px', 'width': '400px'}}>
                      <RadioButton
                        value="not_light"
                        label="Just Once"
                        style={{'display': 'inline-block', 'width': '150px'}}
                        iconStyle={{'color': '#009494'}}
                        onClick={this.props.handleJustOnceClick}
                      />
                      <RadioButton
                        value="light"
                        label="Repeat"
                        style={{'display': 'inline-block', 'width': '150px'}}
                        iconStyle={{'color': '#009494'}}
                        onClick={this.props.handleRepeatClick}
                      />
                      
                </RadioButtonGroup>
            </div>
        );
    }
}


export default Scheduler;