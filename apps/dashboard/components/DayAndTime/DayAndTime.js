'use strict';

import d3 from 'd3';
import React from 'react';
import moment from 'moment';
import BarChart from '../../../../common/components/BarChart/BarChart';
import Axis from '../../../../common/components/Axis/Axis';
import classNames from 'classnames';
require('./DayAndTime.scss');

class DayAndTime extends React.Component {
    padding = {
        top: 20,
        bottom: 20,
        left: 32,
        right: 45
    };

    static propTypes = {
        dataToRender: React.PropTypes.object.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.init(props);
    };


    init(props) {
        this.data = props.dataToRender.data;
        this.width = props.width - 5;
        this.height = props.height - 5;
        this.barPadding = 5;
        this.prepareData();
        this.setScalesAndMax();
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.width != this.width || nextProps.height != this.height) {
            this.init(nextProps);
            this.forceUpdate();
        }
    }

    getDateRangeArray(startDate, endDate, interval, total) {
        let config = {
                interval: interval || 'days',
                total: total || 1
            },
            dateArray = [],
            currentDate = startDate.clone();

        while (currentDate < endDate) {
            dateArray.push(currentDate.toDate());
            currentDate = currentDate.clone().add(config.total, config.interval);
        }
        return dateArray;
    }

    // https://github.com/d3/d3/issues/2241#issuecomment-150099953 //
    tickFormat = (v) => {
        let formatNumber = d3.format(".0f"),
            formatBillion = function(x) { return formatNumber(x / 1e9) + "B"; },
            formatMillion = function(x) { return formatNumber(x / 1e6) + "M"; },
            formatThousand = function(x) { return formatNumber(x / 1e3) + "k"; },
            formatHundred = function(x) { return formatNumber(x);};

        if (v < 1) {
            return v;
        } else {
            return (v >= .9995e9 ? formatBillion : v >= .9995e6 ? formatMillion :  v >= .9995e3 ? formatThousand : formatHundred)(v);
        }
    }

    prepareData() {
        let self = this;
        this.totalData = [];
        for (let d = 0; d < this.props.dataToRender.data.length; d++){
            let formattedData = [];
            this.hours = Object.keys(this.props.dataToRender.data[d].volumeByHour);
            _.map(this.props.dataToRender.data[d].volumeByHour, function(d, i) { formattedData.push({ x: parseInt(i), y: d}) });
            this.barWidth = Math.round(this.width/this.hours.length)/2 || 0;
            this.totalData.push(formattedData)
        }
    }

    setScalesAndMax() {
        let obj = this.data[0].volumeByHour;
        let width = Math.round(this.width - this.padding.right - this.barWidth);
        let arr = Object.keys(obj).map(function (key) { return obj[key]; });
        let startDate = moment().startOf('day');
        let endDate = moment().endOf('day');
        this.xAxisTickFormat = function(d) {
            let hour = d.getHours();
           if (hour == 0) {
                hour = 'am'
            } else if (hour == 12) {
                hour = 'pm'
            } else {
                hour = '';
            }
            return hour;
        };
        this.dateRange = this.getDateRangeArray(startDate, endDate, 'hours');
        this.total = Math.max.apply(null, arr);
        this.xAxisScale =  d3.time.scale().domain([startDate.toDate(), endDate.toDate()]).range([5, width]);
        this.xScale = d3.scale.linear().domain([0, 24]).range([5, width]);
        this.yAxisScale = d3.scale.linear().domain([0, (this.total * 1.2) || 1000]).range([(this.height - this.padding.bottom - 15), 0]);
        this.yScale = d3.scale.linear().domain([0, (this.total * 1.2)]).range([0, (this.height - this.padding.bottom - this.padding.top)]);
        this.colors = '#5e9bd4';
    }

     showCharts(){
        this.prepareData();
        let barLeftTranslate = this.padding.left + this.barWidth/2;
        let barTopTranslate = 15;
        let chartsToRender = this.props.dataToRender.data.map( ( dataSet, dataCount ) => {

            let color = this.props.dataToRender.colors[dataCount]
            return (<BarChart
                        id={'dayandtime'}
                        transform={"translate(" + (barLeftTranslate) + "," + (barTopTranslate)}
                        padding={this.padding}
                        barWidth={this.barWidth}
                        xScale={this.xScale}
                        colors={color}
                        yScale={this.yScale}
                        data={[this.totalData[dataCount]]}
                        height={this.height}
                        translateLeft={barLeftTranslate}
                        translateTop={barTopTranslate - 5}
                    />);
        });

        return(
            <g>{chartsToRender}</g>
        )
    }

    render() {
         let myClasses = classNames(
            'day-and-time',
            {
                "open": this.props.addChartOpen,
                'selected': this.props.selected
            }
        );

        if (this.hours) {
            
            return (
                <svg width={this.width} height={this.height} className={myClasses}>
                    <Axis
                        type={"number"}
                        scale={this.yAxisScale}
                        orient={"left"}
                        tickFormat={(d => this.tickFormat(d))}
                        tickSize={0}
                        ticks={6}
                        translateLeft={this.padding.left}
                        translateTop={5}
                        className={"yAxis"}
                        />
                    <Axis
                        type={"hours"}
                        scale={this.xAxisScale}
                        orient={"bottom"}
                        ticks={this.dateRange.length}
                        tickSize={0}
                        tickValues={this.dateRange}
                        tickFormat={(d3.time.format("%I"))}
                        translateLeft={Math.round(this.padding.left + this.barWidth)}
                        translateTop={this.height - 27}
                        className={"xAxis"}
                        />
                    <Axis
                        type={"hours"}
                        scale={this.xAxisScale}
                        orient={"bottom"}
                        ticks={this.dateRange.length}
                        tickSize={0}
                        tickValues={this.dateRange}
                        tickFormat={(d => this.xAxisTickFormat(d))}
                        translateLeft={Math.round(this.padding.left + (this.barWidth * 1.1))}
                        translateTop={this.height - 17}
                        className={"xAxisAmPm"}
                        />
                    
                        {this.showCharts()}
                </svg>
            );
        }
    }
};

export default DayAndTime;
