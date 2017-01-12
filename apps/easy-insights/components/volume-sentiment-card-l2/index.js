import React from 'react';
import classnames from 'classnames';
import d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';
import T from '../../i18n';
import {chSort} from 'ch-ui-lib';
import {BaseL2Card} from '../cardL2';
import {formatSmartText} from '../../utils/utils';
import VolumeChartL2 from './volume-chart-l2.js';
import SentimentChart from '../volume-sentiment-card/sentiment-chart.js';
import Tweet from '../tweet';

require('./sentiment-l2.scss');
const drillDownNames = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];

export default class VolumeSentimentCardL2 extends BaseL2Card {

  chartOpts = {
		chartHeight               : 200,
		showHighlightGridLines    : false,
    dayIntervalDivider        : 12,
    footerHeightWithLegend    : 40,
    footerHeightWithoutLegend : 30,
    xAxisLegendSpacing        : {
      day  : { padTop1: 12, padTop2: 15 },
      hour : { padTop1: 7, padTop2: 9, padTop3: 18 }
    },
    chartPadding : {
      top: 28,
      bottom: 30,
      left: 36,
      right: 5
    },
    drillDownNames : drillDownNames
	};
  cardClass = 'volume-sentiment-card-l2';

  constructor(props, context) {
    super(props, context);
    this.data = this.props.card.data;
		this.hasVolume = !!this.data.volumeSeries && !!Object.keys(this.data.volumeSeries).length;
		this.hasSentiment = !!this.data.sentimentSeries && !!Object.keys(this.data.sentimentSeries).length;
		this.hasData = this.hasVolume || this.hasSentiment;
    this.hasDrilldowns = !!this.data.topRetweets && !!this.data.topRetweets.length;
    if (this.hasDrilldowns) {
      this.state = {selectedDrilldown: 0};
      // prepare drillDownPoints
      this.data.drilldownPoints = this.data.topRetweets.map((dd, i) => _.assign(dd, {date: moment.utc(dd.tweetDate).toDate(), active: false}));
      this.data.drilldownPoints = chSort(this.data.drilldownPoints, 'date');
    }
  }

  componentDidMount() {
    this.handleResize = this.handleResize.bind(this);
		window.addEventListener('resize', this.handleResize);

    // draw volume chart
    if (this.hasVolume) {
			let volOpts = Object.assign({
				highlight         : this.data.volumeHighlight,
				externalHighlight : this.data.sentimentHighlight,
        drillDownPoints   : this.data.drilldownPoints,
        onDrillDownClick  : this.openDrillDown.bind(this),
        drillDownPointYOffset : -20,
      }, this.chartOpts);

			if ( this.data.volumeEstimate ) {
				volOpts.estimate = Object.assign(this.data.volumeEstimate, {
					estimateLegend  : T('legends.volume.estimate')
				});
			}
			this.volumeChart = new VolumeChartL2(this.refs.volumeGraphElem, this.data.volumeSeries,'l2-volume-chart', volOpts);
		}

    // draw sentimentChart
		if (this.hasSentiment) {
			let sentOpts = Object.assign({
				highlight          : this.data.sentimentHighlight,
				externalHighlight  : this.data.volumeHighlight
			}, this.chartOpts);

			if (this.data.volumeEstimate) {
				sentOpts.estimate = {
					estimate       : this.data.sentimentSeries[this.data.volumeEstimate.date],
					date           : this.data.volumeEstimate.date,
					estimateLegend : T('legends.sentiment.estimate')
				}
			}
			this.sentimentChart = new SentimentChart(this.refs.sentimentGraphElem, this.data.sentimentSeries,'l2-sentiment-chart', sentOpts);
		}
	}

	componentDidUpdate() {
    this.state && this.state.selectedDrilldown && 
      this.volumeChart.updateDrillDownPoints(this.state.selectedDrilldown);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize() {
		this.resizing && clearTimeout(this.resizing);
		this.resizing = setTimeout(() => {
			this.volumeChart && this.volumeChart.resize();
      this.sentimentChart && this.sentimentChart.resize();
		}, this.resizeDelay);
  }

  openDrillDown(ev, idx) {
    ev.stopPropagation();
    ev.preventDefault();
    let numDDs = this.data.drilldownPoints.length;
    idx = idx % numDDs;
    if (idx < 0) idx = numDDs + idx;
    this.setState({selectedDrilldown: idx});
  }

  renderDrilldownList() {
    const startDate = moment(_.first(this.data.drilldownPoints).tweetDate);
    const endDate   = moment(_.last(this.data.drilldownPoints).tweetDate);
    let daysTitle = '';
    let ddTimeFormat = 'h:mm A';
    if (endDate.diff(startDate, 'd') > 0) {
      ddTimeFormat = 'MMM DD - h:mm A';
      if (startDate.year() != endDate.year()) {
        daysTitle = startDate.format('MMM DD YYYY')+ ' - ' + endDate.format('MMM DD YYYY');
      } else {
        daysTitle = startDate.format('MMM DD')+ ' - ' + endDate.format('MMM DD YYYY');
      }
    } else {
      daysTitle = startDate.format('MMM DD');
    }
    return (
      <div className="drilldown-list">
        <div className="dd-btns">
          <button className="btn-prev"
          ref="ddPrevBtn"
          onClick={(ev)=>this.openDrillDown(ev, this.state.selectedDrilldown-1)}
          disabled={this.state.selectedDrilldown==0}></button>
          <button className="btn-next"
          ref="ddNextBtn"
          onClick={(ev)=>this.openDrillDown(ev, this.state.selectedDrilldown+1)}
          disabled={this.state.selectedDrilldown==this.data.drilldownPoints.length -1}></button>
        </div>
        <div className="dd-items">
          {this.data.drilldownPoints.map((dd, i) =>
            <div className={classnames('dd-item', this.state.selectedDrilldown == i && 'active')} key={'dd-item-'+i} data-index={i}>
              <div className="dd-title" onClick={(ev) => this.openDrillDown(ev, i)}>
                <span className="dd-point">{drillDownNames[i]}</span>
                <div className="dd-title-text">
                  <span className="dd-time">{moment(dd.tweetDate).format(ddTimeFormat)}</span>
                  <span className="dd-info"> - {T('cardL2.volSent.userPostedRT', {username: '@'+dd.authorUsername})}</span>
                </div>
              </div>
              <div className="dd-content">
                <Tweet tweetId={dd.guid} tdata={dd} showCard={true} />
              </div>
            </div>
          )}
        </div> {/* /dd-items */}
      </div>
    )
  }

  renderCardContent() {
    return (
      <div className="volsent-card-content">
        <div className="row">

          {/******** INFO COL *******/}
          {this.hasDrilldowns &&
            <div className="col-xs-12 col-sm-6 col-md-5 col-lg-4 info-col">
              <div className="card-block card-content">
                <div className="title-wrap">
                  <h4 className="card-title">{T('cardL2.volSent.infoColTitle')}</h4>
                </div>
                <div className="section-content">
                  {this.renderDrilldownList()}
                </div>
              </div>
            </div>
          }

          {/****** CHART COL ********/}
          <div className={classnames('col-xs-12 chart-col', this.hasDrilldowns ? 'col-sm-6 col-md-7 col-lg-8' : 'col-sm-12 col-md-12 col-lg-12')}>
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
    			</div> {/* /content-wrapper */}
        </div> {/* /col */}
      </div> {/* /row */}
    </div>
		);
  }
}
