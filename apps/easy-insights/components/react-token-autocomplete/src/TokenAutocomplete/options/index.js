import React from 'react';
import ReactDOM from 'react-dom';
import {noop, map} from 'lodash';
import keyCodes from '../utils/keyCodes';
import Option from './option';
import {decorators} from 'peters-toolbelt';

require('./styles.scss');

export default class OptionList extends React.Component {

  static displayName = 'Option List';

  static propTypes = {
    options: React.PropTypes.array,
    alreadySelected: React.PropTypes.array,
    term: React.PropTypes.string
  }

  static defaultProps = {
    options: [],
    term: '',
    emptyInfo: 'no suggestions',
    handleAddSelected: noop
  }

  state = {
    selected: 0,
    suggestions: []
  }

  componentDidMount() {
    if (window) {
      window.addEventListener('keydown', this.onKeyDown);
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('keydown', this.onKeyDown);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.options.length <= this.state.selected) {
      this.setState({selected: newProps.options.length - 1});
    }

    if (!newProps.options.length) {
      this.setState({selected: 0});
    }
  }

  onKeyDown = e => {
    switch (e.keyCode) {
      case keyCodes.UP :
        this.selectPrev();
        e.preventDefault();
        break;
      case keyCodes.DOWN :
        this.selectNext();
        e.preventDefault();
        break;
    }
  }

  renderOption = (option, index) => {
    let optionDisplay = option.name;
    if(this.props.type == 'locations'){
      optionDisplay = option.description;
    }

    return (
      <Option
        key={index}
        ref={'option' + index}
        index={index}
        parse={this.parseOption}
        handleClick={this.handleClick}
        handleSelect={this.handleSelect}
        value={optionDisplay}
        selected={index === this.state.selected}/>
    );
  }

  renderOptions() {
    let data = this.props.options;
    return map(data, (option, index) => {
      return this.renderOption(option, index);
    });
  }

  selectNext = () => {
    this.setState({
         selected: this.state.selected === this.props.options.length - 1
           ? 0
           : this.state.selected + 1
    });
    this.scrollIntoView();
  }

  selectPrev = () => {
    this.setState({
      selected: !this.state.selected
        ? this.props.options.length - 1
        : this.state.selected - 1
    });
    this.scrollIntoView();
  }

  scrollIntoView() {
    let curr = this.getSelected();
    let searchTerm = this.props.type == 'locations' ? curr.description : curr.name;

    let elem = null;
    for(var ref in this.refs){
      if(this.refs[ref].props.value == searchTerm){
        elem = this.refs[ref];
        break;
      }
    }
    if(!!elem){
      let selected = ReactDOM.findDOMNode(elem);
      selected.scrollIntoView(false);
    }
  }

  handleSelect = index => {
    this.setState({
      selected: index,
      a: '123'
    });
  }

  handleClick = index => {
    this.props.handleAddSelected(this.props.options[index]);
  }

  getSelected = () => {
    let selected = this.props.options[this.state.selected];
    this.props.onSelect(selected);
    return selected;
  }

  renderEmptyInfo() {
    return <div ref="emptyInfo" className="empty-info">{this.props.emptyInfo}</div>;
  }

  render() {
    const displayEmptyInfo = !this.props.options.length;
    return (
      <div ref="wrapper" className="options-wrapper">
        {displayEmptyInfo ? this.renderEmptyInfo() : this.renderOptions() }
      </div>
    );
  }
}

OptionList.displayName = 'OptionList';
