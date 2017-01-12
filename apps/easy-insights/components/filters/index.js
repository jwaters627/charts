import React from 'react';
import RadioButtonFilter from './radio-button-filter';
import ButtonFilter from './button-filter';
import InputFilter from './input-filter';
import DateFilter from './date-filter';
import ClassNames from 'classnames';
import T from '../../i18n';

require('./filters.scss');

export default class Filters extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  handleSearch(){
    this.props.onSearch();
  }

  handleClear(){
    this.props.onClear();
  }

  render() {
      let showApplyClear = this.props.numFilters == 0 && this.props.numAppliedFilters > 0 ||
                           this.props.numFilters > 0 ? true : false
      return (
      <div className="filters">
        {showApplyClear &&
          <div className="row filter-actions">
              <span>
                <button id="apply_filters" className="apply" onClick={this.handleSearch.bind(this)}>
                  {T('searchBar.buttons.apply')}
                </button>
                <button className="button-link" id="clear_all" onClick={this.handleClear.bind(this)}>
                  {T('searchBar.buttons.clearAll')}
                </button>
              </span>
          </div>
        }
        <div className="container-fluid filter-options">
          <div className="">
            <div className="filter-col date-filter col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <div className="form-group">
                <label>
                  {T('filters.date.title')}
                  <span className="tz-info">{T('filters.date.timezone')}: {this.props.timezone}</span>
                </label>
                <DateFilter />
              </div>
            </div>

            <div className="filter-col gender-filter col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <div className="form-group">
                <label>{T('filters.gender.title')}</label>
                <RadioButtonFilter type={"genders"} filters={this.props.filters}/>
              </div>
            </div>

            <div className="filter-col sentiment-filter col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <div className="form-group">
                <label>{T('filters.sentiment.title')}</label>
                <div className="buttons">
                  <ButtonFilter id="sentiment_filter_positive" name={"Positive"} label={T('filters.sentiment.positive')} type={"sentiment"} filters={this.props.filters}/>
                  <ButtonFilter id="sentiment_filter_neutral" name={"Neutral"} label={T('filters.sentiment.neutral')} type={"sentiment"} filters={this.props.filters}/>
                  <ButtonFilter id="sentiment_filter_negative" name={"Negative"} label={T('filters.sentiment.negative')} type={"sentiment"} filters={this.props.filters}/>
                </div>
              </div>
            </div>

            <div className="filters">
              <div className="filter-col location-filter col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="form-group">
                  <label>{T('filters.location.title')}</label>
                  <InputFilter id="location_filter" name={T('filters.location.placeholder')} type={"locations"} filterOption={'search'} displayOption={v=>v.description} formInputOption={'id'} />
                </div>
              </div>

              <div className="filter-col language-filter col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="form-group">
                  <label>{T('filters.language.title')}</label>
                  <InputFilter id="language_filter" name={T('filters.language.placeholder')} type={"languages"} filterOption={'name'} displayOption={v=>v.name} formInputOption={'code'} />
                </div>
              </div>

              <div className="filter-col interests-filter col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="form-group">
                  <label>{T('filters.interest.title')}</label>
                  <InputFilter id="interests_filter" name={T('filters.interest.placeholder')} type={"interests"} filterOption={'name'} displayOption={v=>v.name} formInputOption={'id'}  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>)
  }
}


Filters.contextTypes = {
  flux: React.PropTypes.object
};
