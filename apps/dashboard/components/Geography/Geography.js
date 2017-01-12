'use strict';

import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Icon from '../../../../common/icons';
import WorldDistributionMap from '../../../../common/components/Geography/WorldDistributionMap';

require('./Geography.scss'); 

const topCountriesQty = 3; //the amount of top countries that should be listed
const reservedHeight = 75; //the total of the card's height the map should let free for other areas
const topCountryPercentFormat = d3.format('%');

class Geography extends React.Component {

    static propTypes = {
		/**
		* JSON containing the country info 
		*		{id:{percentage:p,name:n},id:{percentage:p,name:n}} 
		*	example
		*		{"USA":{percentage:40,name:"United States"},"GBR":{percentage:60,name:Great Britain}}
		*/
        data: React.PropTypes.object.isRequired, 
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.init(props);
    }

    init(props) {
        this.width = props.width;
        this.height = props.height;
        this.data = props.data.cardData[0];
        this.color = props.data.colors
		
		this.topCountries = this.calculateTopCountries(this.data);
    }
	
	/**
	* Goes thru the data and builds a top countries list
	* @returns map
	*	{
	*		id:{id:char(3), percentage:number, name: text},
	*		id:{id:char(3), percentage:number, name: text}
	*	} 
	*/
	calculateTopCountries(data) {
		
		let topCountries = {};
		let countriesCount = Object.keys(data).length;

		for(let i = 0; i < topCountriesQty && i < countriesCount; i++) {
			let nextTopCountry = this.findNextTopCountry(data,topCountries);
			if(nextTopCountry) {
				topCountries[nextTopCountry.id] = nextTopCountry;
			}
		}
		
		return topCountries;
	}
	
	/**
	 * Finds next top region 
	 * @returns {id:char(3), percentage:number, name: text}
	 */
	findNextTopCountry(data,currentTopCountries) {
		let topCountry = null;
		Object.keys(data).forEach(countryId => {
			let countryData = data[countryId];
			if (
				!currentTopCountries[countryId] //not already in top regions
				&& (null == topCountry || countryData.percentage > topCountry.percentage) //is greater than current top region
			) {
				topCountry = {id: countryId, percentage: countryData.percentage, name: countryData.name};
			}
		});
		return topCountry;
	}

    componentWillReceiveProps(nextProps) {
        if (this.shouldComponentUpdate(nextProps)) {
            this.init(nextProps);
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
	
	render() {
        let hasData = this.data ? Object.keys(this.data).length > 0 : false;
		let contentHeight = this.props.height-20;
		let mapHeight = this.height - reservedHeight;
		if (hasData) {
			let topCountriesList = [];
			_.values(this.topCountries).forEach(topCountry => {
				topCountriesList.push(
					<div className="topCountry">
						<div className="name">{topCountry.name}</div>
						<div className="percent">{topCountryPercentFormat(topCountry.percentage / 100)}</div>
					</div>
				);
			});
			return (
				<div style={{height:contentHeight}}>
					<div className="topCountriesDiv">
						<div className="topCountriesTable">
							{topCountriesList}
						</div>
					</div>
					<div className="mapDiv" style={{height:mapHeight}}>
						<WorldDistributionMap width={this.width} height={mapHeight} data={this.data} color={this.color}/>
					</div>
				</div>
			);
		}
    }
}

export default Geography;