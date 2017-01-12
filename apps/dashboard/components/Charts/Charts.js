'use strict';

import React from 'react';

import TotalImpressions from '../TotalImpressions/TotalImpressions';
import DayAndTime from '../DayAndTime/DayAndTime';
import AutoSentiment from '../AutoSentiment/AutoSentiment';
import BarsCard from '../BarsCard/BarsCard';
import Geography from '../Geography/Geography';
import classNames from 'classnames';
import ReactGridLayout from 'react-grid-layout';
import MoreVert from 'react-material-icons/icons/navigation/more-vert';
import ResizableAndMovable from 'react-resizable-and-movable';


import data from '../../data';


import getMuiTheme from 'material-ui/styles/getMuiTheme';

const emptyImage = require('../../../../dist/bundles/img/emptyCanvasImage.png');
require('./charts.scss');

class Charts extends React.Component {


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
            hovering: false,
            hoveringId: false
             }
            this.renderCharts = this.renderCharts.bind(this);
            this.showEllipsis = this.showEllipsis.bind(this);
            this.hideEllipsis = this.hideEllipsis.bind(this);
        }


    
    setDataVol(item){
        var arr = {data:[], colors:[]};

        for(var i =0; i < item.monitors.length; i++){
            arr.data.push(data[item.monitors[i]].volume)
            arr.colors.push(this.props.monitors[item.monitors[i]].color)
        }

        return arr
    }

     setDataDayAndTime(item){
         var arr = {data:[], colors:[]};

        for(var i =0; i < item.monitors.length; i++){
            arr.data.push(data[item.monitors[i]].dayAndTime)
            arr.colors.push(this.props.monitors[item.monitors[i]].color)
        }

        return arr
    }

     setDataTopHashtags(item){
        var arr = {cardData:[], colors:[]};
        for(var i =0; i < item.monitors.length; i++){
            arr.cardData.push(data[item.monitors[i]].topHashtags)
            arr.colors.push(this.props.monitors[item.monitors[i]].color)
        }
        return arr
    }

    setDataAutoSentiment(item){
        for(var i =0; i < item.monitors.length; i++){
            return(data[item.monitors[i]].sentiment)
        }
    }

    setDataGeography(item){
        let arrGeo = {cardData:[], colors:[]};
        for(var i =0; i < item.monitors.length; i++){
            let newObj = data[item.monitors[i]].geography
            Object.keys(data[item.monitors[i]].geography).forEach(function(key,index){newObj[key].percentage = ((data[item.monitors[i]].geography[key].value/data[item.monitors[i]].totalGeo) * 100)})
            arrGeo.cardData.push(newObj)
            arrGeo.colors.push(this.props.monitors[item.monitors[i]].color)
            let colorArray = this.props.monitors[item.monitors[i]].color.split('');
            if(colorArray.length == 7)colorArray.splice(0,1);
            for(let n = 0; n < colorArray.length; n++){



                if(colorArray[n] == 'a'){colorArray[n] = 'F'}
                else if(colorArray[n] == 'b'){colorArray[n] = 'F'}
                else if(colorArray[n] == 'c'){colorArray[n] = 'F'}
                else if(colorArray[n] == 'd'){colorArray[n] = 'F'}
                else if(colorArray[n] == 'e'){colorArray[n] = 'F'}
                else if(colorArray[n] == 'f'){colorArray[n] = 'F'}
                else if(colorArray[n] == '9'){colorArray[n] = 'F'}
                else if(colorArray[n] == '8'){colorArray[n] = 'E'}
                else if(colorArray[n] == '7'){colorArray[n] = 'D'}
                else if(colorArray[n] == '6'){colorArray[n] = 'C'}
                else if(colorArray[n] == '5'){colorArray[n] = 'B'}
                else if(colorArray[n] == '4'){colorArray[n] = 'A'}
                else{
                    let newNum = Number(colorArray[n]);
                    colorArray[n] = (newNum += 6).toString()}
            }
            arrGeo.colors.push('#' + colorArray.join(''))
        }
        return arrGeo
    }

    showEllipsis(item){
        this.setState({hoveringId: item.id})
    }

    hideEllipsis(){
        this.setState({hoveringId: false})
    }

    renderCharts(item){

        let myClass = classNames(
            'chart',
            {
                "selected": (item.id === this.props.selectedViz)
            }
        );
        let chartTitle = (<h4 className='chartName' id={item.id} onClick={this.props.handleTitleInput}>{item.name}</h4>);
            if(this.props.editing && this.props.selectedTitle == item.id){
                chartTitle = (<input style={{'display':'inline-block', 'font-size': '18px'}} type="text" defaultValue={this.props.clickedText} autoFocus={true} onBlur={( e ) => { this.props.handleTitleUnfocus( e, item ) }} className='inputField' onKeyDown={( e ) => { this.props.setName( e, item ) }} />)
            }

        let analysisType = (<div></div>)
        if(item.monitors.length ===0 && item.chartType === false){
            analysisType =(<div><h4>You need to choose some monitors and a chart type.</h4></div>)
        }
        else if(item.chartType === false){
            analysisType =(<div><h4>You need to choose an analysis type.</h4></div>)
        }
        else if(item.monitors.length ===0){
            analysisType =(<div><h4>You need to choose some monitors.</h4></div>)
        }
        else if(item.chartType === 0){
            analysisType = (
                            <TotalImpressions 
                                width={item.size.width} 
                                height={item.size.height} 
                                chartOption={item.chartOption} 
                                dataToRender={this.setDataVol(item)} 
                                color={item.color} 
                                addChartOpen={this.props.openAddChart} 
                            />)
        }
        else if(item.chartType == 1){
            analysisType = (
                            <AutoSentiment 
                                width={item.size.width} 
                                height={item.size.height} 
                                data={this.setDataAutoSentiment(item)} 
                                addChartOpen={this.props.openAddChart} 
                            />
                )
        }
        else if(item.chartType == 2){
            analysisType = (
                            <DayAndTime 
                                width={item.size.width} 
                                height={item.size.height} 
                                dataToRender={this.setDataDayAndTime(item)} 
                                addChartOpen={this.props.openAddChart} 
                                chartOption={item.chartOption}
                                chartType={item.chartType}
                            />
                )
        }
        else if(item.chartType == 3){
            analysisType = (
                            <BarsCard 
                                width={item.size.width} 
                                height={item.size.height} 
                                data={this.setDataTopHashtags(item)} 
                                addChartOpen={this.props.openAddChart} 
                            />
                )
        }
        else if(item.chartType == 5){
            analysisType = (
                            <Geography 
                                width={item.size.width} 
                                height={item.size.height} 
                                data={this.setDataGeography(item)} 
                                addChartOpen={this.props.openAddChart} 
                            />
                )
        }

        let ellipsis = (<div></div>)
        if((this.state.hoveringId === item.id) || this.props.showMoreContainer === item.id){
            ellipsis = (<MoreVert onClick={ ( e ) => { this.props.handleEllipsisClick( e, item ) }} style={{'display': 'inline-block', 'float': 'right', 'marginTop': '6px'}}/>)
        }
        let moreContainer = (<div></div>);
        if(this.props.showMoreContainer === item.id){
            moreContainer = (<div className='moreContainer'>
                                <p onClick={ ( e ) => { this.props.deleteChart( e, item ) }} className='deleteButton'>Delete Chart</p>
                                <p onClick={ ( e ) => { this.props.duplicateChart( e, item ) }} className='deleteButton'>Duplicate Chart</p>
                                <p id={item.id} className='deleteButton' onClick={this.props.handleAnnotationInput}>Comment</p>
                            </div>)
        }

        let annotation = (<div></div>);
        if(item.chartAnnotation.length > 0){annotation = (<h4 className='chartAnnotation' style={{'maxWidth': item.size.width}} id={item.id} onClick={this.props.handleAnnotationInput}>{item.chartAnnotation}</h4>)}
        if(this.props.editingAnnotation && this.props.selectedAnnotation == item.id){
                annotation = (<textarea style={{'display':'inline-block', 'font-size': '14px'}} defaultValue={item.chartAnnotation} type="text" autoFocus={true} onBlur={( e ) => { this.props.handleTitleUnfocus( e, item ) }} className='inputField' onKeyDown={( e ) => { this.props.setAnnotation( e, item ) }} />)
            }

        let opacity = 1;
        if((this.props.selectedViz || this.props.selectedViz === 0) && this.props.selectedViz !== item.id){
            opacity = 0.4
        }
        let height = item.size.height + 100;
        let width = item.size.width + 100;
        let allowMove = [1, 1];
        if(this.props.editing){
            allowMove = [1000000, 100000]
        }
        let zindex = 99;
        if(this.props.showMoreContainer === item.id){zindex = 100}
        if(this.props.visualizations.length === 1){
            return(
            <div style={{'display': 'inline-block', 'width': width, 'height': height, 'opacity': opacity, 'marginLeft': '60%', 'position': 'relative', 'zIndex': zindex}}>
                <ResizableAndMovable 
                        x={20}
                        y={20}
                        width={'auto'}
                        height={'auto'}
                        moveGrid={allowMove}
                        style={{'display': 'block'}}
                        onResizeStop={this.props.handleChartResize}
                    >    
                    <div className={myClass} id="singleChart" style={{'display': 'block'}} onMouseEnter={ () => { this.showEllipsis( item ) }} onMouseLeave={this.hideEllipsis}>
                        {chartTitle}
                        {ellipsis}
                        {moreContainer}
                        <div onClick={ ( e ) => { this.props.handleChartClick( e, item ) }}>
                            {analysisType}
                        </div>
                        {annotation}
                    </div>
                </ResizableAndMovable>
            </div>
        )
        }
        else{
        return(
            <div style={{'display': 'inline-block', 'width': width, 'height': height, 'opacity': opacity, 'position': 'relative', 'zIndex': zindex}}>
                <ResizableAndMovable 
                        x={20}
                        y={20}
                        width={'auto'}
                        height={'auto'}
                        moveGrid={allowMove}
                        style={{'display': 'block'}}
                        onResizeStop={this.props.handleChartResize}
                    >    
                    <div className={myClass} id="singleChart" style={{'display': 'block'}} onMouseEnter={ () => { this.showEllipsis( item ) }} onMouseLeave={this.hideEllipsis}>
                        {chartTitle}
                        {ellipsis}
                        {moreContainer}
                        <div onClick={ ( e ) => { this.props.handleChartClick( e, item ) }}>
                            {analysisType}
                        </div>
                        {annotation}
                    </div>
                </ResizableAndMovable>
            </div>
        )
}
    }
 


render(){
    let selectedChartClass = classNames(
            'allChartsContainer',
            {
                "selectedChart": (this.props.selectedViz || this.props.selectedViz === 0),
                "open": (this.props.openAddChart)
            }
        );

    let chartArea = (<div className = 'emptyImageCanvas'>
                        <img className='emptyImage' src={emptyImage} />
                        <h2 className='emptyCanvasText'>Your Report is Empty!</h2>
                        <h3 className='emptyCanvasSubText'>Let's clear away the dust bunnies and start adding charts.</h3>
                    </div>);

    if(this.props.visualizations.length > 0){
        chartArea = (<div className={selectedChartClass} onClick={this.props.handleChartAreaClick}>
                     {this.props.visualizations.map(this.renderCharts)}
            </div>)
    }

     return(
            chartArea
        )
    }
}


export default Charts;