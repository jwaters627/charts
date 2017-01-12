'use strict';

import React from 'react';
import {Flux} from 'ch-flux';
import DashboardActions from './DashboardActions';
import CommonActions from '../../common/CommonActions';
import EasyActions from '../easy-insights/actions.js';
import DashboardStore from './DashboardStore';
import CardStore from '../easy-insights/stores/card-store.js';
import TeamStore from '../../common/stores/TeamStore';
import DashboardController from './DashboardController';
import DashboardDataService from './DashboardDataService';
import CommonDataService from '../../common/CommonDataService';

let flux = new Flux();
let dashActions = flux.createActions('dashboard-actions', DashboardActions);
let commonActions = flux.createActions('commonActions', CommonActions);
let easyActions = flux.createActions('easyactions', EasyActions);
let dashStore = flux.createStore(DashboardStore, 'dashboard-store').init(dashActions);
let commonStore = flux.createStore(TeamStore, 'common-store').init(commonActions);
let cardStore = flux.createStore(CardStore, 'card-store').init(easyActions);
let dashDataService = new DashboardDataService(dashActions);
let commonDataService = new CommonDataService(commonActions);

class DashboardApp extends React.Component {
    static childContextTypes = {
        flux: React.PropTypes.object,
        gridColumns: React.PropTypes.number
    };

    getChildContext() {
        return {
            flux: flux,
            gridColumns: 16
        }
    }

    render() {
        return <DashboardController children={this.props.children} />;
    }
}

export default DashboardApp;