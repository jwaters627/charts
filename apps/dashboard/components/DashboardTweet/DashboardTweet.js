'use strict';

import React from 'react';
import moment from 'moment';

require('./DashboardTweet.scss');

class DashboardTweet extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        tweet: React.PropTypes.object.isRequired,
        percent: React.PropTypes.number.isRequired
    };

    render() {
        let barWidth = this.props.percent + '%';

        return (
            <div className="dashboard-tweet">
                <div className="tweet-head">
                    <a className="twitter-avatar-default" href={'http://twitter.com/' + this.props.tweet.authorUserName}></a>
                    <div className="tweet-author">
                        <span className="twitter-bird"></span>
                        <a className="dname" href={'http://twitter.com/' + this.props.tweet.authorUserName} target="_blank">{this.props.tweet.authorDisplayName}</a>
                        <a className="uname" href={'http://twitter.com/' + this.props.tweet.authorUserName} target="_blank">{'@' + this.props.tweet.authorUserName}</a>
                    </div>
                </div>
                <div className='content'>{this.props.tweet.content || 'This tweet has been deleted or set to private'}</div>
                <div className='links'>
                    <a href={"https://twitter.com/" + this.props.tweet.authorUserName + "/status/" + this.props.tweet.guid} target="_blank">
                        {moment(this.props.tweet.date.toString()).format('MMM D, YYYY')}
                    </a>
                    <a href={"https://twitter.com/intent/favorite?tweet_id=" + this.props.tweet.guid}>Favorite</a>
                    <a href={"https://twitter.com/intent/retweet?tweet_id=" + this.props.tweet.guid}>Retweet</a>
                    <a href={"https://twitter.com/intent/tweet?in_reply_to=" + this.props.tweet.guid}>Reply</a>
                </div>
                <div className='count'>
                    <div className='bar'>
                        <span style={{width: barWidth}}></span>
                    </div>
                    <div className='number'>{this.props.tweet.count + '+'}</div>
                </div>
            </div>
        );
    }
}

export default DashboardTweet;