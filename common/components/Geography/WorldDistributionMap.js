'use strict';

import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';
import {geoPatterson} from 'd3-geo-projection';
import _ from 'lodash';

const countries = require('./WORLD-countries-110m-topo.json');
const svgData = require('topojson').feature(countries, countries.objects['WORLD-countries-110m']).features;

require('./WorldDistributionMap.scss');

/**
 * Renders a world map and shows distribution of the given data
 *
 * @author Damian Kober
 */
class WorldDistributionMap extends React.Component {

    static propTypes = {

		/**
		 * JSON containing the country info 
		 *		{code:{percentage:p,name:n},code:{percentage:p,name:n}} 
		 *	example
		 *		{"USA":{percentage:40,name:"United States"},"GBR":{percentage:60,name:Great Britain}}
		 */
        data: React.PropTypes.object.isRequired,
        width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired
    };

    constructor(props) {
        
		super(props);
        this.init(props);

        this.setStrokeColor = this.setStrokeColor.bind(this);
	}

    init(props) {
		this.width = props.width;
		this.height = props.height;
        this.data = props.data;
        this.colorStart = this.props.color[1]
        this.colorEnd = this.props.color[0]
    }

	componentWillReceiveProps(nextProps) {
		this.init(nextProps);
		this.generate(ReactDOM.findDOMNode(this))
		if (this.shouldComponentUpdate(nextProps)) {
			this.init(nextProps);
			this.generate(ReactDOM.findDOMNode(this))
			this.forceUpdate(); //forces re-rendering
		}
	}

	shouldComponentUpdate(nextProps) {
		if ( //if something changed...
			nextProps.width != this.width
			|| nextProps.height != this.height
		|| JSON.stringify(this.data) != JSON.stringify(nextProps.data)
		) {
			return true;
		}
		return false;
	}

	setStrokeColor(){
		let strokeColor = '#FFFFFF';
		let colorToCheck = this.props.color[1].split('');
		let reds = colorToCheck.splice(1,2);
		let greens = colorToCheck.splice(1,2);
		let blues = colorToCheck.splice(1,2);	

		let redsNumber = reds.map(this.changeLettersToHex);
		let greensNumber = greens.map(this.changeLettersToHex);
		let bluesNumber = blues.map(this.changeLettersToHex);

		let multipliedReds = Number(redsNumber[0]) * Number(redsNumber[1]);
		let multipliedGreens = Number(greensNumber[0]) * Number(greensNumber[1]);
		let multipliedBlues = Number(bluesNumber[0]) * Number(bluesNumber[1]);

		if(((multipliedReds * 0.299) + (multipliedGreens * 0.587) + (multipliedBlues * 0.114)) > 106){strokeColor = '#000000'}

		return strokeColor
	}

	changeLettersToHex(letter){
		if(letter.toLowerCase() === 'a'){return(10)}
		else if(letter.toLowerCase() === 'b'){return(11)}
		else if(letter.toLowerCase() === 'c'){return(12)}
		else if(letter.toLowerCase() === 'd'){return(13)}
		else if(letter.toLowerCase() === 'e'){return(14)}
		else if(letter.toLowerCase() === 'f'){return(15)}
		else{return(Number(letter))}
	}
	
	/**
     * Generates the svg
     */
    generate(el) {

		let svgContainer = d3.select(el);

		//clear svg container
		svgContainer.selectAll("*").remove();

		let data = this.data;
		let projection = geoPatterson();
		let padding = 2 * 2; //both ends
		let height = this.height - padding;
		let svg = svgContainer.append('svg');
		let widthHeightRatio = 2;

		//resolve width/height restrictions to match proportion
		let bestWidth = height * widthHeightRatio;
		while(bestWidth>this.width - padding) {
			bestWidth--;
			height = bestWidth / widthHeightRatio;
		}

		let width = bestWidth;

		//find max percentage to make colors relative
		let maxPercentage = _.max(_.map(data, d => d.percentage));
		
		//scale projection
		let scale = width * 0.16;
		let trans = [width/2.1, height/1.5];
		projection.scale(scale).translate(trans);

		//resize svg
        svg.attr('width', width).attr('height', height).attr('class', 'svg');

		//create main path	
        let path = d3.geo.path().projection(projection);

		//color handler
		let colorScale = d3.scale.linear().range([this.colorStart, this.colorEnd]).domain([0, 100]);

        
		//draw country data
		svg.selectAll('.geo-path')
			.data(svgData)
			.enter().append('path')
			.attr('class', 'geo-path')
			.attr('d', path)
			.attr('fill', d => {
				let id = d.id.split('.').slice(0, 2).join('.');
				return colorScale(!!data[id] ? data[id].percentage * 100 / maxPercentage : 0);
			})
			.attr('stroke', this.setStrokeColor);
    }

	componentDidMount() {
		this.generate(ReactDOM.findDOMNode(this));
	}

    componentDidUpdate() {
		this.componentDidMount();

	}

	render() {

		return <div className="container"></div>; //empty container;
	}
}

export default WorldDistributionMap;