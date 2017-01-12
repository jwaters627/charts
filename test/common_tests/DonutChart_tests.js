'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import d3 from 'd3';
import _ from 'lodash';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import DonutChart from '../../common/components/DonutChart/DonutChart';

describe('DonutChart', () => {
    let node = document.createElement('div');
    let component;

    beforeEach(function() {
        component = ReactDOM.render(
            <DonutChart
                colors={d3.scale.ordinal().range(["#c32635","#ededed", "#72b246"])}
                innerRadius={20}
                outerRadius={30}
                data={[{x:1, y:1}, {x:2, y:1},{x:3, y:5},{x:4, y:6},{x:5, y:10},{x:6, y:0},{x:7, y:15},{x:8, y:7},{x:9, y:20}]}
                className={'donut'}
                translateLeft={60}
                translateTop={80}
                arcScale={d3.scale.linear().domain([0,100]).range([0, 2 * Math.PI])}
                id={"mmmm...donuts"}
                />,
            node);
    });

    it('should render a react component with correct props', () => {
        expect(component).to.not.equal(null);
        expect(component.props.id).to.equal("mmmm...donuts");
    });
});