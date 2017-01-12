import React from 'react';
import InterestsCardL2 from '../interests-card-l2';
import WordsCardL2 from '../words-card-l2';
import HashtagsCardL2 from '../hashtags-card-l2';
import InfluencersCardL2 from '../influencers-card-l2';
import VolumeSentimentCardL2 from '../volume-sentiment-card-l2';
import T from '../../i18n';
import history from '../../history';
import {createURLFromState} from '../../urlTracker';
require('./level2-container.scss');

export default class L2Container extends React.Component {

  static contextTypes = {
		flux: React.PropTypes.object
	};

  constructor(props, context) {
    super(props, context);
    this.breadcrumbRoot = context.flux._stores.get('cardstore').state.breadcrumbRoot;
    context.flux.getActions('easyactions').setBreadcrumbRoot(null);
  }

  renderL2Card() {
    switch(this.props.l2Data.id){
      case 'interests':
        return <InterestsCardL2 key={this.props.l2Data.id} card={this.props.l2Data} />;
      case 'words':
        return <WordsCardL2 key={this.props.l2Data.id} card={this.props.l2Data} />;
      case 'hashtags':
        return <HashtagsCardL2 key={this.props.l2Data.id} card={this.props.l2Data} />;
      case 'topInfluencers':
        return <InfluencersCardL2 key={this.props.l2Data.id} card={this.props.l2Data} />;
      case 'volume':
        return <VolumeSentimentCardL2 key={this.props.l2Data.id} card={this.props.l2Data} />;
    }
  }

  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  renderBreadCrumb(){
    let wordContent = this.props.l2Data.id.split(/(?=[A-Z])/).join(" ");
    return this.capitalize(wordContent);
  }

  createBackLink() {
    if (this.breadcrumbRoot) {
      return this.breadcrumbRoot;
    } else {
      let state = _.cloneDeep(this.context.flux._stores.get('cardstore').state);
      state.currentLevel = 1;
      return createURLFromState(state);
    }
  }

  handleBreadcrumbClick(e) {
    e.preventDefault();
    let actions = this.context.flux.getActions('easyactions');
    if (this.breadcrumbRoot) {
      actions.setMainLoading(true);
      this.query = this.context.flux._stores.get('cardstore').state.query;
      actions.updateQuery(this.query);
      setTimeout(()=>actions.navigateBack());
    } else {
      actions.expandAllCards();
    }
  }

  render() {
    return (
      <div className="level-2">
        <div className="container-fluid">
          <div className="breadcrumbs">
            <a href={this.createBackLink()} onClick={(e) => this.handleBreadcrumbClick(e)} className="breadcrumb-root">
              {T('breadcrumb.root')}
            </a>
            <span className="separator">&gt;</span>
            <span className="current">{!!this.props.l2Data && this.renderBreadCrumb()}</span>
          </div>
          {!!this.props.l2Data && this.renderL2Card()}
        </div>
      </div>
    );
  }
}
