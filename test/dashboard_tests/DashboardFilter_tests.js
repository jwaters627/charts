'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import DashboardFilter from '../../apps/dashboard/components/DashboardFilter/DashboardFilter';

describe('DashboardFilter', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            classes: 'active',
            icon: 'fa-users',
            label: 'Shared with me',
            count: 0
        };

        renderer = TestUtils.createRenderer();
        renderer.render(<DashboardFilter {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.type).to.equal('div');
        expect(result.props.className).to.equal('filter ' + props.classes);
    });

    it('should have 3 children', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.children.length).to.equal(3);
    });

    it('should render an icon', () => {
        let result = renderer.getRenderOutput();
        let icon = result.props.children[0];

        expect(icon.type).to.equal('i');
        expect(icon.props.className).to.equal('fa ' + props.icon);
    });

    it('should render a label', () => {
        let result = renderer.getRenderOutput();
        let label = result.props.children[1];

        expect(label.type).to.equal('label');
        expect(label.props.children).to.equal(props.label);
    });

    it('should render a count', () => {
        let result = renderer.getRenderOutput();
        let count = result.props.children[2];

        expect(count.type).to.equal('span');
        expect(count.props.className).to.equal('count');
        expect(count.props.children).to.equal(props.count);
    });
});