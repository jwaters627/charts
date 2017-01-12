'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import _ from 'lodash';
import DataSeries from '../DataSeries/DataSeries';

class BarChart extends React.Component {
    static propTypes = {
        data: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]).isRequired,
        height: React.PropTypes.number.isRequired,
        colors: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.array, React.PropTypes.string]).isRequired,
        xScale: React.PropTypes.func.isRequired,
        yScale: React.PropTypes.func.isRequired,
        barWidth: React.PropTypes.number.isRequired,
        monthAxis: React.PropTypes.object,
        padding: React.PropTypes.object
    };

    render() {
        let props = this.props;
        let series;
        let chartType = this.props.chartType || ''
        series = _.map(this.props.data, function(series, i) {
            return (
                <DataSeries
                    i={i}
                    translateLeft={props.translateLeft}
                    translateTop={props.translateTop}
                    transform={props.transform}
                    data={series}
                    key={i*Math.random()}
                    color={props.colors}
                    xScale={props.xScale}
                    yScale={props.yScale}
                    padding={props.padding}
                    height={props.height}
                    width={props.width}
                    barWidth={props.barWidth}
                    type={'bar'}
                    chartType={chartType} />);
        });

        return (<g>{series}</g>);
    }
}

export default BarChart;