'use strict';

import d3 from 'd3';
import React from 'react';
import moment from 'moment';
import BarChart from '../../../../common/components/BarChart/BarChart';
import Axis from '../../../../common/components/Axis/Axis';
require('./Ethnicity.scss');

class Ethnicity extends React.Component {
    padding = {
        top: 20,
        bottom: 20,
        left: 32,
        right: 45
    };

    static propTypes = {
        data: React.PropTypes.object.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.init(props);
    };


    init(props) {
        this.padding = {top: 10, bottom: 10, left: 10, right: 10};
        this.data = props.data;
        this.width = props.width - this.padding.left - this.padding.right;
        this.height = props.height - this.padding.top - this.padding.bottom;
        this.barPadding = 5;
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
        let obj = this.data.volumeByEthnicity;
        let arr = Object.keys(obj).map(function (key) { return obj[key]; });
        this.formattedData = [];
        _.map(obj, function(d, i) { self.formattedData.push({ x: i, y: d}) });
        this.barWidth = (this.width/1.4)/this.formattedData.length;
        this.total = Math.max.apply(null, arr);
        this.xScale = d3.scale.ordinal().domain(Object.keys(obj)).rangePoints([5, (this.width/1.4)]);
        this.yAxisScale = d3.scale.linear().domain([0, (this.total * 2) || 1000]).range([(this.height - this.padding.bottom - 20), 0]);
        this.yScale = d3.scale.linear().domain([0, (this.total * 2) || 1000]).range([0, (this.height - this.padding.bottom - 20)]);
        this.colors = '#5e9bd4';
    }

    render() {
        if (this.data) {
            return (
                <svg width={this.width} height={this.height} className="ethnicity">
                    <Axis
                        type={"number"}
                        scale={this.yAxisScale}
                        orient={"left"}
                        tickFormat={(d => this.tickFormat(d))}
                        tickSize={(0)}
                        ticks={3}
                        translateLeft={20}
                        translateTop={0}
                        className={"yAxis"}
                        />
                    <Axis
                        type={"race"}
                        scale={this.xScale}
                        orient={"bottom"}
                        ticks={Object.keys(this.data.volumeByEthnicity).length}
                        tickSize={(1, 1, 0)}
                        tickValues={Object.keys(this.data.volumeByEthnicity)}
                        tickFormat={(d => d)}
                        translateLeft={this.barWidth}
                        translateTop={this.height - 25}
                        className={"race"}
                        />
                    <BarChart
                        id={'ethnicity'}
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

    }
};

export default Ethnicity;
