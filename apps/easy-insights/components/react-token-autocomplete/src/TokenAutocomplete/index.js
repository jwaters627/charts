import React from 'react';
import ReactDOM from 'react-dom';
import OptionList from './options';
import Token from './token';
import {includes, difference, filter, noop, identity, isArray, isUndefined, isEmpty} from 'lodash';
import {contains} from 'underscore.string';
import Immutable from 'immutable';
import keyCodes from './utils/keyCodes';
import TypeUtil from './utils/type';
import classnames from 'classnames';

require('./styles.scss');

function defaultValuesPropType(props, propName, component) {
  const prop = props[propName];

  if (props.simulateSelect && isArray(prop) && prop.length > 1) {
      return new Error(
        'when props.simulateSelect is set to TRUE, you should pass more than a single value in props.defaultValues'
      );
  }

  return React.PropTypes.array(props, propName, component);
}

function tresholdPropType(props, propName, component) {
  const prop = props[propName];

  if (props.simulateSelect && prop > 0) {
      return new Error(
        'when props.simulateSelect is set to TRUE, you should not pass non-zero treshold'
      );
  }

  return React.PropTypes.number(props, propName, component);
}

export default class TokenAutocomplete extends React.Component {

  static displayName = 'TokenAutocomplete';

  static propTypes = {
    //initial state
    options: React.PropTypes.array,
    placeholder: React.PropTypes.string,
    treshold: tresholdPropType,
    defaultValues: defaultValuesPropType,
    processing: React.PropTypes.bool,
    focus: React.PropTypes.bool,
    //behaviour
    filterOptions: React.PropTypes.bool,
    simulateSelect: React.PropTypes.bool,
    limitToOptions: React.PropTypes.bool,
    parseOption: React.PropTypes.func,
    parseToken: React.PropTypes.func,
    parseCustom: React.PropTypes.func,
    //handles
    onInputChange: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    onRemove: React.PropTypes.func
  }

  static contextTypes = {
  }

  static defaultProps = {
    //initial state
    options: [],
    defaultValues: [],
    placeholder: 'add new tag',
    treshold: 0,
    focus: false,
    processing: false,
    //behaviour
    filterOptions: true,
    simulateSelect: false,
    limitToOptions: false,
    parseOption: identity,
    parseToken: identity,
    parseCustom: identity,
    //handles
    onInputChange: noop,
    onAdd: noop,
    onRemove: noop
  }

  state = {
    focused: false,
    inputValue: '',
    values: Immutable.List([]),
    empty: false,
    hideInput: false,
    selectedOption: null
  }


  //LIFECYCLE

  componentDidMount() {
    let values = Immutable.List(this.props.defaultValues);
    this.setState({values});

    if (!isUndefined(this.props.focus)) {
      this.setState({focused: this.props.focus});
    }

    if (this.props.focus) {
      this.bindListeners();
    }

    if (window) {
      window.addEventListener('click', this.handleClick);
    }

  }

  componentWillReceiveProps(newProps) {
    if(newProps.empty && newProps.empty != this.props.empty) {
      this.setState({
        values: Immutable.List([]),
        empty: newProps.empty,
        hideInput: false
      });
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('click', this.handleClick);
    }
    this.unbindListeners();
  }

  bindListeners() {
    if (!this.keyDownListener) {
      this.keyDownListener = window.addEventListener('keydown', this.onKeyDown);
    }
  }

  unbindListeners() {
    window.removeEventListener('keydown', this.onKeyDown);
    delete this.keyDownListener;
  }

  //EVENT HANDLERS

  onInputChange = e => {
    this.props.onInputChange(e.target.value);
    this.setState({
      inputValue: e.target.value,
      selectedOption: null
    });

  }

  onKeyDown = e => {
    switch (e.keyCode) {
      case keyCodes.ESC:
        this.blur();
        break;
      case keyCodes.ENTER:
        this.addSelectedValue();
        break;
      case keyCodes.BACKSPACE:
        if (!this.state.inputValue.length) {
          this.setState({
            inputValue: this.state.inputValue.slice(0, -1)
          });
          this.deleteValue(this.state.values.size - 1);
          e.preventDefault();

        }
        break;
    }
  }

  handleSelected = e => {
    this.setState({
      selectedOption: e
    });
  }

  handleClick = e => {
    const clickedOutside = !ReactDOM.findDOMNode(this).contains(e.target);
     if (clickedOutside && this.state.focused) {
       if(this.state.values.size > 0){
         this.setState({ hideInput: true });
       }
        this.blur();
     }

     if (!clickedOutside && !this.state.focused) {
       this.focus();
     }
   }

  //ACTIONS

  focus = () => {
    if (this.refs.input) {
      ReactDOM.findDOMNode(this.refs.input).focus();
    }
    this.bindListeners();
    this.setState({focused: true, hideInput: false }, function(){ReactDOM.findDOMNode(this.refs.input).focus()});
  }

  blur = () => {
    if (this.refs.input) {
      ReactDOM.findDOMNode(this.refs.input).blur();
    }

    this.unbindListeners();
    this.setState({focused: false});
  }

  deleteValue = index => {
    const valueRemoved = this.state.values.get(index);
    const values = this.state.values.delete(index);
    this.props.onRemove(valueRemoved);

    this.setState({values});
    this.focus();
  }

  addSelectedValue = option => {
    const areOptionsAvailable = this.getAvailableOptions().length;
    let newValue = null;
    let currSelected = !!option ? option : this.state.selectedOption;
    newValue = areOptionsAvailable && currSelected == null ? this.getAvailableOptions()[0] : currSelected;

    const isAlreadySelected = includes(this.state.values.toArray(), newValue);
    const shouldAddValue = !!newValue && !isAlreadySelected;
    if (shouldAddValue) {
      let values = this.props.simulateSelect
        ? Immutable.List([newValue])
        : this.state.values.push(newValue);

      this.props.onAdd(newValue);
      this.setState({
        values: values,
        inputValue: '',
        selectedOption: null
      });

    }

    if (this.props.simulateSelect) {
      this.blur();
    } else {
      this.focus();
    }

  }

  //HELPERS

  removeUnsupported = (results) => {
    let supported = results.filter(function(option){
      if(option.supported){
        return option;
      }
    });

    return supported;
  }

  getAvailableOptions = () => {
    let value = this.state.inputValue.toLowerCase().trim();
    let options = this.props.options;
    let valueLength = value.length;
    let results = [];
    let type = new TypeUtil();
    if(valueLength > 0){
      // language filter
      if(this.props.type == 'languages'){
        let languageResults = options.filter(function(option){
          let searchName = option.name.toLowerCase();
          let subsetName = searchName.substring(0, valueLength);
          if(subsetName == value){
            return option;
          }
        });
        // sort by supported/unsupported here
        let intermediateResults = difference(languageResults, this.state.values.toArray());
        results = this.removeUnsupported(intermediateResults);
      }
      // interests filter
      if(this.props.type == 'interests'){
        let interestsResults = options.filter(function(option){
          let searchName = option.name.toLowerCase();
          let subsetName = searchName.substring(0, valueLength);
          let hasMatchingToken = type.isInSearch(value, valueLength, option.name);
          if(subsetName == value || hasMatchingToken){
            return option;
          }
        });

        interestsResults = difference(interestsResults, this.state.values.toArray());
        if(interestsResults.length > this.props.maxVisible){
          results = interestsResults.splice(0, this.props.maxVisible);
        } else {
          results = interestsResults;
        }
      }

      // locations filter
      if(this.props.type == 'locations'){
        let countryResults = options.filter(function(option) {
          let searchTokens = (option.search).toLowerCase().split(' ');
          let lastTok = searchTokens.pop();
          let searchIn = [searchTokens.join(' '), lastTok];
          for (let i = 0; i < searchIn.length; i++) {
            let idx = searchIn[i].indexOf(value);
            if (option.type == 'COUNTRY' && idx === 0) {
              return option;
            }
          }
        });

        let regionResults = options.filter(function(option) {
          let hasMatchingToken = type.isInSearch(value, valueLength, option.search);
          if(option.type == 'REGION' && hasMatchingToken){
            return option;
          }
        });

        let stateResults = options.filter(function(option) {
          let hasMatchingToken = type.isInSearch(value, valueLength, option.search);
          if(option.type == 'STATE' && hasMatchingToken){
            return option;
          }
        });

        let urbanAreaResults = options.filter(function(option) {
          let hasMatchingToken = type.isInSearch(value, valueLength, option.search);
          if(option.type == 'URBAN_AREA' && hasMatchingToken){
            return option;
          }
        });

        let totalLocations = countryResults.concat(regionResults).concat(stateResults).concat(urbanAreaResults);
        totalLocations = difference(totalLocations, this.state.values.toArray());
        if(totalLocations.length > this.props.maxVisible){
          results = totalLocations.splice(0, this.props.maxVisible);
        } else {
          results = totalLocations;
        }
      }
    }
    else {
      results = difference(this.props.options, this.state.values.toArray()).splice(0, this.props.maxVisible);
      if(this.props.type == 'languages'){
        results = this.removeUnsupported(results);
      }
    }
    return results;
  }

  shouldAllowCustomValue = () => {
    return !this.props.limitToOptions && !this.props.simulateSelect;
  }

  shouldShowOptions = () => {
    return this.isTresholdReached() && this.state.focused;
  }

  shouldShowInput = () => {
    return this.props.filterOptions && (!this.props.simulateSelect || !this.state.values.size);
  }

  shouldShowFakePlaceholder = () => {
    return !this.shouldShowInput() && !this.state.values.size;
  }

  isTresholdReached = () => {
    return this.state.inputValue.length >= this.props.treshold;
  }

  //RENDERERS

  renderOptionsDropdown = () => {
    if (this.shouldShowOptions()) {
      let passProps = {
          options: this.getAvailableOptions(),
          term: this.state.inputValue,
          handleAddSelected: this.addSelectedValue,
          parseOption: this.props.parseOption,
          type: this.props.type
      };
      return <OptionList ref="options"
        onSelect={this.handleSelected.bind(this)}
        {...passProps}/>;
    } else {
      return null;
    }
  }

  renderTokens = () => {
    return this.state.values.map((value, key) => {
      return (
        <Token
          key={key}
          ref={'token' + key}
          type={this.props.type}
          index={key}
          value={value}
          fullWidth={this.props.simulateSelect}
          parse={this.props.parseToken}
          handleRemove={this.deleteValue}/>
      );
    });
  }

  renderProcessing = () => {
    return this.props.processing ? <div ref='processing' className='processing'/> : null;
  }

  renderFakePlaceholder = () => {
    return this.shouldShowFakePlaceholder()
      ? (<div
          ref="fakePlaceholder"
          className='fake-placeholder'>
            {this.props.placeholder}
         </div>)
      : null;
  }

  renderInput = () => {
    let placeholder = this.props.placeholder;
    if(this.state.values.size > 0) {
      placeholder = '';
    }

    return this.shouldShowInput()
      ? (<input
          className={this.state.hideInput && 'hide'}
          onFocus={this.focus}
          onChange={this.onInputChange.bind(this)}
          value={this.state.inputValue}
          placeholder={placeholder}
          ref="input"/>)
      : this.renderFakePlaceholder();
  }

  renderDropdownIndicator = () => {
    return this.props.simulateSelect
      ? <div ref="dropdownIndicator" className='dropdown-indicator' />
      : null;
  }

  render() {
    let isEmpty = this.state.values.size > 0 ? false : true;
    let showDropdown = this.state.inputValue.length > 0 ? true : false;
    let cl = classnames(
      'input-wrapper',
      this.state.focused && 'focus',
      !isEmpty && 'non-empty-input'
    );
    return (
      <div ref="wrapper" className="wrapper">
        <div ref="inputWrapper"
          onClick={this.focus}
          className={cl}>
          {this.renderTokens()}
          {this.renderInput()}
          {this.renderProcessing()}
          {this.renderDropdownIndicator()}
        </div>
        {showDropdown ? this.renderOptionsDropdown() : ''}
      </div>
    );

  }

}
