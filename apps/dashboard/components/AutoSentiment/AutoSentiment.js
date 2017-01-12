'use strict';

import d3 from 'd3';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import BarChart from '../../../../common/components/BarChart/BarChart';
import Axis from '../../../../common/components/Axis/Axis';

require('./AutoSentiment.scss');

class AutoSentiment extends React.Component {
    static propTypes = {
        data: React.PropTypes.object.isRequired,
        className: React.PropTypes.string.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.init(props);
    }

    init(props) {
        this.padding = {top: 10, bottom: 10, left: 5, right: 5};
        this.data = props.data;
        this.width = props.width - this.padding.left - this.padding.right;
        this.height = props.height - this.padding.top - this.padding.bottom;
        this.stack = d3.layout.stack();
        this.prepareDataForBuzz();
        this.setScalesAndMax();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.width != this.width || nextProps.height != this.height) {
            this.init(nextProps);
            this.forceUpdate();
        }
    }

    prepareDataForBuzz() {
        let positive = [];
        let negative = [];
        let neutral = [];
        let dates = Object.keys(this.data.sentiments);
        let sortedDates = dates.sort();
        this.utcDates = sortedDates.map(d => moment.utc(parseInt(d) * 1000).endOf('day').toDate());
        this.minDate = d3.min(this.utcDates);
        this.maxDate = d3.max(this.utcDates);
        _.map(this.data.sentiments, function(date, i) {
            return _.map(date, function(obj) {
                if (obj.categoryName == 'Basic Positive') {
                    positive.push({ x: moment.utc(parseInt(i) * 1000).endOf('day').toDate(), y: obj.volume });
                } else if (obj.categoryName == 'Basic Neutral') {
                    neutral.push({  x: moment.utc(parseInt(i) * 1000).endOf('day').toDate(), y: obj.volume });
                } else if (obj.categoryName == 'Basic Negative') {
                    negative.push({ x: moment.utc(parseInt(i) * 1000).endOf('day').toDate(), y: obj.volume });
                }
            });
        });
        this.barData = [ negative, neutral, positive ];
        this.formattedData = this.stack(this.barData);
        this.barWidth = Math.round((this.width/2)/dates.length) || 0;
        this.scaleWidth = dates.length < 4 ?  Math.round(this.width/2) : Math.round(this.width/1.2);
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

    setScalesAndMax() {
        let max = [];
        _.map(this.barData, (function(series) {
            let arr = [];
            _.map(series, function(date) {
                arr.push(date.y)
            });
            max.push(Math.max(...arr));
        }));
        this.total = Math.max(...max);
        this.xScale =  d3.time.scale().domain([this.minDate, this.maxDate]).range([10, this.scaleWidth]);
        this.yAxisScale = d3.scale.linear().domain([0, (this.total * 2.5) || 1000]).range([(this.height - this.padding.bottom - 20), 0]);
        this.yScale = d3.scale.linear().domain([0, (this.total * 2.5)]).range([0, (this.height - this.padding.bottom - 20)]);
        this.colors = d3.scale.ordinal().range(["#c32635","#ededed", "#72b246"]);
    }

    render() {
        if (this.formattedData) {
            return (
                <svg width={this.width} height={this.height} className="auto-sentiment">
                    <Axis
                        type={"date"}
                        scale={this.xScale}
                        orient={"bottom"}
                        ticks={this.utcDates.length}
                        tickSize={0}
                        tickValues={this.utcDates}
                        tickFormat={d3.time.format("%d")}
                        translateLeft={this.barWidth + 20}
                        translateTop={this.height - 25}
                        className={"xAxis"}
                        />
                    <Axis
                        type={"number"}
                        scale={this.yAxisScale}
                        orient={"left"}
                        ticks={3}
                        tickSize={(0)}
                        tickFormat={(d => this.tickFormat(d))}
                        translateLeft={30}
                        translateTop={0}
                        className={"yAxis"} />
                    <Axis
                        type={"month"}
                        scale={this.xScale}
                        orient={"bottom"}
                        ticks={1}
                        tickFormat={d3.time.format("%b")}
                        tickSize={(1, 1, 0)}
                        translateLeft={this.barWidth + 20}
                        translateTop={this.height - 13}
                        className={"monthAxis"}
                        tickValues={[this.minDate]}
                        />
                    <BarChart
                        id={'sentiment'}
                        transform={"translate(" + (0) + "," + (0)}
                        padding={this.padding}
                        barWidth={this.barWidth}
                        xScale={this.xScale}
                        colors={this.colors}
                        yScale={this.yScale}
                        data={this.formattedData}
                        height={this.height}
                        translateLeft={this.barWidth/2 + 20}
                        translateTop={-10}
                        />
                </svg>
            );
        }
    }
}

export default AutoSentiment;