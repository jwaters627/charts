import React from 'react';
import ClassNames from 'classnames';

export default class ButtonFilter extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      type: props.type,
      selected: props.filters.sentiment.indexOf(props.name) > -1
    };
  }

  componentWillReceiveProps(newState) {
    let newSelected = newState.filters.sentiment.indexOf(this.props.name) > -1 ? true : false;
    if(newSelected != this.state.selected) {
      this.setState({
        selected: newSelected
      });
    }
  }

  handleButtonSelected(event) {
    this.context.flux.getActions('easyactions').updateFilter({
      type : this.props.type,
      value : this.props.name
    });
    this.setState({
      selected: !this.state.selected
    });
  }

  render() {
    return <div className="sentiment-button-wrap">
      <button className={ClassNames(this.state.selected && 'active')} id={this.props.id} onClick={this.handleButtonSelected.bind(this)}>
             {this.props.label}
      </button>
    </div>
  }
}

ButtonFilter.contextTypes = {
  flux: React.PropTypes.object
};
