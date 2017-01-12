import React from 'react';
import classnames from 'classnames';
import d3 from 'd3';
import {BaseL2Card, HorizBarCol, TextLabelCol, NetSentimentCol, SentimentBreakdownCol} from '../cardL2';
import T from '../../i18n';
import {chSort} from 'ch-ui-lib';

require('./interests-l2.scss');

const oneDecPercent   = d3.format('.1%');
const defaultPercent  = v => oneDecPercent(v).replace('100.0', '100');
const oneDecFloat     = d3.format('.1f');
const zeroDecFloat    = d3.format('.0f');
const relevanceFormat = v => oneDecFloat(v).replace('-0.0', '0');
const affinityFormat  = v => (v >= 100 ? zeroDecFloat(v) : oneDecFloat(v)).replace('-0.0', '0.0') + 'x';


export default class InterestsCardL2 extends BaseL2Card {

  cardClass = 'interests-card-l2';
  colHeadHeight = 2.7;
  rowHeight     = 1.63;

  constructor(props, context) {
    super(props, context);
    this.data    = this.props.card.data;
		this.hasData = !!this.data.interests && !!this.data.interests.length;
    this.state  = {
      sortField : 'pctUniqueAuthors',
      sortDirec : 'desc',
      doScroll  : false
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
    direc = sortField === 'name' ? direc : [direc, 'asc'];
    sortField = sortField !== 'name' ? [sortField, 'name'] : 'name';
    let inputData = Object.prototype.toString.call( this.data.interests ) === '[object Array]' ? this.data.interests : this.data;
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
          <h4 className="card-title">{T('card.interests.title')}</h4>
          <span className="sub">({this.sortedData.length})</span>
        </div>

        <div className="table-bars-wrapper" ref="tableBarsWrapperElem">

          {/* sticky column */}
          <TextLabelCol data={this.sortedData}
            handleSort={this.handleSort.bind(this)}
            prepareData={this.prepareData.bind(this)}
            sortField={this.state.sortField}
            sortDirec={this.state.sortDirec}
            valueKey={'name'}
            title={T('cardL2.interests.colInterest')}
            onRowHover={this.onRowHover} />

          <div className="table-bars-scroll-container">
            <div className="table-bars-layout">
              <div className="section-col main-section">
                {/*<div className="row-hover-bg" ref="hoverBgElem0" style={{display: 'none'}}></div>*/}
                <div className="content-table">
                  <div className="content-col text-label-col"></div>
                  {/* <HorizBarCol data={this.sortedData}
                    handleSort={this.handleSort.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec}
                    valueKey="relevanceScore"
                    helpText="relevance"
                    valueFormatter={relevanceFormat}
                    barLegendTriptic={[
                      T('legends.relevance.toGenPop'),
                      T('legends.relevance.equally'),
										  T('legends.relevance.toGroup')
                    ]}
                    title={T('l2cols.relevance.title')}
										barStart="middle"
										colClass="relevance-col" /> */}

                  {/* }<HorizBarCol data={this.sortedData}
                    handleSort={this.handleSort.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec}
                    displayValueKey="displayAffinity"
                    valueKey="affinity"
                    helpText="affinity"
                    valueFormatter={affinityFormat}
                    barLegendTriptic={[
                      T('legends.affinity.toGenPop'),
                      T('legends.affinity.equally'),
										  T('legends.affinity.toGroup')
                    ]}
                    title={T('l2cols.affinity.title')}
										barStart="middle"
										invertLblPos={true}
										colClass="affinity-col" /> */ }

                  <HorizBarCol data={this.sortedData}
                    handleSort={this.handleSort.bind(this)}
                    prepareData={this.prepareData.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec}
                    helpText="percentAudience"
                    valueKey="pctUniqueAuthors"
                    valueFormatter={defaultPercent}
                    title={T('l2cols.audience.title')}
										colClass="unique-authors-col" />

                </div>
              </div>

              {/*<div className="section-col additional-section">
                <div className="content-table">

                  <NetSentimentCol data={this.sortedData}
                    handleSort={this.handleSort.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec} />

                  <SentimentBreakdownCol data={this.sortedData}
                    handleSort={this.handleSort.bind(this)}
                    sortField={this.state.sortField}
                    sortDirec={this.state.sortDirec} />

                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>);
  }
}
