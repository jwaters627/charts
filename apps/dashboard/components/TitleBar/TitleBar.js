'use strict';

import React from 'react';
import Cover from '../Cover/Cover';
import mui from 'material-ui';
import Add from 'react-material-icons/icons/content/add';
import Chart from 'react-material-icons/icons/social/poll';
import MoreHoriz from 'react-material-icons/icons/navigation/more-horiz'
import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./TitleBar.scss');
const VALID_LOGO_TYPES = ['image/jpeg', 'image/png'];
const UPLOAD_FORMATS_TEXT = 'You can upload images in the following formats: PNG, JPG';

class TitleBar extends React.Component {

    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        dashboard: React.PropTypes.object.isRequired,
        userMenuOpen: React.PropTypes.bool.isRequired
    };

     static childContextTypes =
    {
        muiTheme: React.PropTypes.object
    }

    getChildContext()
    {
        return {
            muiTheme: getMuiTheme()
        }
    }

   

    onNameToggle = () => {
        if (!this.state.editing) {
            this.setState({ editing: true });
        }
    }


    uploadFile = () => {
        let type = this.refs.logo.files[0].type;
        if (VALID_LOGO_TYPES.indexOf(type) == -1) {
            alert(UPLOAD_FORMATS_TEXT);
            return false;
        } else {
            let self = this;
            let file = this.refs.logo.files[0];
            this.reader = new FileReader();
            this.reader.addEventListener("load", function () {
                self.context.flux.getActions('dashboard-actions').editDashboard({
                    id: self.props.dashboard.id,
                    logo: self.reader.result || ''
                });
            }, false);
            if (file) {
                this.reader.readAsDataURL(file);
            }
        }
    }

    render() {
        let cover = null;
        let background = this.props.dashboard.logo || require('./logo.png');
        let dashboardName = (<div style={{'marginTop': '4px'}}>{this.state.name}</div>);
        if (this.state.editing) {
            dashboardName = (<input type="text" name="name" maxLength="65" ref="name" defaultValue={this.state.name} onKeyUp={this.onEditName} />);
            cover = <Cover onClick={this.onClickCover}/>;
        }

        let backgroundImage = "url(" + background + ")" ;
        let logo = (
            <form ref="logoForm" method="PUT" action="/ch/newdashboard" encType="multipart/form-data">
                <input type="hidden" name="dashboardId" value={this.props.dashboard.id} readOnly />
                <label><span aria-hidden="true"><Add /></span><p id="addLogoText">Add Logo</p><input type="file" name="logo" ref="logo" className="logo-input" onChange={this.uploadFile} /></label>
            </form>
        );

        return (
            <div id="titleBar" className="title-bar">
                <div id="addLogo" className="add-logo">{logo}</div>
                <div id="dashboardName" className="dashboard-name" onClick={this.onNameToggle}>{dashboardName}</div>
               
                <div id="moreEllipsis" className="menu-button" onClick={this.props.handleEllipsisClick}>
                    <span aria-hidden="true"><MoreHoriz style={{'width': '36px', 'height': '36px'}} /></span>
                    <span className="label">More</span>
                </div>
               
                <div id="addMedia" className="menu-button" onClick={this.props.handleAddChartClick}>
                    <span aria-hidden="true"><Chart style={{'width': '36px', 'height': '36px'}} /></span>
                    <span className="label">Add Chart</span>
                </div>

                {cover}
           </div>
        );
    }
}

export default TitleBar;