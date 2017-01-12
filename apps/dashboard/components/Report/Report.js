'use strict';

import React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import _ from 'lodash';
import classNames from 'classnames';
import ReportList from '../ReportList/ReportList';
import ReportArea from '../ReportArea/ReportArea';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen';
import AddChart from '../AddChart/AddChart';
import Charts from '../Charts/Charts';
import Scheduler from '../Scheduler/Scheduler';
import TotalImpressions from '../TotalImpressions/TotalImpressions';
import DayAndTime from '../DayAndTime/DayAndTime';
import Card from '../Card/Card.js';
import Snackbar from 'material-ui/Snackbar';


import data from '../../data';
import chartsData from '../../chartsData';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('../../scss/dashboard.scss');


const retweetsIcon = require('../../../../dist/bundles/img/retweetsIcon.png');
const autoSentimentIcon = require('../../../../dist/bundles/img/autoSentimentIcon.png');
const volume = require('../../../../dist/bundles/img/volumeIcon.svg');
const geographyIcon = require('../../../../dist/bundles/img/geographyIcon.png');
const topMentions = require('../../../../dist/bundles/img/topMentionsIcon.png');
const topHashtags = require('../../../../dist/bundles/img/topHashTagIcon.png');
const dayAndTime = require('../../../../dist/bundles/img/dayAndTimeIcon.png');
const columnIcon = require('../../../../dist/bundles/img/columnIcon.png');
const areaIcon = require('../../../../dist/bundles/img/areaIcon.png');
const lineIcon = require('../../../../dist/bundles/img/lineIcon.png');
const aggregateIcon = require('../../../../dist/bundles/img/aggregateIcon.png');
const genderIcon = require('../../../../dist/bundles/img/genderIcon.png');



class Report extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };


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
            openMore: false,
            openSnackbar: false,
            openAddChart: false,
            scheduler: false,
            monitors: [{"id":0,"name":"Heavy Beer","type":"BUZZ","contentSources":["Facebook"], checked: false, color:'#4771b8', tags: ['Election']}, {"id":1,"name":"Light Beer","type":"BUZZ","contentSources":["Facebook"], checked: false, color: '#70af46', tags: ['Election']}, {"id":2,"name":"Wine","type":"BUZZ","contentSources":["Facebook"], checked: false, 'color': 'orange', tags: ['Election']}, {"id":3,"name":"Boston Marathon 2014","type":"BUZZ","contentSources":["Facebook"], checked: false, color:'#4771B8', tags: ['Running']},{"id":4,"name":"#newbalanceday","type":"BUZZ","contentSources":["Facebook"], checked: false, color:'#4771B8', tags: ['Running', 'Shoes']}, {"id":5,"name":"@nbrunning account","type":"BUZZ","contentSources":["Facebook"], checked: false, color:'#4771B8', tags: ['Running']}],
            addedMonitors:[],  
            selectedMonitors: [],
            editing: false,
            clickedText: '',
            selectedTitle: '',
            chartTypes: [
                {id: 0, source: volume, text: 'Volume', selected: false}, 
                {id: 1, source: autoSentimentIcon, text: 'Auto Sentiment', selected: false},
                {id: 2, source: dayAndTime, text: 'Day and Time', selected: false},
                {id: 3, source: topHashtags, text: 'Top Hashtags', selected: false}, 
                {id: 4, source: retweetsIcon, text: 'Retweets', selected: false}, 
                {id: 5, source: geographyIcon, text: 'Geography', selected: false}, 
                {id: 6, source: topMentions, text: 'Top Mentions', selected: false}, 
                {id: 7, source: genderIcon, text: 'Gender', selected: false}

                
            ],
            chartOptions:[
                {id: 0, source: areaIcon, type: 'area', text: 'Area', selected: false}, 
                {id: 1, source: columnIcon, type: 'bar', text: 'Bar', selected: false},
                {id: 2, source: lineIcon, type: 'line', text: 'Line', selected: false},

            ],
            usedMonitors: [],
            usedMonitorsInViz: [],
            unUsedMonitors:[],
            chosenMonitor: 0,
            selectedChartType: false,
            monitorIsSelected: false,
            newChartId: 0,
            selectedViz: false,
            visualizations: [],
            monitorSearchAreaOpen: false,
            dropdownOpen: false,
            chartOptionOpen: false,
            selectedVizOption: 'monitors',
            showMoreContainer: false,
            selectedChartOption: false,
            editingAnnotation: false,
            clickedTextAnnotation: '',
            selectedAnnotation: ''
        }
        this.handleEllipsisClick = this.handleEllipsisClick.bind(this);
        this.handleAddChartClick = this.handleAddChartClick.bind(this);
        this.handleCloseAddChart = this.handleCloseAddChart.bind(this);
        this.schedulerClick = this.schedulerClick.bind(this);
        this.handleCheckMonitorClick = this.handleCheckMonitorClick.bind(this);
        this.handleChartTypeClick = this.handleChartTypeClick.bind(this);
        this.handleChartClick = this.handleChartClick.bind(this);
        this.finishedSchedulerClick = this.finishedSchedulerClick.bind(this);
        this.handleChartAreaClick = this.handleChartAreaClick.bind(this);
        this.handleDeleteChart = this.handleDeleteChart.bind(this);
        this.deleteChart = this.deleteChart.bind(this);
        this.handleTitleInput = this.handleTitleInput.bind(this);
        this.setName = this.setName.bind(this);
        this.handleTitleUnfocus = this.handleTitleUnfocus.bind(this);
        this.setAddedMonitors = this.setAddedMonitors.bind(this);
        this.setChipColor = this.setChipColor.bind(this);
        this.setChosenMonitor = this.setChosenMonitor.bind(this);
        this.handleAddMonitorClick = this.handleAddMonitorClick.bind(this);
        this.setVizChartType = this.setVizChartType.bind(this);
        this.handleChartResize = this.handleChartResize.bind(this);
        this.handleOpenDropdown = this.handleOpenDropdown.bind(this);
        this.handleOpenChartOptions = this.handleOpenChartOptions.bind(this);
        this.handleEllipsisClick = this.handleEllipsisClick.bind(this);
        this.duplicateChart = this.duplicateChart.bind(this);
        this.handleAnnotationInput = this.handleAnnotationInput.bind(this);
        this.setAnnotation = this.setAnnotation.bind(this);
        this.handleAnnotationUnfocus = this.handleAnnotationUnfocus.bind(this);

        this.placeholder = {};

        this.gridProps = {
            rowHeight: 30,
            breakpoints: {lg: 1200, md: 996, sm: 768, xs: 360, xxs: 0},
            cols: {lg: 16, md: 12, sm: 8, xs: 4, xxs: 2},
            verticalCompact: true,
            draggableCancel: 'input'
        };
    }

    componentWillMount() {
        document.addEventListener('keydown', this.handleDeleteChart)
    }

    handleEllipsisClick(){
        this.setState({openSnackbar: false})
        this.setState({openMore: !this.state.openMore})
    }

    handleAddChartClick(){
        let usedMonitorsHere = [];
        let notUsedMonitors = this.state.monitors.slice();
        for(let i =0; i < this.state.visualizations.length; i++){
            for(let n = 0; n < this.state.visualizations[i].monitors.length; n++){
                if(!usedMonitorsHere.includes(this.state.monitors[this.state.visualizations[i].monitors[n]]) ){
                    usedMonitorsHere.push(this.state.monitors[this.state.visualizations[i].monitors[n]])
                    notUsedMonitors.splice(notUsedMonitors.indexOf(this.state.monitors[this.state.visualizations[i].monitors[n]]),1)
                }
            }
        }

        this.setState({openSnackbar: false, openAddChart: true, monitorSearchAreaOpen: true, selectedVizOption: 'monitors', usedMonitorsInViz: usedMonitorsHere, unUsedMonitors: notUsedMonitors})
        for(var n=0; n < this.state.monitors.length; n++){
            this.state.monitors[n].checked = false
        }

        this.createChart()
    }

    createChart(option='bar'){
        console.log(this.state.newChartId)
            let names = []
            for(var i = 0; i < this.state.selectedMonitors.length; i++){
                names.push(this.state.monitors[this.state.selectedMonitors[i]].name)
            }
            this.setState({selectedViz: this.state.newChartId})
            this.state.visualizations.push(
                {
                    id: this.state.newChartId,
                    name: 'untitled',
                    monitors: [],
                    type: '',
                    size: {
                        height: 220,
                        width: 480
                        },
                    dateRange: {
                        start: 'monday',
                        end: 'tuesday'
                    },
                    chartType: false,
                    chartOption: option,
                    chartAnnotation: ''
                }
            )
            this.setState({newChartId: this.state.newChartId + 1});
    }

    handleCloseAddChart(){
        this.setState({openAddChart: false})
        if(this.state.selectedChartType){this.state.chartTypes[this.state.selectedChartType].selected = false}
        this.setState({selectedChartType: false, selectedViz: false, selectedVizOption: false, selectedMonitors: []})
    }

    handleCheckMonitorClick(event){
        var checkedMonitors = []
        if(this.state.selectedChartType == 1  || this.state.selectedChartType == 3){
            for(var i=0; i < this.state.monitors.length; i++){
                if(this.state.monitors[i].id == event.target.id){
                this.state.monitors[i].checked = !this.state.monitors[i].checked
                }  
                else{this.state.monitors[i].checked = false}    
            }
        }
        else{
        for(var i=0; i < this.state.monitors.length; i++){
            if(this.state.monitors[i].id == event.target.id){
                this.state.monitors[i].checked = !this.state.monitors[i].checked
            }
            if(this.state.monitors[i].checked){
                checkedMonitors.push(this.state.monitors[i].id) 
            }
            if(this.state.usedMonitors.includes(this.state.monitors[event.target.id])){continue}
            else{this.state.usedMonitors.push(this.state.monitors[event.target.id])}
         }
        }
        if(this.state.selectedViz || this.state.selectedViz === 0){
            for(var h = 0; h < this.state.visualizations.length; h++){
                if(this.state.visualizations[h].id == this.state.selectedViz){
                  this.state.visualizations[h].monitors = checkedMonitors
                }
            }
        }
        this.setAddedMonitors()
        this.setState({selectedMonitors: checkedMonitors})
    }

    handleChartTypeClick(event, item){
        let chartTypeName = this.state.chartTypes[item.id].text;
                  console.log(chartTypeName)
                  let monitorsUsed = this.state.visualizations[this.state.selectedViz].monitors
                  console.log(monitorsUsed)
                  let monitorsToPrint = []
                  for(let m = 0; m < monitorsUsed.length; m++){
                    monitorsToPrint.push(this.state.monitors[monitorsUsed[m]].name)
                  }
                  console.log(monitorsToPrint)
                  this.state.visualizations[this.state.selectedViz].name = chartTypeName + ': ' + monitorsToPrint.join(' vs ')
        this.setState({selectedChartType: item.id, monitorSearchAreaOpen: false})
        if(item.id == 1 || item.id == 3 || item.id == 5){
            this.setState({selectedChartOption: false, chartOptionOpen: false,})
            for(var i=0; i < this.state.monitors.length; i++){
                this.state.monitors[0].checked = true;
                this.state.monitors[1].checked = false;
                this.state.monitors[2].checked = false;   
            }
        }
        for(var i = 0; i < this.state.chartTypes.length; i++){
            if(i == item.id){
                this.state.chartTypes[i].selected = true 
            }
            else{this.state.chartTypes[i].selected = false}
        }
        if(!this.state.selectedViz && this.state.selectedViz !== 0){
            this.setState({selectedChartType: item.id}, this.createChart)    
        }
        if(this.state.selectedViz || this.state.selectedViz === 0){
            for(var h = 0; h < this.state.visualizations.length; h++){
                if(this.state.visualizations[h].id == this.state.selectedViz){
                  this.state.visualizations[h].chartType = item.id
                    if(item.id == 0){
                        this.state.visualizations[h].chartOption = 'area'; 
                        this.setState({visualizations: this.state.visualizations}) 
                    }
                    else if(item.id == 2){this.state.visualizations[h].chartOption = 'bar'; this.setState({visualizations: this.state.visualizations})}
                }
            }
        }
        this.setState({dropdownOpen: false})
    }

    handleChartClick(event, item){
        this.setState({openSnackbar: false, monitorIsSelected: true, monitorSearchAreaOpen: false, selectedViz: item.id, selectedChartOption: item.chartOption, selectedChartType: item.chartType, openAddChart: true, showMoreContainer: false, dropdownOpen: false})
         for(var m = 0; m < this.state.monitors.length; m++){
            if(item.monitors.includes(m)){
                this.state.monitors[m].checked = true
            }
            else{this.state.monitors[m].checked = false}
        }
        this.state.selectedChartType = item.chartType
        for(var i = 0; i < this.state.chartTypes.length; i++){
            if(item.chartType == i){
                this.state.chartTypes[i].selected = true
            }
            else{this.state.chartTypes[i].selected = false}
        }
        let chartMonitors = []
         for(var n =0; n < item.monitors.length;n++){
            chartMonitors.push(this.state.monitors[item.monitors[n]])
        }
        this.setState({addedMonitors: chartMonitors, selectedMonitors: item.monitors})
        event.stopPropagation()
    }

    schedulerClick(){
       this.setState({scheduler: !this.state.scheduler})
       this.setState({openMore: false})
    }

    handleDeleteChart(e){
        if(e.keyCode == 8 && !this.state.editing && !this.state.editingAnnotation){
            this.deleteChart()
        } 
    }

    deleteChart(e, item){
        if(this.state.selectedViz || this.state.selectedViz === 0)  {
            for(var i =0; i<this.state.visualizations.length; i++){
                if(this.state.visualizations[i].id == this.state.selectedViz){
                    this.state.visualizations.splice(i, 1)
                }
            }
        }
        else{
            for(var i =0; i<this.state.visualizations.length; i++){
                if(this.state.visualizations[i].id == item.id){
                    this.state.visualizations.splice(i, 1)
                }
            }
        }
        this.handleChartAreaClick();
    }

    setAddedMonitors(){
        let monitors = []
        for(var i = 0; i < this.state.monitors.length; i++){
            if(this.state.monitors[i].checked){
                this.setState({monitorIsSelected: true})
                monitors.push(this.state.monitors[i])
            }
        }
        this.setState({addedMonitors: monitors})
    }

    finishedSchedulerClick(){
       this.setState({
            scheduler: !this.state.scheduler, 
            openMore: false, 
            openSnackbar: true})
    }

    setTitle(e, item){
        console.log(item)
    }

    handleChartAreaClick(){ 
       
        if(this.monitorSearchAreaOpen){
            this.setState({
                monitorSearchAreaOpen: false, 
                chartOptionOpen: false,
                dropdownOpen: false,
                selectedVizOption: false,
                showMoreContainer: false,
                openAddChart: true
            })
        }

        else{

        this.setState({
                selectedViz: false,
                selectedChartType: false,
                monitorIsSelected: false,
                addedMonitors: [],
                monitorSearchAreaOpen: false, 
                chartOptionOpen: false,
                dropdownOpen: false,
                openAddChart: false,
                selectedVizOption: false,
                showMoreContainer: false, 

            });

        for(var m =0; m < this.state.chartTypes.length; m++){
            if(this.state.chartTypes[m].selected){
                this.state.chartTypes[m].selected = false
            }
        }
        for(var n=0; n < this.state.monitors.length; n++){
            if(this.state.monitors[n].checked){
                this.state.monitors[n].checked = false
            }
        }
        this.handleCloseAddChart()
        this.setState({selectedMonitors: []});
    }
    }

    handleTitleInput(e){
            this.setState({
                editing: true,
                clickedText: e.target.innerText,
                selectedTitle: e.target.id
            })
            e.stopPropagation()
        }

    handleTitleUnfocus(e, item){
        if(e.target.value.length == 0 || !(/\S/.test(e.target.value))){ item.name = "untitled"; this.setState({editing: false})}
        else{
                item.name = e.target.value
                this.setState({editing: false})
             }
    }


    setName(e, item){
            if(e.keyCode == 13){
                if(e.target.value.length == 0 || !(/\S/.test(e.target.value))){ item.name = "untitled"; this.setState({editing: false})}
                else{
                item.name = e.target.value
                this.setState({editing: false})
             }
            }
     }

     handleAnnotationInput(e){
            this.setState({
                editingAnnotation: true,
                selectedAnnotation: e.target.id,
                showMoreContainer: false,

            })
        }

    handleAnnotationUnfocus(e, item){
        if(e.target.value.length == 0 || !(/\S/.test(e.target.value))){ item.chartAnnotation = ""; this.setState({editingAnnotation: false})}
        else{
                item.annotation = e.target.value
                this.setState({editingAnnotation: false})
             }
    }

     setAnnotation(e, item){
            if(e.keyCode == 13){
                if(e.target.value.length == 0 || !(/\S/.test(e.target.value))){ item.chartAnnotation = ""; this.setState({editingAnnotation: false})}
                else{
                item.chartAnnotation = e.target.value
                this.setState({editingAnnotation: false})
             }
            }
     }

     setVizChartType(e, item){
        
        if(!this.state.selectedViz && this.state.selectedViz !== 0){
            this.createChart(item.type)
        }
        else{
            this.state.visualizations[this.state.selectedViz].chartOption = item.type
            this.setState({visualizations: this.state.visualizations})
        }
        this.setState({dropdownOpen: false, selectedVizOption: false, chartOptionOpen: false})
     }

     setChipColor(color){
        console.log('from reports ' + color.hex)
        this.state.monitors[this.state.chosenMonitor].color = color.hex
        this.state.visualizations[this.state.selectedViz].color = color.hex
        this.setState({monitors: this.state.monitors})
     }

     setChosenMonitor(sentId){
        this.setState({chosenMonitor: sentId})
     }

     handleAddMonitorClick(){
     
        let selectedOption = 'monitors';
        if(this.state.selectedVizOption == 'monitors'){selectedOption = false}
        this.setState({monitorSearchAreaOpen: !this.state.monitorSearchAreaOpen, selectedVizOption: selectedOption, dropdownOpen: false, chartOptionOpen: false})
        this.setAddedMonitors()
    }

     handleOpenDropdown(){

        if(this.state.selectedMonitors.length > 0){
        let option = 'chartType';
        if(this.state.selectedVizOption == 'chartType'){option = false}

        this.setState({
                dropdownOpen: !this.state.dropdownOpen, 
                chartOptionOpen: false, 
                monitorSearchAreaOpen: false, 
                selectedVizOption: option
            });
        }
    }


    handleOpenChartOptions(e, item){
        let chartTypeName = this.state.chartTypes[item.id].text;
        console.log(chartTypeName)
        let monitorsUsed = this.state.visualizations[this.state.selectedViz].monitors
        console.log(monitorsUsed)
        let monitorsToPrint = []
        for(let m = 0; m < monitorsUsed.length; m++){
            monitorsToPrint.push(this.state.monitors[monitorsUsed[m]].name)
        }
        console.log(monitorsToPrint)
        this.state.visualizations[this.state.selectedViz].name = chartTypeName + ': ' + monitorsToPrint.join(' vs ')
        if(this.state.selectedViz || this.state.selectedViz === 0){
            this.state.visualizations[this.state.selectedViz].chartType = item.id
        }
        this.setState({chartOptionOpen: !this.props.chartOptionOpen, selectedChartType: item.id})
    }


    handleChartResize(direction, styleSize, clientSize, delta){
        for(var i = 0; i < this.state.visualizations.length; i++){
            if(this.state.visualizations[i].id === this.state.selectedViz){
                this.state.visualizations[i].size.width += delta.width
                this.state.visualizations[i].size.height += delta.height
                this.setState({visualizations: this.state.visualizations})
            }
        }
    }

    handleEllipsisClick(e, item){
        
        this.setState({showMoreContainer: item.id})
        e.stopPropagation()
    }

    duplicateChart(e, item){
        let newChart = Object.assign({}, item);
        newChart.id = this.state.newChartId;
        this.state.visualizations.push(newChart);
        this.setState({newChartId: this.state.newChartId += 1});
    }

       


    render() {
       
            return (

                <div>
                    <ReportArea
                        schedulerClick={this.schedulerClick}
                        handleAddChartClick={this.handleAddChartClick} 
                        handleCloseAddChart={this.handleCloseAddChart} 
                        displayChart={this.displayChart} 
                        handleCheckMonitorClick={this.handleCheckMonitorClick}
                        handleChartTypeClick={this.handleChartTypeClick}
                        setAddedMonitors={this.setAddedMonitors}
                        setChipColor={this.setChipColor}
                        handleAddMonitorClick={this.handleAddMonitorClick}
                        setVizChartType={this.setVizChartType}
                        handleOpenDropdown={this.handleOpenDropdown}
                        handleOpenChartOptions = {this.handleOpenChartOptions}
                        deleteChart={this.deleteChart} 
                        handleChartAreaClick={this.handleChartAreaClick} 
                        handleChartClick={this.handleChartClick} 
                        handleTitleInput={this.handleTitleInput} 
                        handleTitleUnfocus={this.handleTitleUnfocus}
                        setName={this.setName}
                        handleChartResize={this.handleChartResize}
                        handleEllipsisClick={this.handleEllipsisClick}
                        duplicateChart={this.duplicateChart}
                        handleAnnotationUnfocus={this.handleAnnotationUnfocus}
                        handleAnnotationInput={this.handleAnnotationInput}
                        setAnnotation={this.setAnnotation}
                        setTitle={this.setTitle}
                        {...this.state}

                    />
                    <Scheduler scheduler={this.state.scheduler} schedulerClick={this.schedulerClick}  finishedSchedulerClick={this.finishedSchedulerClick} />
                    <Snackbar open={this.state.openSnackbar} message="you have scheduled a report" autoHideDuration={4000}/>
                </div>
            );
    };
};

export default Report;