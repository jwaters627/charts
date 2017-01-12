import React from 'react';
import {BaseCol} from './base-col';
import {format} from 'd3';
import classnames from 'classnames';
import T from '../../i18n';

const numFormat = format('.1s');

export default class InfluenceBreakdownChartComponent extends BaseCol {

  render () {
    return <div className="content-col influencer-breakdown-col">
      <div className="col-head">
        <div className="col-title">{T('l2cols.influencerBreakdown.title')}</div>
        <div className="col-head-legend-3">
          <div className="legend-link">
            <a className={this.getSortLinkClass('numTweets')} href="javascript:void(0)" onClick={this.handleSort.bind(this, 'numTweets')}>
              {T('l2cols.influencerBreakdown.tweets')}
            </a>
          </div>
          <div className="legend-link">
            <a className={this.getSortLinkClass('numFollowers')} href="javascript:void(0)" onClick={this.handleSort.bind(this, 'numFollowers')}>
              {T('l2cols.influencerBreakdown.followers')}
            </a>
          </div>
          <div className="legend-link">
            <a className={this.getSortLinkClass('numFollowing')} href="javascript:void(0)" onClick={this.handleSort.bind(this, 'numFollowing')}>
              {T('l2cols.influencerBreakdown.following')}
            </a>
          </div>
        </div>
      </div>
      <div className="col-body">
        {this.props.data.map( (w,i) =>
          <div key={'s-break-item-'+i} className={classnames('data-row', w.highlight && 'highlight')}>
            <div className="row-item">{numFormat(w.numTweets)}</div>
            <div className="row-item">{numFormat(w.numFollowers)}</div>
            <div className="row-item">{numFormat(w.numFollowing)}</div>
          </div>
        )}
      </div>
    </div>;
  }
}
