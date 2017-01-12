'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import _ from 'lodash';
import {Flux} from 'ch-flux';
import BarsCard from '../../apps/dashboard/components/BarsCard/BarsCard';

describe('BarsCard', () => {
    let props = null, renderer = null;

    beforeEach(function() {
        props = {
            data: [
                { label: '#firstsevenlanguages', value: 1300000000 },
                { label: '#starwars', value: 720000000 },
                { label: '#travel', value: 12000000 },
                { label: '#summerslam16', value: 5000000 },
                { label: '#EURO2016', value: 250000 },
                { label: '#ALDUBGetThemLolaTini', value: 14000 },
                { label: '#dolceamorefamilyday', value: 2600 },
            ]
        };
        renderer = TestUtils.createRenderer();
        renderer.render(<BarsCard {...props} />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
        expect(result.props.className).to.equal('bars-card');
    });

    it('should render the correct number of children', () => {
        let result = renderer.getRenderOutput();
        expect(result.props.children.length).to.equal(props.data.length);
    });

    it('should render each row with a label, bar, and count', () => {
        let result = renderer.getRenderOutput();
        let max = _.max(_.map(props.data, function(d) { return d.value; }));

        for (let i = 0; i < props.data.length; i++) {
            let row = result.props.children[i];
            let className = 'bar-row ';
            if (i == props.data.length-1) className += 'last-odd';

            expect(row).to.not.equal(null);
            expect(row.props.className).to.equal(className);
            expect(parseInt(row.key, 10)).to.equal(i);
            expect(row.props.children[0].props.className).to.equal('label');
            expect(row.props.children[0].props.children).to.equal(props.data[i].label);
            expect(row.props.children[1].props.className).to.equal('bar');
            expect(row.props.children[1].props.children.type).to.equal('span');
            expect(row.props.children[1].props.children.props.style.width).to.equal(Math.round((props.data[i].value / max) * 100) + '%');
            expect(row.props.children[2].props.className).to.equal('count');
            expect(row.props.children[2].props.children[0]).to.equal(props.data[i].value);
            expect(row.props.children[2].props.children[1]).to.equal('+');
        }
    });
});