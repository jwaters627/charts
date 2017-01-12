import React from 'react';
import classnames from 'classnames';
import {BaseCol} from './base-col';
import OverflowTooltip from '../overflow-tooltip';

const defaultAvatar = 'https://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png';

export default class TwitterUserCol extends BaseCol {
  render() {
    const sortLinkClass = classnames('col-title', this.getSortLinkClass('displayName'));
    return <div className="sticky-column text-label-col content-col">
      <div className="col-head">
        <a className={sortLinkClass} href="javascript:void(0)" onClick={this.handleSort.bind(this, 'displayName')}>{this.props.title}</a>
      </div>
      <div className="col-body">
        {this.props.data.map( (d,i) =>
          <a key={"influencer"+i} className={classnames('influencer-content', d.highlight && 'highlight')} href={'https://twitter.com/'+d.username} target="_blank">
            <img src={d.avatarUrl || defaultAvatar} onError={(e)=>{e.target.src=defaultAvatar}} className="avatar" />
            <div className="author">
              <OverflowTooltip>
                <div className="display-name">{d.displayName || d.username}</div>
              </OverflowTooltip>
              <OverflowTooltip>
                <div className="handle">@{d.username}</div>
              </OverflowTooltip>
            </div>
          </a>
        )}
      </div>
    </div>
  }
}
