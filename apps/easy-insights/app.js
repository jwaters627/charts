import 'bootstrap/dist/css/bootstrap.css';
import './scss/fontb64.scss';
import React from 'react';
import ReactDom from 'react-dom';
import EasyFlux from './Flux';
import {App} from 'ch-flux';
import Main from './components/main';
import Header from '../../common/components/header';
import FeedbackButton from '../../common/components/feedback-button';
import ErrorPage from './components/error-page';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';
import { createNavigation } from 'ch-router-utils';
import history from './history';
import messages from './i18n/en';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {basePath} from './urlTracker';

injectTapEventPlugin();

if (module.hot) {
    module.hot.accept();
}

let flux       = new EasyFlux();
let navigation = createNavigation({flux, history});
let MainApp    = App({flux, navigateTo: navigation.navigateTo});

class EasyInsightsApp extends React.Component {
  render() {
    return (
      <MainApp>
        <div className="page-container">
          <Header basePath={basePath} />
          <FeedbackButton url="https://crimsonhexagon.ideas.aha.io/ideas/new" />
          {this.props.children}
        </div>
      </MainApp>
    );
  }
}

ReactDom.render((
  <Router history={history}>
    <Route path={basePath} component={EasyInsightsApp}>
      <IndexRoute component={Main} />
      <Route path="search/:query(/:l2cardId)" component={Main}/>
      <Route path="*" errorId='NOT_FOUND' component={ErrorPage}/>
    </Route>
  </Router>
), document.getElementById('mainContent'));
