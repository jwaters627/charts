'use strict';

import React from 'react';
import d3 from 'd3';

class Crosshair extends React.Component {
    static propTypes = {
        x: React.PropTypes.func.isRequired,
        currentX: React.PropTypes.number.isRequired,
        y: React.PropTypes.func.isRequired,
        height: React.PropTypes.number.isRequired,
        currentY: React.PropTypes.number.isRequired,
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
        

    }

    render() {
        return (<rect className={this.props.className} height={this.props.height - 20} y={20} x={this.props.currentX} width={2} ></rect>
               );
    }
}

export default Crosshair;