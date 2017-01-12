'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import FeedbackButton from '../../common/components/feedback-button';

describe('FeedbackButton', () => {
    let renderer = null;
    let url = 'http://www.google.com';

    beforeEach(function() {
        renderer = TestUtils.createRenderer();
        renderer.render(<FeedbackButton url={url} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.type).to.equal('a');
    });

    it('should have the right URL prop', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.href).to.equal(url);
    });

    it('should open in a new window', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.target).to.equal('_blank');
    });
});