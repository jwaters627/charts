import d3 from 'd3';
import moment from 'moment';
import _ from 'lodash';

const d3Time = require('d3-time');

const numFormat = d3.format('.1s');
const oneDecFloat = d3.format('.1f');
const hlNumberFormat = d3.format(',g');
const graphAspectRatio = 2.2;
const dateFormat = 'YYYY-MM-DD[T]HH:mm';
const graphMinHeight = 110;
const defaultHlFormat = v => v < 100000 ? hlNumberFormat(v) : numFormat(v);

class BaseChart {
    yTickFormat = (v) => (v < 1 ? oneDecFloat(v) : numFormat(v)).replace('.0', '');
    hlPointFormat = defaultHlFormat;
    graphPadding = {
        top: 20,
        bottom: 30,
        left: 30,
        right: 5
    };

    constructor(el, data, options = {}) {
        this.el = el;
        this.data = data;
        this.options = options;
        if (options.yTickFormat) this.yTickFormat = options.yTickFormat;
        if (options.hlPointFormat) this.hlPointFormat = options.hlPointFormat;
        this.init();
    }

    init() {
        this.prepareData();
        this.initSize();
        this.setMinMaxValues();
        this.createScales();
        this.svg = d3.select(this.el)
        .append('svg')
        .attr('width', this.totalWidth)
        .attr('height', this.totalHeight);
        this.drawXAxis();
        this.drawYAxis();
        this.drawLine();
        this.drawEstimate();
        this.drawEstimateLegend();
        this.drawHighlightPoints();
        this.drawHighlightGridLines();
    }

    initSize() {
        // Set the scales
        this.width = this.el.offsetWidth;
        this.totalWidth = this.width + 20;
        this.height = this.el.offsetParent.clientHeight - 50;
        //this.height = this.height > graphMinHeight ? this.height : graphMinHeight;
        this.legendHeight = this.options.estimate ? 30 : 0;
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
        const intervalH = moment(dates[1]).diff(dates[0], 'hours');
        this.dateInterval = intervalH == 24 ? 'day' : 'hour';

        // internal highlight points
        let hl = this.options.highlight;
        this.highlight = hl ? hl.map(h => Object.assign(h, {type: 'own'})) : [];
        const hlDates = this.highlight.map(h => h.date);

        // external highlight points (marked in gray). Exclude if the same as above.
        if (this.options.externalHighlight && this.options.externalHighlight.length) {
            let extHl = this.options.externalHighlight.filter(h => hlDates.indexOf(h.date) === -1);
            this.highlight = this.highlight.concat(extHl.map(h => Object.assign(h, {type: 'external'})));
            this.highlight.reverse(); // draw own highlighted point first
        };
    }

    setMinMaxValues() {
        const values = Object.values(this.data);
        this.minVal = d3.min(values);
        this.maxVal = d3.max(values);
    }

    createScales() {
        // tick interval
        if (this.dateInterval == 'day') {
            this.xTickInterval = d3Time.timeHour.filter(d => moment.utc(d).hours() % 12 === 0);
            this.xTickTextEvery = 2;
        } else {
            this.xTickInterval = d3.time.hour;
            this.xTotalHours = moment(_.last(this.dateKeys)).diff(this.dateKeys[0], 'hours');
            this.xTickTextEvery = [1,2,3,4,6,12][Math.floor(this.xTotalHours/24)];
        }

        this.xScale = d3.time.scale()
            .domain([this.minDate, this.maxDate])
            .range([this.graphPadding.left, this.width - this.graphPadding.right]);

        this.yScale = d3.scale.linear()
            .domain([this.minVal, this.maxVal])
            .range([this.height - this.graphPadding.bottom, this.graphPadding.top]);

        // ensure we have 3 grid lines
        const yTicks = this.xGridLinesAt();
        if (yTicks.length == 2) {
            this.maxVal = this.yScale.ticks(2)[1] * 2;
            this.createScales();
        } else if (yTicks[2] < this.maxVal) {
            this.maxVal = this.maxVal * 1.5;
            this.createScales();
        }
    }

    xGridLinesAt () {
        return this.yScale.ticks(2);
    }

    drawXAxis() {
        // X AXIS and grid
        this.xAxis = d3.svg.axis()
            .scale(this.xScale)
            .orient('bottom')
            .tickFormat((d, i) => {
                if (this.dateInterval == 'day') {
                    let dm = moment.utc(d);
                    return dm.hours() === 0 ? dm.format('D'): '';
                } else {
                    if (i % this.xTickTextEvery !== 0) return '';
                    let dm = moment.utc(d);
                    return dm.format('h');
                }
            })
            .tickSize(1, 1, 0)
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

        // Highlight tick
        const highlightedDates = this.highlight.map(v => v.date);
        this.xAxisG.selectAll('.tick')
            .attr('class', v => {
                const dateIdx = moment.utc(v).format(dateFormat);
                return highlightedDates.indexOf(dateIdx) !== -1 ? 'tick highlight' : 'tick';
            })
            .selectAll('text')
            .attr('dy', 9);

        this.drawMonthLegend();
    }

    drawYAxis() {
        this.yAxis = d3.svg.axis()
            .scale(this.yScale)
            .orient('left')
            .tickFormat(d => this.yTickFormat(d))
            .tickSize(1, 1, 0)
            .ticks(2); // set rough # of ticks

        this.svg.append('g')
            .attr('class', 'axis y-axis')
            .attr('transform', 'translate(' + (this.graphPadding.left -2) + ', 0)')
            .call(this.yAxis);
    }

    drawMonthLegend() {
        // create month legend
        // check if there's a first day of month in series
        const dmin = moment.utc(this.minDate);
        const dmax = moment.utc(this.maxDate);
        let skipFirst = false;
        if (dmin.date() !== 1 && dmax.isAfter(dmin, 'month') && (dmax.diff(dmin, 'days') >= 6)) {
            skipFirst = true;
        }

        this.monthLegendAxis = d3.svg.axis()
            .scale(this.xScale)
            .orient('bottom')
            .tickFormat( (d, i) => {
                let dm = moment.utc(d);
                let dFormat = this.dateInterval === 'day' ? 'MMM' : 'MMM Do';
                if (dm.hours() !== 0) return '';
                return (i == 0 && !skipFirst) ||
                     (dm.date() === 1 && i !== 0) ||
                     this.dateInterval == 'hour' ?
                     dm.format(dFormat) : ''
            })
            .tickSize(1, 1, 0)
            .ticks(this.xTickInterval, 1);

        this.monthLegend = this.svg.append('g')
            .attr({
                'class' : 'axis x-axis month-legend',
                'transform' : 'translate( 0,'+(this.height - (this.dateInterval === 'day' ? 18 : 10))+')'
            }).call(this.monthLegendAxis);

        if (this.dateInterval === 'hour') {
            this.AMPMLegendAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient('bottom')
                .tickFormat( (d, i) => {
                    let dm = moment.utc(d);
                    return    dm.hours() % 12 == 0 ? dm.format('A') : '';
                })
                .tickSize(1, 1, 0)
                .ticks(this.xTickInterval, 1);

            this.svg.append('g')
                .attr({
                    'class' : 'axis x-axis ampm-legend',
                    'transform' : 'translate( 0,'+(this.height - 18)+')'
                }).call(this.AMPMLegendAxis);
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
                    let x = this.xScale(moment.utc(d.date).toDate()) - 3;
                    let y = this.yScale(val) - 3;
                    return 'translate('+x+','+y+')';
                }
            })

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
                'y': d => d.type == 'own' ? -7 : -4
            }).text(d => {
                let txt = d.type == 'own' ? d.value : this.data[d.date];
                return this.hlPointFormat(txt);
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
                hlP.selectAll('.hl-val-txt').each( function (d) {
                    const bbox = this.getBBox();
                    let val = d.type == 'own' ? d.value : self.data[d.date];
                    let xBase = self.xScale(moment.utc(d.date).toDate()) - 3;
                    let yBase = self.yScale(val) - 3;
                    self.svg.append('rect').attr({
                        class: 'hl-num-bg',
                        x: xBase + bbox.x - 4,
                        y: yBase + bbox.y - 1,
                        width: bbox.width + 8,
                        height: bbox.height + 2
                    });
                    // move text to front
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
                        return 'left: '+(this.xScale(moment.utc(d.date).toDate()) + mrgRight)+'px';
                    });
        }
    }

    drawLine() {
        // draw line graph
        this.line = d3.svg.line()
            .interpolate('monotone')
            .x(o => this.xScale(o.date))
            .y(o => this.yScale(o.value))

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
                const x = this.xScale(moment.utc(dashedStartDate).toDate()),
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
            this.legend = this.svg.append('g').attr('class', 'estimate-legend');

            this.legend.append('line')
                .attr({
                    'x1': 0,
                    'x2': 20,
                    'y1': 0,
                    'y2': 0,
                    'stroke-dasharray': [0.5,5],
                    'stroke-linecap': 'round',
                    'class': 'legend-dashed-line'
                });

            this.legendText1 = this.legend.append('text')
                .attr({
                    'class': 'legend-text',
                    'x': 23,
                    'y': 3
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
        const EPSILON = 1;
        let point;
        let target;
        let start = 0;
        let end = path.getTotalLength();

        // Mad binary search, yo
        while (true) {
            target = Math.floor((start + end) / 2);
            point = path.getPointAtLength(target);

            if (Math.abs(point.x - x) <= EPSILON) break;

            if ((target >= end || target <= start) && point.x !== x) {
                break;
            }

            if (point.x > x) {
                end = target;
            } else if (point.x < x) {
                start = target;
            } else {
                break;
            }
        }
        return target;
    }
    resize() {
        this.remove();
        this.init();
    }
    remove() {
        this.svg.remove();
        this.gridlines && this.gridlines.remove();
    }
}

export default BaseChart;