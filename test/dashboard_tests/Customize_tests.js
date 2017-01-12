'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Customize from '../../apps/dashboard/components/Customize/Customize';

describe('Customize', () => {
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
            },
            customizeProps: {
                display: 'block',
                title: 'Customize',
                cover: true,
                button: 'Update',
                edit: true
            }
        };

        renderer = TestUtils.createRenderer();
        renderer.render(<Customize {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();
        expect(result).to.not.equal(null);
    });

    it('should render 2 children', () => {
        let result = renderer.getRenderOutput();
        expect(result.props.children.length).to.equal(2);
    });

    it('should render a header', () => {
        let result = renderer.getRenderOutput();
        let wrapper = result.props.children[0].props.children;
        let title = wrapper.props.children[1];

        expect(title).to.not.equal(null);
        expect(title.type).to.equal('h1');
        expect(title.props.className).to.equal('header');
    });

    it('should render a input for preview', () => {
        let result = renderer.getRenderOutput();
        let wrapper = result.props.children[0].props.children;
        let img = wrapper.props.children[6];

        expect(img).to.not.equal(null);
        expect(img.type).to.equal('img');
        expect(img.ref).to.equal('preview');
    });

    it('should render the dashboard name', () => {
        let result = renderer.getRenderOutput();
        let wrapper = result.props.children[0].props.children;
        let name = wrapper.props.children[3];

        expect(name).to.not.equal(null);
        expect(name.type).to.equal('input');
        expect(name.ref).to.equal('dashboardTitle');

    });

    it('should render logo upload field', () => {
        let result = renderer.getRenderOutput();
        let wrapper = result.props.children[0].props.children;
        let upload = wrapper.props.children[7];

        expect(upload).to.not.equal(null);
        expect(upload.type).to.equal('form');
        expect(upload.ref).to.equal('logoUpload');
    });

    it('should render a button', () => {
        let result = renderer.getRenderOutput();
        let wrapper = result.props.children[0].props.children;
        let button = wrapper.props.children[8];

        expect(button).to.not.equal(null);
        expect(button.type).to.equal('button');
        expect(button.props.children).to.equal('Update');
    });

    it('should render a cover', () => {
        let result = renderer.getRenderOutput();
        let cover = result.props.children[1];

        expect(cover).to.not.equal(null);
    });
});