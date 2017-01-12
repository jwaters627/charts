'use strict';

import React from 'react';


require('./choice.scss');

class Choice extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
        };
        this.setOptions = this.setOptions.bind(this);
    }



setOptions(item){
    if(item.selected){
        return(<h4 className="frequencyOption selected" id={item.id} key={item.key}>{item.text}</h4>)
    }
    else{return(<h4 className="frequencyOption" id={item.id} key={item.key} onClick={this.props.handleSelectClick}>{item.text}</h4>)}
}



render(){

        return (
                 <div className="frequencyContainer">
                    {this.props.options.map(this.setOptions)}
                 </div>
        );
    }
} 


export default Choice;