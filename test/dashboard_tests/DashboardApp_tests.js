'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import DashboardApp from '../../apps/dashboard/DashboardApp';
import DashboardActions from '../../apps/dashboard/DashboardActions';
import CommonActions from '../../common/CommonActions';

const ACTIONS_ID = 'dashboard-actions';
const STORE_ID = 'dashboard-store';

describe('DashboardApp', () => {
    let app = TestUtils.renderIntoDocument(<DashboardApp />);

    it('should render a react component', () => {
        expect(app).to.not.equal(null);
    });

    it('should have a ch-flux child context object', () => {
        let context = app.getChildContext();
        
        expect(context).to.have.property('flux');
        expect(context.flux).to.be.an('object');
    });

    it('should have access to each dashboard action', () => {
        let flux = app.getChildContext().flux;
        let actions = flux.getActions(ACTIONS_ID);

        DashboardActions.forEach(function(action) {
            expect(actions).to.include.keys(action);
        });
    });

    it('should have access to the dashboard store', () => {
        let flux = app.getChildContext().flux;
        let store = flux.getStore(STORE_ID);

        expect(store.getId()).to.equal(STORE_ID);
    });

    it('should have access to each common action', () => {
        let flux = app.getChildContext().flux;
        let actions = flux.getActions('commonActions');

        CommonActions.forEach(function(action) {
            expect(actions).to.include.keys(action);
        });
    });

});