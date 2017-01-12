'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import DashboardList from '../../apps/dashboard/components/DashboardList/DashboardList';

describe('DashboardList', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            dashboards: [
                {id: 1, name: 'Test', creationDate: '2016-06-23T02:52:00', creatingUser: 'Erik Klingman'},
                {id: 2, name: 'Test 2', creationDate: '2016-06-23T02:52:00', creatingUser: 'Erik Klingman'},
                {id: 3, name: 'Test 3', creationDate: '2016-06-23T02:52:00', creatingUser: 'Erik Klingman'},
                {id: 4, name: 'Test 4', creationDate: '2016-06-23T02:52:00', creatingUser: 'Erik Klingman'},
            ],
            folders: [
                {id: 1, name: 'Test Folder'},
                {id: 2, name: 'Test Folder #2'}
            ],
            inDash: false
        };

        renderer = TestUtils.createRenderer();
        renderer.render(<DashboardList {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.className).to.equal('dashboard-list');
    });

    it('should have 4 children', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.children.length).to.equal(4);
    });

    it('should be closed by default', () => {
        let result = renderer.getRenderOutput();
        let menu = result.props.children[0];

        expect(menu.props.className).to.equal('dashboard-tab');
    });

    it('should open when clicked', () => {
        let result = renderer.getRenderOutput();
        result.props.children[0].props.onClick();
        let updated = renderer.getRenderOutput();
        let menu = updated.props.children[1];

        expect(menu.props.className).to.equal('dashboard-menu open');
    });

    it('should render three filters', () => {
        let result = renderer.getRenderOutput();
        result.props.children[0].props.onClick();
        let updated = renderer.getRenderOutput();
        let menu = updated.props.children[1];

        for (let i = 1; i <= 3; i++) {
            let filter = menu.props.children[i];
            expect(filter).to.not.equal(null);
        }
    });

    /*
    it('should render a valid All Dashboards filter', () => {
        let result = renderer.getRenderOutput();
        result.props.children[1].props.onClick();
        let updated = renderer.getRenderOutput();
        let menu = updated.props.children[2];
        let filter = menu.props.children[1];

        expect(filter.props.label).to.equal('All Dashboards');
        expect(filter.props.count).to.equal(props.dashboards.length);
    });
    */

    it('should render a list of folders with unique IDs', () => {
        let result = renderer.getRenderOutput();
        result.props.children[0].props.onClick();
        let updated = renderer.getRenderOutput();
        let menu = updated.props.children[1];
        let list = menu.props.children[1];
        let ids = [];

        list.props.children.forEach(function(li) {
            ids.push(li.props['data-id']);
        });

        let uniques = ids.filter(function(id, i) {
            return ids.indexOf(id) === i;
        });

        expect(list.props.children.length).to.equal(props.folders.length);
        expect(uniques.length).to.equal(ids.length);
    });

    it('should render a list of dashboards with unique IDs', () => {
        let result = renderer.getRenderOutput();
        result.props.children[0].props.onClick();
        let updated = renderer.getRenderOutput();
        let menu = updated.props.children[1];
        let list = menu.props.children[2];
        let ids = [];

        list.props.children.forEach(function(li) {
            ids.push(li.props['data-id']);
        });

        let uniques = ids.filter(function(id, i) {
            return ids.indexOf(id) === i;
        });

        expect(list.props.children.length).to.equal(props.dashboards.length);
        expect(uniques.length).to.equal(ids.length);
    });
});