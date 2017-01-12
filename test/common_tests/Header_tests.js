'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {Flux} from 'ch-flux';
import Header from '../../common/components/header';

describe('Header', () => {
    let renderer = null;

    beforeEach(function() {
        renderer = TestUtils.createRenderer();
        renderer.render(<Header />, {flux: new Flux()});
    });

    it('should render a react component', () => {
        let result = renderer.getRenderOutput();

        expect(result).to.not.equal(null);
    });
});