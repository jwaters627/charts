'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import CommonActions from '../../common/CommonActions';
import Menu from '../../common/components/header/menu';

let flux = new Flux();
let actions = flux.createActions('commonActions', CommonActions);

const menuClass = 'profile-menu';

describe('Menu', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            actions: actions,
            userInfo: {
                fullName: 'Erik Klingman',
                initials: 'EK',
                isEasyInsightsOnly: false,
                isSystemAdmin: true,
                isTeamAdmin: true,
                selectedTeam: {id: 0, name: 'Crimson Hexagon'},
                teams: [
                    {id: 1, name: 'Test1'},
                    {id: 2, name: 'Test2'},
                    {id: 3, name: 'Test3'},
                    {id: 4, name: 'Test4'}
                ]
            }
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<Menu menu={menuClass} {...props} />, {flux: flux});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
    });
});