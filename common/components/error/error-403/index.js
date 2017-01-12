import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap-4';
require('./error-403.scss');
import T from '../../../i18n';
import {ControllerView} from 'ch-flux';

@ControllerView({
    stores:
        [['common-store', state => {
            return {
                'userInfo'    : state.userInfo
            }
        }]],
      actions : 'commonActions'
})
export default class Error403 extends React.Component {

  constructor(props) {
    super(props);
    this.actions = this.props.actions;
  }

  handleClickChangeTeam(ev, team) {
    this.actions.switchTeams(team.id);
    setTimeout(() => {
      this.refs.teamList.scrollTop = 0;
    }, 400);
  }

  render () {
    return <div className="container container-403-error">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-403-error">
          <h1>{T('error.403.title')}</h1>
          {!! this.props.userInfo.teams && this.props.userInfo.teams.length >= 1 &&
            <div>
              <div className="error-content">
                <p>{T('error.403.msg1')}</p>
                  <span>{T('error.403.switch')} </span>
                  <DropdownButton className="team-dropdown" id="team-dropdown" title={this.props.userInfo.selectedTeam.name || ''}>
                    {this.props.userInfo.teams.map(team =>
                      <MenuItem key={team.id} onClick={(ev) => this.handleClickChangeTeam(ev, team)}>{team.name}</MenuItem>
                    )}
                  </DropdownButton>
              </div>
              <div className="message-403-error">
                {T('error.403.or')}
              </div>
            </div>
          }
          <div className="error-content">{T('error.403.msg2')}</div>
        </div>
      </div>
    </div>
  }
}
