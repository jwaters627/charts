import React from 'react';
import classnames from 'classnames';
import {formatSmartText} from '../../utils/utils';
import HorizBarCol from './horiz-bar-col';
import NetSentimentCol from './net-sentiment-col';
import SentimentBreakdownCol from './sentiment-breakdown-col';
import TextLabelCol from './text-label-col';

require('./level2.scss');

export {HorizBarCol, NetSentimentCol, SentimentBreakdownCol, TextLabelCol};

export class BaseL2Card extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  /*onRowHover(row) {
    for (let i of [0,1]) {
      if (this.refs['hoverBgElem'+i]) {
        let elem = this.refs['hoverBgElem'+i];
        elem.style.display = row !== null ? 'block' : 'none';
        if (row !== null ) elem.style.top = (this.colHeadHeight + row * this.rowHeight)+'rem';
      }
    }
  }*/

  render() {
    return (
      <div className={classnames('ei-card ei-card-l2', this.cardClass, !this.hasData && 'no-data')}>
        <div className="card-block text-center card-head">
          <div className="msg" dangerouslySetInnerHTML={{__html: formatSmartText(this.props.card.message || 'No message :(')}}></div>
        </div>
        {this.hasData && this.renderCardContent()}
      </div>
    );
  }
}
