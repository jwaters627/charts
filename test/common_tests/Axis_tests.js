'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import d3 from 'd3';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Axis from '../../common/components/Axis/Axis';

describe('Axis', () => {
    let node = document.createElement('div');
    let component;

    beforeEach(function() {
        component = ReactDOM.render(
            <Axis
                scale={d3.time.scale()}
                tickSize={0}
                ticks={5}
                tickFormat={(d => d)}
                orient={'bottom'}
                translateLeft={10}
                translateTop={20}
                type={'axis test'}
                className={'test'} />,
            node);
    });

    it('should render a react component with correct props', () => {
        expect(component).to.not.equal(null);
    });

    it('should update component with new props', () => {
        ReactDOM.render(
            <Axis
                scale={d3.time.scale()}
                tickSize={0}
                ticks={5}
                tickFormat={(d => d)}
                orient={'bottom'}
                translateLeft={45}
                translateTop={15}
                type={'axis test 1'}
                className={'test'} />,
            node);
        expect(component.props.translateLeft).to.equal(45);
        expect(component.props.translateTop).to.equal(15);
        expect(component.props.type).to.equal('axis test 1');
    });
});