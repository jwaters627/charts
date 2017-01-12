'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import d3 from 'd3';
import _ from 'lodash';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import BarChart from '../../common/components/BarChart/BarChart';

describe('BarChart', () => {
    let renderer = null;

    beforeEach(function() {
        let padding  = {top: 10, bottom:10};
        renderer = TestUtils.createRenderer();
        renderer.render(
            <BarChart
                colors={'#5e9bd4'}
                yScale={d3.scale.linear()}
                xScale={d3.time.scale()}
                translateLeft={10}
                translateTop={20}
                padding={padding}
                height={10}
                barWidth={10}
                data={[{x:1, y:1}, {x:2, y:1},{x:3, y:5},{x:4, y:6},{x:5, y:10},{x:6, y:0},{x:7, y:15},{x:8, y:7},{x:9, y:20}]}
                />,
            {flux: new Flux()});
    });

    it('should render a react component with correct props', () => {
        let result = renderer.getRenderOutput();
        expect(result).to.not.equal(null);
    });
});