import React from 'react';
import d3 from 'd3';
import classnames from 'classnames';
import moment from 'moment';
import BaseCard from '../card';
import VolumeChart from './volume-chart';
import SentimentChart from './sentiment-chart';
import T from '../../i18n';

require('./sentiment.scss');

export default class VolumeSentimenCard extends BaseCard {

	hasPNGExport     = true;
	hasL2Link        = true;
	cardClass        = 'volume-sentiment-card';
	cardDisplayName  = 'Volume & Sentiment';
	chartOpts        = {
		chartHeight             : 100,
		showHighlightGridLines  : true
	};

	constructor(props, context) {
		super(props, context);
		this.data = this.props.card.data;
		this.hasVolume = !!this.data.volumeSeries && !!Object.keys(this.data.volumeSeries).length;
		this.hasSentiment = !!this.data.sentimentSeries && !!Object.keys(this.data.sentimentSeries).length;
		this.hasData = this.hasVolume || this.hasSentiment;
	}

	clickHighlightFunc(isoDate, value) {
		let flux = this.context.flux;
		let actions = flux.getActions('easyactions');
		let store   = flux._stores.get('cardstore');

		let currentUrl = flux.urlTracker.getCurrentUrl();
		actions.setBreadcrumbRoot(currentUrl);

		// generate date range for the day;
		let newStart = moment(isoDate).startOf('day').format('YYYY-MM-DD');
		let newEnd   = moment(isoDate).endOf('day').format('YYYY-MM-DD');
		actions.updateFilter({type: 'startDate', value: newStart});
		actions.updateFilter({type: 'endDate', value: newEnd});

		const storeState = store.getState();
    const payload = {
      cardId   : this.cardId,
      query    : storeState.query,
      filters  : storeState.filters,
			phrasify : storeState.doPhrasify
    };
    actions.expandCard(payload);
		actions.clearCards();
	};

	componentDidMount() {
		this.handleResize = this.handleResize.bind(this);
		window.addEventListener('resize', this.handleResize);

		if (this.hasVolume) {
			let volOpts = Object.assign({
				highlight          : this.data.volumeHighlight,
				clickHighlightFunc : this.clickHighlightFunc.bind(this),
				externalHighlight  : this.data.sentimentHighlight
			}, this.chartOpts);

			if ( this.data.volumeEstimate ) {
				volOpts.estimate = Object.assign(this.data.volumeEstimate, {
					estimateLegend  : T('legends.volume.estimate')
				});
			}
			this.volumeChart = new VolumeChart(this.refs.volumeGraphElem, this.data.volumeSeries,'l1-volume-chart', volOpts);
		}


		if (this.hasSentiment) {
			let sentOpts = Object.assign({
				highlight          : this.data.sentimentHighlight,
				clickHighlightFunc : this.clickHighlightFunc.bind(this),
				externalHighlight  : this.data.volumeHighlight
			}, this.chartOpts);

			if (this.data.volumeEstimate) {
				sentOpts.estimate = {
					estimate       : this.data.sentimentSeries[this.data.volumeEstimate.date],
					date           : this.data.volumeEstimate.date,
					estimateLegend : T('legends.sentiment.estimate')
				}
			}
			this.sentimentChart = new SentimentChart(this.refs.sentimentGraphElem, this.data.sentimentSeries,'l1-sentiment-chart', sentOpts);
		}
		this.handleCardMounted();
	}

	componentDidUpdate() {
		if (this.volumeChart) this.volumeChart.remove();
    if (this.sentimentChart) this.sentimentChart.remove();
		this.componentWillUnmount();
		this.componentDidMount();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize() {
		this.resizing && clearTimeout(this.resizing);
		this.resizing = setTimeout(() => {
			this.volumeChart && this.volumeChart.resize();
      this.sentimentChart && this.sentimentChart.resize();
			setTimeout(() => this.handleCardMounted());
		}, this.resizeDelay);
  }

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

  renderCardContent() {
		/*const classes = classnames(
			'content-wrapper',
			//this.data.volumeEstimate && 'charts-have-legend',
			//!this.hasVolume || !this.hasSentiment ? 'no-highlight-grid-lines' : false
		);*/
    return (
			<div className="content-wrapper">
				{this.hasVolume &&
          <div className="card-block card-content volume-block" >
						<div className="title-wrap">
	            <h4 className="card-title">{T('card.volSent.volumeTitle')}</h4>
	            <span className="sub">{T('card.volSent.volumeSubtitle')}</span>
	          </div>
	          <div className="section-content">
	            <div className="volume-chart chart" ref="volumeGraphElem"></div>
	          </div>
	        </div>
				}
				{this.hasSentiment &&
	        <div className="card-block card-content sentiment-block" >
	          <div className="title-wrap">
	            <h4 className="card-title">{T('card.volSent.sentimentTitle')}</h4>
							<span className="sub">{T('card.volSent.sentimentSubtitle')}</span>
	          </div>
	          <div className="section-content">
	            <div className="sentiment-chart chart" ref="sentimentGraphElem"></div>
	          </div>
	        </div>
				}
			</div>
		);
  }
}
