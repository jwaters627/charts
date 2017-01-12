import EasyFlux from '../../Flux';
import {expect} from 'chai';
import l1Data  from './data/l1-result';
import l2Data from './data/l2-result';
import {initialState} from '../../stores/card-store';
import BaseCard from '../../components/card';
import history from '../../history';
import _ from 'lodash';
import {jsdom} from 'jsdom';

const MockBrowser = require('mock-browser').mocks.MockBrowser;

describe('Card Store', function () {

  let flux, store, actions;
  beforeEach(() => {
    flux = new EasyFlux();
    store = flux._stores.get('cardstore');
    actions = flux.getActions('easyactions');
    const opts = {
      'window' : jsdom('<!doctype html><html><head><base href="http://crimsonhexagon.com"></head><body></body></html>',
                 {url: 'http://crimsonhexagon.com'}).defaultView
    };
    let browser = new MockBrowser(opts);
    document = browser.getDocument();
    window = browser.getWindow();
  });


  it('has the correct initial state after init', function () {
      expect(store.getState()).to.containSubset(_.omit(initialState.toJS(), [
        'autoCompleteSentiment',
        'autoCompleteLanguages',
        'autoCompleteInterests',
        'autoCompleteLocations',
        'firstDayInclusive',
        'lastDayInclusive'
      ]));
  });

  it('prepares for a new L1 search result', function () {
      actions.prepareNewSearch({query: 'pizza'});
      expect(store.getState()).to.containSubset({
        cards         : [],
        query         : 'pizza',
        l2Data        : null,
        cardHeights   : {},
        mainLoading   : true,
        summaryLoaded : false,
        queryStatus   : 'OK',
        isFirstSearch : false,
        currentLevel  : 1
      });
  });

  it('loads a L1 search result, including summary', function () {
    actions.prepareNewSearch({query: 'pizza'});
    actions.setMainLoading(false);
    actions.cardsLoaded(l1Data);
    let summaryCard = _.first(l1Data.cards.filter(c=> c.id == 'summary'));
    let otherCards = l1Data.cards.filter(c=> c.id != 'summary');
    expect(store.getState()).to.containSubset({
      cards : otherCards,
      queryStatus   : 'OK',
      isFirstSearch : false,
      currentLevel  : 1,
      mainLoading   : false,
      summaryLoaded : true,
      summary : summaryCard
    });
  });

  it('prepares for a L2 result', function () {
    actions.prepareExpandCard({query: 'pizza', cardId: 'hashtags'});
    expect(store.getState()).to.containSubset({
      query           : 'pizza',
      mainLoading     : true,
      summaryLoaded   : false,
      currentLevel    : 2,
      currentOpenCard : 'hashtags',
      isFirstSearch   : false
    });;
  });


  it('loads a L2 result, including summary', function () {
    let summaryCard = _.first(l2Data.cards.filter(c=> c.id == 'summary'));
    let wordsCard = _.first(l2Data.cards.filter(c=> c.id == 'words'));
    let otherCards = l1Data.cards.filter(c=> c.id != 'summary');
    actions.prepareExpandCard({query: 'pizza', cardId: 'words'});
    actions.l2CardLoaded(wordsCard);
    actions.setSummary(summaryCard);
    expect(store.getState()).to.containSubset({
      l2Data : wordsCard,
      summary : summaryCard,
      summaryLoaded : true,
      queryStatus: 'OK',
      currentLevel: 2
    });
  });

  it('goes back from L2 to L1 (without reloading)', function () {
    let summaryCard1 = _.first(l1Data.cards.filter(c=> c.id == 'summary'));
    let summaryCard2 = _.first(l2Data.cards.filter(c=> c.id == 'summary'));
    let wordsCard = _.first(l2Data.cards.filter(c=> c.id == 'words'));
    let otherCards = l1Data.cards.filter(c=> c.id != 'summary');
    actions.prepareNewSearch({query: 'pizza'});
    actions.cardsLoaded(l1Data);
    actions.prepareExpandCard({query: 'pizza', cardId: 'words'});
    actions.l2CardLoaded(wordsCard);
    actions.setSummary(summaryCard2);
    actions.expandAllCards();
    expect(store.getState()).to.containSubset({
      cards: [],
      queryStatus: 'OK',
      l2Data: null,
      currentLevel: 1
    });
  });

  it('clears l1 cards', function () {
    actions.prepareNewSearch({query: 'pizza'});
    actions.setMainLoading(false);
    actions.cardsLoaded(l1Data);
    actions.clearCards();
    expect(store.getState()).to.containSubset({
      cards         : [],
      cardHeights   : {},
      queryStatus   : 'OK',
      isFirstSearch : false
    });
  });

  it('reverts to landing page status', function () {
    actions.prepareNewSearch({query: 'pizza'});
    actions.setMainLoading(false);
    actions.cardsLoaded(l1Data);
    actions.revert2Landing();
    expect(store.getState()).to.containSubset({
      queryStatus   : null,
      isFirstSearch : true,
      mainLoading   : false,
      queryInput    : '',
      query         : '',
      summary       : null,
      cards         : [],
      currentLevel  : 1
    });
  });

  it('updates gender filter', function () {
    // set female
    actions.updateFilter({type: 'genders', value: 'F'});
    expect(store.getState()).to.containSubset({
      filters: { genders: ['F'] }
    });

    // switch to male
    actions.updateFilter({type: 'genders', value : 'M'});
    expect(store.getState()).to.containSubset({
      filters: { genders: ['M'] }
    });

    // deactivate filter (click same gender again)
    actions.updateFilter({type: 'genders', value : 'M'});
    expect(store.getState()).to.containSubset({
      filters: { genders: [] }
    });
  });

  it('updates sentiment filter', function () {
    // set positive
    actions.updateFilter({type: 'sentiment', value: 'Positive'});
    expect(store.getState()).to.containSubset({
      filters: { sentiment: ['Positive'] }
    });

    // add neutral
    actions.updateFilter({type: 'sentiment', value : 'Neutral'});
    expect(store.getState()).to.containSubset({
      filters: { sentiment: ['Positive', 'Neutral'] }
    });

    // remove neutral
    actions.updateFilter({type: 'sentiment', value : 'Neutral'});
    expect(store.getState().filters).to.containSubset({
      sentiment: ['Positive']
    });
  });

  it('updates date filters (normal and quickDate)', function () {
    const start = '2016-08-11';
    const end   = '2016-08-15';
    const quick = '24h';

    actions.updateFilter({type: 'startDate', value: start});
    expect(store.getState().filters).to.containSubset({
      startDate : start,
      endDate   : null,
      quickDate : null
    });

    actions.updateFilter({type: 'endDate', value: end});
    expect(store.getState().filters).to.containSubset({
      startDate : start,
      endDate : end,
      quickDate: null
    });

    // set quick filter
    actions.updateFilter({type: 'quickDate', value: quick});
    expect(store.getState().filters).to.containSubset({
      startDate : null,
      endDate : null,
      quickDate : quick
    });

    // set start date again
    actions.updateFilter({type: 'startDate', value: start});
    expect(store.getState().filters).to.containSubset({
      startDate : start,
      endDate   : null,
      quickDate : null
    });
  });

  it('updates input based filters (locations, languages, interests)', function () {
    actions.updateFilter({type: 'locations', value: ['GBR', 'USA']});
    expect(store.getState().filters).to.containSubset({
      locations : ['GBR', 'USA'],
    });

    actions.updateFilter({type: 'locations', value: []});
    expect(store.getState().filters).to.containSubset({
      locations : [],
    });
  });

  it('sets filters with an object', function () {
    const newFilters = {genders: ['M'], locations: ['USA', 'GBR'], startDate: '2016-08-04'};
    actions.setFilters(newFilters);
    const compare = Object.assign({}, initialState.get('filters').toJS(), newFilters);
    expect(store.getState().filters).to.deep.equal(compare);
  });

  it('clears filters', function () {
    const newFilters = {genders: ['M'], locations: ['USA', 'GBR'], startDate: '2016-08-04'};
    actions.setFilters(newFilters);
    actions.clearFilters();
    expect(store.getState().filters).to.deep.equal(initialState.get('filters').toJS());
  });

  it('handles 400s', function () {
    // common 400 errors
    let err = {
      response : {
        status: 400,
        body : {}
      }
    };
    actions.processQueryError(err);
    expect(store.getState()).to.containSubset({
      queryStatus : 'BAD_REQUEST',
      queryErrorMsg : null,
      mainLoading : false
    });

    // validation failure
    err.response.body.validationFailure = {message: 'some message'};
    actions.processQueryError(err);
    expect(store.getState()).to.containSubset({
      queryStatus: 'VALIDATION_FAILURE',
      queryErrorMsg: 'some message',
      mainLoading : false
    });

  });

  it('handles 500s', function () {
    let err = {response : { status: 500 }};
    actions.processQueryError(err);
    expect(store.getState()).to.containSubset({
      queryStatus: 'SERVER_ERROR',
      mainLoading : false
    });
  });

  it('handles 403s', function () {
    let err = {response : { status: 403 }};
    actions.processQueryError(err);
    expect(store.getState()).to.containSubset({
      queryStatus: 'FORBIDDEN',
      mainLoading : false
    });
  });

  it('handles 404s', function () {
    actions.show404();
    expect(store.getState()).to.containSubset({
      queryStatus: 'NOT_FOUND',
      mainLoading : false
    });
  });

});
