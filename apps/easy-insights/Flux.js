import {Flux} from 'ch-flux';
// easy items
import EasyActions from './actions';
import EasyCardStore from './stores/card-store';
import EasyUrlTracker from './urlTracker';
import EasyDataService from './dataService';
// common items (header basically)
import CommonActions from '../../common/CommonActions';
import TeamStore from '../../common/stores/TeamStore';
import CommonDataService from '../../common/CommonDataService';

export default class EasyFlux extends Flux {
  constructor() {
    super();
    // easy items
    let actions = this.createActions('easyactions', EasyActions);
    this.createStore(EasyCardStore, 'cardstore').init(actions);
    this.dataService = new EasyDataService(actions);
    this.urlTracker  = new EasyUrlTracker(actions);
    // common
    let commonActions = this.createActions('commonActions', CommonActions);
    this.createStore(TeamStore, 'common-store').init(commonActions);
    let commonDataService = new CommonDataService(commonActions);
  }
}
