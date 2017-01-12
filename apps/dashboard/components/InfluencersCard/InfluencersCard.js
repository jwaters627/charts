'use strict';

import React from 'react';
import _ from 'lodash';
import moment from 'moment';

require('./InfluencersCard.scss');

class InfluencersCard extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        data: React.PropTypes.array.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.forceUpdate();
        }
    }

    render() {
        return (
            <div className="influencers-card">
                {_.map(this.props.data, function(d, i) {
                    return (
                        <div className="influencer" key={i}>
                            <div className="influencer-header">
                                <img className="klout-score" src={'/chs/images/klout-icons/klout-score_105x95_' + d.score + '.png'} />
                                <img className="avatar" src={d.profileImageUrl} />
                                <h1>{d.authorUserName}</h1>
                                <h2>@{d.author}</h2>
                            </div>

                            <div className="influencer-metrics">
                                <div className="metric">
                                    <h3>Tweets</h3>
                                    <span>{d.tweets}</span>
                                </div>
                                <div className="metric">
                                    <h3>Followers</h3>
                                    <span>{d.followers}</span>
                                </div>
                                <div className="metric">
                                    <h3>Following</h3>
                                    <span>{d.following}</span>
                                </div>
                            </div>

                            <div className="influencer-sample-tweet">
                                <p>&quot;{d.description.content}&quot;</p>
                                <div className="influencer-date">
                                    <a href={'https://twitter.com/' + d.author + '/status/' + d.guid} target="_blank">
                                        posted on {moment.utc(d.description.dateTime).format('M/D/YY h:mm A UTC')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default InfluencersCard;