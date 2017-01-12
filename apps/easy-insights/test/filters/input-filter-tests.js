import React from 'react';
import {shallow, mount, render} from 'enzyme';
import {expect} from 'chai';
import TokenAutocomplete from '../../components/react-token-autocomplete/src/TokenAutocomplete';

const data = require('./locations.json');
const wrapper = shallow(<TokenAutocomplete />);

describe('TokenAutocomplete', () => {

  it('should have placeholder prop defined', () => {
    expect(wrapper.props().placeholder).to.be.defined;
  });

  it('input value is initialized', () => {
    expect(wrapper.state().inputValue).to.equal('');
  });

  it('should set input value', () => {
    const wrapper = mount(<TokenAutocomplete />);
    const input = wrapper.find('input');
    input.simulate('change', {target: {value: 'Germany'}});
    expect(wrapper.state().inputValue).to.equal('Germany');
    input.simulate('change', {target: {value: ''}});
    expect(wrapper.state().inputValue).to.equal('');
  });

  it('should render option list', () => {
    const wrapper = mount(<TokenAutocomplete />);
    const input = wrapper.find('input');
    input.simulate('change', {target: {value: 'test'}});
    input.simulate('click');
    expect(wrapper.find('OptionList')).to.have.length(1);
  })

  it('should return correct result germany', () => {
    const props = {
      options: data,
      type: 'locations'
    };
    const wrapper = mount(<TokenAutocomplete {...props}/>);
    const input = wrapper.find('input');
    input.simulate('change', {target: {value: 'germany'}});
    input.simulate('focus');
    expect(wrapper.find('Option')).to.have.length(1);
  });

  it('should return correct result deu', () => {
    const props = {
      options: data,
      type: 'locations'
    };
    const wrapper = mount(<TokenAutocomplete {...props}/>);
    const input = wrapper.find('input');
    input.simulate('change', {target: {value: 'deu'}});
    input.simulate('focus');
    expect(wrapper.find('Option')).to.have.length(1);
  });

  it('should return correct result new york', () => {
    const props = {
      options: data,
      type: 'locations'
    };
    const wrapper = mount(<TokenAutocomplete {...props}/>);
    const input = wrapper.find('input');
    input.simulate('change', {target: {value: 'new york'}});
    input.simulate('focus');
    expect(wrapper.find('Option')).to.have.length(2);
  });

  it('should return correct result paris', () => {
    const props = {
      options: data,
      type: 'locations'
    };
    const wrapper = mount(<TokenAutocomplete {...props}/>);
    const input = wrapper.find('input');
    input.simulate('change', {target: {value: 'paris'}});
    input.simulate('focus');
    expect(wrapper.find('Option')).to.have.length(1);
  });

  it('should return correct result pasadena', () => {
    const props = {
      options: data,
      type: 'locations'
    };
    const wrapper = mount(<TokenAutocomplete {...props}/>);
    const input = wrapper.find('input');
    input.simulate('change', {target: {value: 'pasadena'}});
    input.simulate('focus');
    expect(wrapper.find('Option')).to.have.length(2);
  });

  it('should update option list', () => {
    const props = {
      options: data,
      type: 'locations'
    };
    const wrapper = mount(<TokenAutocomplete {...props}/>);
    const input = wrapper.find('input');
    input.simulate('change', {target: {value: 'new'}});
    input.simulate('focus');
    expect(wrapper.find('Option')).to.have.length(4);
    input.simulate('change', {target: {value: 'new york'}});
    input.simulate('focus');
    expect(wrapper.find('Option')).to.have.length(2);
  });

});
