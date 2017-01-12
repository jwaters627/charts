import _ from 'lodash';
import Immutable from 'immutable';
import { chFetch } from 'ch-ui-lib';

export default class TeamStore {

    constructor() {
        this.state = Immutable.Map({
            id: 1,
            isMenuOpen: false,
            openMenu: '',
            userInfo: {
                fullName: '',
                initials: '',
                teams: null,
                selectedTeam: null
            }
        });
    }

    init(actions) {
        this.actions = actions;
        this.observe([
            [actions.toggleMenu, this.toggleMenu],
            [actions.redirectToDashboard, this.redirectToDashboard],
            
        ]);
    }

    toggleMenu(args) {
        let menuToOpen = args.payload,
            isOpen = (typeof menuToOpen === 'undefined') ? false : true;

        this.setState({
            isMenuOpen: isOpen,
            openMenu: menuToOpen
        })
    }

    handleUserDataLoaded(args) {
        this.setState(args.payload);
    }

    redirectToDashboard() {
    }

    setState(obj, emit = true) {
        this.state = this.state.merge(Immutable.Map(obj));
        emit && this.emitChange();
    }

    getState() {
        return this.state.toJS();
    }
}