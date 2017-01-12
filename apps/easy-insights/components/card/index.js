import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {formatSmartText} from '../../utils/utils';
import html2canvas from 'html2canvas';
import classnames from 'classnames';
import {saveAs} from 'browser-filesaver';
import HelpText from '../help-text';
import T from '../../i18n';
import {DropdownButton, MenuItem} from 'react-bootstrap-4';
import ExportCaption from '../export-caption';
import browser from 'bowser';
import Icon from '../../../../common/icons';

require('./card.scss');

export default class BaseCard extends React.Component {

  static contextTypes = {
    flux: React.PropTypes.object
  };

  hasXLSExport = false;
  hasL2Link    = false;
  resizeDelay  = 500;

  constructor(props, context) {
    super(props, context);
    this.rank   = props.card.rank;
    this.cardId = props.card.id;
  }

  handleExpandCard(event) {
    event.preventDefault();
    const storeState = this.context.flux._stores.get('cardstore').getState();
    const payload = {
      cardId   : this.cardId,
      query    : storeState.query,
      filters  : storeState.filters,
      phrasify : storeState.doPhrasify
    };
    this.context.flux.getActions('easyactions').expandCard(payload);
  }

  renderL2Link() {
    return <div className="l2-link" data-html2canvas-ignore="true">
              <div className="l2-link-txt" onClick={this.handleExpandCard.bind(this)}>
                {T('card.moreLink')}
              </div>
           </div>
  }

  handleCardMounted() {
    if (this.refs.cardMainElem) {
      let h = this.refs.cardMainElem.offsetHeight;
      setTimeout( () => {
        this.context.flux.getActions('easyactions').cardMounted({
          cardId : this.cardId,
          rank   : this.rank,
          height : h
        });
      }, 10);
    }
  }

  handleMenuSelect(ev, key) {
    switch (key) {
      case 'export2PNG':
        this.export2PNG();
        break;
      case 'export2XLS':
        console.log('exportXLS');
        break;
    }
  }

  export2PNG() {
    let start = new Date().getTime();
    const storeState = this.context.flux._stores.get('cardstore').getState();
    html2canvas(this.refs.cardMainElem, {
			height          : this.refs.cardMainElem.offsetHeight,
			width           : this.refs.cardMainElem.offsetWidth,
			allowTaint      : false,
			letterRendering : true,
			background      : '#f4f4f4',
			scale           : 2, //window.devicePixelRatio > 1 ? 2: 1,
			logging         : false,
      proxy           : '/ch/heliosight/proxy',
      proxyWithCredentials : true,
      padding         : {left: 30, right: 30, top: 30, bottom: 30},
      caption         : ReactDOMServer.renderToString(<ExportCaption cardTitle={this.cardDisplayName} storeState={storeState}/>)
		})
    .then(canvas => {
			let ctx = canvas.getContext('2d');
			ctx.webkitImageSmoothingEnabled = false;
			ctx.mozImageSmoothingEnabled = false;
			ctx.imageSmoothingEnabled = false;
			console.log('FINITO IMG EXPORT!', new Date().getTime() - start);
			canvas.toBlob(blob => saveAs(blob, this.cardId+'.png'));
		}).catch(e => console.log('ERROR HTML2CANVAS', e));
  }

  renderMenu() {
    if (!this.hasXLSExport && !(this.hasPNGExport && !browser.safari)) return '';
    return (
    <div className="card-menu" data-html2canvas-ignore="true">
      <DropdownButton id="cardMenu" bsStyle="link" noCaret pullRight={true} title={<Icon name="ellipsis" />} onSelect={this.handleMenuSelect.bind(this)}>
        {this.hasPNGExport && !browser.safari && <MenuItem eventKey="export2PNG">{T('card.menu.exportPNG')}</MenuItem>}
        {this.hasXLSExport && <MenuItem eventKey="export2XLS">{T('card.menu.exportXLS')}</MenuItem>}
      </DropdownButton>
    </div>);
  }

  render() {
    return (
      <div className={classnames('ei-card ei-card-l1', this.cardClass, !this.hasData && 'no-data')} ref="cardMainElem">
        {this.hasData && this.renderMenu()}
        {this.hasData && this.hasL2Link && this.renderL2Link()}
        <div className="card-block text-center card-head">
          <div className="msg" dangerouslySetInnerHTML={{__html: formatSmartText(this.props.card.message)}}></div>
        </div>
        {this.hasData && this.renderCardContent()}
        {this.hasData && <HelpText type={this.cardId} />}
      </div>);
  }
}
