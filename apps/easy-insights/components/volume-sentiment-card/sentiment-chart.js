import d3 from 'd3';
import moment from 'moment';
import classnames from 'classnames';
import BaseChart from './base-chart';

const intFormat = d3.format('.0f');
const sentFormat = v => (v*100>0 ? '+' : '') + intFormat(v*100);

export default class SentimentChart extends BaseChart {

	overrideDefaultOptions()  {
		return {
			yTickFormat : sentFormat,
  		hlPointFormat : sentFormat
		};
	}

	setMinMaxValues() {
		let values = Object.values(this.data);
		let minVal  = d3.min(values);
		let maxVal  = d3.max(values);
		if (minVal == 0 && maxVal == 0) {
			this.minVal = -0.5;
			this.maxVal =  0.5;
		} else {
			let absMax = Math.max(Math.abs(minVal), Math.abs(maxVal));
			absMax = Math.ceil(absMax*10) / 10;
			this.minVal = -absMax; //> -0.5 ? -0.5 : minVal;
			this.maxVal = absMax; //< 0.5 ? 0.5 : maxVal;
		}
	}

	xGridLinesAt() {
		return [this.minVal, 0, this.maxVal];
	}

	drawYAxis() {
		this.yAxis = d3.svg.axis()
				.scale(this.yScale)
				.orient('left')
				.tickFormat(d => this.options.yTickFormat(d))
				.tickSize(1, 1, 0)
        .tickValues([this.minVal, 0, this.maxVal]);

		this.svg.append('g')
    		.attr('class', 'axis y-axis')
				.attr('transform', 'translate(' + (this.padding.left -2) + ', 0)')
    		.call(this.yAxis);
  }

	drawHighlightPoints() {
		this.hlightPoint = this.svg.selectAll('.hlight-point')
				.data(this.highlight)
				.enter()
			.append('g')
				.attr({
					'class': d => {
						return classnames(
							d.type == 'own' ? 'hlight-point' : 'external-hlight-point',
							d.value > 0 && 'positive',
							d.value < 0 && 'negative'
						);
					},
					'transform': d => {
						let val = d.type == 'own' ? d.value : this.data[d.date];
						let x = this.getLineX(d.date) - 3;
						let y = this.yScale(val) - 3;
						return 'translate('+x+','+y+')';
					}
				})

		this.hlightPoint.append('circle')
			.attr({
				'cx': 3,
				'cy': 3,
				'r' : d => d.type == 'own' ? 3.5 : 2.5
			});

		this.hlightPoint.append('text')
			.attr({
				'class': 'hl-val-txt',
				'text-anchor': 'middle',
				'x': 5,
				'y': -9
			}).text(d => {
				let val = d.type == 'own' ? d.value : this.data[d.date];
				return this.options.hlPointFormat(val);
			});

		// add text background
    this.drawHLPointBackgrounds();
	}

	drawLine() {
		// add linear gradient
		this.defs.append('linearGradient')
      .attr('id', 'sentiment-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', this.padding.top)
      .attr('x2', 0).attr('y2', this.height - this.padding.bottom)
    .selectAll('stop')
      .data([
        {offset: '0%', color: '#70AF46'},
        {offset: '49%', color: '#70AF46'},
				{offset: '49%', color: '#BDBEBF'},
        {offset: '51%', color: '#BDBEBF'},
        {offset: '51%', color: '#c32635'},
        {offset: '100%', color: '#c32635'}
      ])
    .enter().append('stop')
      .attr('offset', d => d.offset )
      .attr('stop-color', d => d.color);

		// draw line graph
		this.line = d3.svg.line()
				.interpolate('monotone')
				.x(d => this.getLineX(d.date))
				.y(d => this.yScale(d.value));

		this.path = this.svg.append('svg:path')
				.attr('d', this.line(this.sortedData))
				.attr('class', 'line sentiment-line')
				.attr('stroke-linecap', 'round')
				.style('stroke', 'url(#sentiment-gradient)');
				//.style('stroke', '#ff0000');
	}
}
