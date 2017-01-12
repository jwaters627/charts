import React from 'react';
import ClassNames from 'classnames';
import onClickOutside from 'react-onclickoutside';

class Menu extends React.Component {

  constructor() {
    super();
    this.renderDashboardMenu = this.renderDashboardMenu.bind(this);
  }

  renderDashboardMenu() {
    console.log(this.props.actions);
  }

  handleClickOutside = (ev)  => {
    if (this.props.menu == this.props.openMenu) {
      setTimeout(() => this.props.actions.toggleMenu(), 100);
    }
  }

  handleClickChangeTeam = (ev, team) => {
    this.props.actions.switchTeams(team.id);
    setTimeout(() => {
      this.refs.teamList.scrollTop = 0;
    }, 400);
  }

  render() {
    let menu = this.props.menu;
    let menuClass = ClassNames({
      'nav'           : true,
      'nav-dropdown'  : true,
      'fixed'         : true,
      'active'        : (menu == this.props.openMenu),
      'left'          : (menu == 'main-menu'),
      'right'         : (menu == 'profile-menu'),
      'profile-menu'  : (menu == 'profile-menu')
    });


    const hasMonitors = this.props.userInfo.showMonitorAccess;
    const hasHeliosight = this.props.userInfo.showHeliosightAccess;
    const hasSegments = this.props.userInfo.showSegmentAccess;
    const hasWorkspaces = this.props.userInfo.showWorkspaceAccess;
    const hasDashboards = this.props.userInfo.showDashboardsAccess;

    // Render Main Menu
    if(menu == 'main-menu') {
      return <div className={menuClass}>
        <ul className="fullwidth">
          {!!hasMonitors &&
            <li>
              <a className="dropdown-item" href="/ch/dashboard">
                <i className="chico monitors"></i>
                <span>Monitors</span>
              </a>
            </li>
          }
          {!!hasHeliosight &&
            <li>
              <a className="dropdown-item" href="/ch/heliosight">
                <i className="chico easyinsights"></i>
                <span>HelioSight</span>
              </a>
            </li>
          }
          {!!hasSegments &&
            <li>
              <a className="dropdown-item" href="/ch/segmentInsights">
                <i className="chico segments"></i>
                <span>Segments</span>
              </a>
            </li>
          }
          {!!hasWorkspaces &&
            <li>
              <a className="dropdown-item" href="/ch/workspaces">
                <i className="chico workspaces"></i>
                <span>Workspaces</span>
              </a>
            </li>
          }
          {!!hasDashboards &&
            <li>
              <a className="dropdown-item" href="/ch/newdashboard">
                <i className="chico workspaces"></i>
                <span>Dashboards</span>
              </a>
            </li>
          }
        </ul>
      </div>;
    } // Render Profile Menu
    else if(menu == 'profile-menu') {

      let teamItems   = [],
          adminItems  = [],
          actions     = this.props.actions,
          user        = this.props.userInfo;

      if (user.showSystemAdmin) {
          adminItems.push(<li key="1"><a className="dropdown-item" href="/ch/admin">System Admin</a></li>);
      }
      if (user.showTeamAdmin || user.showSystemAdmin) {
          adminItems.push(<li key="0"><a className="dropdown-item" href="/ch/admin/customer">Team Admin</a></li>);
      }
      adminItems.push(<li key="2"><a className="dropdown-item" href="https://help.crimsonhexagon.com">Help Center</a></li>);

      return <div className={menuClass}>

        <a href="/ch/preferences">
          <div className="profile-header">
            <span className="avatar">{user.initials}</span>
            <span className="name">{user.fullName}</span>
            <div className="clearfix"></div>
          </div>
        </a>

        <ul className="skinny">
          {adminItems}
        </ul>

        {!!user.selectedTeam &&
          <div>
            <ul className="skinny">
              <span className="list-title">Switch Teams</span>
            </ul>

            <ul className="skinny team-list" ref="teamList">
              <li><a href="javascript:void(0)" className="dropdown-item active">{user.selectedTeam.name}</a></li>
              {user.teams.map(team =>
                <li id={'team-'+team.id} key={team.id}>
                  <a href="javascript:void(0)"
                    className="dropdown-item"
                    onClick={(ev) => this.handleClickChangeTeam(ev, team)}>{team.name}</a>
                </li>
              )}
            </ul>
          </div>
        }
        <ul className="skinny">
          <li><a className="dropdown-item" href="/ch/logout">Logout</a></li>
        </ul>
      </div>;
    }

    return <div></div>;
  }
}

export default onClickOutside(Menu, {preventDefault: false, stopPropagation: false});