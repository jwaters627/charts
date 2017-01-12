'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import moment from 'moment';
import InfluencersCard from '../../apps/dashboard/components/InfluencersCard/InfluencersCard';

describe('InfluencersCard', () => {
    let data = null, renderer = null;

    beforeEach(function() {
        data = [
            {guid: "1234567890", score: 63, profileImageUrl: '/chs/images/post-list-icons/icon_twitter.png', author: 'eklingman', authorUserName: 'Erik Klingman', tweets: 19891, followers: 2344705, following: 157, description: {content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eros massa, fermentum a purus consequat, vulputate tempor nisi. Aenean maximu.', dateTime: '2016-08-19T13:22'} },
            {guid: "1234567890", score: 63, profileImageUrl: '/chs/images/post-list-icons/icon_twitter.png', author: 'eklingman', authorUserName: 'Erik Klingman', tweets: 19891, followers: 2344705, following: 157, description: {content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eros massa, fermentum a purus consequat, vulputate tempor nisi. Aenean maximu.', dateTime: '2016-08-19T13:22'} },
            {guid: "1234567890", score: 63, profileImageUrl: '/chs/images/post-list-icons/icon_twitter.png', author: 'eklingman', authorUserName: 'Erik Klingman', tweets: 19891, followers: 2344705, following: 157, description: {content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eros massa, fermentum a purus consequat, vulputate tempor nisi. Aenean maximu.', dateTime: '2016-08-19T13:22'} },
            {guid: "1234567890", score: 63, profileImageUrl: '/chs/images/post-list-icons/icon_twitter.png', author: 'eklingman', authorUserName: 'Erik Klingman', tweets: 19891, followers: 2344705, following: 157, description: {content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eros massa, fermentum a purus consequat, vulputate tempor nisi. Aenean maximu.', dateTime: '2016-08-19T13:22'} }
        ];
        renderer = TestUtils.createRenderer();
        renderer.render(<InfluencersCard data={data} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.className).to.equal('influencers-card');
    });

    it('should render the proper number of influencers', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.children.length).to.equal(data.length);
    });

    it('should render influencers with header, metrics, and sample tweet', () => {
        let result = renderer.getRenderOutput();

        for (let i = 0; i < data.length; i++) {
            let influencer = result.props.children[i];

            expect(influencer).to.not.equal(null);
            expect(influencer.props.className).to.equal('influencer');
            expect(parseInt(influencer.key, 10)).to.equal(i);
            expect(influencer.props.children[0].props.className).to.equal('influencer-header');
            expect(influencer.props.children[1].props.className).to.equal('influencer-metrics');
            expect(influencer.props.children[2].props.className).to.equal('influencer-sample-tweet');
        }
    });

    it('should render influencers headers with the right klout score', () => {
        let result = renderer.getRenderOutput();

        for (let i = 0; i < data.length; i++) {
            let header = result.props.children[i].props.children[0];

            expect(header.props.children[0].type).to.equal('img');
            expect(header.props.children[0].props.className).to.equal('klout-score');
            expect(header.props.children[0].props.src).to.equal('/chs/images/klout-icons/klout-score_105x95_' + data[i].score + '.png');
        }
    });

    it('should render influencers headers with the right avatar', () => {
        let result = renderer.getRenderOutput();

        for (let i = 0; i < data.length; i++) {
            let header = result.props.children[i].props.children[0];

            expect(header.props.children[1].type).to.equal('img');
            expect(header.props.children[1].props.className).to.equal('avatar');
            expect(header.props.children[1].props.src).to.equal(data[i].profileImageUrl);
        }
    });

    it('should render influencers headers with the right twitter name', () => {
        let result = renderer.getRenderOutput();

        for (let i = 0; i < data.length; i++) {
            let header = result.props.children[i].props.children[0];

            expect(header.props.children[2].type).to.equal('h1');
            expect(header.props.children[2].props.children).to.equal(data[i].authorUserName);
        }
    });

    it('should render influencers headers with the right twitter username', () => {
        let result = renderer.getRenderOutput();

        for (let i = 0; i < data.length; i++) {
            let header = result.props.children[i].props.children[0];

            expect(header.props.children[3].type).to.equal('h2');
            expect(header.props.children[3].props.children[0]).to.equal('@');
            expect(header.props.children[3].props.children[1]).to.equal(data[i].author);
        }
    });

    it('should render influencers metrics with the right # of tweets', () => {
        let result = renderer.getRenderOutput();

        for (let i = 0; i < data.length; i++) {
            let header = result.props.children[i].props.children[1];

            expect(header.props.children[0].type).to.equal('div');
            expect(header.props.children[0].props.className).to.equal('metric');
            expect(header.props.children[0].props.children[0].type).to.equal('h3');
            expect(header.props.children[0].props.children[1].type).to.equal('span');
            expect(header.props.children[0].props.children[1].props.children).to.equal(data[i].tweets);
        }
    });

    it('should render influencers metrics with the right # of followers', () => {
        let result = renderer.getRenderOutput();

        for (let i = 0; i < data.length; i++) {
            let header = result.props.children[i].props.children[1];

            expect(header.props.children[1].type).to.equal('div');
            expect(header.props.children[1].props.className).to.equal('metric');
            expect(header.props.children[1].props.children[0].type).to.equal('h3');
            expect(header.props.children[1].props.children[1].type).to.equal('span');
            expect(header.props.children[1].props.children[1].props.children).to.equal(data[i].followers);
        }
    });

    it('should render influencers metrics with the right # of following', () => {
        let result = renderer.getRenderOutput();

        for (let i = 0; i < data.length; i++) {
            let header = result.props.children[i].props.children[1];

            expect(header.props.children[2].type).to.equal('div');
            expect(header.props.children[2].props.className).to.equal('metric');
            expect(header.props.children[2].props.children[0].type).to.equal('h3');
            expect(header.props.children[2].props.children[1].type).to.equal('span');
            expect(header.props.children[2].props.children[1].props.children).to.equal(data[i].following);
        }
    });

    it('should render influencers sample tweet with the right data', () => {
        let result = renderer.getRenderOutput();

        for (let i = 0; i < data.length; i++) {
            let header = result.props.children[i].props.children[2];

            expect(header.props.children[0].type).to.equal('p');
            expect(header.props.children[0].props.children[0]).to.equal('"');
            expect(header.props.children[0].props.children[1]).to.equal(data[i].description.content);
            expect(header.props.children[0].props.children[2]).to.equal('"');
        }
    });

    it('should render influencers sample tweet date with the right data', () => {
        let result = renderer.getRenderOutput();

        for (let i = 0; i < data.length; i++) {
            let header = result.props.children[i].props.children[2];

            expect(header.props.children[1].type).to.equal('div');
            expect(header.props.children[1].props.className).to.equal('influencer-date');
            expect(header.props.children[1].props.children.type).to.equal('a');
            expect(header.props.children[1].props.children.props.href).to.equal('https://twitter.com/' + data[i].author + '/status/' + data[i].guid);
            expect(header.props.children[1].props.children.props.children[0]).to.equal('posted on ');
            expect(header.props.children[1].props.children.props.children[1]).to.equal(moment(data[i].description.dateTime).format('M/D/YY h:mm A UTC'));
        }
    });
});