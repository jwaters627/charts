'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import _ from 'lodash';
import {Flux} from 'ch-flux';
import TotalImpressions from '../../apps/dashboard/components/TotalImpressions/TotalImpressions';

describe('TotalImpressions', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            data: {
                start: 1473440477,
                end: 1471021277,
                volume: {
                    1470009600: 444825275,
                    1470096000: 599083782,
                    1470182400: 483869927,
                    1470268800: 320701683,
                    1470355200: 340969715,
                    1470441600: 0,
                    1470528000: 0,
                    1470614400: 172808502
                }
            },
            width: 325,
            height: 280
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<TotalImpressions {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.type).to.equal('svg');
        expect(result.props.className).to.equal('total-impressions');
    });

    it('should have the right props', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.width).to.equal(props.width - 20);
        expect(result.props.height).to.equal(props.height - 20);
    });
});