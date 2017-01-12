'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import DashboardError from '../../apps/dashboard/components/DashboardError/DashboardError';

describe('Cover', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            header: "Oops!",
            text: "You say it's your birthday? It's my birthday too, yeah!"
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<DashboardError {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.id).to.equal('dashboardError');
        expect(result.props.className).to.equal('dashboard-error');
    });

    it('should render a header', () => {
        let result = renderer.getRenderOutput();
        let header = result.props.children[0];

        expect(header.type).to.equal('h1');
        expect(header.props.children).to.equal(props.header);
    });

    it('should render some text', () => {
        let result = renderer.getRenderOutput();
        let text = result.props.children[1];

        expect(text.type).to.equal('p');
        expect(text.props.children).to.equal(props.text);
    });
});