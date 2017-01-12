import React from 'react';
import {format} from 'd3';
import classnames from 'classnames';
import BaseCard from '../card';
import T from '../../i18n';
import {chSort, textDir} from 'ch-ui-lib';
import {sanitizeUrl} from '../../utils/utils';

require('./influencers.scss');

const numFormat     = format('.1s');
const oneDecFloat   = format('.1f');
const scoreFormat   = v => oneDecFloat(v*100);
const defaultAvatar = require('../../img/defaultTwitterAvatar.png');

class Influencer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {influencer: props.influencer};
  }

  handleImgError() {
    let inf = Object.assign({}, this.state.influencer);
    inf.avatarUrl = defaultAvatar;
    setTimeout(() => this.setState({ influencer: inf }));
  }

  render() {
    const inf = this.state.influencer;
    const avatarUrl = !!inf.avatarUrl ? inf.avatarUrl.replace('_normal', '') : defaultAvatar;
    return (
      <div className={classnames('author-item', inf.highlight && 'highlight')}>
        <div className="avatar-and-score">
          <a className="avatar-link" href={'https://twitter.com/'+inf.username} target="_blank"><img className="author-avatar" src={sanitizeUrl(avatarUrl)} alt="" onError={this.handleImgError.bind(this)} /></a>
          <div className="author-score">
            <div className="score-number">{scoreFormat(inf.influenceScore)}</div>
            <div className="score-desc">{T('card.influencers.infScore')}</div>
          </div>
        </div>
        <div className="author-info">

          <div className="author-head">
            <h4 className="display-name">
              <a href={'https://twitter.com/'+inf.username} target="_blank"
                 dir={textDir(!!inf.displayName ? inf.displayName : inf.username)}>
                {!!inf.displayName ? inf.displayName : inf.username}
              </a>
            </h4>
            <div className="handle">
              <a href={'https://twitter.com/'+inf.username} target="_blank">@{inf.username}</a>
            </div>
          </div>

          <div className="author-stats">
            <div className="stats">
              <div className="aitem">
                <div className="item-wrap">
                  <span className="item-label">{T('card.influencers.tweets')}</span>
                  <span className="number">{numFormat(inf.numTweets)}</span>
                </div>
              </div>
              <div className="aitem">
                <div className="item-wrap">
                  <span className="item-label">{T('card.influencers.followers')}</span>
                  <span className="number">{numFormat(inf.numFollowers)}</span>
                </div>
              </div>
              <div className="aitem">
                <div className="item-wrap">
                  <span className="item-label">{T('card.influencers.following')}</span>
                  <span className="number">{numFormat(inf.numFollowing)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="author-desc" dir={textDir(inf.profileDescription)}>{inf.profileDescription}</div>

        </div>
      </div>);
  }
}

export default class InfluencersCard extends BaseCard {

  hasL2Link        = true;
  hasPNGExport     = true;
  cardClass        = 'top-influencers-card';
  cardDisplayName  = 'Influencers';

  constructor(props) {
    super(props);
    this.hasData = props.card.data.topInfluencers && !!props.card.data.topInfluencers.length;
    if (this.hasData) {
      this.influencers = chSort(props.card.data.topInfluencers, ['influenceScore', 'username'], ['desc', 'asc']).slice(0,10);
    }
  }

  componentDidMount() {
    this.handleCardMounted();
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.resizing && clearTimeout(this.resizing);
		this.resizing = setTimeout(() => {
			this.handleCardMounted();
		}, this.resizeDelay);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  renderCardContent() {
    return (
      <div className="card-block section card-content card-content-wider" ref="oembTwitterElem">
        <div className="title-wrap">
          <h4 className="card-title">{T('card.influencers.title')}</h4>
          <span className="sub">{T('card.influencers.subtitle')}</span>
        </div>
        {this.influencers.map((inf, i) => <Influencer influencer={inf} key={i} />)}
      </div>
    );
  }
}
