import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from '../search-container';
import CardList from '../card-list';
import ErrorPage from '../error-page';
import L2Container from '../level2-container';
import ClassNames from 'classnames';
import {ControllerView} from 'ch-flux';
import QueryHelper from '../query-helper';

require('./main.scss');

@ControllerView({
  stores: [['cardstore', state => _.pick(state, [
    'cards',
    'filters',
    'cardHeights',
    'mainLoading',
    'queryStatus',
    'queryErrorMsg',
    'query',
    'convertedQuery',
    'showQueryHelper',
    'numFilters',
    'currentLevel',
    'l2Data',
    'isFirstSearch',
    'summaryLoaded',
    'summary',
    'currentOpenCard',
    'timezone'
  ])]],
  actions : 'easyactions'
})
export default class Main extends React.Component {

  renderSpinner() {
    document.body.classList.remove('body-bg-gray');
    return <div className="grid-row">
            <div className="col">
                <ul className="loading">
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>;
  }

  renderError(errorId) {
    document.body.classList.remove('body-bg-gray');
    let msgs = this.props.queryErrorMsg ? [this.props.queryErrorMsg] : null;
    return <ErrorPage query={this.props.query || null} errorId={errorId} messages={msgs} />;
  }

  renderLevel() {
    document.body.classList.add('body-bg-gray');
    switch (this.props.currentLevel) {
      case 1:
        return <CardList cards={this.props.cards} cardHeights={this.props.cardHeights} />;
      case 2:
        return <L2Container l2Data={this.props.l2Data} />;
    }
  }

  render() {
    let loading     = this.props.mainLoading,
        queryStatus = this.props.queryStatus;

    if (queryStatus == 'NOT_FOUND') {
      return this.renderError('NOT_FOUND');
    }

    return <div className="main-container">
             {queryStatus != 'FORBIDDEN' &&
               <div className="search-container">
                 <SearchContainer {...this.props}/>
               </div>
             }

             {!!loading && this.renderSpinner()}

             {!loading && <QueryHelper query={this.props.query}
                convertedQuery={this.props.convertedQuery}
                show={this.props.showQueryHelper} />
             }

             {['NO_RESULTS', 'SERVER_ERROR', 'VALIDATION_FAILURE', 'FORBIDDEN']
               .indexOf(queryStatus) !== -1 && !loading &&
               this.renderError(queryStatus)
             }

             {queryStatus === 'OK' && !loading && this.renderLevel()}

           </div>
  }

  componentWillUnmount() {
    document.body.classList.remove('body-bg-gray');
  }
}
