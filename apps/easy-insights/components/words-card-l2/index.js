import React from 'react';
import classnames from 'classnames';
import d3 from 'd3';
import {BaseL2Card, HorizBarCol, TextLabelCol, NetSentimentCol, SentimentBreakdownCol} from '../cardL2';
import T from '../../i18n';
import {chSort} from 'ch-ui-lib';

require('./words-l2.scss');


const oneDecPercent = d3.format('.1%');
const zeroDecPercent = d3.format('.0%');
const numFormat = (n) => n >= 0.1 ? zeroDecPercent(n) : oneDecPercent(n).replace('.0', '');

export default class WordsCardL2 extends BaseL2Card {

  cardClass = 'words-card-l2';
  colHeadHeight = 5.3;
  rowHeight     = 1.63;

  constructor(props, context) {
    super(props, context);
    this.data    = this.props.card.data;
		this.hasData = !!this.data.words && !!this.data.words.length;
    this.state   = {
      sortField : 'pctPosts',
      sortDirec : 'desc',
      doScroll  : false
    };
    this.prepareData();
  }

  prepareData(sortField, direc) {
    sortField = sortField || this.state.sortField;
    direc = direc || this.state.sortDirec;
    direc = sortField === 'word' ? direc : [direc, 'asc'];
    sortField = sortField !== 'word' ? [sortField, 'word'] : 'word';
    let inputData = Object.prototype.toString.call( this.data.words ) === '[object Array]' ? this.data.words : this.data;
    this.sortedData = chSort(inputData, sortField, direc);
  }

  // componentDidUpdate() {
  //   this.componentWillUnmount();
  //   this.componentDidMount();
  // }

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
          <h4 className="card-title">{T('card.words.title')}</h4>
          <span className="sub">({this.sortedData.length})</span>
        </div>

        <div className="table-bars-wrapper heads-with-subs" ref="tableBarsWrapperElem">

          {/* sticky column */}
          <TextLabelCol data={this.sortedData}
            handleSort={this.handleSort.bind(this)}
            prepareData={this.prepareData.bind(this)}
            sortField={this.state.sortField}
            sortDirec={this.state.sortDirec}
            valueKey={'word'}
            title={T('cardL2.words.colWords')}
            onRowHover={this.onRowHover} />

          <div className="table-bars-scroll-container">
            <div className="table-bars-layout">
              <div className="section-col main-section">
                {/*<div className="row-hover-bg" ref="hoverBgElem0" style={{display: 'none'}}></div>*/}
                <div className="content-table">
                  <div className="content-col text-label-col"></div>
                    <HorizBarCol data={this.sortedData}
                      handleSort={this.handleSort.bind(this)}
                      prepareData={this.prepareData.bind(this)}
                      sortField={this.state.sortField}
                      sortDirec={this.state.sortDirec}
                      valueKey="pctPosts"
                      helpText="percentWordPosts"
                      valueFormatter={numFormat}
                      title={T('l2cols.posts.title')}
                      barStart="left"
                      colClass="pct-col" />
                </div>
              </div>

              <div className="section-col additional-section">

                <div className="row-hover-bg" ref="hoverBgElem1" style={{display: 'none'}}></div>

                <div className="content-table">

                  <NetSentimentCol data={this.sortedData}
                    handleSort={this.handleSort.bind(this)}
                    prepareData={this.prepareData.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec}
                    helpText="netSentiment" />

                  <SentimentBreakdownCol data={this.sortedData}
                    handleSort={this.handleSort.bind(this)}
                    prepareData={this.prepareData.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec}
                    helpText="sentimentBreakdown" />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }

}
