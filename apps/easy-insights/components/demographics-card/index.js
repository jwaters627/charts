import React from 'react';
import _ from 'lodash';
import {rem2px} from '../../utils/utils';
import topojson from 'topojson';
import d3 from 'd3';
import classnames from 'classnames';
import BaseCard from '../card';
import AgeChart from './age-chart';
import DonutChart from './donat-chart';
import LocationChart from './location-chart';
import T from '../../i18n';
import Icon from '../../../../common/icons';

// STYLE!
require('./demographics.scss');

const intPercent  = d3.format('.0%'),
		  oneDecFloat = d3.format('.1f'),
		  twoDecFloat = d3.format('.2f');

export default class DemographicsCard extends BaseCard {

	hasPNGExport     = true;
	cardClass        = 'demographics-card';
	cardDisplayName  = 'Demographics';

	constructor(props) {
		super(props);
		let data = this.props.card.data;

		this.hasAge    = data.agePercent && _.sumBy(data.agePercent, 'percentage') > 0;
		this.hasGender = data.genderPercent && Object.keys(data.genderPercent).length == 2 &&
										 _.sum(Object.values(data.genderPercent)) > 0;
		this.hasGeo    = !!data.geoPercent && Object.keys(data.geoPercent).length > 0;
		this.hasData   = this.hasGeo || this.hasGender || this.hasAge;

		if (this.hasGender) {
			this.genderPercent = data.genderPercent;
			this.gender = {
				femaleFloat : twoDecFloat(this.genderPercent.F),
				maleFloat   : twoDecFloat(this.genderPercent.M)
			};
		}

		if (this.hasGeo) {
			this.topRegions = data.topRegions;
		}
		this.locationDisplay = this.hasGeo && data.region !== 'SPECIFIED' ? 'map' : 'list';
		this.data = data;
	}

	componentDidMount() {
		this.handleResize = this.handleResize.bind(this);
		window.addEventListener('resize', this.handleResize);

		if (this.hasAge) {
			this.ageChart = new AgeChart(this.refs.ageChartElem, this.data.agePercent);
		}
		if (this.hasGender) {
			this.genderDonut = new DonutChart(this.refs.genderDonutElem, this.data.genderPercent);
		}
		if (this.hasGeo && this.data.region !== 'SPECIFIED') {
			this.geoChart = new LocationChart(this.refs.locationChartElem, this.data.geoPercent, this.data.region, this.handleCardMounted.bind(this));
		}
		this.handleCardMounted();
	}

	/*
	componentDidUpdate() {
		this.hasGender && this.genderDonut.remove();
		this.hasAge && this.ageChart.remove();
		this.hasGeo && this.geoChart.remove();
		this.componentWillUnmount();
		this.componentDidMount();
	}*/

	shouldComponentUpdate(newProps, newState) {
		return false;
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize() {
		this.resizing && clearTimeout(this.resizing);
		this.resizing = setTimeout(() => {
			this.hasGender && this.genderDonut.resize();
		  this.hasGeo && this.geoChart.resize();
			this.hasAge && this.ageChart.resize();
			this.handleCardMounted();
		}, this.resizeDelay);
  }

	renderCardContent() {
		let fillOpacityM = 0.5 * (this.data.genderPercent.M + 1);
		let fillOpacityF = 0.5 * (this.data.genderPercent.F + 1);
		return <div>
					{ (this.hasGender || this.hasAge) &&
						<div className="card-block card-content gender-age-block">
							<div className="row">
							{ this.hasAge &&
								<div className={classnames(this.hasGender ? 'col-xs-6' : 'col-xs-12', 'age-section')}>
									<div className="title-wrap">
				            <h4 className="card-title">
											{T('card.demographics.age')}
										</h4>
				            <span className="sub"></span>
				          </div>
									<div className="section-content age-chart" ref="ageChartElem">
									</div>
								</div>
							}
							{ this.hasGender &&
								<div className={classnames(this.hasAge ? 'col-xs-6' : 'col-xs-12' , 'gender-section')}>
									<div className="title-wrap">
				            <h4 className="card-title">
											{T('card.demographics.gender')}
				            </h4>
				            <span className="sub"></span>
				          </div>
									<div className="section-content">
										<div className="donut" ref="genderDonutElem"></div>
										<div className="man-woman">
											{/* Regression here, because html2canvas can't handle inline svg icons
											<Icon name="male" style={{fillOpacity: fillOpacityM}} />
											<Icon name="female" style={{fillOpacity: fillOpacityF}} />*/}
											<svg className={'svg-man '+(this.gender.maleFloat > this.gender.femaleFloat ? 'highlight' : 'normal')} viewBox="0 0 15.1 40">
												<g>
													<circle className="icon-part" cx="7.9" cy="3.6" r="3.2" fillOpacity={fillOpacityM} />
													<path className="icon-part" fillOpacity={fillOpacityM} d="M3.2,12.7l0,9c0,0.8-0.6,1.4-1.4,1.4s-1.4-0.6-1.4-1.4v-9.7c0-2.5,2-4.5,4.5-4.5h6c2.5,0,4.5,2,4.5,4.5l-0.1,9.7c0,0.8-0.6,1.4-1.4,1.4c-0.8,0-1.4-0.6-1.4-1.4v-9c0-0.2-0.2-0.3-0.3-0.3c-0.2,0-0.3,0.2-0.3,0.3l0.1,25.1c0,1-0.8,1.9-1.9,1.9c-1,0-1.9-0.8-1.9-1.9V23.1c0-0.2-0.1-0.3-0.3-0.3c-0.2,0-0.3,0.1-0.3,0.3v14.7c0,1-0.8,1.9-1.9,1.9c-1,0-1.9-0.8-1.9-1.9V12.7c0-0.2-0.2-0.3-0.3-0.3C3.3,12.4,3.2,12.5,3.2,12.7z"/>
												</g>
											</svg>
											<svg className={'svg-woman '+(this.gender.femaleFloat > this.gender.maleFloat ? 'highlight' : 'normal')} viewBox="0 0 18.1 40">
												<g>
													<path className="icon-part" fillOpacity={fillOpacityF} d="M11.8,7.5c2.2,0,3.1,1.8,3.5,2.9l2.7,9c0.5,1.9-1.9,2.7-2.5,0.9L13,11.9h-0.7l4.3,14.8h-3.9v11.5c0,2-3,2-3,0V26.6H8.5l0,11.6c0,2-3,2-3,0l0-11.5h-4l4.3-14.8H5.1l-2.5,8.3c-0.6,1.8-3.1,1.1-2.5-0.9l2.7-9c0.3-1,1.2-2.9,3.5-2.9H11.8z"/>
													<circle className="icon-part" fillOpacity={fillOpacityF} cx="9.1" cy="3.6" r="3.2"/>
												</g>
											</svg>

										</div>
										<div className="legend text-center">
												<div className={this.gender.maleFloat > this.gender.femaleFloat ? 'bold' : 'normal' }>
													<span className={this.gender.maleFrac > this.gender.femaleFloat ? 'highlight' : 'normal' }>
														{intPercent(this.gender.maleFloat)}
													</span> {T('card.demographics.men')}
												</div>
												<div className={this.gender.femaleFloat > this.gender.maleFloat ? 'bold' : 'normal' }>
													<span className={this.gender.femaleFloat > this.gender.maleFloat ? 'highlight' : 'normal' }>
														{intPercent(this.gender.femaleFloat)}
													</span> {T('card.demographics.women')}
												</div>
										</div>
									</div>
								</div>
							}
						</div>
					</div>
				}
				{ this.hasGeo &&
					<div className="card-block location-section card-content">
						<div className="title-wrap">
							<h4 className="card-title">
								{T('card.demographics.location')}
							</h4>
							<span className="sub"></span>
						</div>
						<div className="section-content">
								<div className={classnames('geo-ranking', this.locationDisplay === 'list' && 'as-list')}>
									{this.topRegions.map( (reg, i) =>
										<div className={classnames('item-'+this.topRegions.length, 'geo-item', (i==0 && 'highlight'))} key={reg.id}>
											<div className="name">{reg.name}</div>
											<div className="percent">{String(oneDecFloat(reg.percentage)).replace('.0', '')}%</div>
										</div>
									)}
								</div>
								{this.locationDisplay === 'map' &&
									<div className="location-chart" ref="locationChartElem"></div>
								}
						</div>
					</div>
				}
			  </div>;
		}
}
