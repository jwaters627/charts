import d3 from 'd3';
import moment from 'moment';
import _ from 'lodash';
import classnames from 'classnames';
const d3Time = require('d3-time'); // not working with es6 imports!

const dateFormat  = 'YYYY-MM-DD[T]HH:mm';
const numFormat1s = d3.format('.1s');
const numFormat2s = d3.format('.2s');
const numFormat3s = d3.format('.3s');
const oneDecFloat = d3.format('.1f');
const hlNumberFormat = d3.format(',g');

const defaultYTickFormat = v => {
  let result;
  if (v < 1) {
    result = oneDecFloat(v);
  } else if (v < 10000) {
    result = numFormat1s(v)
  } else if (v < 10000000) {
     result = numFormat2s(v);
  } else {
    result = numFormat3s(v);
  }
  return result.replace('.0', '');
}

const defaultHlFormat = v => {
  if (v < 10000) return hlNumberFormat(v);
  return defaultYTickFormat(v);
}

const defaultOptions = {
  chartHeight               : 100,
  yTickFormat               : defaultYTickFormat,
  hlPointFormat             : defaultHlFormat,
  dayIntervalDivider        : 12,
  minPxPerLabelTick         : 15,
  footerHeightWithLegend    : 30,
  footerHeightWithoutLegend : 0,
  xAxisLegendSpacing        : {
    day  : { padTop1: 9, padTop2: 11},
    hour : { padTop1: 9, padTop2 : 11, padTop3: 18 }
  },
  chartPadding : {
		top: 28,
		bottom: 30,
		left: 30,
		right: 5
	},
  hlBgXPadding : 6,
  hlBgYPadding : 3,
  hlBgMinWidth : 35,
  drillDownPointYOffset : -30,
  drillDownPointRadius  : 20
};

export default class BaseChart {

	constructor(el, data, id, options = {}) {
		this.el = el;
    this.id = id;
		this.data = data;
		this.options = Object.assign({}, defaultOptions, this.overrideDefaultOptions(), options);
    this.padding = this.options.chartPadding;
		this.init();
	}

  overrideDefaultOptions() {
    return {};
  }

	init() {
    this.prepareData();
		this.initSize();
    this.setMinMaxValues();
		this.createScales();

		this.svg = d3.select(this.el)
  		.append('svg')
      .attr('id', this.id)
  		//.attr('viewBox', '0 0 ' + this.width + ' ' + this.height);
			.attr('width', this.totalWidth)
			.attr('height', this.totalHeight)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr("version", 1.1);

    this.defs = this.svg.append('defs');

		this.drawXAxis();
    this.drawYAxis();
		this.drawLine();
		this.drawEstimate();
    this.drawEstimateLegend();
    this.drawHighlightPoints();
		//this.options.showHighlightGridLines && this.drawHighlightGridLines();
	}

	initSize() {
		// Set the scales
		this.width = this.el.offsetWidth;
    this.chartWidth = this.width - this.padding.left - this.padding.right;
    this.totalWidth = this.width + 20;
		this.height = this.options.chartHeight + this.padding.top + this.padding.bottom;
		this.legendHeight = this.options.estimate ? this.options.footerHeightWithLegend : this.options.footerHeightWithoutLegend;
		this.totalHeight = this.height + this.legendHeight;
	}

	prepareData() {
		let dates = Object.keys(this.data);
		dates.sort();
		this.dateKeys = dates;
		let dateObjs = dates.map(d => moment.utc(d).toDate());
		this.minDate = d3.min(dateObjs);
		this.maxDate = d3.max(dateObjs);

		let sortedData = [];
		dates.forEach( d => sortedData.push({
			date: moment.utc(d).toDate(),
			value: this.data[d]
		}));
		this.sortedData = sortedData;

    // check if daily or hourly data intervals
    if (dates.length > 1) {
      const intervalH = moment(dates[1]).diff(dates[0], 'hours');
      this.dateInterval = intervalH == 24 ? 'day' : 'hour';
      this.intervalSeconds = moment(dates[1]).diff(dates[0], 'seconds');
      this.maxDate = moment(this.maxDate).add(1, this.dateInterval).toDate();
    }else{
      this.dateInterval = 'hour';
      this.intervalSeconds = 3600;
      this.minDate = moment.utc(this.minDate).subtract(1, 'h').toDate();
      this.maxDate = moment(this.maxDate).add(2, this.dateInterval).toDate();
    }

		// internal highlight points
		let hl = this.options.highlight;
		this.highlight = hl ? hl.map(h => Object.assign(h, {type: 'own'})) : [];
		const hlDates = this.highlight.map(h => h.date);

		// external highlight points (marked in gray). Exclude if the same as above.
		if (this.options.externalHighlight && this.options.externalHighlight.length) {
			let extHl = this.options.externalHighlight.filter(h => hlDates.indexOf(h.date) === -1);
			this.highlight = this.highlight.concat(extHl.map(h => Object.assign(h, {type: 'external'})));
      this.highlight.reverse(); // draw own highlighted point on top (after external)
		};
	}

  setMinMaxValues() {
    const values = Object.values(this.data);
		this.minVal  = d3.min(values);
		this.maxVal  = d3.max(values);
  }

	createScales() {
		// tick interval
    if (this.dateInterval == 'day') {
	    this.xTickInterval = d3Time.timeHour.filter(d => moment.utc(d).hours() % this.options.dayIntervalDivider === 0);
      this.xTickTextEvery = 24 % this.options.dayIntervalDivider;
      this.halfIntervalInPx = this.chartWidth/(2*this.sortedData.length);
    } else {
      if (this.sortedData.length != 1) {
        this.xTickInterval = d3.time.hour;
        this.xTotalHours   = moment(_.last(this.dateKeys)).diff(this.dateKeys[0], 'hours') + 1;
        this.halfIntervalInPx = this.chartWidth/(2*this.sortedData.length);
      }else{ // time series has only one point (add 1h in each direction)
        let min = moment.utc(this.minDate).minute();
        this.xTickInterval = d3Time.timeMinute.filter(d => moment.utc(d).minutes() == min);
        this.xTotalHours = 3;
        this.halfIntervalInPx = this.chartWidth/(6);
      }
    }

		this.xScale = d3.time.scale()
    		.domain([this.minDate, this.maxDate])
    		.range([this.padding.left, this.width - this.padding.right]);

		this.yScale = d3.scale.linear()
    		.domain([this.minVal, this.maxVal])
    		.range([this.height - this.padding.bottom, this.padding.top]);

		// ensure we have 3 ticks in the y-axis (3 grid lines along the x-axis)
    const yTicks = this.xGridLinesAt();
		if (yTicks.length < 3) {
			this.maxVal = this.yScale.ticks(2)[1] * 2;
			this.createScales();
      return;
		} else if (yTicks[2] < this.maxVal) {
      this.maxVal = this.maxVal * 1.5;
      this.createScales();
      return;
    }

    if (this.dateInterval == 'hour') {
      this.xTickTextEvery = 1;
      let hIntervals = [1,2,3,4,6,12,24];
      for (let i=0; i < this.sortedData.length; i++) {
        if (this.xScale(this.sortedData[i].date) - this.xScale(this.minDate) >= this.options.minPxPerLabelTick) {
          this.xTickTextEvery = hIntervals[i];
          break;
        }
      }
    }

	}

  getLineX(date) {
    return this.xScale(moment.utc(date).add(this.intervalSeconds/2, 'seconds').toDate());
  }

	xGridLinesAt () {
		return this.yScale.ticks(2);
	}

	drawXAxis() {

    // check if minDate hour is even or odd
    let odd = 0;
    if (this.dateInterval == 'hour') {
      odd = moment.utc(this.minDate).hours() % 2;
    }

		// X AXIS and grid
    let lastPx;
    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient('bottom')
      .tickFormat((d, i) => {
        if (this.dateInterval == 'day') {
          if (i == 0) lastPx = -100;
          let px = this.xScale(d);
          if (px >= lastPx + this.options.minPxPerLabelTick) {
            lastPx = px;
            let dm = moment.utc(d);
            let isLast = i*this.options.dayIntervalDivider/24 == this.sortedData.length;
            return !isLast && dm.hours() == 0 ? dm.format('D') : '';
          }else{
            return '';
          }
        } else if (this.dateInterval == 'hour') {
          let dm = moment.utc(d);
          if (this.sortedData.length == 1) {
            return dm.format('h:mma')+' - '+moment.utc(d).add(1,'h').format('h:mma');
          }else {
            let isLast = i == this.sortedData.length;
            if (!isLast && parseInt(dm.hours()) % this.xTickTextEvery == 0) {
              return dm.format('h');
            }else{
              return '';
            }
          }
        }
      })
      .tickSize(1, 1)
      .ticks(this.xTickInterval, 1);


		this.xAxisG = this.svg.selectAll('line.horizontal-grid')
				.data(this.xGridLinesAt())
				.enter()
			.append('g')
				.attr({
					'class' : (d, i) => 'axis x-axis x-axis-'+i,
					'transform' : (d, i) => {
						let y = this.yScale(d) - 0.5;
						return 'translate( 0,'+y+')';
					}
				}).call(this.xAxis);

		const tick = this.xAxisG.selectAll('.x-axis-0 .tick')
      .attr('class', v => {
        const tm = moment.utc(v);
        const dateIdx = tm.format(dateFormat);
        return classnames(
          'tick',
          tm.format('X') % this.intervalSeconds == 0 ? 'on' : 'off'
        );
      })

    // x-axis style
    tick.selectAll('line')
        .attr({
          y2 : 2,
          x1 : 0,
          y1 : -2
        });

    // pad tick text
    tick.selectAll('text')
        .attr('dy', this.options.xAxisLegendSpacing[this.dateInterval].padTop1)
        .attr('dx', this.halfIntervalInPx)

		this.drawMonthLegend();
	}

  drawYAxis() {
		this.yAxis = d3.svg.axis()
				.scale(this.yScale)
				.orient('left')
				.tickFormat(d => this.options.yTickFormat(d))
				.tickSize(1, 1, 0)
				.ticks(2); // set rough # of ticks

		this.svg.append('g')
    		.attr('class', 'axis y-axis')
    		//.attr('transform', 'translate(' + this.padding.left + ', -'+ this.padding.bottom +')')
				.attr('transform', 'translate(' + (this.padding.left -2) + ', 0)')
    		.call(this.yAxis);
  }

	drawMonthLegend() {
		// create month legend
		// check if there's a first day of month in series
		const dmin = moment.utc(this.minDate);
		const dmax = moment.utc(this.maxDate);
    const chartBottom = this.padding.top + this.options.chartHeight;
    const spacing = this.options.xAxisLegendSpacing[this.dateInterval];

		let skipFirst = false;
		if (dmin.date() !== 1 && dmax.isAfter(dmin, 'month') && (dmax.diff(dmin, 'days') >= 6)) {
			skipFirst = true;
		}

    let lastPx, lastDay;
    this.monthLegendAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient('bottom')
      .tickFormat((d, i) => {
        let dm = moment.utc(d);
        if (this.dateInterval == 'day') {
          if (i == 0) {
            lastDay = 32;
            lastPx = -100;
          }
          let px = this.xScale(d);
          if (px >= lastPx + this.options.minPxPerLabelTick) {
            lastPx = px;
            let day = parseInt(dm.format('D'));
            let isLast = i*this.options.dayIntervalDivider/24 == this.sortedData.length;
            let res =  !isLast && !skipFirst && day < lastDay ? dm.format('MMM') : '';
            lastDay = day;
            skipFirst = false;
            return res;
          }else{
            return '';
          }
        } else if (this.dateInterval == 'hour') {
          if (this.sortedData.length == 1) {
            return dm.format('MMM Do');
          } else {
            let isLast = i == this.sortedData.length;
            return !isLast && dm.hours() == 0 ? dm.format('MMM Do') : '';
          }
        }
      })
      .tickSize(1, 1)
      .ticks(this.xTickInterval, 1);

    let monthTop = chartBottom;
    if (this.dateInterval === 'day') {
      monthTop += spacing.padTop2;
    }else{
      monthTop += (this.sortedData.length == 1 ? spacing.padTop2+2 : spacing.padTop3);
    }

    this.monthLegend = this.svg.append('g')
				.attr({
					'class' : 'axis x-axis month-legend',
					'transform' : 'translate( 0,'+monthTop+')'
				}).call(this.monthLegendAxis);

    this.monthLegend.selectAll('text').attr('dx', this.halfIntervalInPx);

    if (this.dateInterval === 'hour' && this.sortedData.length != 1) {
      this.AMPMLegendAxis = d3.svg.axis()
  		    .scale(this.xScale)
  		    .orient('bottom')
  		    .tickFormat( (d, i) => {
    					let dm = moment.utc(d);
              if (this.xTotalHours < 12) {
                return dm.format('A');
              }else{
    					  return  dm.hours() % 12 == 0 && i != this.sortedData.length ? dm.format('A') : '';
              }
          })
  				.tickSize(1, 1, 0)
  		    .ticks(this.xTickInterval, 1);

      this.ampmLegend = this.svg.append('g')
  				.attr({
  					'class' : 'axis x-axis ampm-legend',
  					'transform' : 'translate( 0,'+(chartBottom + spacing.padTop2)+')'
  				}).call(this.AMPMLegendAxis);
      this.ampmLegend.selectAll('text').attr('dx', this.halfIntervalInPx);
    }
	}

	drawHighlightPoints() {
		this.hlightPoint = this.svg.selectAll('.hlight-point')
				.data(this.highlight)
				.enter()
			.append('g')
				.attr({
					'class': d => d.type == 'own' ? 'hlight-point' : 'external-hlight-point',
					'transform': d => {
						let val = d.type == 'own' ? d.value : this.data[d.date];
						let x = this.getLineX(d.date) - 3;
						let y = this.yScale(val) - 3;
						return 'translate('+x+','+y+')';
					}
				});

		this.hlightPoint.append('circle')
			.attr({
				'cx': 3,
				'cy': 3,
				'r' : d => d.type == 'own' ? 3.5 : 2.5,
			});

		this.hlValTexts = this.hlightPoint.append('text')
      .attr('class', 'hl-val-txt')
			.attr({
				'text-anchor': 'middle',
				'x': 3,
				'y': d => d.type == 'own' ? -9 : -4
			}).text(d => {
				let txt = d.type == 'own' ? d.value : this.data[d.date];
				return this.options.hlPointFormat(txt);
			});

    this.drawHLPointBackgrounds();
	}

  drawHLPointBackgrounds() {
    // add text background
    let self = this;
    this.hlightPoint
      .each(function () {
        let hlPThis = this;
        let hlP = d3.select(this);
        hlP.selectAll('.hl-val-txt')
        .each( function (d) {

          let val = d.type == 'own' ? d.value : self.data[d.date];
          const bbox   = this.getBBox();
          const isBtn  = self.dateInterval == 'day' && d.type == 'own' && self.options.clickHighlightFunc
          const xBase  = self.getLineX(d.date) - 3;
          const yBase  = self.yScale(val) - 3;
          const width  = Math.max(bbox.width, self.options.hlBgMinWidth) + 2*self.options.hlBgXPadding;
          const height = bbox.height + 2*self.options.hlBgYPadding;
          const bgXRel = bbox.x - (self.options.hlBgMinWidth > bbox.width ? (self.options.hlBgMinWidth - bbox.width)/2 : 0) - self.options.hlBgXPadding;
          const bgYRel = bbox.y - self.options.hlBgYPadding;

          let bgRectAttr = {
            x      : xBase + bgXRel,
            y      : yBase + bgYRel,
            width  : width,
            height : height,
            class: 'hl-num-bg'
          };

          // Highlight point is a button!
          isBtn && Object.assign(bgRectAttr, {
            rx : 4,
            ry : 4,
            class: 'hl-btn-bg'
          });

          // add background rect/btn bg (avoid collision of bgs
          // and fgs of other hl points: put the bgs in the bg)
          let bgRect = self.svg.append('rect')
            .attr(bgRectAttr);

          // add highlight point button click area
          isBtn && hlP.append('rect')
              .attr({
                class  : 'hl-click-area',
                width  : width,
                height : height,
                x      : bgXRel,
                y      : bgYRel
              })
              .on('click', () => self.options.clickHighlightFunc(d.date, d.value))
              .on('mouseover', () => bgRect.classed('hover', true))
              .on('mouseout', () => bgRect.classed('hover', false));

          // move text/btn to front
          self.svg.node().appendChild(hlPThis);
        });
      });
  }

  drawHighlightGridLines() {
		const mrgRight = this.el.parentNode.parentNode.offsetWidth * 0.1;
		if (this.options.highlight) {
			this.gridlines = d3.select(this.el)
					.selectAll('highlight-gridline')
					.data(this.options.highlight)
					.enter()
				.append('div')
					.attr('class', 'highlight-gridline')
					.attr('style', d => {
						return 'left: '+(this.getLineX(date) + mrgRight)+'px';
					});
		}
	}

	drawLine() {
		// draw line graph
		this.line = d3.svg.line()
        .interpolate('monotone')
		    .x(d => this.getLineX(d.date))
		    .y(d => this.yScale(d.value))

		this.path = this.svg.append('svg:path')
				.attr('d', this.line(this.sortedData))
				.attr('class', 'line vol-line')
        .attr('stroke-linecap', 'round');
	}

	drawEstimate() {
		if (this.options.estimate) {
			const est = this.options.estimate,
				estStartIdx = this.dateKeys.indexOf(est.date);

			if (estStartIdx !== -1) {
				// get x from which dashed line starts
				const dashedStartDate = this.dateKeys[estStartIdx > 0 ? estStartIdx - 1 : 0];
				const path = this.path.node();
				const x = this.getLineX(dashedStartDate),
							pLength = path.getTotalLength(),
							pLengthAtX = this.getPathLengthAtX(path, x);

				let dashArray = [pLengthAtX];
				const dashedLength = pLength - pLengthAtX;
				for (let i=0; i <= dashedLength / 5; i++) {
					dashArray.push(5);
					dashArray.push(0.5);
				}
				this.path.attr('stroke-dasharray', dashArray);
			}
		}
	}

	drawEstimateLegend() {
    if (this.options.estimate) {
      this.legend = this.svg.append('g')
          .attr('class', 'estimate-legend');

      this.legend.append('line')
        .attr({
          'x1' : 0,
          'x2' : 20,
          'y1' : 0,
          'y2' : 0,
          'stroke-dasharray' : [2,4],
          //'stroke-linecap' : 'round',
          'class' : 'legend-dashed-line'
        });

      this.legendText1 = this.legend.append('text')
          .attr({
            'class': 'legend-text',
            'x' : 23,
            'y' : 3
          })
          .text(this.options.estimate.estimateLegend);

      this.legend.attr('transform', () => {
        let l = this.legendText1.node().getComputedTextLength();
        return 'translate('+(this.width/2 - l/2 - 10)+', '+(this.height+15)+')';
      });
    }
	}

	// taken from https://wiredcraft.com/blog/dashed-line-segmentation-d3js/
	getPathLengthAtX(path, x) {
	  const EPSILON = 1
	  let point
	  let target
	  let start = 0;
	  let end = path.getTotalLength()

	  // Mad binary search, yo
	  while (true) {
	    target = Math.floor((start + end) / 2)
	    point = path.getPointAtLength(target)

	    if (Math.abs(point.x - x) <= EPSILON) break

	    if ((target >= end || target <= start) && point.x !== x) {
	      break
	    }

	    if (point.x > x) {
	      end = target
	    } else if (point.x < x) {
	      start = target
	    } else {
	      break
	    }
	  }
	  return target
	}

	resize() {
    this.drillDownPoints && this.drillDownPoints.remove();
		this.remove();
		this.init();
	}

	remove() {
		this.svg.remove();
		this.gridlines && this.gridlines.remove();
	}
}
