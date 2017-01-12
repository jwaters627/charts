'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Bar from '../Bar/Bar';
import d3 from 'd3';

class DataSeries extends React.Component {
    static propTypes = {
        colors: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string, React.PropTypes.func]),
        data: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.number, React.PropTypes.object]).isRequired,
        height: React.PropTypes.number,
        xScale: React.PropTypes.func,
        yScale: React.PropTypes.func,
        barWidth: React.PropTypes.number,
        translateLeft: React.PropTypes.number.isRequired,
        translateTop: React.PropTypes.number.isRequired,
        padding: React.PropTypes.object
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
        switch (props.type) {
            case 'bar':
                series = _.map(props.data, function(d, i) {
                    return (
                        <Bar
                            key={Math.random()*i}
                            x={d.x}
                            y={d.y}
                            y0={d.y0 || 0}
                            color={typeof props.color == 'function' ? props.color(props.i) : props.color}
                            xScale={props.xScale}
                            yScale={props.yScale}
                            padding={props.padding}
                            height={props.height}
                            barWidth={props.barWidth}
                            chartType={props.chartType} />

                    );
                });
                break;
        }

        return (<g>{series}</g>);
    }
}

export default DataSeries;