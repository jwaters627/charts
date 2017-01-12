import React from 'react';
import {formatSmartText} from '../../utils/utils';
import classnames from 'classnames';
import {format} from 'd3';
import BaseCard from '../card';
import T from '../../i18n';
import {chSort, textDir} from 'ch-ui-lib';
import OverflowTooltip from '../overflow-tooltip';

require('./words.scss');

let oneDecPercent = format('.1%');
let zeroDecPercent = format('.0%');
let numFormat = (n) => n >= 0.1 ? zeroDecPercent(n) : oneDecPercent(n).replace('.0', '');

export default class Card extends BaseCard {

	hasPNGExport     = true;
	hasL2Link 	     = true;
	cardClass        = 'words-card';
	cardDisplayName  = 'Words';

	constructor(props) {
		super(props);
		this.data    = chSort(this.props.card.data.wordData, ['percentage', 'word'], ['desc', 'asc']);
		this.hasData = !!this.data && !!this.data.length;

		this.state = {numColumns: window.innerWidth > 440 && window.innerWidth <= 768 ? 3 : 2};
	}

	componentDidMount() {
		this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    setTimeout(()=>this.handleCardMounted(), 50);
  }

	handleResize() {
		let numColumns = window.innerWidth > 440 && window.innerWidth <= 768 ? 3 : 2;
		if (numColumns != this.state.numColumns) this.setState({numColumns: numColumns});
		this.resizing && clearTimeout(this.resizing);
		this.resizing = setTimeout(() => {
			this.handleCardMounted();
		}, this.resizeDelay);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

  renderCardContent() {
		const wordsH = Math.ceil(this.data.length/this.state.numColumns) * 1.85;
    return (
	        <div className="card-block card-content">
	          <div className="title-wrap">
	            <h4 className="card-title">{T('card.words.title')}</h4>
	            <span className="sub">{T('card.words.subtitle')}</span>
	          </div>
	          <div className="section-content words">
							<div className="words-wrap" style={{'height': wordsH+'rem'}}>
								{this.data.map((item, i) =>
	                <div className={classnames('word-item', item.highlight && 'highlight')} key={item.word}>
	                  <span className="percent">{ numFormat(item.percentage) }</span>
	                  <OverflowTooltip ttipOptions={{offset: '0 0'}}><span className="word" dir={textDir(item.word)}>{ item.word }</span></OverflowTooltip>
	                </div>
	              )}
							</div>
	          </div>
	        </div>
			);
  }
}
