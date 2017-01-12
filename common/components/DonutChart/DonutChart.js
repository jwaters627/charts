'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import _ from 'lodash';
import Arc from '../Arc/Arc';

class DonutChart extends React.Component {
    static propTypes = {
        innerRadius: React.PropTypes.number.isRequired,
        outerRadius: React.PropTypes.number.isRequired,
        data: React.PropTypes.array.isRequired,
        className: React.PropTypes.string.isRequired,
        color: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array, React.PropTypes.func]),
        translateLeft: React.PropTypes.number.isRequired,
        translateTop: React.PropTypes.number.isRequired,
        arcScale: React.PropTypes.func.isRequired
    };

    componentDidMount() {
        this.updatePosition(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updatePosition(nextProps);
    }

    updatePosition(props) {
        let translateLeft = props.translateLeft;
        let translateTop = props.translateTop;
        d3.select(ReactDOM.findDOMNode(this))
            .attr("class", props.className)
            .attr("transform", "translate(" + translateLeft + "," + translateTop + ")");

    }

    render() {
        let props = this.props;
        let series;
        series = _.map(props.data, function(series, i) {
            return (
                <Arc
                    i={i}
                    key={i*Math.random()}
                    innerRadius={props.innerRadius}
                    outerRadius={props.outerRadius}
                    color={props.colors(i)}
                    endAngle={series.endAngle}
                    padAngle={series.padAngle}
                    startAngle={series.startAngle}
                    value={series.value}
                    translateLeft={props.translateLeft}
                    translateTop={props.translateTop}
                    type={'donut'}
                    className={'arc' + i}
                    />
            );
        });
        return (
            <g>{series}</g>
        );
    }
}

export default DonutChart;