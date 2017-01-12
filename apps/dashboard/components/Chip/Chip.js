import React from 'react';
import Chip from 'material-ui/Chip';

import {grey50, red500, yellowA400} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


import suggestions from './data';
import baseballSuggestions from './baseballSuggestions';
import stlSuggestions from './stlSuggestions'
import MenuList from './menulist';
import AutoCompleteExample from './search';

import styles from '../css/search.css';



 const muiTheme = getMuiTheme({
    fontFamily: "Roboto",
    palette: {
      primary1Color: 'white',
      primary2Color: 'black',
      primary3Color: 'white',
      textColor: grey50,
      },
      appBar: {
        height: 55,
      },
});



export default class ChipExampleArray extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: 'none', data: suggestions};
    this.styles = {
      chip: {
        margin: 4,
        cursor: 'pointer',
        
      },
      wrapper: {
        display: 'flex',
        flexFlow: 'row wrap',
        flexWrap: 'wrap',
        float: 'left',
        
      },
    };
  }
    


  





  renderChip(data) {
    if(data.label[0].toLowerCase() == 'baseball'){this.state.data=baseballSuggestions}
    else if(data.label[0].toLowerCase() == 'mlb'){this.state.data=baseballSuggestions}
    else if(data.label[0].toLowerCase() == 'stl'){this.state.data=stlSuggestions}
    else if(data.label[0].toLowerCase() == 'st louis'){this.state.data=stlSuggestions}
    else if(data.label[0].toLowerCase() == 'st. louis'){this.state.data=stlSuggestions}
    else if(data.label[0].toLowerCase() == 'cardinals'){this.state.data=suggestions}
    else{this.state.data=[]}

    var color = ''
    if(data.inOrEx == 'exclude'){
      color = '#BF2A3A'
    }
    else{
      color = '#4771B8'
    }

    return (
      <div id="chips">
          <Chip
            backgroundColor= {color}
            labelColor= {'white'}
            key= {data.key}
            id={data.label}
            style= {this.styles.chip}
            onClick={(event)=>this.props.showMenu(data.key)}
          >
            {data.label.join(' OR ')} 
            <svg height="12px" width= "22px" viewBox="10 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: "10px"}}>
              <path d="M98.9,184.7l1.8,2.1l136,156.5c4.6,5.3,11.5,8.6,19.2,8.6c7.7,0,14.6-3.4,19.2-8.6L411,187.1l2.3-2.6  c1.7-2.5,2.7-5.5,2.7-8.7c0-8.7-7.4-15.8-16.6-15.8v0H112.6v0c-9.2,0-16.6,7.1-16.6,15.8C96,179.1,97.1,182.2,98.9,184.7z" fill="#ffffff"/>
            </svg>
          </Chip>
          <div style={{position: "fixed"}}>
              <div  className='menuBox1' id= {data.key} style={{display: 'none', overflow: 'scroll', margin: '0 auto'}}>

                    <p style={{maxWidth:'200px', textAlign: 'center'}}>Select similar terms to capture more of the conversation</p>  
                    <p 
                      id="addButton" 
                      onClick={(event)=>this.props.addToPill(data.key)}
                      style={{backgroundColor: this.props.color, color: this.props.textColor}}
                    >
                      Done
                    </p>
                    
                    <MenuList 
                     suggestions={this.state.data}
                     menuClick={this.props.menuClick}
                     clickAction={this.props.includeClick}
                    >
                    </MenuList>         
                    <p 
                      id="deleteButton" 
                      onClick={(event)=>this.props.removeChip(data.key)}
                    >
                      DELETE PILL
                    </p>
              </div>
           </div>
            
        </div>
     
    );
  }

  render() {
    return (
      <MuiThemeProvider>
        <div style={this.styles.wrapper}>
          {this.props.addedMonitors.map(this.renderChip, this)}
        </div>
      </MuiThemeProvider>
    );
  }
}
































