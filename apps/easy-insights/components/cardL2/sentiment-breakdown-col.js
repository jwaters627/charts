import React from 'react';
import {BaseCol} from './base-col';
import {format} from 'd3';
import classnames from 'classnames';
import T from '../../i18n';
import HelpText from '../help-text';

const percentFormat = format('.0%');

export default class SentBreakdownChartComponent extends BaseCol {

  render () {
    return <div className="content-col sentiment-breakdown-col">
      <div className="col-head">
        <span className="title-content">
          <HelpText level={2} type={this.props.helpText}/>
          <span className="section-name">{T('l2cols.sentimentBreakdown.title')}</span>
        </span>
        <div className="col-head-legend-3">
          <div className="legend-link">
            <a className={this.getSortLinkClass('pctPositiveSentiment')} href="javascript:void(0)" onClick={this.handleSort.bind(this, 'pctPositiveSentiment')}>
              {T('l2cols.sentimentBreakdown.positive')}
            </a>
          </div>
          <div className="legend-link">
            <a className={this.getSortLinkClass('pctNeutralSentiment')} href="javascript:void(0)" onClick={this.handleSort.bind(this, 'pctNeutralSentiment')}>
              {T('l2cols.sentimentBreakdown.neutral')}
            </a>
          </div>
          <div className="legend-link">
            <a className={this.getSortLinkClass('pctNegativeSentiment')} href="javascript:void(0)" onClick={this.handleSort.bind(this, 'pctNegativeSentiment')}>
              {T('l2cols.sentimentBreakdown.negative')}
            </a>
          </div>
        </div>
      </div>
      <div className="col-body">
        {this.props.data.map( (w,i) =>
          <div key={'s-break-item-'+i} className={classnames('data-row', w.highlight && 'highlight')}>
            <div className="row-item positive">{percentFormat(w.pctPositiveSentiment)}</div>
            <div className="row-item neutral">{percentFormat(w.pctNeutralSentiment)}</div>
            <div className="row-item negative">{percentFormat(w.pctNegativeSentiment)}</div>
          </div>
        )}
      </div>
    </div>;
  }
}
