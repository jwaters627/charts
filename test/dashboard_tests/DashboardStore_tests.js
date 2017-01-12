'use strict';

import {expect} from 'chai';
import {Flux} from 'ch-flux';
import DashboardActions from '../../apps/dashboard/DashboardActions';
import DashboardStore from '../../apps/dashboard/DashboardStore';

const STORE_ID = 'dashboard-store';

describe('DashboardStore', () => {
    let flux = new Flux();
    let actions = flux.createActions('dashboard-actions', DashboardActions);
    flux.createStore(DashboardStore, STORE_ID).init(actions);
    let store = flux.getStore(STORE_ID);

    it('should be properly instantiated', () => {
        expect(store.getId()).to.equal(STORE_ID);
    });
    
    it('should have access to all actions', () => {
        expect(store.actions).to.equal(actions);
    });

    it('should have a default state object', () => {
        expect(store.state).to.be.an('object');
        expect(store.state).to.not.be.empty;
    });

    it('should have a state getter and setter', () => {
        let state = store.getState();
        expect(store.getState()).to.equal(store.state);

        store.setState({});
        expect(store.state).to.equal(state);
    });

    it('should have a working loadedData method', () => {
        let monitors = [{id: 1, name: 'foo'}, {id: 2, name: 'bar'}, {id: 3, name: 'baz'}];
        store.loadedData({payload: {monitors: monitors}});
        expect(store.state.monitors).to.equal(monitors);
    });

    it('should have a working loadedDashboards method', () => {
        let dashboards = [{id: 1, name: 'foo'}, {id: 2, name: 'bar'}, {id: 3, name: 'baz'}];
        store.loadedDashboards({payload: {dashboards: dashboards}});
        expect(store.state.dashboards).to.equal(dashboards);
    });
});