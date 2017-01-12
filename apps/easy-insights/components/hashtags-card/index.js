import React from 'react';
import {chSort} from 'ch-ui-lib';
import classnames from 'classnames';
import HorizBarChart from '../../charts/horizontal-bar-chart';
import BaseCard from '../card';
import T from '../../i18n';

export default class HashtagsCard extends BaseCard {

	hasL2Link        = true;
	hasPNGExport     = true;
	cardClass        = 'interests-card';
	cardDisplayName  = 'Hashtags';

	constructor(props) {
		super(props);
		let data     = this.props.card.data;
		this.hasData = data.hashtagPercentages && !!data.hashtagPercentages.length;
		if (this.hasData) {
			this.sortedData = chSort(data.hashtagPercentages, ['percentage', 'hashtag'], ['desc', 'asc']).slice(0,10);
		}
	}

	componentDidMount() {
		this.handleResize = this.handleResize.bind(this);
		window.addEventListener('resize', this.handleResize);
		if (this.hasData) {
			let opts = {
				labelKey: 'hashtag'
			};
			this.chart = new HorizBarChart(this.refs.hashtagsGraphElem, this.sortedData, opts);
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
			setTimeout(() => this.handleCardMounted());
		}, this.resizeDelay);
  }

  renderCardContent() {
    return (
      <div className="card-block card-content">
        <div className="title-wrap">
          <h4 className="card-title">
						{T('card.hashtags.title')}
					</h4>
          <span className="sub">
						{T('card.hashtags.subtitle')}
					</span>
        </div>
        <div className="section-content">
          <div className="interests-graph" ref="hashtagsGraphElem"></div>
        </div>
      </div>
		);
  }
}
