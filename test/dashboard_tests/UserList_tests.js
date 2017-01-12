'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import UserList from '../../apps/dashboard/components/UserList/UserList';

describe('UserList', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            users: [
                {userId: 1, userName: 'Erik Klingman', email: 'eklingman@crimsonhexagon.com'},
                {userId: 2, userName: 'Steve Ungerer', email: 'steve@crimsonhexagon.com'},
                {userId: 5, userName: 'Kunal Patel', email: 'kunal@crimsonhexagon.com'},
                {userId: 6, userName: 'Luke Payyapilli', email: 'lpayyapilli@crimsonhexagon.com'},
                {userId: 7, userName: 'Nick Balsbaugh', email: 'nbalsbaugh@crimsonhexagon.com'}
            ],
            onCancel: function() { return null; },
            dashboardId: 1234
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<UserList {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.id).to.equal('userList');
    });

    it('should render a list of users with unique IDs', () => {
        let result = renderer.getRenderOutput();
        let list = result.props.children[0];
        let ids = [];

        list.props.children.forEach(function(li) {
            ids.push(li.props.children.props.id);
        });

        let uniques = ids.filter(function(id, i) {
            return ids.indexOf(id) === i;
        });

        expect(list.props.children.length).to.equal(props.users.length);
        expect(uniques.length).to.equal(ids.length);
    });

    it('should render a Cancel button', () => {
        let result = renderer.getRenderOutput();
        let actions = result.props.children[1];
        let cancel = actions.props.children[0];

        expect(actions).to.not.equal(null);
        expect(actions.props.className).to.equal('user-actions');
        expect(cancel.type).to.equal('button');
        expect(cancel.props.id).to.equal('cancel');
        expect(cancel.props.onClick()).to.equal(props.onCancel());
        expect(cancel.props.children).to.equal('Cancel');
    });

    it('should render an Add button', () => {
        let result = renderer.getRenderOutput();
        let actions = result.props.children[1];
        let add = actions.props.children[1];

        expect(add.type).to.equal('button');
        expect(add.props.id).to.equal('add');
        expect(add.props.children).to.equal('Add');
    });
});