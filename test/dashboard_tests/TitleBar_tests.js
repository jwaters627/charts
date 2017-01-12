'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import TitleBar from '../../apps/dashboard/components/TitleBar/TitleBar';

describe('TitleBar', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            userMenuOpen: false,
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
        renderer.render(<TitleBar {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.id).to.equal('titleBar');
        expect(result.props.className).to.equal('title-bar');
    });

    it('should render 8 children', () => {
        let result = renderer.getRenderOutput();

        expect(result.props.children.length).to.equal(8);
    });

    it('should render an Add Logo div', () => {
        let result = renderer.getRenderOutput();
        let logo = result.props.children[0];

        expect(logo).to.not.equal(null);
        expect(logo.props.id).to.equal('addLogo');
        expect(logo.props.className).to.equal('add-logo');
    });

    it('should render the dashboard name', () => {
        let result = renderer.getRenderOutput();
        let name = result.props.children[1];
        let div = name.props.children;

        expect(name).to.not.equal(null);
        expect(name.props.id).to.equal('dashboardName');
        expect(name.props.className).to.equal('dashboard-name');
        expect(div.type).to.equal('div');
        expect(div.props.children.length).to.equal(2);
        expect(div.props.children[0]).to.equal(props.dashboard.name);
        expect(div.props.children[1].type).to.equal('i');
    });

    it('should render logo upload info', () => {
        let result = renderer.getRenderOutput();
        let info = result.props.children[2];

        expect(info).to.not.equal(null);
        expect(info.type).to.equal('span');
        expect(info.props.id).to.equal('logoInfoText');
        expect(info.props.children).to.equal('You can upload images in the following formats: PNG, JPG');
    });

    it('should render a delete button', () => {
        let result = renderer.getRenderOutput();
        let button = result.props.children[3];

        expect(button).to.not.equal(null);
        expect(button.props.id).to.equal('delete');
        expect(button.props.className).to.equal('menu-button');
    });

    it('should render a share button', () => {
        let result = renderer.getRenderOutput();
        let button = result.props.children[4];

        expect(button).to.not.equal(null);
        expect(button.props.id).to.equal('share');
        expect(button.props.className).to.equal('menu-button');
    });

    it('should render a customize button', () => {
        let result = renderer.getRenderOutput();
        let button = result.props.children[5];

        expect(button).to.not.equal(null);
        expect(button.props.id).to.equal('customize');
        expect(button.props.className).to.equal('menu-button');
    });

    it('should render a add media button', () => {
        let result = renderer.getRenderOutput();
        let button = result.props.children[6];

        expect(button).to.not.equal(null);
        expect(button.props.id).to.equal('addMedia');
        expect(button.props.className).to.equal('menu-button');
    });

    it('should render a null cover by default', () => {
        let result = renderer.getRenderOutput();
        let cover = result.props.children[7];

        expect(cover).to.equal(null);
    });
});