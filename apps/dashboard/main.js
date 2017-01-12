'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, hashHistory} from 'react-router';
import DashboardRoutes from './DashboardRoutes';


ReactDOM.render(
    <Router routes={DashboardRoutes} history={hashHistory} />,
    document.getElementById('content')
);