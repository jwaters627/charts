'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Card from '../../apps/dashboard/components/Card/Card';

describe('Card', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            index: "1",
            name: "Chart Name",
            source: "Monitor Name",
            cardProps: { x: 1, y: 1, w: 4, h: 6, i: "1", minW: 4, minH: 6, data: {'2016-06-24T00:00':'0', '2016-06-25T00:00':'0'} },
            cardEdit: { index: '', value: false },
            style: { zIndex: 100 }
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<Card {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.className).to.equal('dashboard-card');
    });

    it('should render a title bar', () => {
        let result = renderer.getRenderOutput();
        let title = result.props.children[0];

        expect(title).to.not.equal(null);
        expect(title.props.className).to.equal('card-title');
    });

    it('should render the viz source', () => {
        let result = renderer.getRenderOutput();
        let title = result.props.children[0];
        let source = title.props.children[0];

        expect(source).to.not.equal(null);
        expect(source.props.className).to.equal('name');
    });

    it('should render the viz name', () => {
        let result = renderer.getRenderOutput();
        let title = result.props.children[0];
        let name = title.props.children[1];

        expect(name).to.not.equal(null);
        expect(name.props.className).to.equal('menu-icon');
    });

    it('should render the menu icon', () => {
        let result = renderer.getRenderOutput();
        let title = result.props.children[0];
        let icon = title.props.children[2];

        expect(icon).to.not.equal(null);
    });

    it('should render the card contents', () => {
        let result = renderer.getRenderOutput();
        let contents = result.props.children[1];

        expect(contents).to.not.equal(null);
        expect(contents.props.className).to.equal('contents');
    });
});