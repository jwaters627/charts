import React from 'react';
import d3 from 'd3';
import $ from 'jquery';
import {markdown} from 'markdown';

require('./volume.scss');

const oneDecFloat  = d3.format('.1f');
const bigNumFormat = d3.format('s');

class BarChart {

  constructor(el, data) {
    this.el = el;
    this.data = data;
    this.init();
  }

  init() {
    const self = this;
    this.svgWidth = this.el.offsetWidth;
    this.svgHeight = this.el.offsetHeight;
    this.dateFormat = d3.time.format('%Y-%m-%d'),
    this.shortDateFormat = d3.time.format('%b %d');
    this.data = Object.keys(this.data).map(function(k) {
        return {
            date: k,
            volume: self.data[k]
        };
    });

    this.data.sort(function(a,b){
        return new Date(a.date).getTime() - new Date(b.date).getTime()
    });

    this.maxVolume = Math.max.apply(Math,this.data.map(function(o){return o.volume;}))
    this.padding = {
        left: 35, right: 30,
        top: 20, bottom: 40
    }

    this.maxWidth = this.svgWidth - this.padding.left - this.padding.right;
    this.maxHeight = this.svgHeight - this.padding.top - this.padding.bottom;

    this.convert = {
        x: d3.scale.ordinal(),
        y: d3.scale.linear()
    };

    this.axis = {
        x: d3.svg.axis()
            .orient('bottom')
            .ticks(5)
            .tickFormat(function(d){
                return self.shortDateFormat(self.dateFormat.parse(d));
            }),
        y: d3.svg.axis()
            .orient('left')
            .ticks(5)
            .tickFormat(function(d) {
                return d < 1 ? d : bigNumFormat(d);
            })
    };

    // conversion function for axis points
    this.axis.x.scale(this.convert.x);
    this.axis.y.scale(this.convert.y);

    this.convert.y.range([this.maxHeight, 0]);
    this.convert.x.rangeRoundBands([0, this.maxWidth]);

    this.convert.x.domain(this.data.map(function (d) {
            return d.date;
        })
    );
    this.convert.y.domain([0, this.maxVolume]);

    // markup for svg
    this.svg = d3.select(this.el)
      .append('svg')
        .attr('class', 'chart')
        .attr({
            width: this.svgWidth,
            height: this.svgHeight
        });

    // group node (contains all other nodes in the chart)
    this.chart = this.svg.append('g')
        .attr({
            transform: function (d, i) {
                return 'translate(' + self.padding.left + ',' + self.padding.top + ')';
            }
        });

    // axis containers
    this.chart.append('g')
        .attr({
            class: 'x axis',
            transform: 'translate(0,' + this.maxHeight + ')'
        })
        .call(this.axis.x)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dy', '-.2em')
        .attr('dx', '-.8em')
        .attr('transform', 'rotate(-70)');

    this.chart.append('g')
        .attr({
            class: 'y axis',
            height: this.maxHeight
        })
        .call(this.axis.y);

    this.bars = this.chart
        .selectAll('g.bar-group')
        .data(this.data)
        .enter()
        .append('g')
        .attr({
            transform: function (d, i) {
                return 'translate(' + self.convert.x(d.date) + ', 0)';
            },
            class: 'bar-group'
        });

    this.bars.append('rect')
        .attr({
            y: this.maxHeight,
            height: 0,
            width: function(d) {return self.convert.x.rangeBand(d) - 1;},
            class: 'bar'
        })
        //.transition()
        //.duration(1500)
        .attr({
            y: function (d, i) {
                return self.convert.y(d.volume);
            },
            height: function (d, i) {
                return self.maxHeight - self.convert.y(d.volume);
            }
        });
  }

  remove() {
    this.svg.remove();
  }
}

export default class Card extends React.Component{

  componentWillMount() {
    this.message = this.props.card.message;
    this.volumeData = this.props.card.data.volumeSeries;
  }

  componentDidMount() {
    this.chart = new BarChart(this.refs.volumeChartElem, this.volumeData);
  }

  componentDidUpdate() {
    if (this.chart) this.chart.remove();
    this.componentWillUnmount();
    this.componentDidMount();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return  <div className='card general-card'>
              <div className='card-block text-center card-head'>
                <div className='msg' dangerouslySetInnerHTML={{__html: markdown.toHTML(this.message)}}></div>
              </div>
              <div className='card-block card-content'>
                <div className='bar-chart-container' ref='volumeChartElem'>
                </div>
              </div>
            </div>;
  }
}
