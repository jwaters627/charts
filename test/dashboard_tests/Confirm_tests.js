'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Confirm from '../../apps/dashboard/components/Confirm/Confirm';

describe('Confirm', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            display: "block",
            header: "Confirm",
            text: "Please confirm your action",
            onDelete: function() { return null; }
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<Confirm confirmProps={props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.className).to.equal('confirm');
    });

    it('should render a Close X icon', () => {
        let result = renderer.getRenderOutput();
        let confirm = result.props.children[0];
        let close = confirm.props.children[0];

        expect(confirm).to.not.equal(null);
        expect(close).to.not.equal(null);
        expect(close.props.className).to.equal('close');
        expect(close.props.children.type).to.equal('i');
    });

    it('should render a header element', () => {
        let result = renderer.getRenderOutput();
        let confirm = result.props.children[0];
        let header = confirm.props.children[1];

        expect(confirm).to.not.equal(null);
        expect(header).to.not.equal(null);
        expect(header.type).to.equal('h1');
        expect(header.props.children).to.equal(props.header);
    });

    it('should render a paragraph element', () => {
        let result = renderer.getRenderOutput();
        let confirm = result.props.children[0];
        let text = confirm.props.children[2];

        expect(confirm).to.not.equal(null);
        expect(text).to.not.equal(null);
        expect(text.type).to.equal('p');
        expect(text.props.children).to.equal(props.text);
    });

    it('should render a delete button', () => {
        let result = renderer.getRenderOutput();
        let confirm = result.props.children[0];
        let button = confirm.props.children[3];

        expect(confirm).to.not.equal(null);
        expect(button).to.not.equal(null);
        expect(button.type).to.equal('button');
        expect(button.props.children).to.equal('Delete');
    });

    it('should have a (mostly) opaque cover below it', () => {
        let result = renderer.getRenderOutput();
        let cover = result.props.children[1];

        expect(cover).to.not.equal(null);
        expect(cover.props.style.backgroundColor).to.equal('#FFF');
        expect(cover.props.style.opacity).to.equal('0.9');
        expect(cover.props.style.zIndex).to.equal('10001');
    });

    it('should handle onDelete when clicking the delete button', () => {
        let result = renderer.getRenderOutput();
        let confirm = result.props.children[0];
        let button = confirm.props.children[3];

        expect(button.props.onClick()).to.equal(props.onDelete());
    });
});