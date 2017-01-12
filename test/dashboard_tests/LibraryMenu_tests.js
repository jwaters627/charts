'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import LibraryMenu from '../../apps/dashboard/components/LibraryMenu/LibraryMenu';

describe('LibraryMenu', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            userMenuOpen: false,
            libraryMenuProps: {className: 'open'},
            monitors: [
                {id: 1, name: 'Test1'},
                {id: 2, name: 'Test2'},
                {id: 3, name: 'Test3'},
                {id: 4, name: 'Test4'},
            ]
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<LibraryMenu {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.id).to.equal('libraryMenu');
        expect(result.props.className).to.equal('media-menu ' + props.libraryMenuProps.className);
    });

    it('should render a title bar', () => {
        let result = renderer.getRenderOutput();
        let title = result.props.children[0];

        expect(title.props.className).to.equal('menu-title');
        expect(title.props.children.length).to.equal(3);
    });

    it('should render a search field', () => {
        let result = renderer.getRenderOutput();
        let search = result.props.children[1];

        expect(search.props.className).to.equal('menu-search');
        expect(search.props.children.type).to.equal('input');
    });

    it('should render a list of monitors', () => {
        let result = renderer.getRenderOutput();
        let list = result.props.children[2];

        expect(list.type).to.equal('ul');
        expect(list.props.children.length).to.equal(props.monitors.length);
    });

    it('should have a clear cover below it', () => {
        let result = renderer.getRenderOutput();
        let cover = result.props.children[3];

        expect(cover).to.not.equal(null);
        expect(cover.props.id).to.equal('cover');
        expect(cover.props.style.zIndex).to.equal('-1');
    });
});