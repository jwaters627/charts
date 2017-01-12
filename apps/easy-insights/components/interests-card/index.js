import React from 'react';
import d3 from 'd3';
import classnames from 'classnames';
import HorizBarChart from '../../charts/horizontal-bar-chart';
import {defaultHorizBarOptions} from '../../charts/horizontal-bar-chart';
import BaseCard from '../card';
import T from '../../i18n';
import {chSort} from 'ch-ui-lib';

require('./interests.scss');

const oneDecPercent   = d3.format('.1%');
const zeroDecPercent  = d3.format('.0%');
const defaultPercent  = v => oneDecPercent(v).replace('100.0', '100');

export default class InterestsCard extends BaseCard {

	hasPNGExport     = true;
	hasL2Link        = true;
	cardClass        = 'interests-card';
	cardDisplayName  = 'Interests';

	constructor(props) {
		super(props);
		let data = this.props.card.data;
		this.hasData = data.interestData && !!data.interestData.length;
		if (this.hasData) {
			this.sortedData = chSort(data.interestData, ['pctUniqueAuthors', 'name'], ['desc', 'asc']).slice(0,10);
		}
	}

	componentDidMount() {
		this.handleResize = this.handleResize.bind(this);
		window.addEventListener('resize', this.handleResize);
		if (this.hasData) {
			let opts = {
				valueKey       : 'pctUniqueAuthors',
				labelKey       : 'interestName',
				valueFormatter : defaultPercent,
				barStart			 : 'left'
			};
			this.chart = new HorizBarChart(this.refs.interestGraphElem, this.sortedData, opts);
		}
		this.handleCardMounted();
	}

	componentDidUpdate() {
		if (this.chart) this.chart.remove();
		this.componentWillUnmount();
		this.componentDidMount();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize() {
		this.resizing && clearTimeout(this.resizing);
		this.resizing = setTimeout(() => {
			this.chart && this.chart.resize();
			setTimeout( () => this.handleCardMounted());
		}, this.resizeDelay);
  }


  renderCardContent() {
    return (
			<div className="card-block card-content">
        <div className="title-wrap">
          <h4 className="card-title">{T('card.interests.title')}</h4>
          <span className="sub">{T('card.interests.subtitle')}</span>
        </div>
        <div className="section-content">
          <div className="interests-graph" ref="interestGraphElem"></div>
        </div>
      </div>
		);
	}
}
