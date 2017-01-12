import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import T from '../../i18n';
import Icon from '../../../../common/icons';

require('./help-text.scss');
const MOBILE_SCREEN = 768;
const helpText = {
	volume             		: T('helptext.l1.volume'),
	affinity           		: T('helptext.l2.affinity'),
	hashtags           		: T('helptext.l1.hashtags'),
	topRetweets        		: T('helptext.l1.topRetweets'),
	relevance          		: T('helptext.l2.relevance'),
	topInfluencers     		: T('helptext.l1.topInfluencers'),
	sentimentBreakdown 		: T('helptext.l2.sentimentBreakdown'),
  netSentiment 		      : T('helptext.l2.netSentiment'),
	percentAudience    		: T('helptext.l2.percentAudience'),
	words              		: T('helptext.l1.words'),
	interests          		: T('helptext.l1.interests'),
	demographics       		: T('helptext.l1.demographics'),
	percentHashtagPosts  	: T('helptext.l2.percentHashtags'),
  percentWordPosts  	  : T('helptext.l2.percentWords'),
  influenceScore        :	T('helptext.l2.influenceScore')
};

export default class HelpText extends React.Component {

	constructor(props) {
		super(props);
		this.state = { showText: false};
	}

	// handleExpandTip() {
	// 	this.setState({
	// 		iconUrl: helpIconHover,
	// 		showText: true
	// 	});
	// }

	// closeHelpText() {
	// 	this.setState({
	// 		iconUrl: !!this.props.level ? helpIconLevel2 : helpIcon,
	// 		showText: false
	// 	});
	// }

	shouldComponentUpdate(nextState){
		if(nextState.showText != this.state.showText) return true;
	}

	toggleFlyover(e){
		if(e.type == 'click' && window.innerWidth <= MOBILE_SCREEN ||
			e.type == 'mouseenter' || e.type == 'mouseleave'){
				this.setState({
					showText: !this.state.showText
				});
			}
	}

	renderHelpTextBox() {
		return (<div className="flyover">
			{helpText[this.props.type]}
		</div>);
	}

	renderHelpContainer(){
		let helpTextClasses = classnames('help-text',
			this.state.showText && 'active');
		return (
			<div className={helpTextClasses}
				data-html2canvas-ignore="true">
				{this.state.showText && this.props.level == null ? this.renderHelpTextBox() : ''}
				<span
					onMouseEnter={this.toggleFlyover.bind(this)}
					onMouseLeave={this.toggleFlyover.bind(this)}
					onClick={this.toggleFlyover.bind(this)}
					>
					<Icon name={this.props.level ? 'help-outline' : 'help'}
						className={classnames(this.props.level && 'level2')}/>
				</span>
			</div>);
	}

  render() {
		let helpContainer = null;
		// If in L2, render flyover outside of help-text container
		if(!!this.props.level) {
			helpContainer = <div>
				{this.state.showText && this.renderHelpTextBox()}
				{this.renderHelpContainer()}
			</div>
		} else {
			helpContainer = this.renderHelpContainer();
		}

    return helpContainer;
  }
}
