'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import d3 from 'd3';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import DataSeries from '../../common/components/DataSeries/DataSeries';

describe('DataSeries', () => {
    let node = document.createElement('div');
    let component;
    let padding  = {top: 10, bottom:10};

    beforeEach(function() {
        component = ReactDOM.render(
            <DataSeries
                data={[{x:1, y:1}, {x:2, y:1},{x:3, y:5},{x:4, y:6},{x:5, y:10},{x:6, y:0},{x:7, y:15},{x:8, y:7},{x:9, y:20}]}
                colors={'#5e9bd4'}
                yScale={d3.scale.linear()}
                xScale={d3.time.scale()}
                translateLeft={10}
                translateTop={20}
                padding={padding}
                height={10}
                barWidth={10}
                />,
            node
        );
    });

    it('should render a react component with correct props', () => {
        expect(component).to.not.equal(null);
    });

    it('should update when receiving new props', () => {
        ReactDOM.render(
            <DataSeries
                data={[{x:1, y:1}, {x:2, y:1},{x:3, y:5},{x:4, y:6},{x:5, y:10},{x:6, y:0},{x:7, y:15},{x:8, y:7},{x:9, y:20}]}
                colors={'#5e9bd4'}
                yScale={d3.scale.linear()}
                xScale={d3.time.scale()}
                translateLeft={10}
                translateTop={20}
                padding={padding}
                height={20}
                barWidth={20}
            />, node
        );
        expect(component.props.height).to.equal(20);
        expect(component.props.barWidth).to.equal(20);
    });
});