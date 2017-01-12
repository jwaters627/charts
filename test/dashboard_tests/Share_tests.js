'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Share from '../../apps/dashboard/components/Share/Share';

describe('Share', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            id: 1,
            dashboardId: 1234,
            classes: 'test',
            name: 'Erik Klingman',
            initials: 'EK',
            email: 'eklingman@crimsonhexagon.com',
            type: 'add'
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<Share {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.id).to.equal('share');
        expect(result.props.className).to.equal('share ' + props.classes);
    });

    it('should have the proper ID', () => {
        let result = renderer.getRenderOutput();

        expect(result.props['data-id']).to.equal(props.id);
    });

    it('should render a user\'s initials', () => {
        let result = renderer.getRenderOutput();
        let initials = result.props.children[0];

        expect(initials.type).to.equal('div');
        expect(initials.props.className).to.equal('initials');
        expect(initials.props.children).to.equal(props.initials);
    });

    it('should render a user\'s name', () => {
        let result = renderer.getRenderOutput();
        let name = result.props.children[1];

        expect(name.type).to.equal('div');
        expect(name.props.className).to.equal('name');
        expect(name.props.children).to.equal(props.name);
    });

    it('should render a user\'s email', () => {
        let result = renderer.getRenderOutput();
        let email = result.props.children[2];

        expect(email.type).to.equal('div');
        expect(email.props.className).to.equal('email');
        expect(email.props.children).to.equal(props.email);
    });

    it('should render a checkbox (when type=add)', () => {
        let result = renderer.getRenderOutput();
        let checkbox = result.props.children[3];

        expect(checkbox.type).to.equal('input');
        expect(checkbox.props.className).to.equal('checkbox');
        expect(checkbox.props.checked).to.equal(false);
    });
});