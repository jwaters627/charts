import React from 'react';
import T from '../../i18n';
import {createURLFromState} from '../../urlTracker';
require('./query-helper.scss');

export default class QueryHelper extends React.Component {

  static contextTypes = {
    flux : React.PropTypes.object
  };

  handleOverrideClick = (ev) => {
    ev.preventDefault();

    const storeState = this.context.flux._stores.get('cardstore').getState();
    const actions = this.context.flux.getActions('easyactions');

    let payload = {
      query    : storeState.query,
      filters  : storeState.filters,
      phrasify : false
    };

    if (storeState.currentLevel == 1) {
      actions.searchCards(payload);
    } else if (storeState.currentLevel == 2) {
      payload.cardId = storeState.currentOpenCard;
      actions.expandCard(payload);
    }
  }

  render() {
    if (!this.props.show) return <div style={{display: 'none'}}></div>;
    const storeState = this.context.flux._stores.get('cardstore').getState();
    const unPhrasifyURL = createURLFromState(storeState, true);

    return (
      <div className="container-fluid query-helper-container">
        <div className="row">
          <div className="col-xs-12">
            <div className="query-helper">
              <div className="qh-row1">
                <span className="hidden-xs-down visible-sm-up">{T('queryHelper.exactPhrase')} </span>
                <span className="hidden-sm-up">{T('queryHelper.exactPhrase.mobile')} </span>
                {this.props.convertedQuery}
              </div>
              <div className="qh-row2">
                <span className="hidden-xs-down visible-sm-up">{T('queryHelper.allTerms')} </span>
                <span className="hidden-sm-up">{T('queryHelper.allTerms.mobile')} </span>
                <a href={unPhrasifyURL} onClick={this.handleOverrideClick}>{this.props.query}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
