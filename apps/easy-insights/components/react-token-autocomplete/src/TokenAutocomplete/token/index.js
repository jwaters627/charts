import React from 'react';
import {identity, noop} from 'lodash';
import {decorators} from 'peters-toolbelt';
import createFragment from 'react-addons-create-fragment';
import classnames from 'classnames';

require('./styles.scss');

export default class Token extends React.Component {

  constructor(props){
    super(props);
  }

  static displayName = 'Token';

  static propTypes = {
    handleRemove: React.PropTypes.func,
    index: React.PropTypes.number,
    parse: React.PropTypes.func
  }

  static defaultProps = {
    handleRemove: noop,
    parse: identity,
    index: 0,
    fullWidth: false
  }

  onRemoveBtnClick = () => {
    this.props.handleRemove(this.props.index);
  }


  renderRemoveBtn = () => {
    let cl = classnames(
      'remove-btn',
      'token-remove-btn'
    );
    return (
      <div
        className={cl}
        ref="removeBtn"
        className={cl}
        onClick={this.onRemoveBtnClick.bind(this)}>
        &#x00d7;
      </div>
    );
  }

  render() {
    let token = null;
    if(this.props.type == 'locations'){
      token = createFragment({
        description: this.props.value.description
      });
    } else if(this.props.type == 'languages' || 'interests'){
      token = createFragment({
        description: this.props.value.name
      });
    }
    let outerCl = classnames(
      'token-wrapper',
      this.props.fullWidth && 'wrapper-full-width'
    );

    let innerCl = classnames('value');
    return (
      <div ref="wrapper" className={outerCl}>
        <div ref="value" className={innerCl}>
          {token}
        </div>
        { !this.props.fullWidth ? this.renderRemoveBtn() : null}
      </div>
    );
  }
}
