'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Menu from '../../apps/dashboard/components/Menu/Menu';

describe('Menu', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            userMenuOpen: false,
            menuProps: { display: 'none', x: 0, y: 0, name: '', source: 'Edit' },
            dashboard: {
                creatingUser: 'Erik Klingman',
                creationDate: '2016-06-10T15:20:37.237+0000',
                id: 550543750,
                name: 'Erik Test Dashboard',
                theme: null,
                visualizations: [
                    {h: 6, i: "0", id: 1, minH: 6, minW: 4, w: 4, x: 0, y: 0},
                    {h: 6, i: "1", id: 2, minH: 6, minW: 4, w: 4, x: 4, y: 0},
                    {h: 6, i: "2", id: 3, minH: 6, minW: 4, w: 4, x: 8, y: 0},
                    {h: 6, i: "3", id: 4, minH: 6, minW: 4, w: 4, x: 12, y: 0}
                ]
            },
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<Menu {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.className).to.equal('menu');
    });

    it('should be hidden by default', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.style.display).to.equal(props.menuProps.display);
    });

    it('should be at position {15,0} by default', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.style.top).to.equal(props.menuProps.x + 15);
        expect(result.props.style.left).to.equal(props.menuProps.y);
    });

    it('should render a header', () => {
        let result = renderer.getRenderOutput();
        let header = result.props.children[0];
        expect(header.type).to.equal('div');
    });

    it('should render a source', () => {
        let result = renderer.getRenderOutput();
        let source = result.props.children[1];
        expect(source.props.className).to.equal('menu-list');
        expect(source.props.children.type).to.equal('span');
        expect(source.props.children.props.children).to.equal(props.menuProps.source);
    });

    it('should render a list of actions', () => {
        let result = renderer.getRenderOutput();
        let list = result.props.children[2];

        expect(list.type).to.equal('ul');
        expect(list.props.children.type).to.equal('li');
        expect(list.props.children.props.id).to.equal('delete');
    });

    it('should have a clear cover below it', () => {
        let result = renderer.getRenderOutput();
        let cover = result.props.children[3];

        expect(cover).to.not.equal(null);
        expect(cover.props.id).to.equal('cover');
        expect(cover.props.style.zIndex).to.equal('-1');
    });
});