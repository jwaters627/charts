import {chFetch} from 'ch-ui-lib';
import {ActionObserver} from 'ch-flux';


@ActionObserver
export default class CommonDataService {

    constructor(actions) {
        this.actions = actions;

        this.observe([
            [actions.switchTeams, this.switchTeams]
        ]);

        this.getUserInformation();
    }

    getUserInformation(){
    }

    switchTeams(args) {
    }

}
