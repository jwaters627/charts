'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import d3 from 'd3';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Arc from '../../common/components/Arc/Arc';

describe('Arc', () => {
    let node = document.createElement('div');
    let component;

    beforeEach(function() {
        component = ReactDOM.render(
            <Arc
                i={1}
                key={1}
                innerRadius={10}
                outerRadius={20}
                color={"blue"}
                endAngle={25}
                padAngle={35}
                startAngle={45}
                value={10}
                translateLeft={30}
                translateTop={30}
                type={'donut'}
                className={'arc' + 1}
                />,
            node);
    });

    it('should render a react component with correct props', () => {
        expect(component).to.not.equal(null);
    });

    it('should update component with new props', () => {
        ReactDOM.render(
            <Arc
                i={1}
                key={1}
                innerRadius={10}
                outerRadius={20}
                color={"blue"}
                endAngle={25}
                padAngle={35}
                startAngle={45}
                value={10}
                translateLeft={15}
                translateTop={45}
                type={'arc test'}
                className={'arc' + 2}
                />,
            node);
        expect(component.props.translateLeft).to.equal(15);
        expect(component.props.translateTop).to.equal(45);
        expect(component.props.className).to.equal('arc2');
    });
});