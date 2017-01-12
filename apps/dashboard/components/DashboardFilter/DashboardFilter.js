'use strict';

import React from 'react';

class DashboardFilter extends React.Component {
    static propTypes = {
        classes: React.PropTypes.string,
        icon: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        count: React.PropTypes.number.isRequired
    };

    render() {
        return (
            <div className={'filter ' + this.props.classes}>
                <i className={'fa ' + this.props.icon} aria-hidden="true"></i>
                <label>{this.props.label}</label>
                <span className="count">{this.props.count}</span>
            </div>
        );
    }
}

export default DashboardFilter;