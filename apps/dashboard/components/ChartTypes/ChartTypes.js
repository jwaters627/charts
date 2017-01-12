'use strict';

import React from 'react';
import classNames from 'classNames';
import DropDown from 'react-material-icons/icons/navigation/arrow-drop-down';
import RightArrow from 'react-material-icons/icons/hardware/keyboard-arrow-right';
import Graph from 'react-material-icons/icons/action/assessment';
import ChartOptions from '../ChartOptions/ChartOptions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./chartTypes.scss');
const columnIcon = require('../../../../dist/bundles/img/columnIcon.png');



class ChartTypes extends React.Component {


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
           chartImage: columnIcon,
           chartImageText: 'Chart Analysis', 
        };
        this.chartTypesSet = this.chartTypesSet.bind(this);
       
    }

    

    chartTypesSet(item){
        let chartTypeClass = classNames(
            'dropdownChartTypeName',
            {
                "selectedChart": this.props.selectedChartType === item.id
            }
        );
            if(item.id === 0 || item.id === 2){
                return(
                <div className='sourceContainer' id={item.id} onClick={ ( e ) => { this.props.handleOpenChartOptions( e, item ) } }>
                     <img className='chartTypeImage' src={item.source} />
                     <p className={chartTypeClass}>{item.text}</p>
                     <RightArrow style={{'display': 'inline-block', 'color': '#ffffff', 'width': '24px', 'height': '24px', 'marginTop': '8px','marginRight': '4px', 'float': 'right'}}/>
                </div>  
                )
            }
            else{
            return(
                <div className='sourceContainer' id={item.id} onClick={ ( e ) => { this.props.handleChartTypeClick( e, item ) } }>
                     <img className='chartTypeImage'src={item.source} />
                     <p className={chartTypeClass}>{item.text}</p>
                </div>  
                )
            }
    }



render(){
    let showClass = classNames(
        'allSourcesContainer',
        {
            "greyed": this.props.monitorIsSelected,
        });

        
        let chartsClass = classNames(
        'allAnalysisTypesContainer',
        {
            "greyed": this.props.monitorIsSelected,
        }
        );


        let analysisTypeDropdown = (<div></div>)
        if(this.props.dropdownOpen && this.props.monitorIsSelected){
            analysisTypeDropdown = (
                    <div className='dropdownContainer'>
                        {this.props.chartTypes.map(this.chartTypesSet)}
                    </div>
                )
        }

        let iconStyle = {'display': 'inline-block', 'verticalAlign': 'middle', 'color': 'white', 'float': 'left', 'marginLeft': '14px', 'width':"24px", 'height': '24px'};
        if(this.props.selectedVizOption == 'chartType'){
            iconStyle = {'display': 'inline-block', 'verticalAlign': 'middle', 'color': '#35D1CF', 'float': 'left', 'marginLeft': '14px', 'width':"24px", 'height': '24px'}
        }

        let headingTextClass = classNames(
            'chartAnalysisText',
            {
                'highlighted': this.props.selectedVizOption == 'chartType'
            }
            )

      
        return(
            <div className={showClass}>
               <div className={chartsClass} onClick={this.props.handleOpenDropdown}>
                    <Graph style={iconStyle}/>
                    <p className={headingTextClass}>Chart Analysis</p>
                </div>
                <div className='allOfDropdown'>        
                    {analysisTypeDropdown}
                   <ChartOptions chartOptionOpen={this.props.chartOptionOpen} selectedChartOption={this.props.selectedChartOption} chartOptions={this.props.chartOptions} setVizChartType={this.props.setVizChartType}/>
               </div>
            </div>
            )
    }
}



export default ChartTypes;