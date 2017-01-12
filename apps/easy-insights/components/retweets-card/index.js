import React from 'react';
import Tweet from '../tweet';
import {format} from 'd3';
import classnames from 'classnames';
import BaseCard from '../card';
import T from '../../i18n';
import {sanitizeUrl} from '../../utils/utils';

require('./retweets.scss');

let numFormat = format('.1s');
const NUM_TWEETS = 5;

export default class RetweetsCard extends BaseCard {

  cardClass        = 'retweets-card';
  cardDisplayName  = 'Retweets';

  constructor(props) {
    super(props);
    this.hasData = props.card.data.topRetweets && !!props.card.data.topRetweets.length;
    if (this.hasData) {
      this.retweets = props.card.data.topRetweets.slice(0, NUM_TWEETS);
      this.tweetsLoaded = 0;
    }
  }

  componentDidMount() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    !this.hasData && setTimeout(()=>this.handleCardMounted(), 50);
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

  handleTweetLoaded() {
    this.tweetsLoaded++;
    if (this.hasData && this.tweetsLoaded === this.retweets.length) {
      this.handleCardMounted();
    }
  }

  renderCardContent() {
    return (
      <div className="card-block section card-content card-content-wider">
        <div className="title-wrap">
          <h4 className="card-title">{T('card.retweets.title')}</h4>
          <span className="sub">{T('card.retweets.subtitle')}</span>
        </div>
        {this.retweets.map( (tw, i) => {
          if (!tw.exemplarGuid) return '';
          return <div className={'retweet-item retweet-item-'+i} key={tw.exemplarGuid}>
                  <Tweet tweetId={tw.exemplarGuid} tdata={tw} onTweetLoaded={this.handleTweetLoaded.bind(this)} />
                </div>
        })}
      </div>
    );
  }
}


