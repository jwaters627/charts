import d3 from 'd3';
import _ from 'lodash';
import {rem2px, checkOverflow} from '../utils/utils';
import classnames from 'classnames';
import direction from 'direction';
import Tooltip from '../extra/ttip';

import {defaultPercent} from '../formats';

const defaultHorizBarOptions = {
  valueKey         : 'percentage',
  labelKey         : 'label',
  showLabel        : true,
  showValue        : true,
  invertLblPos     : false,         // invert label and value
  labelWidthFactor : 0.36,           // of total width
  valueWidthFactor : 0.15,           // of total width
  barPadding       : rem2px(0.5),   // between the bar and the 2 text elements
  valueFormatter   : defaultPercent,
  barWidth         : rem2px(0.625),
  rowHeight        : rem2px(1.6875),
  barStart         : 'left',
  barRounding      : rem2px(0.625) * 0.5,
  opacityFunc      : (v, max, min) =>  0.5 * ( (v>=0 ? v : 0)/max + 1),
  barClass         : (d, i) => classnames('bar-g', d.highlight && 'highlight', 'bar-g-'+i),
  barBottomBuffer  : 0,
  barValueBuffer   : 0
};
export {defaultHorizBarOptions}

export default class HorizBarChart {

	constructor(el, data, options = {}) {
		this.el   = el;
		this.data = data;
    let overrideDisplayValueKey = !!options.displayValueKey;
    this.opt = Object.assign({}, defaultHorizBarOptions, options); // override default options
    if (!overrideDisplayValueKey) this.opt.displayValueKey = this.opt.valueKey;
		this.draw();
	}

	initUnits() {
    let opt = this.opt;
    // basic sizes and positions
		this.width           = this.el.offsetWidth;
		this.height          = this.data.length * (opt.rowHeight + opt.barBottomBuffer);
    this.labelWidth      = opt.showLabel ? opt.labelWidthFactor * this.width : 0;
		this.valueWidth      = opt.showValue ? opt.valueWidthFactor * this.width : 0;
    this.barPaddingLeft  = (!opt.invertLblPos && this.opt.showLabel) ||
                           ( opt.invertLblPos && this.opt.showValue) ? this.opt.barPadding : 0;
    this.barPaddingRight = (!opt.invertLblPos && this.opt.showValue) ||
                           ( opt.invertLblPos && this.opt.showLabel ) ? this.opt.barPadding : 0;
		this.barColumnWidth  = this.width - this.labelWidth - this.valueWidth - this.barPaddingLeft - this.barPaddingRight;
    this.barRoundFunc    = this.opt.barRounding;

    // get min max values and range
    const vKey = this.opt.valueKey;
    let rangeL = 0;
    let rangeR = this.barColumnWidth;

    switch (this.opt.barStart) {
      case 'left':
        this.minVal  = 0;
        this.maxVal  = _.maxBy(this.data, vKey)[vKey];
        break;
      case 'middle':
        let absMaxVal = _.max([
          _.maxBy(this.data, vKey)[vKey],
          _.minBy(this.data, vKey)[vKey]
        ].map(v => Math.abs(v)));
        this.minVal = 0;
        this.maxVal = absMaxVal;
        rangeR = this.barColumnWidth / 2;
        this.opt.barClass = (v, i) => classnames(
          'bar-g',
          'bar-g-'+i,
          v.highlight && 'highlight',
          v[vKey] > 0 && 'positive',
          v[vKey] < 0 && 'negative',
          v[vKey] === 0 && 'neutral'
        );
        break;
      case 'right':
        this.minVal = 0;
        this.maxVal = _.maxBy(this.data, vKey)[vKey];
        rangeR = 0;
        rangeL = this.barColumnWidth;
        break;
    }

    // create the scale
    this.scale = d3.scale.linear()
    		.domain([this.minVal, this.maxVal])
    		.range([rangeL, rangeR]);

    // check value label and bar position
    this.valueX = opt.invertLblPos ? this.valueWidth : this.width - this.valueWidth;
    this.labelX = opt.invertLblPos ? this.width - this.labelWidth : 0;
    this.barStartX = (opt.invertLblPos ? this.valueWidth : this.labelWidth) + this.barPaddingLeft;
    this.barEndX   = this.barStartX + this.barColumnWidth;

    // determine functions for bar x and width
    switch (this.opt.barStart) {
      case 'left':
        this.barFuncX = this.barStartX;
        this.barFuncW = d => this.scale(d[vKey]);
        break;
      case 'middle':
        const middle = this.barStartX + this.barColumnWidth/2;
        this.barFuncX = d => {
          if (d[vKey] === 0) return middle - 1;
          return d[vKey] < 0 ? middle - this.scale(Math.abs(d[vKey])) : middle;
        };
        this.barFuncW = d => {
          let w = this.scale(Math.abs(d[vKey]));
          return w !== 0 ? w : 2;
        }
        this.barRoundFunc = d => d[vKey] === 0 ? 0 : opt.barRounding;
        break;
      case 'right':
        this.barFuncX = d => this.barEndX - this.scale(d[vKey]);
        this.barFuncW = d => this.scale(d[vKey]);
        break;
    }
	}

	draw() {
		this.initUnits();
		this.svg = d3.select(this.el)
	          .append('svg')
              .attr('class', 'l1-horiz-bars')
	          	.attr('width', this.width)
							.attr('height', this.height);

    // bar gs for all elements of a bar
	  this.barG = this.svg.selectAll('.bar-g')
							.data(this.data)
						.enter().append('g')
							.attr('transform', (d, i) => 'translate( 0, '+(i * (this.opt.rowHeight + this.opt.barBottomBuffer))+')')
							.attr('class', this.opt.barClass);

		// bar bg rect
		this.barBg = this.barG.append('rect')
				.attr('x', this.barStartX)
				.attr('y', this.opt.rowHeight/2 - this.opt.barWidth/2)
				.attr('width', this.barColumnWidth)
				.attr('height', this.opt.barWidth)
				.attr('class', 'bar-bg')
				.attr('ry', this.opt.barRounding);

    if (this.opt.barStart === 'middle') {
      this.centerAxis = this.svg.append('line')
          .attr({
            'x1' : this.barStartX + this.barColumnWidth/2,
            'x2' : this.barStartX + this.barColumnWidth/2,
            'y1' : 0,
            'y2' : this.height,
            'stroke-width' : 1,
            'stroke' : 'black',
            'stroke-dasharray' : '1,5',
            'class': 'center-axis'
          });
    }

	  // bar rect
		this.bar = this.barG.append('rect')
				.attr('x', this.barFuncX)
				.attr('y', this.opt.rowHeight/2 - this.opt.barWidth/2)
				.attr('width', this.barFuncW)
				.attr('height', this.opt.barWidth)
				.attr('class', 'bar')
        .attr('fill-opacity', v => this.opt.opacityFunc(v[this.opt.valueKey], this.maxVal))
				.attr('ry', this.barRoundFunc);

		// bar value txt
    if (this.opt.showValue) {
      let maxValPixLength = 0;
  		this.valTxt = this.barG.append('text')
  				.attr('class', 'bar-value')
  				.attr('x', this.valueX)
          .attr('text-anchor', 'end')
  				.attr('y', this.opt.rowHeight/2*1.32 + this.opt.barValueBuffer)
  				.text(d => this.opt.valueFormatter(d[this.opt.displayValueKey]))
          .each(function () {
            let valLength = d3.select(this).node().getComputedTextLength();
            if (valLength > maxValPixLength) maxValPixLength = valLength;
          })

      if (maxValPixLength > 0) {
        this.valueX = this.opt.invertLblPos ? this.valueWidth : this.width - this.valueWidth + maxValPixLength;
        this.valTxt.attr('x', this.valueX);
      }
      this.maxValPixLength = maxValPixLength;
    }

		// bar label text
    if (this.opt.showLabel) {
      let self = this;
  		this.labelTxt = this.barG.append('text')
  				.attr('x', this.labelX + this.labelWidth)
  				.attr('y', this.opt.rowHeight/2*1.32)
          .attr('width', this.labelWidth)
  				.attr('class', (d, i) => classnames(
            'bar-label',
            d.highlight ? 'highlight' : 'normal',
            direction(d[this.opt.labelKey]) === 'rtl' && 'rtl'
          ))
  				.attr('text-anchor', d => direction(d[this.opt.labelKey]) === 'rtl' ? 'start' : 'end')
  				.text(d => d[this.opt.labelKey])
  				.each(function () {
  					// wrap text
  					let txtSelf = d3.select(this),
  	        		textLength = txtSelf.node().getComputedTextLength(),
  	      			text = txtSelf.text();
            // attach tooltip!
            if (textLength > self.labelWidth) {
              let ttip = new Tooltip(this, text);
            }
  					while (textLength > self.labelWidth && text.length > 0) {
  		          text = text.slice(0, -1);
  		          txtSelf.text(text + '...');
  		          textLength = txtSelf.node().getComputedTextLength();
  		      }
  				});
    }

    /*
    if (this.opt.showLabel) {

  		this.labelTxt = this.barG.append('foreignObject')
  				.attr({
  					'x': this.labelX,
  					'y': 0,
  					'width': this.labelWidth,
  					'height': this.opt.rowHeight
  				});

  		this.labelTxtHtml = this.labelTxt
  			.append('xhtml:div')
  				.attr('class', 'bar-label')
  				.style('height', this.opt.rowHeight+'px')
  				.attr('title', d => d[this.opt.labelKey])
  				.text(d => d[this.opt.labelKey])
  				.on('hover', (d, e) => {
  					if (checkOverflow(this.labelTxtHtml[0][e])) {
  						const thisLbl = d3.select(this.labelTxt[0][e])
  							.attr('class', 'expanded-label')
  							.attr('width', '100%');
  						setTimeout(() => {
  							thisLbl.attr('class', '')
  								.attr('width', this.labelWidth);
  						}, 2000);
  					}
  				});
    }*/
	}

	resize() {
		this.initUnits();
		this.svg.attr('width', this.width).attr('height', this.height);
		this.barG.attr('transform', (d, i) => 'translate( 0, '+(i * this.opt.rowHeight)+')');
		this.opt.showLabel && this.labelTxt.attr('width', this.labelWidth);
		this.barBg
        .attr('x', this.barStartX)
				.attr('width', this.barColumnWidth);
		this.bar
        .attr('x', this.barFuncX)
				.attr('width', this.barFuncW);
		if (this.opt.showValue) {
      this.valueX = this.opt.invertLblPos ? this.valueWidth : this.width - this.valueWidth + this.maxValPixLength;
      this.valTxt.attr('x', this.valueX);
    }
    !!this.centerAxis && this.centerAxis
        .attr({
          'x1': this.barStartX + this.barColumnWidth/2,
          'x2': this.barStartX + this.barColumnWidth/2
        });
	}

	remove() {
		this.svg.remove();
	}
}
