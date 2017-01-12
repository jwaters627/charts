import React from 'react';
import {cleanObject} from '../../utils/utils';
import {textDir} from 'ch-ui-lib';
import moment from 'moment';
require('./caption.scss');

const logo = require('../../img/crimson-logo.png');
const dateFormat = 'YYYY.MM.DD';
const dateTimeFormat = 'YYYY.MM.DD h:mma';

export default class ExportCaption extends React.Component {

  createFiltersDescription() {
    let filters = cleanObject(this.props.storeState.filters);
    let result = [];
    if (filters.genders) {
      result.push(filters.genders[0] == 'M' ? 'Male' : 'Female');
    }
    if (filters.sentiment) {
      result.push(filters.sentiment.join(' & ')+' Sentiment');
    }
    if (filters.languages) {
      result = result.concat(filters.languages.map(l => this.findLanguage(l)));
    }
    if (filters.interests) {
      result = result.concat(filters.interests.map(i => this.findLanguage(i)));
    }
    if (filters.locations) {
      result = result.concat(filters.locations.map(l => this.findLocation(l)));
    }
    if (filters.quickDate) {
      let qd      = filters.quickDate;
      const num   = parseInt(qd.slice(0, qd.length -1));
      const tUnit = qd.charAt(qd.length - 1);
      let start   = moment().subtract(num, tUnit).format(dateTimeFormat);
      let end     = moment().format(dateTimeFormat);
      result.push(start+' – '+end);
    } else {
      let start = moment.utc(filters.startDate || this.props.storeState.firstDayInclusive);
      let end   = moment.utc(filters.endDate || this.props.storeState.lastDayInclusive);
      end.add(1, 'day').subtract(1, 'minute');
      result.push(start.format(dateTimeFormat)+' – '+end.format(dateTimeFormat));
    }

    return result.join(', ');
  }

  findLanguage(code) {
    for (let l of this.props.storeState.autoCompleteLanguages) {
      if (l.code === code) return l.name;
    }
  }

  findInterest(id) {
    for (let i of this.props.storeState.autoCompleteInterests) {
      if (i.id === id) return i.name;
    }
  }

  findLocation(id) {
    for (let l of this.props.storeState.autoCompleteLocations) {
      if (l.id === id) return l.name;
    }
  }

  render () {
    return <div className="export-caption">
      <img className="caption-logo" src={logo} />
      <div className="caption-content">
        <div className="caption-title">
          <span className="query" dir={textDir(this.props.storeState.query)}>{this.props.storeState.query}</span>
          <span className="separator">|</span>
          <span className="card-title">{this.props.cardTitle}</span>
        </div>
        <div className="caption-desc">{this.createFiltersDescription()}</div>
      </div>
    </div>;
  }
}
