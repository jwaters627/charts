'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Cover from '../../apps/dashboard/components/Cover/Cover';

describe('Cover', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            onClick: function() { return null; },
            style: { zIndex: '100' }
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<Cover {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.id).to.equal('cover');
        expect(result.props.className).to.equal('cover');
    });

    it('should handle onClick when clicking', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.onClick()).to.equal(props.onClick());
    });

    it('should display with the proper styles', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.style).to.deep.equal(props.style);
    });
});