'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import DashboardTweet from '../../apps/dashboard/components/DashboardTweet/DashboardTweet';

describe('DashboardTweet', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            tweet: {
                authorDisplayName: "AlDubBigBoyz",
                authorUserName: "AlDubBigBoyz",
                content: "mahirap kasi lahat ng traits and even flaws nya LIKE / LOVE mo haha!↵@aldenrichards02 @mainedcm ↵↵#ALDUBMigrateOrNot https://t.co/8xRrDq9TYK",
                count: 8,
                date: "2016-08-03T14:37",
                guid: "760847028012232704"
            },
            percent: 100
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<DashboardTweet {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.className).to.equal('dashboard-tweet');
    });

    it('should render a tweet head', () => {
        let result = renderer.getRenderOutput();
        let head = result.props.children[0];

        expect(head).to.not.equal(null);
        expect(head.props.className).to.equal('tweet-head');
    });

    it('should render tweet content', () => {
        let result = renderer.getRenderOutput();
        let content = result.props.children[1];

        expect(content).to.not.equal(null);
        expect(content.props.className).to.equal('content');
    });

    it('should render some links', () => {
        let result = renderer.getRenderOutput();
        let links = result.props.children[2];

        expect(links).to.not.equal(null);
        expect(links.props.className).to.equal('links');
    });

    it('should render the retweet count', () => {
        let result = renderer.getRenderOutput();
        let count = result.props.children[3];

        expect(count).to.not.equal(null);
        expect(count.props.className).to.equal('count');
    });

    it('should render the correct bar width', () => {
        let result = renderer.getRenderOutput();
        let count = result.props.children[3];
        let bar = count.props.children[0];

        expect(bar.props.className).to.equal('bar');
        expect(bar.props.children.type).to.equal('span');
        expect(bar.props.children.props.style.width).to.equal(props.percent + '%');
    });

    it('should render the correct retweet count', () => {
        let result = renderer.getRenderOutput();
        let count = result.props.children[3];
        let number = count.props.children[1];

        expect(number.props.className).to.equal('number');
        expect(number.props.children).to.equal(props.tweet.count + '+');
    });
});