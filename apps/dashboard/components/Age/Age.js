'use strict';

import d3 from 'd3';
import React from 'react';
import moment from 'moment';
import BarChart from '../../../../common/components/BarChart/BarChart';
import Axis from '../../../../common/components/Axis/Axis';
require('./Age.scss');

const AGE_BRACKETS = {
    ZERO_TO_SEVENTEEN: "17 and below",
    EIGHTEEN_TO_TWENTYFOUR: "18-24",
    TWENTYFIVE_TO_THIRTYFOUR: "25-34",
    THIRTYFIVE_AND_OVER: "35 and over"
};

class Age extends React.Component {

    constructor(props) {
        super(props);
        this.init(props);
    };


    init(props) {
        this.padding = {top: 10, bottom: 10, left: 5, right: 5};
        this.data = props.data;
        this.width = props.width - this.padding.left - this.padding.right;
        this.height = props.height - this.padding.top - this.padding.bottom;
        this.setScalesAndMax();
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.width != this.width || nextProps.height != this.height) {
            this.init(nextProps);
            this.forceUpdate();
        }
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
        let self = this;
        let obj = this.data.volumeByAge;
        this.domain = {};
        let arr = Object.keys(obj).map(function (key) {
            return self.domain[AGE_BRACKETS[key]] = obj[key];
        });
        this.formattedData = [];
        _.map(this.domain, function(d, i) { self.formattedData.push({ x: i, y: d}) });
        this.barWidth = (this.width/1.4)/Object.keys(obj).length;
        this.total = Math.max.apply(null, arr);
        this.xScale = d3.scale.ordinal().domain(Object.keys(this.domain)).rangePoints([5, (this.width/1.4)]);
        this.yAxisScale = d3.scale.linear().domain([0, (this.total * 2) || 1000]).range([(this.height - this.padding.bottom - this.padding.top), 0]);
        this.yScale = d3.scale.linear().domain([0, (this.total * 2) || 1000]).range([0, (this.height - this.padding.bottom - this.padding.top)]);
        this.colors = '#5e9bd4';
    }

    render() {
            return (
                <svg width={this.width} height={this.height} className="age">
                    <Axis
                        type={"number"}
                        scale={this.yAxisScale}
                        orient={"left"}
                        tickFormat={(d => this.tickFormat(d))}
                        tickSize={0}
                        ticks={3}
                        translateLeft={20}
                        translateTop={-10}
                        className={"yAxis"}
                        />
                    <Axis
                        type={"age-range"}
                        scale={this.xScale}
                        orient={"bottom"}
                        ticks={Object.keys(this.domain).length}
                        tickSize={(1, 1, 0)}
                        tickValues={Object.keys(this.domain)}
                        tickFormat={(d => d)}
                        translateLeft={this.barWidth}
                        translateTop={this.height - 25}
                        className={"age"}
                        />
                    <BarChart
                        id={'age'}
                        transform={"translate(" + (0) + "," + (0)}
                        padding={this.padding}
                        barWidth={this.barWidth}
                        xScale={this.xScale}
                        colors={this.colors}
                        yScale={this.yScale}
                        data={[this.formattedData]}
                        height={this.height}
                        translateLeft={this.barWidth/2}
                        translateTop={-10}
                        />
                </svg>
            );

    }
};

export default Age;
