'use strict';

import React from 'react';

import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Chip from 'material-ui/Chip';
import Checkbox from 'material-ui/Checkbox';
import MonitorSearch from '../MonitorSearch/MonitorSearch'
import DropDown from 'react-material-icons/icons/navigation/arrow-drop-down';
import { SketchPicker } from 'react-color';
import classNames from 'classnames';

require('./addMonitors.scss');

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
            showColor: false,
            chosenChip: ''
          };
          this.colorDropDownClick = this.colorDropDownClick.bind(this);
          this.setList = this.setList.bind(this);
          this.styles = {
      chip: {
        margin: 4,
        display: 'inline-flex'
        
      },
      wrapper: {
        display: 'flex',
        flexFlow: 'row wrap',
        flexWrap: 'wrap',
        float: 'left',
        
      },
    };
    }

    colorDropDownClick(e, data){
        this.setState({showColor: !this.state.showColor})
        this.props.setChosenMonitor(data.id)
    }

    setMonitorChips(data){
        let colorPicker = (<div></div>)
        if(this.state.showColor && data.id === this.props.chosenMonitor){
            colorPicker = (<div style={{'position': 'fixed', 'zIndex': '1000000'}}><SketchPicker color={data.color} style={{'position': 'fixed', 'marginTop': '36px'}} onChangeComplete={this.props.setChipColor}/></div>)
        }
        return(<div id="chipContainer"><Chip
            backgroundColor= {data.color}
            labelColor= {'white'}
            key= {data.id}
            id={data.name}
            style= {this.styles.chip}
            >
            <DropDown onClick={ ( e ) => { this.colorDropDownClick( e, data ) }} style={{'display': 'inline-flex', 'verticalAlign': 'middle', 'color': '#ffffff', 'cursor': 'pointer', 'marginLeft': '-8px', 'marginRight': '8px'}}/>
            
            {data.name}
          </Chip>
          {colorPicker}
        </div>
        )
    }

    setList(item){
            return(
                <div>
                    <Checkbox id={item.id} onClick={this.props.handleCheckMonitorClick} checked={item.checked} iconStyle={{'color': '#ffffff'}} style={{'display': 'inline-block', 'color': '#ffffff', 'float': 'left', 'width': '34px', 'marginRight': '12px', 'marginLeft': '26px'}} />
                    <p className='listedMonitor'>{item.name}</p>
                </div>
                )
    }
       



render(){
    let myClass = classNames(
            'recentlyUsed',
                {
                    'open' : this.props.addedMonitors.length > 0
                }
            );
    let addedMonitors = (<p id='addMonitorText' onClick={this.props.handleAddMonitorClick}>+ Add Monitors</p>);
    if(this.props.addedMonitors.length > 0 || this.props.usedMonitors.length > 0){
        
        addedMonitors = (
            <div>
                {this.props.addedMonitors.map(this.setMonitorChips, this)}
                <p className={myClass}>Recently Used</p>
                <div className="listContainer">
                    {this.props.usedMonitors.map(this.setList)}
                </div>
                 <p id='addMonitorTextWithChips' onClick={this.props.handleAddMonitorClick}>+ Add Monitors</p>
            </div>
        );
    }
        
        return(
            <div className="addMonitorContainer">
                {addedMonitors}
            </div>
            )
    }
}



export default AddChart;