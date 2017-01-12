'use strict';

import {expect} from 'chai';
import DashboardActions from '../../apps/dashboard/DashboardActions';

describe('DashboardActions', () => {
    it('should be an array', () => {
        expect(DashboardActions).to.be.an('array');
    });

    it('should not be empty', () => {
        expect(DashboardActions).to.not.be.empty;
    });
});