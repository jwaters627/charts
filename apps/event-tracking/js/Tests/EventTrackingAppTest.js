'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import EventTrackingPortalApp from '../entry.js';
import EventTrackingActions from '../Actions/EventTrackingActions.js';

const ACTIONS_ID = 'events-tracking-actions';
const STORE_ID = 'events-tracking-store';

describe('EventTrackingApp', () => {
    let app = TestUtils.renderIntoDocument(<EventTrackingPortalApp />);

    it('should render a react component', () => {
        expect(app).to.not.equal(null);
    });

    it('should have a ch-flux child context object', () => {
        let context = app.getChildContext();
        
        expect(context).to.have.property('flux');
        expect(context.flux).to.be.an('object');
    });

    it('should have access to each event tracking actions', () => {
        let flux = app.getChildContext().flux;
        let actions = flux.getActions(ACTIONS_ID);

        EventTrackingActions.forEach(function(action) {
            expect(actions).to.include.keys(action);
        });
    });

    it('should have access to the event tracking store', () => {
        let flux = app.getChildContext().flux;
        let store = flux.getStore(STORE_ID);

        expect(store.getId()).to.equal(STORE_ID);
    });


});
