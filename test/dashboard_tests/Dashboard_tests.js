'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Dashboard from '../../apps/dashboard/components/Dashboard/Dashboard';

describe('Dashboard', () => {
    let props = null, renderer = null, dashboard = null;

    beforeEach(function() {
        props = {
            cardEdit: {index: '', value: false},
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
            error: '',
            confirmProps: { display: 'none' },
            sharingProps: { display: 'none' },
            customizeProps: { display: 'none' },
            mediaMenuProps: { className: 'closed' },
            embedMenuProps: { className: 'closed' },
            libraryMenuProps: { className: 'closed' },
            visualizationMenuProps: { className: 'closed', name: '', id: 0 },
            menuProps: { display: 'none', x: 0, y: 0, name: '', source: '' },
            userMenuOpen: false,
            monitors: [],
            shares: [],
            users: []
        };
        dashboard = new Dashboard(props);

        renderer = TestUtils.createRenderer();
        renderer.render(<Dashboard {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.className).to.equal('dashboard-main');
        expect(result.props.id).to.equal(props.dashboard.id);
    });

    it('should have the proper grid props', () => {
        expect(dashboard.gridProps.rowHeight).to.equal(30);
        expect(dashboard.gridProps.breakpoints).to.have.all.keys('lg', 'md', 'sm', 'xs', 'xxs');
        expect(dashboard.gridProps.cols).to.have.all.keys('lg', 'md', 'sm', 'xs', 'xxs');
    });

    it('should be able to create a card', () => {
        let viz = props.dashboard.visualizations[0];
        let card = dashboard.createElement(viz);

        expect(card.type).to.equal('div');
        expect(card.props.className).to.equal('card-parent');
        expect(card.props._grid).to.equal(viz);
    });

    it('should render 11 children', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.children.length).to.equal(12);
    });

    it('should render a null cover by default', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.children[8]).to.equal(null);
    });
});