import {chFetch} from 'ch-ui-lib';
import {ActionObserver} from 'ch-flux';
import {translateEmoji, cleanObject} from './utils/utils';
import moment from 'moment-timezone';
import mockupCards from './mockup-data/mockup-cards';
import mockupCardsL2 from './mockup-data/mockup-cards-l2';

const rootUrl = '/ch/heliosight/';
const interestsUrl = '/ch/data/twitterauthorinterests';
const locationsUrl = '/ch/data/locations';
const languagesUrl = '/ch/data/languages';
const dateRangeUrl = '/ch/data/insightdates';

@ActionObserver
export default class EasyDataService {

  timezone       = null;
  timezoneLoaded = false;

  constructor(actions) {
    this.actions = actions;

    this.observe([
      [actions.searchCards, this.handleSearchCards],
      [actions.expandCard, this.handleExpandCard]
    ]);

    this.getInterests();
    this.getLocations();
    this.getLanguages();
    this.getSentiment();
    this.getDateFilterRange();
  }

  handleSearchCards(args) {
    const query    = args.payload.query;
    const filters  = cleanObject(args.payload.filters);
    const pushUrl  = typeof(args.payload.pushUrl) != 'undefined' ? args.payload.pushUrl : true;
    const phrasify = typeof(args.payload.phrasify) != 'undefined' ? args.payload.phrasify : true;

    this.actions.prepareNewSearch({query, phrasify});
    pushUrl && this.actions.state2Url({query, filters, phrasify});

    // defer until timezone is loaded first
    if (!this.timezoneLoaded) {
      this.fetchDateRangeCallback = () => {
        this.handleSearchCards(args);
        this.fetchDateRangeCallback = null;
      }
      return;
    }

    // cancel other running requests
    this.l1FetchA && this.l1FetchA.state() == 'pending' && this.l1FetchA.abort();
    this.l1FetchB && this.l1FetchB.state() == 'pending' && this.l1FetchB.abort();

    let params = {
      query : translateEmoji(query),
      filters,
      phrasify,
    };
    //console.log('l1 params', params);
    if (this.timezone !== 'UTC') params.timezone = this.timezone;
    this.l1FetchA = chFetch.post(rootUrl+'query', params);
    this.l1FetchA.promise().then(res => {
      if (res.status === 200) {
        this.getCards(res.body.callbackUrl);
        //console.log('response', res.body);
        res.body.converted && this.actions.setQueryHelper({
          showQueryHelper: true,
          convertedQuery: res.body.convertedQuery
        });
      }
    })
    .catch(err => this.processQueryError(err));
  }

  getCards(url) {
    this.l1FetchB = chFetch.get(url);
    this.l1FetchB.then(res => {
      if (res.status == 200) {
        let data = res.body;
        /*
        if (data.cardsRemaining === 0) {
          data.cards = data.cards.concat(mockupCards);
        }*/
        this.actions.setMainLoading(false);
        this.actions.cardsLoaded(data);
        data.cardsRemaining > 0 && this.getCards(rootUrl+'cards?streamId='+data.streamId);
      }
    }).catch(err => this.processQueryError(err));
  }

  handleExpandCard(args) {

    this.actions.setMainLoading(true);

    const cardId   = args.payload.cardId;
    const query    = args.payload.query;
    const filters  = cleanObject(args.payload.filters);
    const pushUrl  = typeof(args.payload.pushUrl) != 'undefined' ? args.payload.pushUrl : true;
    const phrasify = typeof(args.payload.phrasify) != 'undefined' ? args.payload.phrasify : true;

    pushUrl && this.actions.state2Url({cardId, query, filters, currentLevel : 2, phrasify});
    this.actions.prepareExpandCard({cardId, query, phrasify});

    // defer until timezone is loaded first
    if (!this.timezoneLoaded) {
      this.fetchDateRangeCallback = () => {
        this.handleExpandCard(args);
        this.fetchDateRangeCallback = null;
      }
      return;
    }

    this.l2FetchA && this.l2FetchA.state() == 'pending' && this.l2FetchA.abort();
    this.l2FetchB && this.l2FetchB.state() == 'pending' && this.l2FetchB.abort();

    let params = {
      query     : translateEmoji(query),
      filters,
      phrasify,
      drilldown : {
        cardId: cardId,
        level: 2
      },
      //numAnalysisDays : 30
    };
    if (this.timezone != 'UTC') params.timezone = this.timezone;
    this.l2FetchA = chFetch.post(rootUrl+'query', params);
    this.l2FetchA.then(res => {
      if(res.status == 200 && !!res.body && !!res.body.callbackUrl){
        res.body.converted && this.actions.setQueryHelper({
          showQueryHelper : true,
          convertedQuery : res.body.convertedQuery
        });
        this.l2FetchB = chFetch.get(res.body.callbackUrl);
        return this.l2FetchB.promise();
      }
    })
    .then(res => {
      if(res.body.cards && res.body.cards.length){
        res.body.cards.filter((card) => {
          card.id == 'summary' ? this.actions.setSummary(card) : this.actions.l2CardLoaded(card);
        });
      }
      if(res.body.cardsRemaining > 0) {
        let url = rootUrl+'cards?streamId='+res.body.streamId;
        chFetch.get(url)
        .then(res => {
          if(res.body.cards && res.body.cards.length){
            res.body.cards.filter((card) => {
              card.id == 'summary' ? this.actions.setSummary(card) : this.actions.l2CardLoaded(card);
            });
          }
        })
      }

    })
    .catch(err => this.processQueryError(err))
  }

  processQueryError(err) {
    if (!!err && err.status == 401) {
      // redirect to login
      this.actions.redirect2Login();
    }else {
      this.actions.processQueryError(err);
    }
  }

  getDateFilterRange(){
    let tz = false;
    try {
      tz = moment.tz.guess();
      //console.log('Guessed TZ:', tz);
    } catch (e) {
      console.log('NO TZ support on this browser');
    }
    let params = {}
    if (!!tz) params.timezone = tz;
    chFetch.get(dateRangeUrl, params)
    .then(res => {
      if(res.status == 200 && res.body != null) {
        this.timezone = !!res.body.timezone ? res.body.timezone : 'UTC';
        this.actions.filterDataLoaded({
          timezone          : this.timezone,
          firstDayInclusive : res.body.earliestDateInclusive,
          lastDayInclusive  : res.body.latestDateInclusive
        });
      }
      this.timezoneLoaded = true;
      !!this.fetchDateRangeCallback && this.fetchDateRangeCallback();
    }).catch(res => this.actions.filterResourcesError(res));
  }

  getInterests() {
    chFetch.get(interestsUrl)
    .then(res => {
      if(res.status == 200 && res.body.allAuthorInterestSegments) {
        // Had to refactor here and put 'type' for it to work -> extending array with a property?
        let data = res.body.allAuthorInterestSegments;
        data.type = 'interests';
        this.actions.filterDataLoaded({autoCompleteInterests: data});
      }
    }).catch(res => this.actions.filterResourcesError(res));
  }

  getLocations() {
    chFetch.get(locationsUrl)
    .then(res => {
      if(res.status == 200 && res.body) {
        res.body.type = 'locations';
        this.actions.filterDataLoaded({autoCompleteLocations: res.body});
      }
    }).catch(res => this.actions.filterResourcesError(res));
  }

  getLanguages() {
    chFetch.get(languagesUrl)
    .then(res => {
      if(res.status == 200 && res.body) {
        res.body.type = 'languages';
        this.actions.filterDataLoaded({autoCompleteLanguages: res.body});
      }
    }).catch(res => this.actions.filterResourcesError(res));
  }

  getSentiment() {
    let sentimentVals = [
      {
        id: 'pos',
        name: 'Positive'
      },
      {
        id: 'neg',
        name: 'Negative'
      },
      {
        id: 'net',
        name: 'Neutral'
      }
    ];
    sentimentVals.type = 'sentiment';
    this.actions.filterDataLoaded({
      autoCompleteSentiment: sentimentVals
    })
  }
}
