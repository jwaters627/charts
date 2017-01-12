'use strict';

import React from 'react';
import _ from 'lodash';
import Share from '../Share/Share';

require('./UserList.scss');

class UserList extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        users: React.PropTypes.array.isRequired,
        dashboardId: React.PropTypes.number.isRequired,
        onCancel: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            usersToAdd: []
        };
    }

    onCheck = (id) => {
        let users = this.state.usersToAdd;
        let user = this.props.users.filter(function(user) {
            return user.userId == id;
        })[0];

        let index = _.findIndex(this.state.usersToAdd, user);
        if (index < 0) {
            users.push(user);
        } else {
            users.splice(index, 1);
        }

        this.setState({
            usersToAdd: users
        });
    }

    onAddUsers = () => {
        let userIds = this.state.usersToAdd.map(function(user) {
            return user.userId;
        });

        this.context.flux.getActions('dashboard-actions').shareWithUsers({
            dashboardId: this.props.dashboardId,
            users: this.state.usersToAdd,       // Necessary for updating the store later
            userIds: userIds
        });
    }

    render() {
        let onCheck = this.onCheck;
        let dashboardId = this.props.dashboardId;

        let users = _.map(this.props.users, function(user, i) {
            return (
                <li key={i}>
                    <Share classes="user-list" id={user.userId} dashboardId={dashboardId} name={user.userName} email={user.email} type="add" onCheck={onCheck} />
                </li>
            );
        });

        return (
            <div id="userList">
                <ul>{users}</ul>

                <div className="user-actions">
                    <button id="cancel" onClick={this.props.onCancel}>Cancel</button>
                    <button id="add" onClick={this.onAddUsers}>Add</button>
                </div>
            </div>
        );
    }
}

export default UserList;