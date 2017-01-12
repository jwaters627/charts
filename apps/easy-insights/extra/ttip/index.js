import Tether from 'tether';
import {textDir} from 'ch-ui-lib';
import './ttip.scss';

export default class Tooltip {

  defaultOptions = {
    hoverDelay  : 300,
    holdOpenFor : 5000,
    targetAnchor : 'top center',
    tooltipAnchor : 'bottom center',
    offset     : '5px 5px'
  };

  hovered = false;

  constructor(elem, content, options = {}) {
    this.elem    = elem;
    this.content = content;
    this.opts    = Object.assign({}, this.defaultOptions, options);
    this.initEvents();
  }

  initEvents() {
    this.elem.onmouseenter = (ev) => this.handleMouseEnter(ev);
    this.elem.onmouseleave = (ev) => this.handleMouseLeave(ev);
    this.elem.onclick      = (ev) => this.handleClick(ev);
  }

  createTooltip() {
    if (!this.ttElem) {
      this.elem.classList.add('has-tooltip');
      this.ttElem = document.createElement('div');
      this.ttElem.classList.add('ch-tooltip');
      this.ttElem.innerHTML = this.content;
      this.ttElem.dir = textDir(this.content);
      document.body.appendChild(this.ttElem);
      this.ttElem.style.visibility = 'hidden';
      this.tether = new Tether({
        element : this.ttElem,
        target  : this.elem,
        attachment: this.opts.tooltipAnchor,
        targetAttachment: this.opts.targetAnchor,
        offset: this.opts.offset
      });
      setTimeout(() => {
        this.tether.position();
        this.ttElem.style.visibility = 'visible';
        this.ttElem.classList.add('visible');
      });
    }
  }

  destroyTooltip() {
    if (!this.ttElem) return;
    this.ttElem.classList.remove('visible');
    setTimeout(()=>{
      this.tether && this.tether.destroy();
      document.body.removeChild(this.ttElem);
      this.ttElem = null;
      this.elem.classList.remove('has-tooltip');
    }, 300);
  }

  handleClick(ev) {
    this.showTooltip(true, true);
  }

  handleMouseEnter(ev) {
    this.hovered = true;
    this.hoverTimeout = setTimeout(() => this.hovered && this.showTooltip(true), this.hoverDelay);
  }

  handleMouseLeave(ev) {
    this.hovered = false;
    !!this.hoverTimeout && clearTimeout(this.hoverTimeout);
    this.showTooltip(false);
  }

  showTooltip(showTooltip, hideAfterDelay = false) {
    if (showTooltip) {
      this.createTooltip();
      hideAfterDelay && setTimeout(() => this.showTooltip(false), this.holdOpenFor);
    } else {
      this.destroyTooltip();
    }
  }

  destroy() {
    this.destroyTooltip();
    this.elem = null;
  }
}
