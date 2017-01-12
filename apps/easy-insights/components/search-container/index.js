import React from 'react';
import Filters from '../filters';
import ClassNames from 'classnames';
import Typeahead from '../typeahead';
import Icon from '../../../../common/icons'
import {getUrlParams} from '../../urlTracker';
import _ from 'lodash';
import T from '../../i18n';
import {formatSmartText} from '../../utils/utils';
import moment from 'moment';
import {textDir} from 'ch-ui-lib';

require('./search-container.scss');

const oneDecFloat = d3.format('.1f');
const MAX_LEN = 1000;

export default class SearchContainer extends React.Component {

  constructor(props, context) {
    super(props, context);
    let localQueries = null;
    if(!!(localStorage.getItem('queries'))) {
      localQueries = JSON.parse(localStorage.getItem('queries'))
    } else {
      localStorage.setItem('queries', "[]");
      localQueries = [];
    }
    this.enterKeyIsDown = false;
    this.state = {
      queryInput: this.props.query,
      selected: null,
      highlighted : null,
      searchAreaClicked: false,
      queries: localQueries,
      showFilters: false,
      direc: 'auto',
      clearAll: false
    };
  }

  size(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  componentWillReceiveProps(newProps) {
      if(!!newProps.query &&
        newProps.query != this.props.query ||
        newProps.query != this.props.queryInput &&
        !(!!this.state.queryInput)){
          this.setState({
            queryInput: newProps.query
          });
      }
      if(newProps.mainLoading != this.props.mainLoading && newProps.mainLoading){
        this.setState({
          showFilters: !newProps.mainLoading
        });
      }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.clearAll != this.state.clearAll) {
      if(this.size(getUrlParams().filters) > 0){
        this.handleTriggerSearch();
      }
      this.setState({
        clearAll: false
      });
      return true;
    }
    if(nextProps.summaryLoaded != this.props.summaryLoaded) return true;
    if (nextProps.summary != this.props.summary) return true;
    if (nextState.queryInput != this.state.queryInput) return true;
    if (nextState.selected != this.state.selected) return true;
    if (nextState.searchAreaClicked != this.state.searchAreaClicked) return true;
    if (nextState.showFilters != this.state.showFilters) return true;
    if (nextProps.numFilters != this.props.numFilters) return true;
    if (nextProps.query != this.props.query) return true;
    if (nextProps.isFirstSearch != this.props.isFirstSearch) return true;
    if (nextState.direc != this.state.direc) return true;
    return false;
  }

  componentDidMount() {
    if (window) {
      window.addEventListener('keydown', this.onKeyDown);
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('keydown', this.onKeyDown);
    }
  }

  filterBtnText() {
    const cl = ClassNames('filter-button-container', this.state.showFilters ? 'open' : 'closed');
    const fcl = ClassNames('filter-icon', this.props.numFilters && 'filters-selected');
    return (
      <div className={cl}>
        <Icon name="filter-list" className={fcl} />
        <span id="filter_button" className="left-span">{T('searchBar.buttons.filters')}</span>
      </div>
    );
  }

  handleFilterBtnClicked() {
    this.setState({
      showFilters: !this.state.showFilters
    })
  }

  processKeyEvent(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      if((this.state.queryInput != '' &&
         !this.state.searchAreaClicked) ||
          this.state.queries.length == 0) {
        this.enterKeyIsDown = true;
        this.handleTriggerSearch();
        return;
      }
    } else {
      let dir = textDir(this.state.queryInput);
      this.state.direc !== dir && this.setState({direc: dir});
      // open recent searches on delete
      event.keyCode == 8 && this.setState({searchAreaClicked: true});
    }
  }

  processOnClickEvent(event){
    this.setState({
      searchAreaClicked: true
    });
  }

  processOnBlurEvent(event){
    if(!!this.state.selected && this.state.queryInput.length <= 0 ) {
      this.setState({
        queryInput: this.state.selected,
        searchAreaClicked: false
      });
      this.context.flux.getActions('easyactions').updateQuery(this.state.selected);
    }
    else if(!!this.state.selected && this.state.queryInput.length > 0){
      this.setState({
        selected: null,
        searchAreaClicked: false
      });
    }
    else {
      this.setState({
        searchAreaClicked: false
      });
    }
  }

  processPasteEvent(event, ...etc) {
    setTimeout(() => {
      let dir = textDir(this.state.queryInput);
      this.state.direc !== dir && this.setState({direc: dir});
    });
  }

  releaseKeyEvent(event) {
    if (event.keyCode == 13) this.enterKeyIsDown = false;
  }

  renderFilterButton() {
    return <div className="filter-buttons">
      <button onClick={this.handleFilterBtnClicked.bind(this)}>{this.filterBtnText()}</button>
    </div>
  }

  renderSummary() {
    let message  = formatSmartText(this.props.summary.message),
    start        = moment(this.props.summary.startDate).format('M/D/YY'),
    end          = moment(this.props.summary.endDate).format('M/D/YY'),
    analysisTime = oneDecFloat(this.props.summary.analysisTimeMillis/1000),
    volume       = this.props.summary.data.volume.toLocaleString(),
    tz           = this.props.summary.data.timezone;

    const summaryContainerClass = ClassNames(
      'summary-container col-lg-12 col-md-12 col-sm-12 col-xs-12',
      this.state.showFilters ? 'filters-visible' : ''
    );

    return (<div className={summaryContainerClass}>
        <div className="summary">
          <div className="row">
            <div className="posts-analyzed col-xs-12 col-md-7">
              <strong className="card-volume">{volume}</strong>
              <span className="hidden-xs-down visible-sm-up">{T('card.summary.postsAnalyzed', {sources : this.props.summary.data.sources.join(', '), time: analysisTime})}</span>
              <span className="hidden-sm-up">{T('card.summary.postsAnalyzed.mobile', {sources : this.props.summary.data.sources.join(', '), time: analysisTime})}</span>
            </div>
            <div className="buffer hidden-xs col-md-1"></div>
            <div className="message col-xs-12 col-md-5">{this.props.summary.message}</div>
          </div>
        </div>
      </div>
    );
  }

  renderXButton() {
    const imgClass = ClassNames(
      this.props.isFirstSearch ? 'home' : 'results',
      'x-close'
    );
    return <Icon name="close" className={imgClass} onClick={this.clearSearchBar.bind(this)}/>
  }

  renderButtonDisplay() {
    let iconName = this.props.isFirstSearch ? 'search-thin' : 'search';
    return <Icon name={iconName} className="btn search-button" onClick={this.handleTriggerSearch.bind(this)}/>
  }

  clearSearchBar() {
    this.setState({
      queryInput: '',
      selected: null
    }, () => {
      this.context.flux.getActions('easyactions').updateQuery('');
    });
  }

  addNonDuplicate(query) {
    let newQueries = this.state.queries;

    // remove duplicates
    let nonDuplicates = newQueries.filter(function(q){
      if(q != query){
        return q;
      }
    });

    nonDuplicates.unshift(query);

    if(nonDuplicates.length > MAX_LEN){
      nonDuplicates.pop();
    }

    this.setState({
      queries: nonDuplicates
    });

    return nonDuplicates;
  }

  handleClearFilters(){
    if(!!location.search){
      this.handleTriggerSearch(true);
    } else {
      this.context.flux.getActions('easyactions').clearFilters();
    }
  }

  handleTriggerSearch(clearFilters) {
    if(!!this.state.selected && this.state.searchAreaClicked == true) {
      this.setState({
        queryInput: this.state.selected,
        searchAreaClicked: false
      });
    } else {
      let searchTerm = !!this.state.queryInput ? this.state.queryInput : this.state.selected;
      if(searchTerm != null) {
        searchTerm = searchTerm.trim();
      }
      if (!(!!searchTerm)) return;
      localStorage.setItem('queries', JSON.stringify(this.addNonDuplicate(searchTerm)));
      this.state.showFilters && this.setState({showFilters : false});
      this.state.searchAreaClicked && this.setState({searchAreaClicked : false});

      // remove focus from search box after search
      this.refs['searchBoxElem'].blur();
      let currFilters = this.props.filters;
      if(clearFilters == true){
        currFilters = {
          startDate: null,
          quickDate: null,
          endDate: null,
          sources: [],
          genders: [],
          locations: [],
          languages: [],
          interests: [],
          sentiment: []
        };
        this.context.flux.getActions('easyactions').clearFilters();
      }
      if (this.props.currentLevel == 1) {
        this.context.flux.getActions('easyactions').searchCards({
          query   : searchTerm,
          filters : currFilters
        });
      } else if (this.props.currentLevel == 2) {
        this.context.flux.getActions('easyactions').expandCard({
          query   : searchTerm,
          filters : currFilters,
          currentLevel : this.props.currentLevel,
          cardId : this.props.currentOpenCard
        });
      }
    }
  }

  handleTextChange (event) {
    this.setState({
      queryInput: event.target.value
    });
    if(event.target.value.length <= 0) {
      this.setState({
        selected: null
      });
    }
    this.context.flux.getActions('easyactions').updateQuery(event.target.value.trim());
  }

  handleRecentSelected(value){
    this.setState({
      queryInput: value,
      searchAreaClicked: false
    });
    this.context.flux.getActions('easyactions').updateQuery(value);
  }

  handleSetSelected(value){
    this.setState({
      selected: value
    });
  }

  handleRowClicked(event){
    this.setState({
      selected: event.target.innerText,
      searchAreaClicked: false,
      queryInput: event.target.innerText
    });
    event.preventDefault();
    this.context.flux.getActions('easyactions').updateQuery(event.target.innerText);
  }

  handleSetHighlighted(value){
    this.setState({
      highlighted: value
    });
  }

  render() {
    const mainClass = ClassNames('container-fluid', {
      'initial-main'    : this.props.isFirstSearch,
      'main'            : !this.props.isFirstSearch,
      'loaded'          : !this.props.isFirstSearch,
      'container'       : this.props.isFirstSearch
    });
    const searchBoxClass = ClassNames(
      'input-group search-box',
      this.props.isFirstSearch ? 'initial-mode' : 'card-mode'
    );
    let numAppliedFilters = this.size(getUrlParams().filters);
    let inputProps = {
      id: 'search_input',
      autoComplete: 'off',
      onKeyDown: this.processKeyEvent.bind(this),
      onBlur: this.processOnBlurEvent.bind(this),
      onClick: this.processOnClickEvent.bind(this),
      onKeyUp: this.releaseKeyEvent.bind(this),
      value: this.state.queryInput,
      onChange: this.handleTextChange.bind(this),
      onPaste: this.processPasteEvent.bind(this),
      type: 'search',
      name: 'search',
      className: 'form-control',
      placeholder: T('searchBar.placeholder'),
      ref: 'searchBoxElem',
      dir: this.state.direc
    };
    return <div>
      <div className={mainClass}>
           {this.props.isFirstSearch &&
             <div>
               <div className='row'>
                 <span className='landing-title'>{T('landingPage.title')}</span>
               </div>
               <div className='row'>
                 <span className='landing-subtitle'>{T('landingPage.subtitle')}</span>
               </div>
            </div>}
             <div className='row'>
               <div className="col-xs-12">
                {/* Search Box container */}
                <div className={searchBoxClass}>
                    <span className='input-group-btn search-icon'> {this.renderButtonDisplay()} </span>
                    <span className='input-group-btn search-input'>
                      <form className="search-input" action=".">
                          <input {...inputProps} />
                      </form>
                    </span>
                    {!!this.state.queryInput && <span className='input-group-btn search-clear'>
                       {this.renderXButton()}
                     </span>}
                     <span className='input-group-btn filter-btn'>
                       {this.renderFilterButton()}
                     </span>
                </div>
                {/* Recent Searches */}
                {this.state.searchAreaClicked && this.state.queries.length > 0 &&
                  <Typeahead
                  resultsMode={!this.props.isFirstSearch}
                  onEnter={this.handleTriggerSearch.bind(this)}
                  onSelect={this.handleRecentSelected.bind(this)}
                  onHighlight={this.handleSetHighlighted.bind(this)}
                  values={this.state.queries}
                  setSelected={this.handleSetSelected.bind(this)}
                  rowClicked={this.handleRowClicked.bind(this)}
                  value={this.state.queryInput} />}
                </div>
              </div>
              {/* Filters */}
              <div className='row'>
                {this.state.showFilters && !this.mainLoading &&
                    <Filters {...this.props}
                      numAppliedFilters={numAppliedFilters}
                      mode={this.props.isFirstSearch}
                      onClear={this.handleClearFilters.bind(this)}
                      onSearch={this.handleTriggerSearch.bind(this)} />}
              </div>
          </div>
          {/* Summary */}
          <div className="container-fluid">
            <div className='row'>
              {!!this.props.summary && this.props.summaryLoaded && this.renderSummary()}
            </div>
          </div>
        </div>
   }
}

SearchContainer.contextTypes = {
  flux: React.PropTypes.object
};
