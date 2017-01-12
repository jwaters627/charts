'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import EmbedMenu from '../../apps/dashboard/components/EmbedMenu/EmbedMenu';

describe('EmbedMenu', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            userMenuOpen: false,
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
            embedMenuProps: {className: 'open'}
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<EmbedMenu {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.id).to.equal('embedMenu');
        expect(result.props.className).to.equal('media-menu ' + props.embedMenuProps.className);
    });

    it('should render a title bar', () => {
        let result = renderer.getRenderOutput();
        let title = result.props.children[0];

        expect(title.props.className).to.equal('menu-title');
        expect(title.props.children.length).to.equal(3);
    });

    it('should render a pseudo expanded visualiation', () => {
        let result = renderer.getRenderOutput();
        let list = result.props.children[1];

        expect(list.props.className).to.equal('viz-list');
        expect(list.props.children.type).to.equal('li');
    });

    it('should render an icon, label, text input, and button', () => {
        let result = renderer.getRenderOutput();
        let viz = result.props.children[1].props.children;

        expect(viz.props.children[0].type).to.equal('i');
        expect(viz.props.children[1].type).to.equal('label');
        expect(viz.props.children[2].type).to.equal('input');
        expect(viz.props.children[3].type).to.equal('button');
    });

    it('should have a clear cover below it', () => {
        let result = renderer.getRenderOutput();
        let cover = result.props.children[2];

        expect(cover).to.not.equal(null);
        expect(cover.props.id).to.equal('cover');
        expect(cover.props.style.zIndex).to.equal('-1');
    });
});