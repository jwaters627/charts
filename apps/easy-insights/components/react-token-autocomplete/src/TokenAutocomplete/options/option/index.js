import React from 'react';
import {noop, identity} from 'lodash';
import {decorators} from 'peters-toolbelt';
import classnames from 'classnames';

require('./styles.scss');

export default class Option extends React.Component {

  static displayName = 'Option';

  static propTypes = {
    selected: React.PropTypes.bool,
    index: React.PropTypes.number,
    handleSelect: React.PropTypes.func,
    handleClick: React.PropTypes.func,
    parse: React.PropTypes.func
  }

  static defaultProps = {
    handleSelect: noop,
    handleClick: noop,
    selected: false,
    index: 0,
    parse: identity
  }

  onMouseEnter = () => {
    this.props.handleSelect(this.props.index);
  }

  onClick = () => {
    this.props.handleClick(this.props.index);
  }

  render() {
    let cl = classnames(
      this.props.selected && 'selected',
      'option'
    );
    return (
      <div
        ref="option-wrapper"
        onClick={this.onClick.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        className={cl}>
          {this.props.parse(this.props.value)}
      </div>
    );
  }
}
Option.displayName = 'Option';
