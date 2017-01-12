'use strict';

import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Search from 'react-material-icons/icons/action/search';
import DropDown from 'react-material-icons/icons/navigation/expand-more';
import DropUp from 'react-material-icons/icons/navigation/expand-less';
import Clock from 'react-material-icons/icons/action/restore';
import { SketchPicker } from 'react-color';
import {List, ListItem} from 'material-ui/List';
import LabelOutline from 'react-material-icons/icons/action/label-outline';
import Restore from 'react-material-icons/icons/action/restore';

require('./monitorSearch.scss');



const muiTheme = getMuiTheme({
    palette: {
        'textColor': 'white'
    },
});


class AddChart extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            value: '',
            showColor: false,
            
          };
        this.handleChange = this.handleChange.bind(this);
        this.setList = this.setList.bind(this);
        this.colorDropDownClick = this.colorDropDownClick.bind(this);
    }

    colorDropDownClick(e, item){
        this.setState({showColor: !this.state.showColor})
        this.props.setChosenMonitor(item.id)
    }


    setList(item){
        let colorPicker = (<div></div>)
        if(this.state.showColor && item.id === this.props.chosenMonitor){
            colorPicker = (<div style={{'position': 'fixed', 'zIndex': '1000000'}}><SketchPicker color={item.color} style={{'position': 'fixed', 'marginTop': '36px'}} onChangeComplete={this.props.setChipColor}/></div>)
        }
        let currentValue = this.state.value
        let fillColor = '#ffffff';
        let colorPick = <div></div>
        if(item.checked){fillColor = '#00BCD4'; colorPick = <div onClick={ ( e ) => { this.colorDropDownClick( e, item ) }} className='colorBox' style={{backgroundColor: item.color}}></div>}
        for(var i=0; i < this.props.monitors.length; i++){
            if(item.name.toLowerCase().includes(currentValue.toLowerCase())){
        return(
                <div className='monitorContainer'>
                    <Checkbox id={item.id} onClick={this.props.handleCheckMonitorClick} checked={item.checked} iconStyle={{'fill': fillColor}} style={{'display': 'inline-block', 'color': '#ffffff', 'float': 'left', 'width': '34px', 'marginRight': '12px'}} />
                    <p className='listedMonitor'>{item.name}</p>
                    {colorPick}
                    {colorPicker}
                </div>
            )
         }
        }
    }

    setTagList(){
        let tagList = {}
        let setTags = []
        for(var n = 0; n < this.props.monitors.length; n ++){
            for(var i = 0; i < this.props.monitors[n].tags.length; i ++){
                let tag = this.props.monitors[n].tags[i]
                if(!(this.props.monitors[n].tags[i] in tagList)){
                    tagList[tag] = 1
                }
                else{tagList[tag] += 1}
            }
         }
        for(var key in tagList){
            setTags.push(
                    <ListItem
                        primaryText={key}
                        style={{'color': 'white', 'height': '24px', 'paddingTop': '14px', 'marginTop': '8px'}}
                        rightIcon={<p style={{'color': 'white', 'width': '24px', 'height':'24px', 'paddingTop': '5px', 'textAlign': 'center', 'backgroundColor': '#474747'}}>{tagList[key]}</p>}
                    />
                )
        }
        return(setTags)
    }



    setUsedMonitorList(){
        let usedMonitors = [];

        for(let i =0; i < this.props.visualizations.length; i++){
            for(let n = 0; n < this.props.visualizations[i].monitors.length; n++){
                if(!usedMonitors.includes(this.props.visualizations[i].monitors[n]) ){
                    usedMonitors.push(this.props.visualizations[i].monitors[n])
                }
            }
        }
        return usedMonitors.map((e) => this.props.monitors[e]).map(this.setList)
        
    }


    handleChange(event){
        this.setState({value: event.target.value})
    }


render(){
    let inThisReportStyle = {'display': 'none'};
    if(this.props.visualizations.length > 0){
        inThisReportStyle = {'color':'white', 'fill': 'white',  'height': '20px'}
    }
        return(
            <div className="monitorListContainer">
                <Search style={{'display': 'inline-block', 'width': '28px', 'height': '28px', 'verticalAlign': 'middle', 'color': 'white'}}/>
                <TextField hintText="Search by Monitor and Tags" style={{'width': '85%', 'marginLeft': '10px', 'display': 'inline-block'}} hintStyle={{'color': '#bbbbbb'}} inputStyle={{'color': '#ffffff'}} value={this.state.value} onChange={this.handleChange} />
                <MuiThemeProvider muiTheme={muiTheme}>
                    <List style={{'padding': '0'}}>
                    <ListItem 
                        key={1}
                        primaryText="In This Report"
                        innerDivStyle={{'padding': '16px 16px 16px 50px'}}
                        primaryTogglesNestedList={true}
                        leftIcon={<Restore style={{'fill': 'white'}}/>}
                        initiallyOpen={true}
                        className='firstListToggle'
                        style={inThisReportStyle}
                        nestedItems={
                                this.props.usedMonitorsInViz.map(this.setList)
                            }
                    />,
                    <ListItem 
                        key={2}
                        primaryText="Filter by Tags"
                        innerDivStyle={{'padding': '16px 16px 16px 50px'}}
                        primaryTogglesNestedList={true}
                        leftIcon={<LabelOutline style={{'fill': 'white'}}/>}
                        style={{'color':'white', 'fill': 'white',  'height': '20px'}}
                        nestedItems={
                                this.setTagList()
                            }
                    />,
                    <ListItem 
                        key={3}
                        primaryText="All"
                        innerDivStyle={{'padding': '16px 16px 16px 50px'}}
                        primaryTogglesNestedList={true}
                        initiallyOpen={true}
                        iconStyle={{'color': 'white', 'fill': 'white'}}
                        leftIcon={<Clock style={{'fill': 'white'}}/>}
                        style={{'color':'white', 'fill': 'white',  'height': '20px'}}
                        nestedItems={
                                this.props.unUsedMonitors.map(this.setList)
                            }
                    />
                    </List>

                </MuiThemeProvider>
                <div className='doneButton' onClick={this.props.handleOpenDropdown} ><p className='doneButtonText'>Done</p></div>
            </div>
            )
     }
}



export default AddChart;