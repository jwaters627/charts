import d3 from 'd3';
import {rem2px} from '../../utils/utils';
import classnames from 'classnames';

const barWidthRem = 0.625;
const intPercent  = d3.format('.0%');

export default class DonutChart {

	constructor(el, data) {
		this.el   = el;
		this.data = data;
		this.init();
	}

	init() {
		this.width        = this.el.offsetWidth;
		this.height       = this.el.offsetHeight;
		this.arcWidth     = rem2px(barWidthRem) * 0.9;
		this.maxPercent   = Math.max(this.data.F, this.data.M);
		this.minPercent   = Math.min(this.data.F, this.data.M);
		this.radius       = 48; //Math.min(this.height, this.width) / 2.15;
		this.arcDirection = this.data.F > this.data.M ? 1 : -1;

		this.svg = d3.select(this.el).append('svg')
									.attr('id', 'l1-gender-chart')
									.attr('width', this.width)
									.attr('height', this.height);

		this.donutG = this.svg.append('g')
									.attr('transform', 'translate(' + this.width/2 + ',' + this.height/2 + ')');

		this.bgCircle = this.donutG.append('circle')
									.attr('r', this.radius - (this.arcWidth/2))
									.attr('class', 'donat-circle')
									.attr('fill', 'none')
									.attr('stroke-opacity', 0.5 * (this.minPercent + 1))
									.attr('stroke-width', this.arcWidth);

		// check if spread is 50-50
		this.doHighlight = intPercent(this.data.F) !== intPercent(this.data.M);

		this.arc = d3.svg.arc()
					  	.outerRadius(this.radius + 1)
					  	.innerRadius(this.radius - this.arcWidth - 1)
							.startAngle(0)
							.endAngle( this.arcDirection * this.maxPercent * 1.02 * 2 * Math.PI ) // 1.02 -> visually compensate rounded edges
							.cornerRadius(this.arcWidth/2 + 2);

		this.arcPath = this.donutG.append('path')
							.attr('d', this.arc)
							.attr('fill-opacity', 0.5 * (this.maxPercent + 1))
							//.attr('class', this.doHighlight ? 'highlight' : 'tied');
							.attr('class', 'donat-arc');
	}

	resize() {
		this.height = this.el.offsetHeight;
		this.width  = this.el.offsetWidth;
		this.radius = Math.min(this.height, this.width) / 2;
		this.arc.outerRadius(this.radius)
				.innerRadius(this.radius - this.arcWidth);
		this.svg.attr('height', this.height);
		this.donutG.attr('transform', 'translate(' + this.width/2 + ',' + this.height/2 + ')');
		this.bgCircle.attr('r', this.radius - (this.arcWidth/2));
	}

	remove() {
		this.svg.remove();
	}
}
