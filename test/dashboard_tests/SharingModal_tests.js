'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import SharingModal from '../../apps/dashboard/components/SharingModal/SharingModal';

describe('SharingModal', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            sharingProps: { display: 'block' },
            users: [
                {userId: 1, userName: 'Erik Klingman', email: 'eklingman@crimsonhexagon.com'},
                {userId: 2, userName: 'Steve Ungerer', email: 'steve@crimsonhexagon.com'},
                {userId: 5, userName: 'Kunal Patel', email: 'kunal@crimsonhexagon.com'},
                {userId: 6, userName: 'Luke Payyapilli', email: 'lpayyapilli@crimsonhexagon.com'},
                {userId: 7, userName: 'Nick Balsbaugh', email: 'nbalsbaugh@crimsonhexagon.com'}
            ],
            shares: [
                {userId: 3, userName: 'Caleb Isabella', email: 'cisabella@crimsonhexagon.com'},
                {userId: 4, userName: 'Carlos Barrero', email: 'cbarerro@crimsonhexagon.com'}
            ],
            dashboard: {
                creatingUser: 'Erik Klingman',
                creationDate: '2016-06-10T15:20:37.237+0000',
                id: 550543750,
                name: 'Erik Test Dashboard',
                theme: null,
                visualizations: [
                    {h: 6, i: "0", id: 1, minH: 6, minW: 4, w: 4, x: 0, y: 0},
                    {h: 6, i: "1", id: 2, minH: 6, minW: 4, w: 4, x: 4, y: 0},
                    {h: 6, i: "2", id: 3, minH: 6, minW: 4, w: 4, x: 8, y: 0},
                    {h: 6, i: "3", id: 4, minH: 6, minW: 4, w: 4, x: 12, y: 0}
                ]
            }
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<SharingModal {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.id).to.equal('sharingParent');
        expect(result.props.className).to.equal('sharing-parent');
    });

    it('should render a wrapper div', () => {
        let result = renderer.getRenderOutput();
        let wrapper = result.props.children[0];

        expect(wrapper).to.not.equal(null);
        expect(wrapper.props.className).to.equal('wrapper');
    });

    it('should have a (mostly) opaque cover below it', () => {
        let result = renderer.getRenderOutput();
        let cover = result.props.children[1];

        expect(cover).to.not.equal(null);
        expect(cover.props.style.backgroundColor).to.equal('#FFF');
        expect(cover.props.style.opacity).to.equal('0.9');
        expect(cover.props.style.zIndex).to.equal('1500');
    });

    it('should have a header (hence the wrapper)', () => {
        let result = renderer.getRenderOutput();
        let wrapper = result.props.children[0];
        let main = wrapper.props.children;
        let header = main.props.children[1];

        expect(header).to.not.equal(null);
        expect(header.type).to.equal('h1');
        expect(header.props.children).to.equal('Share');
    });

    it('should render the main div', () => {
        let result = renderer.getRenderOutput();
        let wrapper = result.props.children[0];
        let main = wrapper.props.children;

        expect(main).to.not.equal(null);
        expect(main.props.id).to.equal('sharingModal');
    });

    it('shouldn\'t render the list of users by default', () => {
        let result = renderer.getRenderOutput();
        let wrapper = result.props.children[0];
        let main = wrapper.props.children;
        let users = main.props.children[4];

        expect(users).to.equal(null);
    });

    it('should render a list of shares with unique IDs', () => {
        let result = renderer.getRenderOutput();
        let wrapper = result.props.children[0];
        let main = wrapper.props.children;
        let shares = main.props.children[5];
        let ids = [];

        shares.props.children.forEach(function(share) {
            ids.push(share.props.id);
        });

        let uniques = ids.filter(function(id, i) {
            return ids.indexOf(id) === i;
        });

        expect(shares.props.className).to.equal('shares');
        expect(shares.props.children.length).to.equal(props.shares.length);
        expect(uniques.length).to.equal(ids.length);
    });
});