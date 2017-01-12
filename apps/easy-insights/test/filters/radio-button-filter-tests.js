import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';
import RadioButtonFilter from '../../components/filters/radio-button-filter';
import EasyActions from '../../actions';
import CardStore from '../../stores/card-store';
import {Flux} from 'ch-flux';

const STORE_ID = "card-store";
let flux = new Flux();
let actions = flux.createActions('easyactions', EasyActions);
flux.createStore(CardStore, STORE_ID).init(actions);
let store = flux.getStore(STORE_ID);

let props = {
  type: 'genders',
  selected: '',
  filters: {
    'genders': []
  }
};

let context = {
  flux : new Flux()
};

const wrapper = mount(<RadioButtonFilter {...props}/>, {context});

describe('RadioButtonFilter', () => {
  it('should have correct props defined', () => {
    expect(wrapper.props().type).to.be.defined;
    expect(wrapper.props().selected).to.be.defined;
    store.clearFilters();
  });

  it('state values are initialized', () => {
    expect(wrapper.state().type).to.equal('genders');
    expect(wrapper.state().selected).to.equal('');
  });

  it('select on toggle', () => {
    expect(store.getState().numFilters).to.equal(0);
    expect(store.getState().filters.genders).to.eql([]);
    expect(wrapper.state().selected).to.equal('');
    const mButton = wrapper.find('#maleFilter');
    const fButton = wrapper.find('#femaleFilter');

    fButton.simulate('change');
    expect(store.getState().numFilters).to.equal(1);
    expect(store.getState().filters.genders).to.eql(['F']);
    let newProps = {
      type: 'genders',
      selected: 'F',
      filters: {
        'genders': ['F']
      }
    };
    wrapper.setProps(newProps);
    expect(wrapper.state().selected).to.equal('F');
    expect(wrapper.find('.male').hasClass('active')).to.equal(false);
    expect(wrapper.find('.female').hasClass('active')).to.equal(true);

    mButton.simulate('change');
    expect(store.getState().numFilters).to.equal(1);
    expect(store.getState().filters.genders).to.eql(['M']);
    newProps = {
      type: 'genders',
      selected: 'M',
      filters: {
        'genders': ['M']
      }
    };
    wrapper.setProps(newProps);
    expect(wrapper.state().selected).to.equal('M');
    expect(wrapper.find('.male').hasClass('active')).to.equal(true);
    expect(wrapper.find('.female').hasClass('active')).to.equal(false);

    mButton.simulate('change');
    expect(store.getState().numFilters).to.equal(0);
    expect(store.getState().filters.genders).to.eql([]);
    newProps = {
      type: 'genders',
      selected: '',
      filters: {
        'genders': []
      }
    };
    wrapper.setProps(newProps);
    expect(wrapper.state().selected).to.equal('');
    expect(wrapper.find('.male').hasClass('active')).to.equal(false);
    expect(wrapper.find('.female').hasClass('active')).to.equal(false);
  });

});
