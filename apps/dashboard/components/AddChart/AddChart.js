'use strict';

import React from 'react';
import AddMonitors from '../AddMonitors/AddMonitors';
import MonitorSearch from '../MonitorSearch/MonitorSearch';
import TotalImpressions from '../TotalImpressions/TotalImpressions';
import ChartTypes from '../ChartTypes/ChartTypes';
import DateRangePicker from '../DateRange/DateRange';
import Close from 'react-material-icons/icons/navigation/close';
import Chart from 'react-material-icons/icons/social/poll';
import Schedule from 'react-material-icons/icons/action/today';
import classNames from 'classnames';

import data from '../../data';


import getMuiTheme from 'material-ui/styles/getMuiTheme';


const monitorSourcesIcon = require('../../../../dist/bundles/img/monitorSourcesIcon.png');
const monitorSourcesSelected = require('../../../../dist/bundles/img/monitorSourcesSelected.png');

require('./addChart.scss');

class AddChart extends React.Component {


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
                   data:{},
                   open: false,
                   openCalendar: false,
                   startDate: 'Start Date',
                   endDate: 'End Date',
             }
            this.showChartsAndSources = this.showChartsAndSources.bind(this);
            this.closeAddChartWindow = this.closeAddChartWindow.bind(this);
        }

       showChartsAndSources(){
        this.setState({open: false})
       }


    closeAddChartWindow(){
        this.setState({open: false})
        this.props.handleCloseAddChart()
    }


render(){


        let chartClass = classNames(
            'chartsAndSourcesContainer',
            {
                "open": this.state.open
            }
        );

        let dateClass = classNames(
            'dateRange',
            {
                'open': this.state.open
            }
        );

        let containerHeightClass = classNames(
            'addChartContainer open',
                {
                    'dateHeight' : this.state.open
                }
            );

        let selectedOptionClass = classNames(
            'monitorSourcesText',
                {
                    'blue' : this.props.selectedVizOption == 'monitors'
                }
            );

        let blueChartIcon = {'color': '#00C6C5'};
        if(this.state.open == true){blueChartIcon ={'color': '#aaaaaa'}};

        let blueDateRangeIcon = {'color': '#aaaaaa'};
        if(this.state.open == true){blueDateRangeIcon = {'color': '#00C6C5'}}


        let blueChartText = {'borderBottom': '3px solid #00c6c5'};
        if(this.state.open == true){blueChartText ={'borderBottom': 'none'}};

        let blueDateRangeText = {'borderBottom': 'none'};
        if(this.state.open == true){blueDateRangeText = {'borderBottom': '3px solid #00c6c5'}};

        
        let monitorArea = (<div></div>)
        if(this.props.monitorSearchAreaOpen){
            monitorArea = (<MonitorSearch 
                                handleCheckMonitorClick={this.props.handleCheckMonitorClick} 
                                monitors={this.props.monitors} 
                                handleAddMonitorClick={this.props.handleAddMonitorClick} 
                                chosenMonitor={this.props.chosenMonitor} 
                                setChosenMonitor={this.props.setChosenMonitor}
                                setChipColor={this.props.setChipColor}
                                visualizations={this.props.visualizations}
                                usedMonitorsInViz={this.props.usedMonitorsInViz}
                                unUsedMonitors={this.props.unUsedMonitors}
                                handleOpenDropdown={this.props.handleOpenDropdown}
                            />)
        }

        let monitorSourcesImage = monitorSourcesIcon;
        if(this.props.selectedVizOption == 'monitors'){monitorSourcesImage = monitorSourcesSelected}

        let cover = null;
        let addchart = (<div className="addChartContainer closed"></div>);
       if (this.props.openAddChart) {
        addchart = (
            <div className={containerHeightClass}>
                <div className={chartClass}>
                     <div className='monitorSourcesTextContainer' onClick={this.props.handleAddMonitorClick}>
                        <img className='monitorSourcesImage' src={monitorSourcesImage}/>
                        <p className={selectedOptionClass}>Monitor Sources</p>
                    </div>
                    {/* <AddMonitors setChosenMonitor={this.props.setChosenMonitor} usedMonitors={this.props.usedMonitors} monitors={this.props.monitors} handleCheckMonitorClick={this.props.handleCheckMonitorClick} chosenMonitor={this.props.chosenMonitor} handleAddMonitorClick={this.props.handleAddMonitorClick} setChipColor={this.props.setChipColor} addedMonitors={this.props.addedMonitors} /> */}
                   {monitorArea}
                   <ChartTypes 
                        displayChart={this.props.displayChart} 
                        handleChartTypeClick={this.props.handleChartTypeClick} 
                        chartTypes={this.props.chartTypes} 
                        selectedChartType={this.props.selectedChartType}
                        monitorIsSelected={this.props.monitorIsSelected} 
                        handleOpenDropdown={this.props.handleOpenDropdown}
                        dropdownOpen={this.props.dropdownOpen}
                        setVizChartType={this.props.setVizChartType}
                        chartOptions={this.props.chartOptions}
                        handleOpenChartOptions = {this.props.handleOpenChartOptions}
                        chartOptionOpen = {this.props.chartOptionOpen}
                        selectedVizOption={this.props.selectedVizOption}
                        selectedChartOption={this.props.selectedChartOption}
                    />
                   <DateRangePicker setVizChartType={this.props.setVizChartType} selectedViz={this.props.selectedViz} selectedChartType={this.props.selectedChartType} />
               </div>
            {cover}
           </div>
        );
    }
        return(
            <div>
                 {addchart}
            </div>
            )
    }
}



export default AddChart;