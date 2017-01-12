'use strict';

import React from 'react';
import d3 from 'd3';

class Arc extends React.Component {
    static propTypes = {
        color: React.PropTypes.string.isRequired,
        endAngle: React.PropTypes.number.isRequired,
        padAngle: React.PropTypes.number.isRequired,
        value: React.PropTypes.number.isRequired,
        startAngle: React.PropTypes.number.isRequired,
        translateLeft: React.PropTypes.number.isRequired,
        translateTop: React.PropTypes.number.isRequired,
        innerRadius: React.PropTypes.number.isRequired,
        outerRadius: React.PropTypes.number.isRequired
    };

    componentWillMount() {
        this.callArc(this.props)
    }

    componentDidMount() {
        this.renderArc();
    }
    componentWillReceiveProps(nextProps) {
        this.callArc(nextProps);
    }

    componentDidUpdate() {
        this.renderArc();
    }

    callArc(props) {
        this.arc = d3.svg.arc()
            .innerRadius(props.innerRadius)
            .outerRadius(props.outerRadius)
            .startAngle(props.startAngle)
            .endAngle(props.endAngle);
    }

    renderArc() {
        let translateLeft = this.props.translateLeft;
        let translateTop = this.props.translateTop;
        d3.select(this.refs[this.props.className])
            .attr("transform", "translate(" + translateLeft + "," + translateTop + ")")
            .style("fill", this.props.color)
            .attr('d', this.arc);

    }

    render() {
        let props = this.props;
        return (<path className={props.className} ref={props.className} />);
    }
}

export default Arc;