'use strict';

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Cover from '../Cover/Cover';

require('../../scss/dashboard.scss');

const VIZ_TYPES = [
    {type: 'volume', icon: 'fa-bar-chart', name: 'Volume', dayRange: true},
    {type: 'retweets', icon: 'fa-twitter', name: 'Retweets', dayRange: true},
    {type: 'sentiment', icon: 'fa-signal', name: 'Auto Sentiment', dayRange: true},
    {type: 'influencers', icon: 'fa-diamond', name: 'Top Influencers', dayRange: true},
    {type: 'mentions', icon: 'fa-at', name: 'Top Mentions', dayRange: true},
    {type: 'hashtags', icon: 'fa-hashtag', name: 'Top Hashtags', dayRange: true},
    {type: 'impressions', icon: 'fa-area-chart', name: 'Total Impressions', dayRange: true},
    {type: 'dayandtime', icon: 'fa-bar-chart', name: 'Day and Time', dayRange: true},
    {type: 'gender', icon: 'fa-venus-mars', name: 'Gender', dayRange: true},
    {type: 'ethnicity', icon: 'fa-flag-checkered', name: 'Ethnicity', dayRange: true},
    {type: 'age', icon: 'fa-user', name: 'Age', dayRange: true}
];
const DATE_RANGES = [3, 7, 14, 21, 28];
const VIZ_HEIGHT_PLUS_MARGIN = 130;
const VIZ_HEIGHT_EXPANDED = 245;
const TITLE_BAR_HEIGHT_PLUS_MARGIN = 60;

class VisualizationMenu extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object,
        gridColumns: React.PropTypes.number
    };

    static propTypes = {
        visualizationMenuProps: React.PropTypes.object.isRequired,
        dashboard: React.PropTypes.object.isRequired,
        userMenuOpen: React.PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.scrollTop = 0;

        this.state = {
            type: this.props.visualizationMenuProps.type,
            dateRange: '7'
        };
    }

    componentWillReceiveProps(props) {
        this.setState({type: props.visualizationMenuProps.type, dateRange: '7'});

        if (props.visualizationMenuProps.button == 'Update') {
            let self = this;
            // http://javascript.info/tutorial/animation //
            let animate = function(opt) {
                let start = new Date();

                let interval = setInterval(function() {
                    let progress = (new Date() - start) / opt.duration;
                    if (progress > 1) progress = 1;
                    opt.step(opt.delta(progress));
                    if (progress == 1) clearInterval(interval);
                }, opt.delay);
            };

            animate({
               delay: 15,
               duration: 1000,
               delta: function(p) { return (p < .5) ? 2*p*p : -1+(4-2*p)*p; },  // https://gist.github.com/gre/1650294
               step: function(delta) {
                   document.getElementById('visualizationMenu').scrollTop = (delta * self.scrollTop);
               }
            });
        }
    }

    onBack = () => {
        this.context.flux.getActions('dashboard-actions').toggleVisualizationMenu({ className: 'closed' });
    }

    onClose = () => {
        this.context.flux.getActions('dashboard-actions').toggleVisualizationMenu({ className: 'closed' });
        this.context.flux.getActions('dashboard-actions').toggleLibraryMenu({ className: 'closed' });
        this.context.flux.getActions('dashboard-actions').toggleMediaMenu({ className: 'closed' });
    }

    onClickViz = (type) => {
        this.setState({
            type: (this.state.type == type) ? null : type
        });
    }

    onAddDateRange = (e) => {
        e.stopPropagation();
        if (e.target.className == "range") {
            let range = document.getElementsByClassName('range');

            for (let i = 0; i < range.length; i++) {
                if (range[i].classList.contains('selected')) {
                    range[i].classList.remove('selected');
                }
            }
            e.target.classList.add('selected');

            this.setState({dateRange: e.target.dataset.range});
        } else {
            return false;
        }

    }

    onAddCard = (e) => {
        if (this.props.visualizationMenuProps.button == 'Update') {
            this.context.flux.getActions('dashboard-actions').editCard({
                id: this.props.visualizationMenuProps.id,
                dateRange: this.state.dateRange
            });
            this.context.flux.getActions('dashboard-actions').toggleVisualizationMenu({ className: 'closed' });
        } else {
            let lastViz = this.props.dashboard.visualizations[this.props.dashboard.visualizations.length - 1];
            let lastVizX;
            lastViz ? lastVizX = lastViz.w + lastViz.x : lastVizX = 0;

            this.context.flux.getActions('dashboard-actions').createCard({
                type: e.target.dataset.type,
                dashboardId: this.props.dashboard.id,
                monitorId: this.props.visualizationMenuProps.monitorId,
                monitorType: this.props.visualizationMenuProps.monitorType,
                dateRange: this.state.dateRange,
                y: lastViz ? lastViz.y + lastViz.h : 0,
                x: lastVizX < this.context.gridColumns ? lastVizX : 0
            });
        }
    }

    render() {
        let props = this.props.visualizationMenuProps;
        let back = null;
        if (props.button != "Update") {
            back = (
                <span className="add-menu-back" onClick={this.onBack}>
                    <i className="fa fa-caret-left fa-2" aria-hidden="true"></i>
                </span>
            );
        }

        let self = this;
        let expanded = false, afterExpanded = false, expandedTop = 0, prevViz = null;
        let vizTypes = (props.monitorType != 'BUZZ') ? _.filter(VIZ_TYPES, function(viz) { return viz.type != 'sentiment'; }) : VIZ_TYPES;
        let visualizations = _.map(vizTypes, function(viz, i) {
            // Need to keep track of expanded viz, the prev viz if it's on the right, and all viz after it //
            if (expanded == false && self.state.type == viz.type) expanded = true;
            if (expanded && self.state.type != viz.type) afterExpanded = true;
            if (expanded && !afterExpanded && i % 2 != 0) prevViz = i - 1;

            // Build class string based on various truths and falsehoods //
            let classes = classNames('viz-type', {
                'expanded': expanded && !afterExpanded,
                'after-expanded': afterExpanded,
                'left': (i % 2 == 0),
                'right': (i % 2 != 0)
            });

            // The meat: viz are absolutely positioned and top is calculated based on row //
            // However, 'after-expanded' viz are relatively positioned, and so all have same top //
            let top = Math.floor(i / 2) * VIZ_HEIGHT_PLUS_MARGIN;
            if (expanded && !afterExpanded) expandedTop = top;
            if (afterExpanded) top = expandedTop + VIZ_HEIGHT_EXPANDED;
            top += 'px';

            // Need to store scrollTop of expanded viz for update calls //
            self.scrollTop = expandedTop + TITLE_BAR_HEIGHT_PLUS_MARGIN;

            let dayRange = null;
            if (expanded && !afterExpanded && viz.dayRange) {
                dayRange = (
                    <div className="day-range">
                        <h2 className="range-title">Day Range</h2>
                        <div className="ranges" onClick={self.onAddDateRange}>
                            {DATE_RANGES.map(function(r, i) {
                                let className = (r == props.dateRange || (r == 7 && !props.dateRange)) ? 'range selected' : 'range';
                                return (<span key={i} className={className} data-range={r}>{r}</span>);
                            })}
                        </div>
                        <button data-type={viz.type} onClick={self.onAddCard}>{props.button}</button>
                    </div>
                );
            }

            return (
                <li key={i} id={'viz-'+viz.type} className={classes} style={{top: top}} onClick={() => self.onClickViz(viz.type)}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                    <i className={'fa ' + viz.icon + ' fa-3x'} aria-hidden="true"></i>
                    <label>{viz.name}</label>
                    {dayRange}
                </li>
            );
        });

        // If expanding viz on the right, same row viz doesn't move w/o these rules //
        // Can't just set 'after-expanded' class b/c React hates me (yes I know this is gross) //
        if (prevViz != null && visualizations[prevViz]) {
            visualizations[prevViz].props.style.top = expandedTop + VIZ_HEIGHT_EXPANDED + 'px';
            visualizations[prevViz].props.style.position = 'relative';
            visualizations[prevViz].props.style.margin = '10px -4px 10px 10px';
        }

        let isClosed = (typeof(props.className) !== 'undefined' && props.className == 'closed');
        let cover = (isClosed) ? null : (<Cover id="cover" onClick={this.onClose} style={{zIndex: '-1', right:'17px'}} />);

        return (
            <div id="visualizationMenu" className={'media-menu ' + props.className}>
                <div className="menu-title">
                    {back}
                    <span className="add-menu-title">{props.name}</span>
                    <span className="add-menu-close" onClick={this.onClose}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </div>

                <ul className="viz-list">{visualizations}</ul>

                {cover}
            </div>
        );
    }
}

export default VisualizationMenu;