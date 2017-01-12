import _ from 'lodash';
import d3 from 'd3';
import {rem2px} from '../../utils/utils';
import classnames from 'classnames';

const intPercent  = d3.format('.0%');
const barWidthRem = 0.625;

export default class AgeChart {

	constructor(el, data) {
		this.el   = el;
		this.data = data;
		this.init();
	}

	init() {
		this.percentages = _.map(this.data, 'percentage');
		this.data        = _.sortBy(this.data, 'startAgeInclusive');
		this.headHeight  = 10;

		let self          = this,
				height        = 148,
				maxPercent    = _.max(this.percentages),
				width         = this.el.offsetWidth, // pixel in X axis
				xStep         = width / this.percentages.length,
				barWidth      = rem2px(barWidthRem),
				valueHeight   = 10,
				footHeight    = rem2px(2), // px
				barHeight     = 95,
				paddingLeft   = xStep/3,
				legendPadTop  = 36,
				maxBarPercent = maxPercent < 0.8 ? maxPercent * 1.2 : maxPercent,
				yScale        = d3.scale.linear()
									     .domain([0, maxBarPercent ])
									     .range([0, barHeight])
		;

	  // first pass for bar bgs
		this.svg = d3.select(this.el).append('svg')
				.attr('id', 'l1-age-chart')
				.attr('height', height)
				.attr('width', width);

		this.bar = this.svg.selectAll('g')
				.data(this.data)
			.enter().append('g')
				.attr('transform', (d, i) => {
					return 'translate( '+(i*xStep + paddingLeft)+' ,'+self.headHeight+')';
				});

		this.barBg = this.bar.append('rect')
				.attr('class', 'bar-bg')
				.attr('width', barWidth)
				.attr('height', barHeight)
				.attr('y', valueHeight)
				.attr('x', 0)
				.attr('rx', barWidth/2);

		// second pass with actual bars
		this.bar.append('rect')
				.attr('class', d => classnames('bar', d.percentage === maxPercent ? 'highlight' : 'normal'))
				.attr('width', barWidth)
				.attr('x', 0)
				.attr('rx', barWidth/2)
				.attr('fill-opacity', d => 0.5 * (d.percentage/ maxPercent + 1))
				/*.attr('height', 0)
				.attr('y', barHeight + valueHeight)
				.transition()
				.duration(600)
				.ease('elastic')
				.delay( (d, i) => i*40 + 400)*/
				.attr('y', d =>	barHeight - yScale(d.percentage) + valueHeight)
				.attr('height', d => yScale(d.percentage));

		this.bar.append('text')
				.attr('class', d => classnames(d.percentage == maxPercent && 'highlight', 'value-txt'))
				.attr('y', 0)
				.attr('x', barWidth/1.5)
				.attr('text-anchor', 'middle')
				/*.transition()
				.delay(1000)*/
				.text(d => intPercent(d.percentage));

		// add x tick labels
		this.bar.append('text')
				.attr('class', d => classnames(d.percentage == maxPercent && 'highlight', 'xtick'))
				.attr('x', barWidth/2)
				.attr('text-anchor', 'middle')
				.attr('y', barHeight + legendPadTop)
				.text((d, i) => {
					let start = i > 0 ? d.startAgeInclusive : '≤';
					let end = i < this.data.length -1 && d.endAgeInclusive < 100 ? d.endAgeInclusive : '≥';
					let join = i == 0 || (i == this.data.length -1) ? '' : '-';
					return start+join+end;
				});
	}

	resize() {
		let width       = this.el.offsetWidth, // pixel in X axis
				xStep       = width / this.percentages.length,
				paddingLeft = rem2px(0.4)
		;
		this.bar.attr('transform', (d, i) => {
			return 'translate( ' + (i * xStep + paddingLeft) + ' ,'+this.headHeight+')';
		});
	}

	remove() {
		this.svg.remove();
	}
}
