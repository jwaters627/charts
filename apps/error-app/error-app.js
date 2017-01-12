import React from 'react';
import {Error403, Error404, Error500} from '../../common/components/error';

import {Flux, App} from 'ch-flux';
import CommonActions from '../../common/CommonActions';
import TeamStore from '../../common/stores/TeamStore';
import CommonDataService from '../../common/CommonDataService';
import Header from '../../common/components/header';

let flux = new Flux();
let commonActions = flux.createActions('commonActions', CommonActions);
let commonStore = flux.createStore(TeamStore, 'common-store').init(commonActions);
let commonDataService = new CommonDataService(commonActions);
let ErrorApp = App({flux});

export default class ErrorPageApp extends React.Component {

  renderError() {
    if (errorCode == 403) {
      return <Error403 />;
    }
    return '';
  }

  render() {
    return (
      <ErrorApp>
        <div className="page-container">
          <Header />
          {this.renderError()}
        </div>
      </ErrorApp>
    );
  }
}
