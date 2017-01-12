import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';
import ButtonFilter from '../../components/filters/button-filter';
import EasyActions from '../../actions';
import CardStore from '../../stores/card-store';
import {Flux} from 'ch-flux';

const STORE_ID = "card-store";
let flux = new Flux();
let actions = flux.createActions('easyactions', EasyActions);
flux.createStore(CardStore, STORE_ID).init(actions);
let store = flux.getStore(STORE_ID);

let props = {
  type: 'sentiment',
  name: 'Positive',
  filters: {
    'sentiment': []
  }
};

let context = {
  flux : new Flux()
};

const wrapper = mount(<ButtonFilter {...props}/>, {context});

describe('ButtonFilter', () => {
  it('should have correct props defined', () => {
    expect(wrapper.props().name).to.be.defined;
    expect(wrapper.props().label).to.be.defined;
    expect(wrapper.props().id).to.be.defined;
    expect(wrapper.props().type).to.be.defined;
  });

  it('state values are initialized', () => {
    expect(wrapper.state().type).to.equal('sentiment');
    expect(wrapper.state().selected).to.equal(false);
  });

  it('select on click', () => {
    expect(store.getState().numFilters).to.equal(0);
    expect(store.getState().filters.sentiment).to.eql([]);
    expect(wrapper.state().selected).to.equal(false);
    expect(wrapper.find('button').hasClass('active')).to.equal(false);
    wrapper.find('button').simulate('click');
    expect(store.getState().numFilters).to.equal(1);
    expect(store.getState().filters.sentiment).to.eql(['Positive']);
    let newProps = {
      type: 'sentiment',
      name: 'Positive',
      filters: {
        'sentiment': ['Positive']
      }
    };
    wrapper.setProps(newProps);
    expect(wrapper.state().selected).to.equal(true);
    expect(wrapper.find('button').hasClass('active')).to.equal(true);
  });

});
