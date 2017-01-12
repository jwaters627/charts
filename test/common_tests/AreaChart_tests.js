'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import _ from 'lodash';
import {Flux} from 'ch-flux';
import d3 from 'd3';
import AreaChart from '../../common/components/AreaChart/AreaChart';

describe('AreaChart', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            x: d3.time.scale(),
            y: d3.scale.linear(),
            data: [{
                name: 'volume',
                values: [
                    {key: "1473033600", y: 0, y0: 0},
                    {key: "1473120000", y: 257589583, y0: 0},
                    {key: "1473206400", y: 343141176, y0: 0},
                    {key: "1473292800", y: 208279049, y0: 0},
                    {key: "1473379200", y: 148989586, y0: 0},
                    {key: "1473465600", y: 0, y0: 0},
                    {key: "1473552000", y: 0, y0: 0},
                    {key: "1473638400", y: 536847024, y0: 0},
                    {key: "1473724800", y: 311238037, y0: 0},
                    {key: "1473811200", y: 0, y0: 0},
                ]
            }],
            className: 'area',
            translateLeft: 0,
            translateTop: 0
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<AreaChart {...props} />, {flux: new Flux()});
    });

    it('should render a react component with correct props', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.type).to.equal('path');
        expect(result.props.className).to.equal(props.className);
    });
});