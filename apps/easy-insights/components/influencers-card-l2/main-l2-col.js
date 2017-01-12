import React from 'react';
import {BaseCol, barChartBaseOpts} from './base-col';
import d3 from 'd3';
import classnames from 'classnames';
import HorizBarChart from '../../charts/horizontal-bar-chart';
import HelpText from '../help-text';
import {rem2px, checkOverflow} from '../../utils/utils';

const oneDecFloat = d3.format('0.1f');

export default class MainL2Col extends BaseCol {

  constructor(props) {
    super(props);
    this.opts = Object.assign({}, barChartBaseOpts, {
      valueKey         : this.props.valueKey,
      displayValueKey  : this.props.displayValueKey || this.props.valueKey,
      valueFormatter   : this.props.valueFormatter || oneDecFloat,
      barStart         : this.props.barStart     || 'left',
      invertLblPos     : this.props.invertLblPos || false,
      rowHeight        : 26,
      barBottomBuffer  : 23,
      barValueBuffer   : 0,
      valueWidthFactor : 0.18
    });
  }

  componentDidMount() {
    if (this.props.data && this.props.data.length) {
      this.chart = new HorizBarChart(this.refs.chartElem, this.props.data, this.opts);
    }
  }

  componentWillUnmount() {
    this.chart && window.removeEventListener('resize', this.handleResize);
  }

  getBarLegendStyle() {
    let style = { left: 0, right: 0 };
    if (!this.opts.invertLblPos) {
      if (this.opts.showLabel) style.left = (this.opts.labelWidthFactor * 100) + '%';
      if (this.opts.showValue) style.right = (this.opts.valueWidthFactor * 100) + '%';
    } else {
      if (this.opts.showLabel) style.right = (this.opts.labelWidthFactor * 100) + '%';
      if (this.opts.showValue) style.left = (this.opts.valueWidthFactor * 100) + '%';
    }
    return style;
  }

  render() {
    return <div className={classnames('content-col main-content-col', this.props.colClass)}>
      <div className="col-head">
        <span className="title-content">
          <HelpText level={2} type={this.props.helpText}/>
          <a className={classnames('col-title', this.getSortLinkClass(this.props.valueKey))} href="javascript:void(0)" onClick={this.handleSort.bind(this, this.props.valueKey)}>{this.props.title}</a>
        </span>
        {!!this.props.barLegendTriptic &&
          <div className="bar-legend-triptic" style={this.getBarLegendStyle()}>
            <div className="legend-triptic-left">{this.props.barLegendTriptic[0]}</div>
            <div className="legend-triptic-center">{this.props.barLegendTriptic[1]}</div>
            <div className="legend-triptic-right">{this.props.barLegendTriptic[2]}</div>
          </div>
        }
      </div>
      <div className="col-body">
        <div className="chart-col-container l2-horiz-bars" ref="chartElem"></div>
      </div>
    </div>
  }
}
