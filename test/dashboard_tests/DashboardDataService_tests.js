'use strict';

import {expect} from 'chai';
import {Flux} from 'ch-flux';
import DashboardActions from '../../apps/dashboard/DashboardActions';
import DashboardDataService from '../../apps/dashboard/DashboardDataService';

describe('DashboardDataService', () => {
    let flux = new Flux();
    let actions = flux.createActions('dashboard-actions', DashboardActions);
    let dataService = new DashboardDataService(actions);

    it('should have access to all actions', () => {
        expect(dataService.actions).to.equal(actions);
    });
});