'use strict';

import React from 'react';
import DashboardTweet from '../DashboardTweet/DashboardTweet.js';
import _ from 'lodash';

require('./RetweetsCard.scss');

class RetweetsCard extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        retweets: React.PropTypes.array.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.forceUpdate();
        }
    }

    render() {
        if (this.props.retweets.length > 0) {
            let count = _.max(_.map(this.props.retweets, function(obj) {
                return obj.count;
            }));

            let tweets = this.props.retweets.map(function(tweet, i) {
                let percent = Math.round((tweet.count / count) * 100);
                return (<DashboardTweet tweet={tweet} percent={percent} key={i} />);
            });

            return (
                <div className='retweets-card'>
                    {tweets}
                </div>
            );
        } else {
            return (
                <div className='retweets-card'>
                    <p>Sorry, no Retweets found for selected date range.</p>
                </div>
            );
        }

    }
}

export default RetweetsCard;