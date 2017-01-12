'use strict';

import React from 'react';
import ClassNames from 'classnames';
import _ from 'lodash';
import Icon from '../../icons';

require('./header.scss');

const logo = require('../../../apps/easy-insights/img/Crimson-Hexagon-Logo@2x.jpg');
const dropdown = require('../../../dist/bundles/img/arrow_dropdown.svg');


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProduct: "Reporting",
            userInfo: {"fullName":"Jamie35 read-only","initials":"JW","teams":[{"id":1,"name":"Crimson Hexagon"},{"id":415669172,"name":"filterSettings"},{"id":505093221,"name":"GE team"},{"id":282632320,"name":"Jamie Customer 5"},{"id":282805711,"name":"Jamie monitor Limit test"},{"id":282629730,"name":"Jamie Parent 2"},{"id":282630768,"name":"JamieChild 11-1"},{"id":282629680,"name":"JamieChild 12_1"},{"id":282610732,"name":"JamieCustomerAmericanExpressDemo"},{"id":283383383,"name":"Locale Test"},{"id":285486435,"name":"Nelesh S3 Test Customer1"}],"selectedTeam":{"id":282629676,"name":"JamieParent1"},"showSystemAdmin":false,"showTeamAdmin":true,"showMonitorAccess":true,"showHeliosightAccess":true,"showSegmentAccess":true,"showWorkspaceAccess":true,"showDashboardsAccess":true}
        }
    }

    componentWillReceiveProps() {
    }

    renderButton(menu) {
        let buttonClass = ClassNames({
            'nav-link': true,
            'main-menu-btn': (menu == 'main-menu') ? true : false,
            'profile-menu-btn': (menu == 'profile-menu'),
            'active': (this.state.openMenu == menu)
        });

        if (menu == 'main-menu') {
            return <Icon name="menu" className={buttonClass} onClick={this.props.burgerClick}/>
        } else if (menu == 'profile-menu') {
            return (
                <div className="avatarCont" onClick={this.handleButtonClick.bind(this, 'profile-menu')}>
                  <span className="avatar">{this.state.userInfo.initials}</span>
                </div>
            );
        }
    }

    handleButtonClick(menu) {
        
    }

    productSelectorClickHandler(){
        console.log('clicked')
    }

    render() {
        return <div>
            <nav id="main-navigation" className="navbar navbar-light navbar-fixed-top">
                <ul className="nav navbar-nav pull-left pull-xs-left">
                    { /* Logo */ }

                     <li className="nav-item">
                        {this.renderButton('main-menu')}
                    </li>

                    <li className="nav-item">
                        <a className="productSelector" onClick={this.productSelectorClickHandler}>
                            <img className="logo pull-left pull-xs-left" alt="" src={logo} />
                            <p className="selectedProduct">{this.state.selectedProduct}</p>
                            <img className="dropdown" src={dropdown} />
                        </a>
                    </li>

                  

                    { /* Main-Menu Button */ }
                   
                </ul>

                <ul className="nav navbar-nav pull-right pull-xs-right">
                   
                    { /* Profile-Menu Button */}
                    <li className="selectedTeam nav-item">
                        <p className="selectedProduct">Team A</p>
                        <img className="dropdown" src={dropdown} />
                    </li>
                    <li className="nav-item profile-icon">
                        {this.renderButton('profile-menu')}
                    </li>
                </ul>
            </nav>

        </div>;
    }
}

export default Header;