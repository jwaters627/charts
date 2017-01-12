'use strict';

import React from 'react';

class Bar extends React.Component {
    static propTypes = {
        yScale: React.PropTypes.func.isRequired,
        xScale: React.PropTypes.func.isRequired,
        y: React.PropTypes.number.isRequired,
        y0: React.PropTypes.number,
        barWidth: React.PropTypes.number.isRequired,
        padding: React.PropTypes.object
    };

    render() {
        let props = this.props;
        let y = props.height - props.yScale(props.y0) - props.padding.top - props.padding.bottom - props.yScale(props.y);
        let height = props.yScale(props.y);
        let x = props.xScale(props.x);

        if(this.props.chartType == 'volume'){
            y = props.yScale(props.y);
            height = props.height - props.yScale(props.y) - 30
            x = props.xScale(props.x) -3;
        }
        
        return (<rect fill={this.props.color} opacity={.4} width={this.props.barWidth} y={y} height={height} x={x} />);
    }
}

export default Bar;