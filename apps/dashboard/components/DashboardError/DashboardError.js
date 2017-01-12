'use strict';

import React from 'react';

require('./DashboardError.scss');

class DashboardError extends React.Component {
    static propTypes = {
        header: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired
    };

    render() {
        return (
            <div id="dashboardError" className="dashboard-error">
                <h1>{this.props.header}</h1>
                <p>{this.props.text}</p>
            </div>
        );
    }
}

export default DashboardError;