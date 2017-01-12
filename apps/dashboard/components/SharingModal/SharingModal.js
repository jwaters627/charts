'use strict';

import React from 'react';
import UserList from '../UserList/UserList';
import Share from '../Share/Share';
import Cover from '../Cover/Cover';
import _ from 'lodash';

require('./SharingModal.scss');

const Y_POS_OFFSET = 100;

class SharingModal extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        sharingProps: React.PropTypes.object.isRequired,
        shares: React.PropTypes.array.isRequired,
        users: React.PropTypes.array.isRequired,
        dashboard: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            props: false,
            searching: false,
            users: this.props.users
        };
    }

    componentWillReceiveProps(props) {
        if (props.dashboard.id && !this.state.props) {
            this.context.flux.getActions('dashboard-actions').loadUsers({id: teamID});
            this.context.flux.getActions('dashboard-actions').loadSharing({id: props.dashboard.id});
            this.setState({ props: true });
        }

        let newShares = (this.props.shares.length == props.shares.length);

        if (newShares) {
            this.refs.email.value = '';
        }

        this.setState({
            searching: (newShares) ? false: this.state.searching,
            users: props.users
        });
    }

    onClose = () => {
        this.setState({
            searching: false,
            users: this.props.users
        });
        this.refs.email.value = '';
        this.context.flux.getActions('dashboard-actions').toggleSharingModal({ display: 'none' });
    }

    onUserSearch = () => {
        let val = this.refs.email.value.trim();

        this.setState({
            users: this.props.users.filter(function(user) {
                let email = user.email.toLowerCase(),
                    name = user.userName.toLowerCase(),
                    str = val.toLowerCase();

                return (email.indexOf(str) != -1 || name.indexOf(str) != -1);
            }),
            searching: (this.refs.email.value !== '')
        });
    }

    onCancelUserSearch = () => {
        this.refs.email.value = '';
        this.setState({
            searching: false
        });
    }

    render() {
        let props = this.props.sharingProps;
        let top = window.scrollY + Y_POS_OFFSET + 'px';
        let dashboardId = this.props.dashboard.id;

        let shares = null;
        if (this.props.shares && this.props.shares.length > 0) {
            shares = this.props.shares.map(function(share, i) {
                return (<Share id={share.userId} dashboardId={dashboardId} name={share.userName} email={share.email} key={i} type="edit" />);
            });
        }

        let users = null;
        if (this.state.searching && this.state.users.length > 0) {
            users = (<UserList users={this.state.users} dashboardId={dashboardId} onCancel={this.onCancelUserSearch} />);
        } else if (this.state.searching && this.state.users.length == 0) {
            users = (<div id="userList"><h4>Sorry, there are no users that match your search.</h4></div>);
        }

        return (
            <div style={{display: props.display}} id="sharingParent" className="sharing-parent">
                <div className="wrapper" style={{top: top}}>
                    <div id="sharingModal">
                        <div className="close" onClick={this.onClose}><i className="fa fa-times" aria-hidden="true"></i></div>
                        <h1>Share</h1>
                        <h2>
                            <i className="fa fa-user-plus" aria-hidden="true"></i>
                            Share with Team Members
                        </h2>
                        <input type="text" id="email" ref="email" placeholder="Enter Email Address" autoComplete="off" onChange={this.onUserSearch} />
                        {users}
                        <div className="shares">{shares}</div>

                        {/*
                        <h2>
                            <i className="fa fa-link" aria-hidden="true"></i>
                            Share with Non Team Members
                        </h2>
                        <input type="text" id="shareUrl" ref="shareUrl" value={window.location.href} readOnly />
                        */}
                    </div>
                </div>

                <Cover onClick={this.onClose} style={{backgroundColor: '#FFF', opacity: '0.9', zIndex: '1500'}}/>
            </div>
        );
    }
}

export default SharingModal;