import React from 'react';
import classnames from 'classnames';
import {rem2px} from '../../utils/utils';
import {defaultHorizBarOptions} from '../../charts/horizontal-bar-chart';

const barChartBaseOpts = Object.assign({}, defaultHorizBarOptions, {
  rowHeight   : rem2px(1.63),
  barWidth    : rem2px(0.63),
  barRounding : rem2px(0.285),
  showLabel   : false
});
export {barChartBaseOpts};

export class BaseCol extends React.Component {

  componentDidMount() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  getSortLinkClass(field) {
    return classnames(
        'sort-link',
        this.props.sortField === field && 'sort-active',
        this.props.sortField === field && this.props.sortDirec === 'asc' ? 'sort-asc' : 'sort-desc'
    );
  }

  handleResize() {
    if (this.chart) {
      this.resizing && clearTimeout(this.resizing);
      this.resizing = setTimeout(() => {
        this.chart.resize();
      }, 250);
    }
  }

  handleSort(field) {
    this.props.handleSort(field);
  }

  componentDidUpdate() {
    !!this.chart && this.chart.remove();
    this.componentWillUnmount();
    this.componentDidMount();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
}
