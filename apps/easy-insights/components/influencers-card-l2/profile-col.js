import React from 'react';
import classnames from 'classnames';
import {BaseCol} from './base-col';
import {textDir} from 'ch-ui-lib';

export default class ProfileCol extends BaseCol {
  render() {
    const profileClass = classnames('col-title');
    return <div className="profile-col content-col">
      <div className="col-head">
        <span className={profileClass}>{this.props.title}</span>
      </div>
      <div className="col-body">
        {this.props.data.map( (d,i) =>
          <div key={"profile-influencer" + i} className={classnames('influencer-content', d.highlight && 'highlight')}>
            <div className={classnames('item')} dir={textDir(d.profileDescription)}>{d.profileDescription}</div>
          </div>
        )}
      </div>
    </div>
  }
}
