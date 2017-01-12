'use strict';

import {expect} from 'chai';
import DashboardRoutes from '../../apps/dashboard/DashboardRoutes';

describe('DashboardRoutes', () => {
    it('should be an object', () => {
        expect(DashboardRoutes).to.be.an('object');
    });

    it('should not be empty', () => {
        expect(DashboardRoutes).to.not.be.empty;
    });

    it('should have the proper keys', () => {
        expect(DashboardRoutes).to.include.keys('path', 'component', 'indexRoute');
    });

    it('should have an :id child path', () => {
        expect(DashboardRoutes).to.have.deep.property('childRoutes[0].path', ':id');
    });
});