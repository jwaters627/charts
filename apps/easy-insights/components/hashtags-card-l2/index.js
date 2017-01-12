import React from 'react';
import classnames from 'classnames';
import d3 from 'd3';
import {chSort} from 'ch-ui-lib';
import {BaseL2Card, HorizBarCol, TextLabelCol} from '../cardL2';
import T from '../../i18n';
import {defaultPercent} from '../../formats';

require('./hashtags-l2.scss');

export default class HashtagsCardL2 extends BaseL2Card {

  cardClass = 'hashtags-card-l2';
  colHeadHeight = 2.7;
  rowHeight     = 1.63;

  constructor(props, context) {
    super(props, context);
    this.data    = this.props.card.data;
		this.hasData = !!this.data.hashtags && !!this.data.hashtags.length;
    this.state   = {
      sortField  : 'pctPosts',
      sortDirec  : 'desc',
      doScroll   : false,
      rowHovered : null,
    };
    this.prepareData();
  }

  // componentDidUpdate() {
  //   this.componentWillUnmount();
  //   this.componentDidMount();
  // }

  prepareData(sortField, direc) {
    sortField = sortField || this.state.sortField;
    direc = direc || this.state.sortDirec;
    direc = sortField === 'hashtag' ? direc : [direc, 'asc'];
    sortField = sortField !== 'hashtag' ? [sortField, 'hashtag'] : 'hashtag';
    let inputData = Object.prototype.toString.call( this.data.hashtags ) === '[object Array]' ? this.data.hashtags : this.data;
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
          <h4 className="card-title">{T('card.hashtags.title')}</h4>
          <span className="sub">({this.sortedData.length})</span>
        </div>

        <div className="table-bars-wrapper" ref="tableBarsWrapperElem">

          {/* sticky column */}
          <TextLabelCol data={this.sortedData}
            prepareData={this.prepareData.bind(this)}
            handleSort={this.handleSort.bind(this)}
            sortField={this.state.sortField}
            sortDirec={this.state.sortDirec}
            valueKey={'hashtag'}
            title={T('cardL2.hashtags.htCol')}
            onRowHover={this.onRowHover} />

          <div className="table-bars-scroll-container">
            <div className="table-bars-layout">
              <div className="section-col main-section">
                {/*<div className="row-hover-bg" ref="hoverBgElem0" style={{display: 'none'}}></div>*/}
                <div className="content-table">
                  <div className="test-item"></div>
                  <div className="content-col text-label-col"></div>
                  <HorizBarCol data={this.sortedData}
                    prepareData={this.prepareData.bind(this)}
                    handleSort={this.handleSort.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec}
                    valueKey="pctPosts"
                    helpText="percentHashtagPosts"
                    title={T('l2cols.posts.title')}
                    barStart="left"
                    colClass="pct-col" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}
