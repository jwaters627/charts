'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import RetweetsCard from '../../apps/dashboard/components/RetweetsCard/RetweetsCard';

describe('RetweetsCard', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            retweets: [
                {authorDisplayName: "AlDubBigBoyz", authorUserName: "AlDubBigBoyz", content: "mahirap kasi lahat ng traits and even flaws nya LIKE / LOVE mo haha!↵@aldenrichards02 @mainedcm ↵↵#ALDUBMigrateOrNot https://t.co/8xRrDq9TYK", count: 8, date: "2016-08-03T14:37", guid: "760847028012232704"},
                {authorDisplayName: "AlDubBigBoyz", authorUserName: "AlDubBigBoyz", content: "mahirap kasi lahat ng traits and even flaws nya LIKE / LOVE mo haha!↵@aldenrichards02 @mainedcm ↵↵#ALDUBMigrateOrNot https://t.co/8xRrDq9TYK", count: 8, date: "2016-08-03T14:37", guid: "760847028012232704"},
                {authorDisplayName: "AlDubBigBoyz", authorUserName: "AlDubBigBoyz", content: "mahirap kasi lahat ng traits and even flaws nya LIKE / LOVE mo haha!↵@aldenrichards02 @mainedcm ↵↵#ALDUBMigrateOrNot https://t.co/8xRrDq9TYK", count: 8, date: "2016-08-03T14:37", guid: "760847028012232704"},
                {authorDisplayName: "AlDubBigBoyz", authorUserName: "AlDubBigBoyz", content: "mahirap kasi lahat ng traits and even flaws nya LIKE / LOVE mo haha!↵@aldenrichards02 @mainedcm ↵↵#ALDUBMigrateOrNot https://t.co/8xRrDq9TYK", count: 8, date: "2016-08-03T14:37", guid: "760847028012232704"},
                {authorDisplayName: "AlDubBigBoyz", authorUserName: "AlDubBigBoyz", content: "mahirap kasi lahat ng traits and even flaws nya LIKE / LOVE mo haha!↵@aldenrichards02 @mainedcm ↵↵#ALDUBMigrateOrNot https://t.co/8xRrDq9TYK", count: 8, date: "2016-08-03T14:37", guid: "760847028012232704"},
                {authorDisplayName: "AlDubBigBoyz", authorUserName: "AlDubBigBoyz", content: "mahirap kasi lahat ng traits and even flaws nya LIKE / LOVE mo haha!↵@aldenrichards02 @mainedcm ↵↵#ALDUBMigrateOrNot https://t.co/8xRrDq9TYK", count: 8, date: "2016-08-03T14:37", guid: "760847028012232704"}
            ]
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<RetweetsCard {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.className).to.equal('retweets-card');
    });

    it('should render the correct number of children', () => {
        let result = renderer.getRenderOutput();
        expect(result.props.children.length).to.equal(props.retweets.length);
    });
});