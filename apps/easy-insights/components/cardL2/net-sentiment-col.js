import React from 'react';
import {BaseCol, barChartBaseOpts} from './base-col';
import d3 from 'd3';
import classnames from 'classnames';
import HorizBarChart from '../../charts/horizontal-bar-chart';
import T from '../../i18n';
import HelpText from '../help-text';

const intFormat = d3.format('.0f');

export default class NetSentiment extends BaseCol {

  componentDidMount() {
    if (this.props.data && this.props.data.length) {
      let netSentOpts = Object.assign({}, barChartBaseOpts, {
        valueKey  : 'netSentiment',
        valueFormatter : v => (v > 0 ? '+':'') + intFormat(v*100),
        opacityFunc: (v, max) => 0.5 * (Math.abs(v/max) + 1),
        barStart  : 'middle',
        valueWidthFactor : 0.24
      });
      this.chart = new HorizBarChart(this.refs.chartElem, this.props.data, netSentOpts);
    }
  }

  render() {
    return <div className="content-col net-sentiment-col">
      <div className="col-head">
        <span className="title-content">
          <HelpText level={2} type={this.props.helpText}/>
          <a className={classnames('col-title', this.getSortLinkClass('netSentiment'))} href="javascript:void(0)" onClick={this.handleSort.bind(this, 'netSentiment')}>{T('l2cols.netSentiment.title')}</a>
        </span>
      </div>
      <div className="col-body">
        <div className="chart-col-container l2-horiz-bars net-sentiment-bars red-and-green" ref="chartElem"></div>
      </div>
    </div>
  }

}
