'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import MediaMenu from '../../apps/dashboard/components/MediaMenu/MediaMenu';

describe('MediaMenu', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            userMenuOpen: false,
            mediaMenuProps: {className: 'open'}
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<MediaMenu {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.id).to.equal('mediaMenu');
        expect(result.props.className).to.equal('media-menu ' + props.mediaMenuProps.className);
    });

    it('should render a header (hidden by default)', () => {
        let result = renderer.getRenderOutput();
        let header = result.props.children[0];

        expect(header.type).to.equal('h1');
        expect(header.props.children).to.equal('Start Adding Your Media');
    });

    it('should render a title bar', () => {
        let result = renderer.getRenderOutput();
        let title = result.props.children[1];

        expect(title.props.className).to.equal('menu-title');
        expect(title.props.children.length).to.equal(2);
    });

    it('should render three options for adding widgets', () => {
        let result = renderer.getRenderOutput();
        let list = result.props.children[2];

        expect(list.type).to.equal('ul');
        expect(list.props.children.length).to.equal(3);
    });

    it('should have a clear cover below it', () => {
        let result = renderer.getRenderOutput();
        let cover = result.props.children[3];

        expect(cover).to.not.equal(null);
        expect(cover.props.style.zIndex).to.equal('-1');
    });
});