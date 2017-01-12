import React from 'react';
import ReactDOM from 'react-dom';
import T from '../../i18n';

require('./tweet.scss');

export default class Tweet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tweetType: 'normal'};
  }

  componentDidMount() {
    const parentWidth = ReactDOM.findDOMNode(this).parentNode.offsetWidth;
    const width = Math.min(Math.max(parentWidth, 250), 550);
    const opts = {
      cards        : this.props.showCard ? undefined : 'hidden',
      conversation : 'none',
      dnt          : false,
      width        : width
    };

    var tweetLoading = false;
    window.twttr.ready(() => {
      tweetLoading = true;
      window.twttr.widgets.createTweet(this.props.tweetId, this.refs.tweetElem, opts)
      .then(el => {
        if (typeof(el) == 'undefined') {
          this.setState({tweetType: 'deleted'});
        }
        !!this.props.onTweetLoaded && setTimeout(() => this.props.onTweetLoaded(), 50);
      });
    });

    setTimeout(() => {
      if (!tweetLoading) {
        this.setState({tweetType: 'inaccessible'});
        !!this.props.onTweetLoaded && setTimeout(() => this.props.onTweetLoaded(), 50);
      }
    }, 500);
  }

  render() {
    return (
      <div className="ch-tweet-container" ref="tweetContainer">
      {this.state.tweetType == 'normal' &&
        <div className="tweet-elem" ref="tweetElem"></div>
      }
      {(this.state.tweetType == 'deleted' || this.state.tweetType == 'inaccessible') &&
        <div className="tweet-replacement">
          <div className="tweet-head">
            <a className="twitter-avatar-default" href={'http://twitter.com/'+this.props.tdata.authorUsername}></a>
            <div className="tweet-author">
              <a className="download-bird" href="http://twitter.com/download"></a>
              <a className="dname" href={'http://twitter.com/'+this.props.tdata.authorUsername} target="_blank">{this.props.tdata.authorDisplayName}</a>
              <a className="uname" href={'http://twitter.com/'+this.props.tdata.authorUsername} target="_blank">@{this.props.tdata.authorUsername}</a>
            </div>
          </div>
          <div className="deleted-message">{this.state.tweetType == 'deleted' ? T('card.retweets.tweetDeleted') : T('card.retweets.tweetInaccesible')}</div>
        </div>
      }
      </div>
    );
  }
}
