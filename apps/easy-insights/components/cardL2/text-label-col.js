import React from 'react';
import classnames from 'classnames';
import {BaseCol} from './base-col';
import OverflowTooltip from '../overflow-tooltip';
import {textDir} from 'ch-ui-lib';

export default class TextLabelCol extends BaseCol {

  constructor (props, context) {
    super(props, context);
    this.state = {
      rowHovered : null
    };
  }

  /* -> dropping row highlighting on hover for now
  onRowEnter(i, ev) {
    this.rowEntered = true;
    !!this.props.onRowHover && this.props.onRowHover(i);
  }

  onRowLeave(i, ev) {
    this.rowEntered = false;
    setTimeout(() => !!this.props.onRowHover && !this.rowEntered && this.props.onRowHover(null));

    <div key={d[this.props.valueKey]} className="item-wrap-bg" onMouseEnter={this.onRowEnter.bind(this, i)} onMouseLeave={this.onRowLeave.bind(this, i)}>
      <Tooltip tooltipText={d[this.props.valueKey]}>
        <div className={classnames('item', d.highlight && 'highlight')} dir={textDir(d[this.props.valueKey])}>{d[this.props.valueKey]}</div>
      </Tooltip>
    </div>
  }*/

  render() {
    const sortLinkClass = classnames('col-title', this.getSortLinkClass(this.props.valueKey));
    return <div className="sticky-column text-label-col content-col">
      <div className="col-head">
        <a className={sortLinkClass} href="javascript:void(0)"
          onClick={this.handleSort.bind(this, this.props.valueKey)}>{this.props.title}</a>
      </div>
      <div className="col-body">
        {this.props.data.map( (d,i) =>
          <OverflowTooltip key={d[this.props.valueKey]+i}>
            <div className={classnames('item', d.highlight && 'highlight')}
              dir={textDir(d[this.props.valueKey])}>
              {d[this.props.valueKey]}</div>
          </OverflowTooltip>
        )}
      </div>
    </div>
  }
}
