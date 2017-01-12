'use strict';

import React from 'react';
import d3 from 'd3';

class AreaChart extends React.Component {
    static propTypes = {
        x: React.PropTypes.func.isRequired,
        y: React.PropTypes.func.isRequired,
        data: React.PropTypes.array.isRequired,
        className: React.PropTypes.string.isRequired,
        translateLeft: React.PropTypes.number.isRequired,
        translateTop: React.PropTypes.number.isRequired
    };

    componentDidMount() {
        this.renderChart(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.renderChart(nextProps);
    }

    renderChart(props) {
        let area = d3.svg.area()
            .x(function(d) { return props.x(d.x); })
            .y0(function(d) { return props.y(d.y0); })
            .y1(function(d) { return props.y(d.y); })
            .interpolate('linear');

        d3.select(this.refs[props.className])
            .data(props.data)
            .attr('d', function(d) { return area(d.values); })
            .attr('transform', 'translate(' + props.translateLeft + ',' + props.translateTop + ')');
    }

    render() {
        return (<path className={this.props.className} style={{'fill': this.props.fill, 'fillOpacity': this.props.opacity, 'strokeOpacity': 1, 'stroke': this.props.color, 'strokeWidth': '2'}} ref={this.props.className}></path>);
    }
}

export default AreaChart;