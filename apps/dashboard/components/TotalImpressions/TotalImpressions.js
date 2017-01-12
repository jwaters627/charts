'use strict';

import React from 'react';
import _ from 'lodash';
import d3 from 'd3';
import moment from 'moment';
import CommonUtils from '../../../../common/CommonUtils';
import Axis from '../../../../common/components/Axis/Axis';
import AreaChart from '../../../../common/components/AreaChart/AreaChart';
import BarChart from '../../../../common/components/BarChart/BarChart';
import classNames from 'classnames';

require('./TotalImpressions.scss');

class TotalImpressions extends React.Component {
    static propTypes = {
        dataToRender: React.PropTypes.object.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.init(props);
        this.state = {
            currentX: 0,
            currentYFirst: 0,
            currentYSecond: 0,
            crosshairs: (<g></g>),

        }
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.showCharts = this.showCharts.bind(this);
    }

    init(props) {
        if (Object.keys(props.dataToRender.data).length == 0) return false;

        this.processData(props.dataToRender.data);
        this.padding = {top: 10, bottom: 10, left: 10, right: 20};
        this.width = props.width - this.padding.left - this.padding.right;
        this.height = props.height - this.padding.top - this.padding.bottom;
        this.minDate = d3.min(this.dates);
        this.maxDate = d3.max(this.dates);
        this.width = props.width - 5;
        this.height = props.height - 5;
        this.barPadding = 5;
        this.xScale = d3.time.scale.utc().range([0, (this.width - ((this.padding.right + this.padding.left) * 2))]).domain([this.minDate, this.maxDate]);
        this.yScale = d3.scale.linear().range([this.height - 30, 0]).domain([0, (this.maxVolume * 1.2)]);
        this.stack = d3.layout.stack().values(function(d) { return d.values; });
    }

    processData(dataArray) {
            this.maxVolume = 0;
           
            let totalProcessedData = [];
            
            // Convert the dates from epoch timestamps to date objects //
            this.dates = Object.keys(dataArray[0]).sort().map(d => moment(+d * 1000).toDate());
            for (let d = 0; d < dataArray.length; d++) {
                let processedData = [];
                for (let o in dataArray[d]) {
                    // Find the max volume //
                    if (dataArray[d][o] > this.maxVolume) {
                        this.maxVolume = dataArray[d][o];
                    }

                    // Convert the data to a D3-friendly format //
                    processedData.push({
                        date: o * 1000,
                        volume: dataArray[d][o]
                    });
                }
            

            var newProcessedData = [
                {
                    name: 'volume',
                    values: processedData.map(function(d) {
                        return {x: d.date, y: d.volume};
                    })
                }
             ];
             totalProcessedData.push(newProcessedData)
            }
            this.totalProcessedData = totalProcessedData 
        
        
    }

    showCharts(){
        var chartsToRender = [];
        let barLeftTranslate = this.padding.left + this.barWidth/2;
        let barTopTranslate = 15;
        for(let dataCount = 0; dataCount < this.props.dataToRender.data.length; dataCount++){
           let color = this.props.dataToRender.colors[dataCount]
            if(this.props.chartOption == "area"){
            chartsToRender.push(<AreaChart
                        x={this.xScale}
                        y={this.yScale}
                        data={this.stack(this.totalProcessedData[dataCount])}
                        translateLeft={35}
                        translateTop={-5}
                        className='class'
                        color={color}
                        fill={color}
                        opacity={0.4}
                        />)
        }
        else if(this.props.chartOption == "bar"){
            let dataToSend = []
            for(var i=0;i<this.totalProcessedData[dataCount].length;i++){dataToSend.push(this.totalProcessedData[dataCount][i].values)}
            chartsToRender.push(<BarChart
                        id={'volume'}
                        transform={"translate(" + (barLeftTranslate) + "," + (barTopTranslate)}
                        padding={1}
                        barWidth={6}
                        chartType={'volume'}
                        xScale={this.xScale}
                        colors={color}
                        yScale={this.yScale}
                        data={dataToSend}
                        height={this.height}
                        translateLeft={35}
                        translateTop={-5}
                    />)
             }
             else if(this.props.chartOption == 'line'){
                chartsToRender.push(<AreaChart
                        x={this.xScale}
                        y={this.yScale}
                        data={this.stack(this.totalProcessedData[dataCount])}
                        translateLeft={35}
                        translateTop={-5}
                        className='class'
                        color={color}
                        opacity={1}
                        fill={'none'}
                        />)
             }
         }
        return(
                <g>{chartsToRender}</g>
            )
    }

  

    componentWillReceiveProps(nextProps) {
        if (nextProps.width != this.width || nextProps.height != this.height) {
            this.init(nextProps);
            this.forceUpdate();
        }
    }

    handleHover(event){
       
        let crosshairToRender = [];
        let xCoordSvg = event.offsetX;
        let dataX = this.xScale.invert(xCoordSvg - 35)
        let dataXinMilliseconds = moment(dataX).unix()

        for(let numOfDataSets = 0; numOfDataSets < this.props.dataToRender.data.length; numOfDataSets++){
            let curr = 10000000000
            for(let key in this.props.dataToRender.data[0]){
                    if(Math.abs(dataXinMilliseconds - key) < Math.abs(dataXinMilliseconds - curr)){
                        curr = key
                    }
            }

            let yValue = this.yScale(this.props.dataToRender.data[numOfDataSets][curr])
            let xValue = this.xScale(moment(curr * 1000).toDate())

            crosshairToRender.push(<rect height={this.height - yValue - 25} y={yValue - 5} x={xValue + 35} width={1} style={{'fill': '#666666'}} />)
            crosshairToRender.push( <rect height={1} y={yValue - 5} x={35} width={xValue} style={{'fill': '#666666'}} />)
            crosshairToRender.push(<circle cx={xValue + 35} cy={yValue - 5} r={4} stroke="black" fill="#666666" />)
        }

        this.setState({crosshairs: (<g>{crosshairToRender}</g>)})

        
    }

    handleMouseOut(){
        this.setState({crosshairs: (<g></g>)})
    }

    render() {

        let myClasses = classNames(
            'total-impressions',
            {
                "open": this.props.addChartOpen,
                "selected": this.props.selected
            }
        );




        if (this.totalProcessedData) {
            return (
                    <svg width={this.width} height={this.height} className={myClasses} onMouseMove={ ( e ) => { this.handleHover( event ) }} onMouseOut={this.handleMouseOut}  >
                        <Axis
                            type={"date"}
                            scale={this.xScale}
                            orient={"bottom"}
                            ticks={5}
                            tickSize={0}
                            tickValues={this.dates}
                            tickFormat={d3.time.format.utc("%-d")}
                            translateLeft={this.padding.left + 25}
                            translateTop={this.height - 35}
                            className={"xAxis"} />

                        <Axis
                            type={"number"}
                            scale={this.yScale}
                            orient={"left"}
                            ticks={6}
                            tickSize={(0)}
                            tickFormat={(d => CommonUtils.tickFormat(d))}
                            translateLeft={30}
                            translateTop={0}
                            className={"yAxis"} />

                        <Axis
                            type={"month"}
                            scale={this.xScale}
                            orient={"bottom"}
                            ticks={1}
                            tickFormat={d3.time.format.utc("%b")}
                            tickSize={(1, 1, 0)}
                            translateLeft={this.padding.left + 25}
                            translateTop={this.height - 20}
                            className={"monthAxis"}
                            tickValues={[this.minDate]} />

                        
                              {this.showCharts()}
                        
                              {this.state.crosshairs}
                    </svg>
                   
            );
        } else {
            return (<h2 className="no-card-msg">Sorry, there is no data available for this monitor.</h2>);
        }
    }
}

export default TotalImpressions;