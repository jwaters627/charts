'use strict';

import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./monitorList.scss');

class AddChart extends React.Component {


     static childContextTypes =
    {
        muiTheme: React.PropTypes.object
    }

    getChildContext()
    {
        return {
            muiTheme: getMuiTheme({
                palette:{
                   
                }
            })
        }
    }



    constructor(props) {
        super(props);
        this.state = {
            value: '',
          };
        this.handleChange = this.handleChange.bind(this);
        this.setList = this.setList.bind(this);
    }



    setList(item){
        let currentValue = this.state.value
        for(var i=0; i < this.props.monitors.length; i++){
            if(item.name.toLowerCase().includes(currentValue.toLowerCase())){
        return(
                <div>
                    <p className='listedMonitor'>{item.name}</p>
                     <Checkbox id={item.id} onClick={this.props.handleCheckMonitorClick} checked={item.checked} style={{'display': 'inline-block', 'color': '#bbbbbb', 'float': 'right', 'width': '34px'}} />
                </div>
            )
         }
        }
    }

    handleChange(event){
        this.setState({value: event.target.value})
    }


render(){
        
        return(
            <div className="monitorListContainer">
                <TextField hintText="Search Monitor" style={{'width': '91%', 'marginLeft': '10px', 'marginBottom': '12px'}} hintStyle={{'color': '#bbbbbb'}} inputStyle={{'color': '#ffffff'}} value={this.state.value} onChange={this.handleChange} />
                <div className="listContainer">
                    {this.props.monitors.map(this.setList)}
                </div>
            </div>
            )
    }
}



export default AddChart;