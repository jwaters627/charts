'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import d3 from 'd3';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Bar from '../../common/components/Bar/Bar';

describe('Bar', () => {
    let renderer = null;

    beforeEach(function() {
        let padding  = {top: 10, bottom:10};
        renderer = TestUtils.createRenderer();
        renderer.render(
            <Bar
                yScale={d3.scale.linear()}
                xScale={d3.time.scale()}
                x={0}
                y={0}
                padding={padding}
                barWidth={5}
                />,
            {flux: new Flux()});
    });

    it('should render a react component with correct props', () => {
        let result = renderer.getRenderOutput();
        expect(result).to.not.equal(null);
    });
});