'use strict';

import d3 from 'd3';
import React from 'react';
import Icon from '../../../../common/icons';
import DonutChart from '../../../../common/components/DonutChart/DonutChart';

require('./Gender.scss');

class Gender extends React.Component {
    static propTypes = {
        data: React.PropTypes.object.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.init(props);
    }

    init(props) {
        this.data = props.data;
        this.width = props.width - 5;
        this.height = props.height - 5;
        this.prepareData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.init(nextProps);
            this.forceUpdate();
        }
    }

    prepareData() {
        this.maleProportion = Math.round(this.data.volumeByGender.M/this.data.totalVolumeKnownGender * 100) || 0;
        this.femaleProportion = Math.round(this.data.volumeByGender.F/this.data.totalVolumeKnownGender * 100) || 0;
        let pie = d3.layout.pie().value(function(d) {   return d.value; }).sort(null);
        this.formattedData = pie([{label: 'female', value: this.femaleProportion }, { label: 'male', value: this.maleProportion}]);
        this.colors = d3.scale.ordinal().range(['#93BDE5', '#5F9ED8']);
        this.arcScale = d3.scale.linear().domain([0,100]).range([0, 2 * Math.PI]);
    }

    render() {

        return (
            <div style={{height: this.height, width: this.width}} className="gender">
                <svg id="donut-svg" height={this.height/1.2} width={this.width}>
                    <DonutChart
                        colors={this.colors}
                        innerRadius={this.width/8}
                        outerRadius={this.width/6}
                        data={this.formattedData}
                        className={'donut'}
                        translateLeft={this.width/4}
                        translateTop={this.height/4.7}
                        arcScale={this.arcScale}
                        id={"gender"}
                        />
                </svg>
                <div className="icons">
                    <Icon name="male" style={{height: this.height/2, width: this.width/10}} />
                    <Icon name="female" style={{height: this.height/2, width: this.width/10}} />
                </div>
                <div className="percent" style={{width: this.width, top: -(this.height/2)}}>
                    <span>{this.maleProportion + '% Male  '}</span>
                    <span>{this.femaleProportion + '% Female'}</span>
                </div>
            </div>
        );
    }
};

export default Gender;