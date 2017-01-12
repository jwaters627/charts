import {ActionObserver} from 'ch-flux';
import {cleanObject} from './utils/utils';
import qs from 'qs';
import _ from 'lodash';
import history from './history';

export const basePath = typeof(__DEV__) == 'undefined' ? '/ch/heliosight' : '/';
export const validCardIds = ['volume', 'hashtags', 'topInfluencers', 'words', 'interests', 'demographics', 'topRetweets'];

@ActionObserver
export default class EasyUrlTracker {

  constructor(actions) {
    this.actions = actions;
    this.observe([
      [actions.state2Url, this.handleState2Url],
      [actions.redirect2Login, this.handleRedirect2Login],
      [actions.navigateBack, this.handleNavigateBack],
      [actions.redirectToDashboard, this.handleRedirectToDashboard]
    ]);
    history.listenBefore(this.handleUrlChange.bind(this));
    this.initFromUrl();
    this.isFirstUrl = true;
  }

  handleState2Url(args) {
    const pl        = args.payload;
    const query     = encodeURIComponent(pl.query);
    let   params    = cleanObject(pl.filters);
    if (!pl.phrasify && pl.phrasify === false) {
      params.phrasify = false;
    }
    const searchStr = qs.stringify(params, { encode: false});

    let path = basePath + (basePath !== '/' ? '/' : '') + 'search/' + query;
    if (!!pl.currentLevel && pl.currentLevel === 2 && !!pl.cardId) {
      path += '/'+pl.cardId;
    }
    this.isFirstUrl = false;
    history.push({
      pathname: path,
      search: !!searchStr ? '?'+searchStr : ''
    });
  }

  handleUrlChange(loc) {
    if (loc.action === 'POP') {
      this.isFirstUrl = false;
      this.initFromUrl(loc);
    }
  }

  initFromUrl(locObj) {
    const params   = getUrlParams(locObj);
    const query    = params.query;
    const filters  = params.filters;
    const cardId   = params.l2CardId;
    const phrasify = params.phrasify;

    this.actions.updateQuery(query);
    this.actions.setFilters(filters);

    // THIS IS L1
    if (params.level == 1) {
      this.actions.searchCards({ query, filters, pushUrl: false, phrasify});
    // L2
    } else if (params.level == 2 && cardId) {
      this.actions.expandCard({cardId, query, filters, pushUrl: false, phrasify});
    // MALFORMED URL -> 404
    } else if (params.level == 2 && !cardId) {
      this.actions.show404();
    }
  }

  handleRedirect2Login() {
    // redirect to login (if java doesn't already)
    let loc = history.createLocation(document.location);
    let destination = loc.pathname + (loc.search ? '?'+loc.search : '');
    document.location.href = '/ch/login?destination='+encodeURIComponent(destination)
  }

  handleRedirectToDashboard() {
    window.location = '/ch/dashboard';
  }

  handleNavigateBack() {
    if (this.isFirstUrl) {
      history.push(basePath);
      this.actions.revert2Landing();
    } else {
      history.goBack();
    }
  }

  getCurrentUrl() {
    let loc = history.createLocation(document.location);
    return loc.pathname + loc.search;
  }
}

export function getUrlParams(locObj) {
  let loc = locObj || history.createLocation(document.location);
  let path = loc.pathname.indexOf('/ch/heliosight') === 0 ? loc.pathname.replace('/ch/heliosight', '') : loc.pathname;
  let pathElems = path.split('/').filter(e => !!e);
  let query   = '';
  let cardId  = null;
  let filters = {};
  let phrasify = true;
  let level   = 0;

  if (pathElems[0] == 'search' && pathElems.length > 1) {
    query = decodeURIComponent(pathElems[1]);
    level = 1;
    if (pathElems.length == 3) {
      level = 2;
      if (validCardIds.indexOf(pathElems[2]) != -1) {
        cardId = pathElems[2];
      }
    }
  }

  if (loc.search) {
    let searchParams = qs.parse(loc.search.replace('?',''));
    phrasify = typeof(searchParams.phrasify) == 'undefined' ? true : searchParams.phrasify == 'true';
    filters = _.omit(searchParams, 'phrasify');
  }

  return {
    query    : query,
    filters  : filters,
    phrasify : phrasify,
    l2CardId : cardId,
    level    : level
  };
}

export function createURLFromState(state, disablePhrasify = false) {
  let params   = cleanObject(state.filters);
  if (!state.doPhrasify || disablePhrasify) params.phrasify = false;
  const paramStr  = qs.stringify(params, { encode: false});
  const query     = encodeURIComponent(state.query);
  let path = basePath + (basePath !== '/' ? '/' : '') + 'search/' + query;
  if (!!state.currentLevel && state.currentLevel === 2 && !!state.currentOpenCard) {
    path += '/'+state.currentOpenCard;
  }
  return path+(paramStr!='' ? '?'+paramStr : '');
}
