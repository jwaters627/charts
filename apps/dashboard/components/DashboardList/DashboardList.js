'use strict';

import React from 'react';
import DashboardFilter from '../DashboardFilter/DashboardFilter';
import Cover from '../Cover/Cover';
import Customize from '../Customize/Customize';

require('../../scss/dashboard.scss');
require('./DashboardList.scss');

class DashboardList extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        createdDashboards: React.PropTypes.array,
        sharedDashboards: React.PropTypes.array,
        dashboards: React.PropTypes.array,
        folders: React.PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            createdDashboards: [],
            sharedDashboards: [],
            dashboards: [],
            createdList: [],
            sharedList: [],
            allList: [],
            all: 'hide',
            shared: 'hide',
            created: 'hide'
        };
        this.filterType = this.filterType.bind(this);
    }

    componentWillMount() {
        this.context.flux.getActions('dashboard-actions').loadDashboards();
    }
    componentWillReceiveProps(nextProps) {
        let shared = [];
        let created = [];
        nextProps.dashboards.map(function(dash) {
            if (dash.shared) {
                shared.push(dash);
            } else {
                created.push(dash);
            }
        });
        this.setState({
            createdDashboards: created,
            sharedDashboards: shared,
            dashboards: nextProps.dashboards
        });
    }

    toggleMenu = () => {
        this.setState({
            open: !this.state.open,
            all: "hide",
            shared: "hide",
            created: 'hide'
        });
    }

    onClickNewDashboard = () => {
        this.context.flux.getActions('dashboard-actions').toggleCustomize({ display: 'block', title: 'Create Dashboard', cover: true, button: 'Create Dashboard' });
    }

    onClickDashboard = (e) => {
        let type = e.target.nodeName.toLowerCase();
        let target = (type == 'label') ? e.target.parentNode : e.target;
        window.location.href = '/ch/newdashboard/' + target.dataset.id;
    }

    redirectToHelp = () => {
        location.href = "https://help.crimsonhexagon.com";
    }

    filterType(e) {
        let self = this;
        let displayState = '';
        let type = e.target.dataset.type;
        let caret = document.getElementById(type);
        let ul = document.getElementsByClassName(type)[0];
        let dashboards = null;
        let result = null;

        type == 'shared' ? dashboards = this.state.sharedDashboards : dashboards = this.state.createdDashboards;
        caret ? caret.classList.contains('down') ? caret.classList.remove('down') : caret.classList.add('down') : null;
        ul ? ul.classList.contains('hide') ? (ul.classList.remove('hide'), ul.classList.add('show'), displayState = 'show') : (ul.classList.remove('show'), ul.classList.add('hide'), displayState = 'hide') : null;

        if (typeof(this.props.dashboards) == 'object' && type != 'all') {
            result = dashboards.map(function (dash, i) {
                return (
                    <li className="dashboard" data-id={dash.id} key={i*Math.random()} onClick={self.onClickDashboard}>
                        <label>{dash.name}</label>
                    </li>
                );
            });
        } else {
            result = this.props.dashboards.map(function (dash, i) {
                return (
                    <li className="dashboard" data-id={dash.id} key={i*Math.random()} onClick={self.onClickDashboard}>
                        <label>{dash.name}</label>
                    </li>
                );
            });
        }

        this.state[type] = displayState;
        type == 'shared' ? this.setState({sharedList: result}) :  type == 'created' ? this.setState({createdList: result}) : this.setState({allList: result});

    }

    render() {
        let customize;
        //let folders = null;
        //if (typeof(this.props.folders) == 'object') {
        //    folders = this.props.folders.map(function(folder, i) {
        //        return (
        //            <li className="folder" data-id={folder.id} key={i}>
        //                <i className="fa fa-folder" aria-hidden="true"></i>
        //                <label>{folder.name}</label>
        //                <i className="fa fa-times" aria-hidden="true"></i>
        //            </li>
        //        );
        //    });
        //}



        let menu = (<div className="dashboard-menu closed"></div>);
        let cover = null;
        if (this.state.open && this.state.dashboards) {
            menu = (
                <div className="dashboard-menu open">
                    <div className="create">
                        <div className='filter active' id="newDashboard">
                            <i className="fa fa-plus left" aria-hidden="true" onClick={this.onClickNewDashboard} ></i>
                            <label onClick={this.onClickNewDashboard} >Create Report</label>
                            <i id='open-list' className="fa fa-angle-double-left fa-2x" aria-hidden="true" onClick={this.toggleMenu}></i>
                        </div>
                    </div>
                    <div className='filter list' data-type="all" onClick={this.filterType}>
                        <i className='fa fa-check-square-o left' data-type="all" aria-hidden="true"></i>
                        <label data-type="all" >All</label>
                        <i id="all" data-type="all" className="fa fa-caret-left rotate" aria-hidden="true"></i>
                        <ul className={"dashboards all " + this.state.all}>
                            {this.state.allList}
                        </ul>
                    </div>
                    <div className='filter list' data-type="created" onClick={this.filterType}>
                        <i className='fa fa-user left' data-type="created" aria-hidden="true"></i>
                        <label data-type="created">Created By Me</label>
                        <i id="created" data-type="created" className="fa fa-caret-left rotate" aria-hidden="true"></i>
                        <ul className={"dashboards created " + this.state.created}>
                            {this.state.createdList}
                        </ul>
                    </div>
                    <div className='filter list' data-type="shared" onClick={this.filterType}>
                        <i className='fa fa-users left' data-type="shared" aria-hidden="true"></i>
                        <label data-type="shared">Shared With Me</label>
                        <i id="shared" data-type="shared" className="fa fa-caret-left rotate" aria-hidden="true"></i>
                        <ul className={"dashboards shared " + this.state.shared}>
                            {this.state.sharedList}
                        </ul>
                    </div>
                    <div className='filter list helpicon' onClick={this.redirectToHelp}>
                        <i className='fa fa-question-circle' aria-hidden="true"></i>
                        <label>Help</label>
                    </div>
                    {/*
                        <div className="folder-header">
                            <h2>New Folder</h2>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                        </div>
                        <ul className="folders">
                            {folders}
                        </ul>
                    */}
                </div>
            );

            cover = (<Cover id="cover" onClick={this.toggleMenu} />);
        }
        this.props.customizeProps ? this.state.dashboards.length > 1 ? this.props.customizeProps['cover'] = false : this.props.customizeProps['cover'] = true : null;
        this.props.customizeProps ? customize = (<Customize customizeProps={this.props.customizeProps}/>) : customize = null;

        return (
            <div className="dashboard-list">
                <div className="dashboard-tab" onClick={this.toggleMenu}>
                    <i className="fa fa-angle-double-right fa-2x" aria-hidden="true"></i>
                </div>
                {menu}
                {customize}
                {cover}
            </div>
        );
    }
}

export default DashboardList;