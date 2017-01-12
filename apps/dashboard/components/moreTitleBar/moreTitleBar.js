'use strict';

import React from 'react';
import Cover from '../Cover/Cover';
import Close from 'react-material-icons/icons/navigation/close';
import Garbage from 'react-material-icons/icons/action/delete';
import Share from 'react-material-icons/icons/social/share';
import Schedule from 'react-material-icons/icons/action/today';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
require('./MoreTitleBar.scss');

class MoreTitleBar extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
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

    componentWillMount() {
        this.state = {
           
        };
    }

    componentWillReceiveProps(props) {
        this.state = {
            
        };
    }

    componentDidUpdate() {
        
    }


    render() {
        let cover = null;
        let menu = (<div className="title-bar closed"></div>);
       if (this.props.openMore) {
        menu = (
            <div className="title-bar open">
               
                <div id="less" className="menu-button" onClick={this.props.handleEllipsisClick}>
                    <span aria-hidden="true"><Close style={{'width': '36px', 'height': '36px', 'color': '#ffffff', 'marginTop': '6px'}} /></span>
                </div>
               

                <div  className="menu-button customize">
                    <span aria-hidden="true"><Share style={{'color': 'white'}}/></span>
                    <span className="label">Share & Download</span>
                </div>


                <div  className="menu-button schedule" onClick={this.props.schedulerClick}>
                    <span aria-hidden="true"><Schedule style={{'color': 'white'}}/></span>
                    <span className="label">Schedule</span>
                </div>

                <div  className="menu-button delete">
                    <span aria-hidden="true"><Garbage style={{'color': 'white'}}/></span>
                    <span className="label">Delete Report</span>
                </div>

                {cover}
           </div>
        );
    }
        return(
            <div>
            {menu}
            </div>
            )
    }
}

export default MoreTitleBar;