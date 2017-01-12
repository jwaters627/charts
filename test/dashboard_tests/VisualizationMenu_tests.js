'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import VisualizationMenu from '../../apps/dashboard/components/VisualizationMenu/VisualizationMenu';

describe('VisualizationMenu', () => {
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
            visualizationMenuProps: {id: 0, name: '', className: 'open'}
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<VisualizationMenu {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.id).to.equal('visualizationMenu');
        expect(result.props.className).to.equal('media-menu ' + props.visualizationMenuProps.className);
    });

    it('should render a title bar', () => {
        let result = renderer.getRenderOutput();
        let title = result.props.children[0];

        expect(title.props.className).to.equal('menu-title');
        expect(title.props.children.length).to.equal(3);
    });

    it('should render a list of visualizations', () => {
        let result = renderer.getRenderOutput();
        let list = result.props.children[1];

        expect(list.props.className).to.equal('viz-list');
    });

    it('should have a clear cover below it', () => {
        let result = renderer.getRenderOutput();
        let cover = result.props.children[2];

        expect(cover).to.not.equal(null);
        expect(cover.props.id).to.equal('cover');
        expect(cover.props.style.zIndex).to.equal('-1');
    });
});