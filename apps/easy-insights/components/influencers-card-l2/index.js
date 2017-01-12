import React from 'react';
import classnames from 'classnames';
import d3 from 'd3';
import {BaseL2Card} from '../cardL2';
import MainL2Col from './main-l2-col';
import TwitterUserCol from './twitter-user-col';
import ProfileCol from './profile-col';
import InfluencerBreakdownCol from './influencer-breakdown-col';
import T from '../../i18n';
import {chSort} from 'ch-ui-lib';
import {sanitizeUrl} from '../../utils/utils';

require('./influencers-l2.scss');

const oneDecFloat   = d3.format('.1f');
const scoreFormat   = v => oneDecFloat(v*100);
const defaultProfileText = T('card.influencers.defaultProfileText');
const defaultAvatar = 'https://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png';
const defaultHandle = T('card.influencers.defaultHandle');

export default class InfluencersCardL2 extends BaseL2Card {

  cardClass = 'influencers-card-l2';

  constructor(props, context) {
    super(props, context);
    this.data    = this.props.card.data;
		this.hasData = !!this.data.topInfluencers && !!this.data.topInfluencers.length;
    this.state  = {
      sortField : 'influenceScore',
      sortDirec : 'desc',
      doScroll  : false
    };

    if (this.hasData) {
      this.data.topInfluencers = this.data.topInfluencers.map( inf => {
        inf.profileDescription = inf.profileDescription === null ? defaultProfileText : inf.profileDescription;
        inf.avatarUrl = inf.avatarUrl === null ? defaultAvatar : sanitizeUrl(inf.avatarUrl);
        inf.username = inf.username === null ? defaultHandle : inf.username;
        inf.displayName = inf.displayName === null ? inf.username : inf.displayName;
        return inf;
      })
    }
    this.prepareData();
  }

  prepareData(sortField, direc) {
    sortField = sortField || this.state.sortField;
    direc = direc || this.state.sortDirec;
    direc = sortField === 'username' ? direc : [direc, 'asc'];
    sortField = sortField !== 'username' ? [sortField, 'username'] : 'username';
    let inputData = Object.prototype.toString.call( this.data.topInfluencers ) === '[object Array]' ? this.data.topInfluencers : this.data;
    this.sortedData = chSort(inputData, sortField, direc);
  }

  handleSort(field) {
    let direc = 'desc';
    if (field == this.state.sortField) {
      direc = this.state.sortDirec === 'asc' ? 'desc' : 'asc';
    }
    this.prepareData(field, direc);
    this.setState({sortField: field, sortDirec: direc});
  }

  renderCardContent() {
    return (
      <div className="card-block card-content">
        <div className="title-wrap">
          <h4 className="card-title">{T('card.topInfluencers.title')}</h4>
          <span className="sub">({this.sortedData.length})</span>
        </div>

        <div className="table-bars-wrapper heads-with-subs" ref="tableBarsWrapperElem">

          {/* sticky column */}
          <TwitterUserCol data={this.sortedData}
            handleSort={this.handleSort.bind(this)}
            sortField={this.state.sortField}
            sortDirec={this.state.sortDirec}
            colClass="influence-col"
            title={T('cardL2.influencers.influencerCol')} />

          <div className="table-bars-scroll-container">
            <div className="table-bars-layout">
              <div className="section-col main-section">
                <div className="content-table">
                  <div className="content-col text-label-col"></div>
                  <MainL2Col data={this.sortedData}
                    handleSort={this.handleSort.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec}
                    valueKey="influenceScore"
                    helpText="influenceScore"
                    valueFormatter={scoreFormat}
                    title="Influencer Score"
										barStart="left"
                    influencer="true"
										colClass="influence-col" />

                  <InfluencerBreakdownCol data={this.sortedData}
                    handleSort={this.handleSort.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec} />

                  <ProfileCol data={this.sortedData}
                    handleSort={this.handleSort.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec}
                    colClass="influence-col"
                    title={T('cardL2.influencers.influencerProfileCol')} />

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>);
  }
}
