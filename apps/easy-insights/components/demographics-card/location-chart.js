import d3 from 'd3';
import {geoPatterson} from 'd3-geo-projection';
//import topojson from 'topojson';
const topojson = require('topojson'); // doesn't like es6 imports!
import _ from 'lodash';
import {chFetch} from 'ch-ui-lib';

const worldCountries = require('../../resources/WORLD-countries-110m-topo.json');
const worldAdmin1Url = require('!file?name=json/[name]-[hash].[ext]!../../resources/WORLD-states-topo.json');

export default class LocationChart {

	constructor(el, data, region = false, callback = false) {
		this.el   = el;
		this.data = data;

		if (!region || region == 'WORLD') {
			this.region = 'WORLD';
			const geoData = topojson.feature(worldCountries, worldCountries.objects['WORLD-countries-110m']);
			this.init(geoData);
		}else{
			this.region = region.split('.')[0]; // for now only country level maps!!
			chFetch.get(worldAdmin1Url)
			.then(result => {
				const geoData = topojson.feature(result.body, result.body.objects['WORLD-states-geo']);
				// filter geoData
				geoData.features = geoData.features.filter(f => f.id.startsWith(this.region));
				this.init(geoData);
				!!callback && callback();
			});
		}
	}

	init(geoData) {
		this.geoData = geoData;
		this.colorScale = d3.scale.linear()
			  .range(['#d4e3f2', '#5b9bd4'])
			  .domain([0, 100]);

		this.width  = this.el.offsetWidth;
		this.height = this.width/2;
		this.values = _.values(this.data);
		this.maxVal = _.max(this.values);

		this.svg = d3.select(this.el).append('svg')
							.attr('width', this.width)
							.attr('id', 'l1-location-chart')
							.attr('class', 'location-map')
							.attr('height', this.width/2);

		// choose projection according to region
		switch(this.region) {
			case 'WORLD':
				this.projection = geoPatterson();
				break;
			case 'USA':
				this.projection = d3.geo.albersUsa();
				break;
			default:
				this.projection = d3.geo.mercator();
		}

		// zoom to bounds
		this.setProjectionFrame();

		// create geo paths
		this.paths = this.svg.selectAll('.geo-path')
		    .data(geoData.features)
		  .enter().append('path')
				.attr('class', 'geo-path')
		    .attr('d', d3.geo.path().projection(this.projection))
				.attr('fill', d => {
					let id = d.id.split('.').slice(0, 2).join('.');
					return this.colorScale(!!this.data[id] ? this.data[id]*100 / this.maxVal : 0);
				})
				.attr('stroke', 'white');
	}

	setProjectionFrame() {
		let scale, trans;
		switch (this.region) {

			case 'WORLD':
				scale = this.width * 0.16;
				trans = [this.width/2.1, this.height/1.5];
				break;

			case 'USA':
				scale = this.width;
				trans = [this.width/2, this.height/2];
				break;

			default:
				this.projection.scale(1).translate([0, 0]);
				const geoPath = d3.geo.path().projection(this.projection),
					bounds = geoPath.bounds(this.geoData),
					dx = bounds[1][0] - bounds[0][0],
					dy = bounds[1][1] - bounds[0][1],
					x = (bounds[0][0] + bounds[1][0]) / 2,
					y = (bounds[0][1] + bounds[1][1]) / 2;
				scale = 0.9 / Math.max(dx / this.width, dy / this.height),
				trans = [this.width / 2 - scale * x, this.height / 2 - scale * y];
		}
		this.projection.scale(scale).translate(trans);
	}

	resize() {
		this.width = this.el.offsetWidth;
		this.height = this.width/2;
		this.svg.attr('height', this.width/2);
		this.setProjectionFrame();
		this.paths.attr('d', d3.geo.path().projection(this.projection));
	}

	remove() {
		if (!!this.svg) this.svg.remove();
	}
}
