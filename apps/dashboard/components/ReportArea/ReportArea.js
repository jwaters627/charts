'use strict';

import React from 'react';
import AddChart from '../AddChart/AddChart';
import ReportCanvas from '../ReportCanvas/ReportCanvas';
import mui from 'material-ui';
import Add from 'react-material-icons/icons/content/add';
import Chart from 'react-material-icons/icons/social/poll';
import Clock from 'react-material-icons/icons/action/query-builder';
import Share from 'react-material-icons/icons/social/share';
import Trash from 'react-material-icons/icons/action/delete';
import MoreHoriz from 'react-material-icons/icons/navigation/more-horiz'
import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./reportArea.scss');

class ReportArea extends React.Component {


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

   


   

    render() {

        return (
            <div className='entireReportArea'>
                <div className='reportNavButton' onClick={this.props.handleAddChartClick}>
                    <span aria-hidden="true"><Chart style={{'width': '28px', 'height': '28px', 'display': 'inline-block', 'color': '#515151', 'verticalAlign': 'middle'}} /></span>
                    <span className="label">Add Charts</span>
                </div>
                <div className='reportNavButton' onClick={this.props.schedulerClick}>
                    <span aria-hidden="true"><Clock style={{'width': '28px', 'height': '28px', 'display': 'inline-block', 'color': '#515151', 'verticalAlign': 'middle'}} /></span>
                    <span className="label">Schedule</span>
                </div>
                <div className='reportNavButton'>
                    <span aria-hidden="true"><Share style={{'width': '28px', 'height': '28px', 'display': 'inline-block', 'color': '#515151', 'verticalAlign': 'middle'}} /></span>
                    <span className="label">Share & Download </span>
                </div>
                <div className='reportNavButton'>
                    <span aria-hidden="true"><Trash style={{'width': '28px', 'height': '28px', 'display': 'inline-block', 'color': '#515151', 'verticalAlign': 'middle'}} /></span>
                    <span className="label">Delete Report</span>
                </div>
                <AddChart 
                        openAddChart={this.props.openAddChart} 
                        handleCloseAddChart={this.props.handleCloseAddChart} 
                        displayChart={this.props.displayChart} 
                        monitors={this.props.monitors}
                        selectedViz={this.props.selectedViz}
                        handleCheckMonitorClick={this.props.handleCheckMonitorClick}
                        handleChartTypeClick={this.props.handleChartTypeClick}
                        chartTypes={this.props.chartTypes}
                        monitorIsSelected={this.props.monitorIsSelected}
                        selectedChartType={this.props.selectedChartType}
                        addedMonitors={this.props.addedMonitors}
                        setAddedMonitors={this.props.setAddedMonitors}
                        setChipColor={this.props.setChipColor}
                        setChosenMonitor={this.props.setChosenMonitor}
                        chosenMonitor = {this.props.chosenMonitor}
                        chartOptions={this.props.chartOptions}
                        usedMonitors={this.props.usedMonitors}
                        monitorSearchAreaOpen={this.props.monitorSearchAreaOpen}
                        handleAddMonitorClick={this.props.handleAddMonitorClick}
                        setVizChartType={this.props.setVizChartType}
                        handleOpenDropdown={this.props.handleOpenDropdown}
                        dropdownOpen={this.props.dropdownOpen}
                        handleOpenChartOptions = {this.props.handleOpenChartOptions}
                        chartOptionOpen = {this.props.chartOptionOpen}
                        visualizations={this.props.visualizations}
                        selectedVizOption={this.props.selectedVizOption}
                        usedMonitorsInViz={this.props.usedMonitorsInViz}
                        unUsedMonitors={this.props.unUsedMonitors}
                        selectedChartOption={this.props.selectedChartOption}
                    />
                <ReportCanvas 
                        deleteChart={this.props.deleteChart} 
                        visualizations={this.props.visualizations}
                        handleChartAreaClick={this.props.handleChartAreaClick} 
                        openAddChart={this.props.openAddChart} 
                        handleChartClick={this.props.handleChartClick} 
                        selectedViz={this.props.selectedViz}
                        handleTitleInput={this.props.handleTitleInput} 
                        handleTitleUnfocus={this.props.handleTitleUnfocus}
                        editing={this.props.editing}
                        selectedTitle={this.props.selectedTitle}
                        clickedText={this.props.clickedText}
                        setName={this.props.setName}
                        monitors={this.props.monitors}
                        handleChartResize={this.props.handleChartResize}
                        handleEllipsisClick={this.props.handleEllipsisClick}
                        showMoreContainer={this.props.showMoreContainer}
                        duplicateChart={this.props.duplicateChart}
                        handleAnnotationInput={this.props.handleAnnotationInput}
                        selectedAnnotation={this.props.selectedAnnotation}
                        editingAnnotation={this.props.editingAnnotation}
                        setAnnotation={this.props.setAnnotation}
                        handleAnnotationUnfocus={this.props.handleAnnotationUnfocus}
                        setTitle={this.props.setTitle}
                        
                />

            </div>
        );
    }
}

export default ReportArea;