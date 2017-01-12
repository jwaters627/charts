import React from 'react';
import {checkOverflow} from '../../utils/utils';
import Tooltip from '../../extra/ttip';

export default class OverflowTooltip extends React.Component {

  initTooltip() {
    let opts = this.props.ttipOptions || {};
    this.ttip = new Tooltip(this.childRef, this.childRef.innerHTML, opts);
  }

  componentDidMount() {
    setTimeout( () => {
      this.isOverFlown = checkOverflow(this.childRef);
      this.isOverFlown && this.initTooltip();
    });
  }

  componentWillUnmount() {
    !!this.ttip && this.ttip.destroy();
  }

  render() {
    return React.cloneElement(React.Children.only(this.props.children), {
        ref: ref => this.childRef = ref
    });
  }
}
