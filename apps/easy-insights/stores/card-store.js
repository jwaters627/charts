import _ from 'lodash';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  numFilters: 0,
  summary: null,
  cards: [],
  cardHeights: {},
  query: '',
  queryInput: '',
  convertedQuery: '',
  doPhrasify : true,
  showQueryHelper : false,
  queryStatus: null,
  filters: {
    startDate: null,
    endDate: null,
    quickDate : null,
    sources: [],
    genders: [],
    locations: [],
    languages: [],
    interests: [],
    sentiment: []
  },
  mainLoading: false,
  summaryLoaded: false,
  autoCompleteInterests: [],
  autoCompleteLocations: [],
  autoCompleteLanguages: [],
  autoCompleteSentiment: [],
  isFirstSearch: true,
  calendarOpen: false,
  hoverDate: null,
  currentFocus: null,
  currentLevel: 1,
  l2Data: null,
  l3Data: null,
  currentOpenCard: null,
  firstDayInclusive: null,
  lastDayInclusive: null,
  breadcrumbRoot: null
});
export {initialState};


export default class CardStore {

  constructor() {
    this.state = initialState.toJS();
  }

  init(actions) {
    this.actions = actions;
    this.observe([
      [actions.expandAllCards, this.expandAllCards],
      [actions.updateFilter,  this.updateFilter],
      [actions.updateHoverDate, this.updateHoverDate],
      [actions.updateFocus, this.updateFocus],
      [actions.clearFilters, this.clearFilters],
      [actions.updateQuery, this.handleUpdateQuery],
      [actions.clearCards, this.handleClearCards],
      [actions.updateCalendarDropdown, this.updateCalendarDropdown],
      [actions.cardMounted, this.handleCardMounted],
      [actions.setMainLoading, this.handleSetMainLoading],
      [actions.prepareNewSearch, this.handlePrepareNewSearch],
      [actions.cardsLoaded, this.handleCardsLoaded],
      [actions.prepareExpandCard, this.handlePrepareExpandCard],
      [actions.l2CardLoaded, this.handleL2CardLoaded],
      [actions.setSummary, this.handleSetSummary],
      [actions.filterDataLoaded, this.handleFilterDataLoaded],
      [actions.setFilters, this.handleSetFilters],
      [actions.processQueryError, this.handleProcessQueryError],
      [actions.revert2Landing, this.handleRevert2Landing],
      [actions.setBreadcrumbRoot, this.handleSetBreadcrumbRoot],
      [actions.show404, this.handleShow404],
      [actions.setQueryHelper, this.handleSetQueryHelper],
      [actions.filterResourcesError, this.handleFilterResourcesError]
    ]);
  }

  clearFilters() {
    this.setState({
      filters: initialState.get('filters').toJS(),
      numFilters: 0
    });
  }

  updateCalendarDropdown(isOpen) {
    this.setState({
      calendarOpen: isOpen.payload
    })
  }

  updateFocus(args) {
    let focus = args.payload;
    this.setState({
      currentFocus: focus
    });
  }

  updateHoverDate(args) {
    let date = args.payload.hoverDate;
    this.setState({
      hoverDate: date
    });
  }

  updateFilter(args) {
    const filter = args.payload;
    let type = filter.type;
    let value = filter.value;
    let newFilters = this.getState().filters;

    if (type == 'genders'){
      newFilters.genders = !!value ? [value] : [];

    }else if (type == 'sentiment'){
      let index = newFilters.sentiment.indexOf(value);
      if(index > -1) {
        newFilters.sentiment.splice(index, 1);
      } else {
        newFilters.sentiment.push(value);
      }

    }else if(args.payload == 'cleardates'){
      newFilters.startDate = null;
      newFilters.endDate = null;

    }else if(type == 'quickDate'){
      newFilters.startDate = null;
      newFilters.endDate = null;
      newFilters.quickDate = value;

    }else if(type == 'startDate' || type == 'endDate'){
      newFilters.quickDate = null;
      newFilters[type] = value;

    // all other filters
    }else {
      newFilters[type] = value;
    }

    this.setState({
      filters: newFilters,
      numFilters : this.getFilterCount(newFilters)
    });
  }

  handleSetFilters(args) {
    const newFilters = Object.assign({}, initialState.get('filters').toJS(), args.payload);
    this.setState({
      filters    : newFilters,
      numFilters : this.getFilterCount(newFilters)
    });
  }

  getFilterCount(filters) {
    let currFilterCount = 0;
    filters = filters || this.getState().filters;

    if (!!filters.startDate || !!filters.endDate) currFilterCount++;
    if (filters.genders.length > 0) currFilterCount++;
    if (filters.sentiment.length > 0) currFilterCount++;
    if (filters.locations.length > 0) currFilterCount++;
    if (filters.languages.length > 0) currFilterCount++;
    if (filters.interests.length > 0) currFilterCount++;
    if (filters.quickDate != null) currFilterCount++;

    ['sources']
    .forEach( f => currFilterCount += filters[f].length);
    return currFilterCount;
  }

  handlePrepareNewSearch(args) {
    this.setState({
      cards         : [],
      l2Data        : null,
      cardHeights   : {},
      mainLoading   : true,
      summaryLoaded : false,
      queryStatus   : 'OK',
      isFirstSearch : false,
      currentLevel  : 1,
      numFilters    : this.getFilterCount(),
      doPhrasify    : args.payload.phrasify,
      query         : args.payload.query,
      showQueryHelper : false
    });
  }

  handleUpdateQuery(args = {}) {
    this.setState({ queryInput: args.payload }, false);
  }

  handleSetMainLoading(args) {
    this.setState({ mainLoading : args.payload });
  }

  handleClearCards(emit = true) {
    this.setState({
      cards         : [],
      cardHeights   : {},
      queryStatus   : 'OK',
      isFirstSearch : false
    }, emit);
  }

  handleCardsLoaded(args) {
    const validCards     = args.payload.cards.filter(c => c.rank > 0);
    const currentCards   = this.removeSummaryCard(this.getState().cards.concat(validCards));
    const cardsRemaining = args.payload.cardsRemaining;
    const hasResults     = !!currentCards.length || cardsRemaining > 0;
    //console.log('cards', currentCards);
    //console.log('cardsRemaining', res.body.cardsRemaining);
    let newState = {
      cards         : currentCards,
      summaryLoaded : hasResults,
      queryStatus   : hasResults ? 'OK' : 'NO_RESULTS'
    };
    this.setState(newState);
  }

  removeSummaryCard(cards) {
    return cards.filter((card) => {
      if(card.id == 'summary') {
        this.setState({ summary: card });
        return false;
      }
      return true;
    });
  }

  handlePrepareExpandCard(args) {
    if (this.getState().currentLevel === 2) {
      this.handleClearCards(false);
    }
    this.setState({
      query           : args.payload.query,
      mainLoading     : true,
      summaryLoaded   : false,
      currentLevel    : 2,
      currentOpenCard : args.payload.cardId,
      isFirstSearch   : false,
      showQueryHelper : false,
      doPhrasify      : args.payload.phrasify
    });
  }

  handleSetQueryHelper(args, emit = true) {
    this.setState({
      showQueryHelper : args.payload.showQueryHelper,
      convertedQuery  : args.payload.convertedQuery || ''
    }, emit);
  }

  handleSetSummary(args) {
    this.setState({
      summary: args.payload,
      summaryLoaded : true
    });
  }

  handleL2CardLoaded(args) {
    let result = args.payload;
    /*if(result == null){
      // put l1 data into l2 (for testing purposes)
      let cards = this.state.cards;
      let l2id = this.state.currentOpenCard;
      result = cards.filter(c => c.id == l2id)[0];
    }*/
    const hasResults = result.rank > -1;
    this.setState({
      l2Data        : result,
      mainLoading   : false,
      summaryLoaded : hasResults,
      queryStatus   : hasResults ? 'OK' : 'NO_RESULTS'
    });
  }

  expandAllCards() {
    this.setState({
      l2Data: null,
      currentLevel: 1,
      summaryLoaded : true
    });
    const state = this.getState();
    //console.log('doPhrasify', state.doPhrasify);
    const payload = {
      query   : state.query,
      filters : state.filters,
      phrasify : state.doPhrasify
    };
    //console.log('cards on expand ALL', this.state.cards);
    if (state.cards.length == 0) {
      this.actions.searchCards(payload);
    }else{
      this.actions.state2Url(payload);
    }
  }

  handleFilterDataLoaded(args) {
    this.setState(args.payload);
  }

  handleSetBreadcrumbRoot(args) {
    this.setState({breadcrumbRoot: args.payload}, false);
  }

  handleProcessQueryError(args) {
    const err = args.payload;
    typeof(window.__DEV__) != 'undefined' && console.log('process query e args', args);
    const status = err.response ? err.response.status : null;
    let queryStatus = null,
        queryErrorMsg = null;

    switch (status) {

        case 502: case 408:
          queryStatus = 'NO_NETWORK';
          break;

        case 400:
          if (err.response.body.validationFailure) {
            queryStatus   = 'VALIDATION_FAILURE';
            queryErrorMsg = err.response.body.validationFailure.message;
          } else {
            queryStatus = 'BAD_REQUEST';
          }
          break;

        case 500:
          //console.log('500 content', err);
          queryStatus = 'SERVER_ERROR';
          break;

        case 403:
          queryStatus = 'FORBIDDEN';
          break;
    }
    queryStatus !== null && this.setState({
      queryStatus   : queryStatus,
      queryErrorMsg : queryErrorMsg,
      mainLoading   : false
    });
  };

  handleFilterResourcesError(err) {
    if (err.response) {
      if (err.response.status == 401) {
        this.actions.redirect2Login();
      }else if (err.response.status == 403) {
        this.setState({
          queryStatus: 'FORBIDDEN'
        });
      }else{
        console.log('fetch error');
      }
    }else{
      console.log('fetch error', err);
    }
  }

  handleShow404() {
    this.setState({
      queryStatus   : 'NOT_FOUND',
      mainLoading   : false
    });
  }

  handleCardMounted(args) {
    let cardHeights = this.getState().cardHeights;
    cardHeights[args.payload.cardId] = args.payload.height;
    this.setState({'cardHeights': cardHeights});
  }

  handleRevert2Landing() {
    this.setState({
      queryStatus   : null,
      isFirstSearch : true,
      mainLoading   : false,
      queryInput    : '',
      query         : '',
      summary       : null,
      cards         : [],
      currentLevel  : 1
    });
  }

  setState(obj, emit = true) {
    //this.state = this.state.merge(Immutable.fromJS(obj));
    Object.assign(this.state, obj);
    emit && this.emitChange();
  }

  getState() {
    return this.state;
  }
}
