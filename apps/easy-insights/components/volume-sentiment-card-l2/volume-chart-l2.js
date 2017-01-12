import d3 from 'd3';
import BaseChart from '../volume-sentiment-card/base-chart';
const dateFormat  = 'YYYY-MM-DD[T]HH:mm';
import classnames from 'classnames';
import moment from 'moment';

export default class VolumeChart extends BaseChart {

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
    this.options.drillDownPoints && this.drawDrillDownPoints();
	}

  drawDrillDownPoints() {
    let self = this;

    // set point labels and index
    this.options.drillDownPoints.forEach((dp,i) => {
      dp.label = this.options.drillDownNames ? this.options.drillDownNames[i] : i+1;
      dp.index = i;
    });
    let ddPoints = [...this.options.drillDownPoints];
    ddPoints.reverse();

    // create array of already allocated space, include current highlighted points
    let allocatedSpace = [];
    for (let hlp of this.highlight) {
      let val = hlp.type == 'own' ? hlp.value : this.data[hlp.date];
      let hlx = this.getLineX(moment.utc(hlp.date).toDate());
      let hly = this.yScale(val);
      allocatedSpace.push([hlx, hly - 20], [hlx, hly]);
    }

    this.drillDownPoints = d3.select(this.el)
        .selectAll('dd-point')
        .data(ddPoints);

    this.drillDownPoints.enter()
      .append('a')
        .attr({
          class : d => classnames('dd-point', d.index == 0 && 'active'),
          style : d => {

            let dm = moment.utc(d.date);
            let y = this.getCurveYAtDate(d.date);
            let yOffset = this.sortedData.length == 1 ? -30 : this.options.drillDownPointYOffset;
            let top = y - 30;
            let left = this.xScale(dm.toDate());

            //
            let nAlloc = this.getNearestTakenPoint(left, top, allocatedSpace);
            if (nAlloc) {
              // run point from the top until the bottom, until it doesn't collide
              let yBefore = this.maxVal;
              let hasPlaceOnTop = false;
              let hittingAllocated = false;
              for (let py=this.maxVal; py>this.minVal; py--) {
                let newTop = this.yScale(py);
                nAlloc = this.getNearestTakenPoint(left, newTop, allocatedSpace);
                if (!nAlloc) {
                  if (py == this.maxVal) hasPlaceOnTop = true;
                  yBefore = newTop;
                  if (hittingAllocated) {
                    top = newTop + 3;
                    break;
                  }
                } else {
                  hittingAllocated = true;
                  if (hasPlaceOnTop) {
                    top = yBefore - 3;
                    break;
                  }
                }
              }
            }
            allocatedSpace.push([left, top]);
            return 'left: '+left+'px; top: '+top+'px;';
          },
          'data-index' : d => d.index
        })
        .text(d => d.label)
        .on('click', function (d) { self.options.onDrillDownClick(d3.event, d.index);});
  }

  getCurveYAtDate(date) {
    if (this.sortedData.length == 1) {
      return this.yScale(this.sortedData[0].value);
    }
    let dm, key0, key1, key2, m0, m1, m2, y, y0, y1, y2, minOffset, interval, secsSinceInt;
    dm = moment.utc(date);
    minOffset = moment(this.minDate).minutes();
    m0 = moment.utc(date).subtract(1, this.dateInterval).startOf(this.dateInterval).add(minOffset, 'm');
    m1 = moment.utc(date).startOf(this.dateInterval).add(minOffset, 'm');
    m2 = moment.utc(date).add(1, this.dateInterval).startOf(this.dateInterval).add(minOffset, 'm');
    key0 = m0.format(dateFormat);
    key1 = m1.format(dateFormat);
    key2 = m2.format(dateFormat);

    y0 = this.data[key0] ? this.data[key0] : this.data[key1];
    y1 = this.data[key1];
    y2 = this.data[key2] ? this.data[key2] : this.data[key1];
    secsSinceInt = dm.diff(m1, 'second');
    interval = this.dateInterval == 'day' ? 60*60*24 : 60*60;

    if (secsSinceInt < interval/2) {
      y = y1 + (y1 - y0) * ((secsSinceInt - interval/2)/interval);
    }else{
      y = y1 + (y2 - y1) * ((secsSinceInt - interval/2)/interval);
    }
    return this.yScale(y);
  }

  getNearestTakenPoint(x,y, allocatedSpace) {
    let point = false;
    let distances = [];
    for (let p of allocatedSpace) {
      let dist = Math.sqrt(Math.pow(x-p[0],2) + Math.pow(y-p[1],2));
      if (dist < this.options.drillDownPointRadius) {
        distances.push(dist);
        if (_.min(distances) == dist) {
          point = p;
        }
      }
    }
    return point;
  }

  updateDrillDownPoints(selectedIdx) {
    this.drillDownPoints.attr('class', d => classnames('dd-point', d.index == selectedIdx && 'active'));
  }

  setMinMaxValues() {
    const values = Object.values(this.data);
		this.minVal  = 0;
		this.maxVal  = d3.max(values);
		if (this.maxVal == 0) this.maxVal = 10;
  }
}
