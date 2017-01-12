'use strict';

import React from 'react';

require('./Share.scss');

class Share extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        id: React.PropTypes.number.isRequired,
        dashboardId: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        onCheck: React.PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
    }

    onToggleCheckbox = () => {
        if (this.props.onCheck) {
            this.props.onCheck(this.props.id);
        }

        this.setState({
            checked: !this.state.checked
        });
    }

    onRemoveShare = () => {
        this.context.flux.getActions('dashboard-actions').removeShare({
            dashboardId: this.props.dashboardId,
            userId: this.props.id
        });
    }

    render() {
        let element = null;
        if (this.props.type == 'add') {
            element = (<input type="checkbox" name="shared" className="checkbox" checked={this.state.checked} onChange={this.onToggleCheckbox} />);
        } else if (this.props.type == 'edit') {
            element = (<i className="fa fa-times" aria-hidden="true" onClick={this.onRemoveShare}></i>);
        }

        let initials = this.props.name.split(' ').map(function(s) { return s[0]; }).join('');

        return (
            <div id="share" data-id={this.props.id} className={'share ' + this.props.classes}>
                <div className="initials">{initials}</div>
                <div className="name">{this.props.name}</div>
                <div className="email">{this.props.email}</div>
                {element}
            </div>
        );
    }
}

export default Share;