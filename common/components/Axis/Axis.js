'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class Axis extends React.Component {
    static propTypes = {
        orient: React.PropTypes.string.isRequired,
        ticks: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.func, React.PropTypes.object, React.PropTypes.array]).isRequired,
        tickFormat: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.func, React.PropTypes.object, React.PropTypes.array]).isRequired,
        tickSize: React.PropTypes.number.isRequired,
        translateLeft: React.PropTypes.number.isRequired,
        translateTop: React.PropTypes.number.isRequired,
        scale: React.PropTypes.func.isRequired,
        type: React.PropTypes.string.isRequired,
        className: React.PropTypes.string.isRequired,
        tickValues: React.PropTypes.array
    };

    componentWillMount() {
        this.callAxis(this.props)
    }

    componentDidMount() {
        this.renderAxis();
    }
    componentWillReceiveProps(nextProps) {
        this.callAxis(nextProps);
    }

    componentDidUpdate() {
        this.renderAxis();
    }

    callAxis(props) {
        this.axis = d3.svg.axis()
            .scale(props.scale)
            .orient(props.orient)
            .ticks(props.ticks)
            .tickValues(props.tickValues)
            .tickFormat(props.tickFormat)
            .tickSize(props.tickSize);
    }

    renderAxis() {
        let translateLeft = this.props.translateLeft;
        let translateTop = this.props.translateTop;
        d3.select(this.refs[this.props.className])
            .attr("transform", "translate(" + translateLeft + "," + translateTop + ")")
            .call(this.axis)
           
    }

    render() {
        let props = this.props;
        return (<g className={props.className} ref={props.className} />);
    }
}

export default Axis;