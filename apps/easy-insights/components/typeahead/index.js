import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import T from '../../i18n';
import _ from 'lodash';

require('./typeahead.scss');

const keyCodes = {
  ENTER: 13,
  UP: 38,
  DOWN: 40,
  BACKSPACE: 8,
  ESC: 27
};

export default class Typeahead extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selected : 0,
      currValue: this.props.value,
      currOptions: this.props.values
    };
  }

  componentWillReceiveProps(newProps) {
    if(newProps.value != this.props.value && !!newProps.value){
      let newOptions = this.filterValues(newProps.value);
       this.setState({
        currOptions: newOptions,
        selected: 0
      });
    } else if(newProps.value != this.props.value && newProps.value == '') {
      this.setState({
        currOptions: this.props.values
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.selected != this.state.selected) return true;
    if (nextProps.value != this.props.value) return true;
    if (nextProps.values != this.props.values) return true;
    if (nextState.currOptions != this.state.currOptions) return true;
    return false;
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
        case keyCodes.ENTER :
          this.enterSelection();
          e.preventDefault();
          break;
      }
  }

  enterSelection(){
    this.state.selected > 0 ?  this.props.onSelect(this.state.currOptions[this.state.selected]) :
      this.props.onEnter();
  }

  selectNext = () => {
    let options = !!this.state.currOptions ? this.state.currOptions : this.props.values;
    this.setState({
         selected: this.state.selected === options.length - 1
           ? 0
           : this.state.selected + 1
    });
    this.props.setSelected(options[this.state.selected])
    this.scrollIntoView();
  }

  selectPrev = () => {
    let options = !!this.state.currOptions ? this.state.currOptions : this.props.values;
    this.setState({
      selected: !this.state.selected
        ? options.length - 1
        : this.state.selected - 1
    });
    this.props.setSelected(options[this.state.selected])
    this.scrollIntoView();
  }

  scrollIntoView = () => {
    let curr = this.getSelected();
    let elem = null;
    for(var ref in this.refs){
      if(this.refs[ref].innerText == curr){
        elem = this.refs[ref];
        break;
      }
    }
    if(!!elem){
      let selected = ReactDOM.findDOMNode(elem);
      selected.scrollIntoView(false);
    }
  }

  getSelected = () => {
    let options = !!this.state.currOptions ? this.state.currOptions : this.props.values;
    return options[this.state.selected];
  }

  filterValues(newValue) {
    let initialValue = newValue.trim().toLowerCase();
    let valueLength = initialValue.length;
    let matchingValues = this.props.values;

    if(valueLength > 0) {
      matchingValues = this.props.values.filter(function(value, idx){
        if(value.trim().toLowerCase().indexOf(initialValue) > -1) {
          return value;
        }
      });
    }

    return matchingValues;
  }

  removeOtherSelected(e){
    if(e.target.className != 'selected') {
      //remove selected class from other nodes
      for(var ref in this.refs){
        if(this.refs[ref].className == 'selected'){
          this.refs[ref].className = '';
        }
      }

      //select the curr element
      e.target.className = 'selected';
      let currValue = e.target.innerText;

      // find location inside list
      let currSelected = 0;
      for(var i = 0; i < this.state.currOptions.length; i++){
        if(this.state.currOptions[i] == currValue){
          currSelected = i;
        }
      }

      // set selected state to that index
      this.setState({
        selected: currSelected
      });
      this.props.setSelected(this.state.currOptions[currSelected])
    }
  }

  renderMatching(matching) {
      let options =  matching.map(function(value, idx){
        const rowClass = ClassNames(
          this.state.selected == idx ? 'selected' : ''
        );

        return <li ref={'value'+ idx}
            className={rowClass}
            onClick={this.clickedSelectedRow.bind(this)}
            onMouseDown={this.clickedSelectedRow.bind(this)}
            onMouseOver={this.removeOtherSelected.bind(this)}
            key={'value'+ idx}>{value}
          </li>;
      }, this);
      options.unshift(<li ref="firstRow" className="initial" key={'list-header-most-recent'}>{T('searchBar.recentSearches.header')}</li>);

      return options;
  }

  clickedSelectedRow(event) {
    this.props.rowClicked(event);
  }

  render() {
    const typeaheadClass = ClassNames({
      'results'             : this.props.resultsMode,
      'typeahead-container' : true
    });
    return (this.state.currOptions.length > 0 && <div ref="typeahead-container" className={typeaheadClass}>
            <ul>
              {this.renderMatching(this.state.currOptions)}
            </ul>
        </div>);
   }
}
