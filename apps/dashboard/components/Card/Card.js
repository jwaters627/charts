'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import VolumeChart from '../../../../common/components/volume-chart/volume-chart';
import RetweetsCard from '../RetweetsCard/RetweetsCard.js';
import AutoSentiment from '../AutoSentiment/AutoSentiment';
import DayAndTime from '../DayAndTime/DayAndTime';
import Gender from '../Gender/Gender';
import InfluencersCard from '../InfluencersCard/InfluencersCard';
import BarsCard from '../BarsCard/BarsCard';
import TotalImpressions from '../TotalImpressions/TotalImpressions';
import Ethnicity from '../Ethnicity/Ethnicity';
import Age from '../Age/Age';

require('./Card.scss');
require('../../../../common/components/volume-chart/volume-chart.scss');

const MENU_WIDTH = 175;
const EMBED_TYPE = 'html';

class Card extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        cardProps: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            editing: false,
            menuOpen: false,
            name: this.props.cardProps.name,
            data: (this.props.cardProps.type == EMBED_TYPE) ? this.props.cardProps.html : this.props.cardProps.data,
            start: this.props.cardProps.start,
            end: this.props.cardProps.end,
            dateRange: this.props.cardProps.data ? this.props.cardProps.data.dateRange ? this.props.cardProps.data.dateRange : this.props.cardProps.dateRange : '',
            el: ''
        };
    }

    componentWillMount() {
        if (!this.props.cardProps.monitorDeleted && this.props.cardProps.type != EMBED_TYPE) {
            this.context.flux.getActions('dashboard-actions').loadVisualizationData({
                id: this.props.cardProps.id,
                type: this.props.cardProps.type,
                monitorId: this.props.cardProps.monitorId,
                start: this.props.cardProps.start,
                end: this.props.cardProps.end,
                dateRange: this.props.cardProps.dateRange
            });
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        this.setState({ loaded: true, el: ReactDOM.findDOMNode(this) });
    }

    componentDidUpdate() {
        if (this.state.data && this.props.cardProps.type == 'volume') {
            if (this.volumeChart) this.volumeChart.remove();
            this.volumeChart = new VolumeChart(
                this.refs.volumeChart,
                this.state.data
            );
        }

        if (this.state.editing) {
            this.refs.name.focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.cardProps.start != this.state.start || nextProps.cardProps.end != this.state.end) {
            this.context.flux.getActions('dashboard-actions').loadVisualizationData({
                id: this.props.cardProps.id,
                type: this.props.cardProps.type,
                monitorId: this.props.cardProps.monitorId,
                start: this.props.cardProps.start,
                end: this.props.cardProps.end,
                dateRange: this.props.cardProps.dateRange || this.props.cardProps.data.dateRange
            });
            this.setState({
                start: nextProps.cardProps.start,
                end: nextProps.cardProps.end
            });
        } else if (nextProps.cardProps.data || nextProps.cardProps.html) {
            this.setState({
                data: (nextProps.cardProps.type == EMBED_TYPE) ? nextProps.cardProps.html : nextProps.cardProps.data
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.cardProps.w != nextProps.cardProps.w || this.props.cardProps.h != nextProps.cardProps.h) {
            this.setState({el: ReactDOM.findDOMNode(this)});
            this.onResize();
            return false;
        }

        if (!this.state.loaded ||
            !this.state.data ||
            (nextProps.cardProps.data && this.state.data.length != nextProps.cardProps.data.length) ||
            (nextProps.cardProps.data && nextProps.cardProps.data.dateRange && nextProps.cardProps.data.dateRange != this.state.dateRange) ||
            (nextProps.cardProps.dateRange && nextProps.cardProps.dateRange != this.state.dateRange)
        )
        {
            return true;
        }

        if (nextProps.cardProps.html && this.state.data != nextProps.cardProps.html) {
            return true;
        }

        if (this.state.editing != nextState.editing) {
            return true;
        }

        return false;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    onNameToggle = () => {
        this.setState({ editing: true });
    }

    onBlur = () => {
        this.setState({
            name: this.state.name,
            editing: false
        });
    }

    onEditName = (e) => {
        if (e.keyCode == 13 && e.target.value.match(/\S/)) {
            this.context.flux.getActions('dashboard-actions').editCard({
                name: e.target.value,
                id: e.target.dataset.index
            });
            this.setState({name: e.target.value, editing: false});
        } else if (e.keyCode == 27) {
            this.setState({name: this.state.name, editing: false});
        }
    }

    onDelete = () => {
        this.context.flux.getActions('dashboard-actions').deleteCard(this.props);
    }

    onToggleMenu = (e) => {
        e.target.dataset.ellipsis ? this.state.menuOpen = true : this.state.menuOpen = false;
        let offset = (e.pageX + MENU_WIDTH >= window.innerWidth) ? MENU_WIDTH : 0;
        let display = (this.state.menuOpen) ? 'block' : 'none';
        let x = (this.state.menuOpen) ? e.pageX - offset : 0;
        let y = (this.state.menuOpen) ? e.pageY : 0;
        let source = (this.props.cardProps.type == EMBED_TYPE) ? this.state.name : (this.props.cardProps.monitorName || '<Deleted>');
        this.context.flux.getActions('dashboard-actions').toggleMenu({
            display: display,
            x: x,
            y: y,
            zIndex: '10000',
            name: this.state.name,
            source: source,
            vizId: this.props.cardProps.id,
            monitorId: this.props.cardProps.monitorId,
            monitorType: this.props.cardProps.monitorType,
            onDelete: this.onDelete,
            type: this.props.cardProps.type,
            dateRange: this.props.cardProps.dateRange,
            data: this.state.data
        });
    }

    onResize = () => {
        switch (this.props.cardProps.type) {
            case 'volume' :
                this.resizing && clearTimeout(this.resizing);
                this.resizing = setTimeout(() => {
                    this.volumeChart && this.volumeChart.resize();
                }, 10);
                break;
            case 'sentiment':
            case 'dayandtime':
            case 'impressions':
            case 'gender':
            case 'ethnicity':
            case 'age':
                this.forceUpdate();
                break;
        }
    }

    render() {
        if (this.state.data || this.props.cardProps.monitorDeleted) {
            let content = null;

            if (this.props.cardProps.monitorDeleted) {
                content = (<h2 className="monitor-deleted">Sorry, this monitor has been deleted.</h2>);
            } else {
                switch (this.props.cardProps.type) {
                    case 'volume':
                        content = (<div className="volume-chart chart" ref="volumeChart"></div>);
                        break;
                    case 'retweets':
                        content = (<RetweetsCard ref='retweetsCard' retweets={this.state.data} />);
                        break;
                    case 'sentiment':
                        content = (<AutoSentiment data={this.state.data} className="chart" width={this.state.el.offsetWidth} height={this.state.el.offsetParent.clientHeight - 30} ref="autoSentimentChart" ></AutoSentiment>);
                        break;
                    case 'dayandtime':
                        content = (<DayAndTime data={this.state.data} width={this.state.el.offsetWidth - 15} height={this.state.el.offsetParent.clientHeight - 40} ref="dayAndTimeChart" />);
                        break;
                    case 'ethnicity':
                        content = (<Ethnicity data={this.state.data} width={this.state.el.offsetWidth} height={this.state.el.offsetParent.clientHeight - 30} ref="ethnicityChart" />);
                        break;
                    case 'age':
                        content = (<Age data={this.state.data} el={this.state.el} className="chart" width={this.state.el.offsetWidth - 15} height={this.state.el.offsetParent.clientHeight - 40} ref="ageChart" />);
                        break;
                    case 'influencers':
                        content = (<InfluencersCard data={this.state.data} />);
                        break;
                    case 'mentions':
                    case 'hashtags':
                        content = (<BarsCard data={this.state.data} />);
                        break;
                    case 'gender':
                        content = (<Gender data={this.state.data} width={this.state.el.offsetWidth - 15} height={this.state.el.offsetParent.clientHeight - 40} ref="genderChart" />);
                        break;
                    case 'impressions':
                        content = (<TotalImpressions data={this.state.data} width={this.state.el.offsetWidth} height={this.state.el.offsetParent.clientHeight - 30} />);
                        break;
                    default:
                        content = (<div className="dangerous-inner-html" dangerouslySetInnerHTML={{__html: this.state.data}}></div>);
                        break;
                }
            }

            let name = (<div>{this.state.name}<i className="fa fa-pencil-square-o" data-index={this.props.cardProps.id} aria-hidden="true"></i></div>);
            if (this.state.editing) {
                name = (<input type="text" name="name" maxLength="50" ref="name" data-index={this.props.cardProps.id} defaultValue={this.state.name} onKeyUp={this.onEditName} onBlur={this.onBlur} />);
            }

            return (
                <div id={'card' + this.props.cardProps.id} className="dashboard-card" data-id={this.props.cardProps.id} data-type={this.props.cardProps.type}>
                    <div className="card-title">
                        <div className="name" onClick={this.onNameToggle}>{name}</div>
                        <div className="menu-icon" onClick={this.onToggleMenu}>
                            <i className="fa fa-ellipsis-h" aria-hidden="true" data-ellipsis="dots"></i>
                        </div>
                    </div>

                    <div className="contents">
                        {content}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="grid-row">
                    <div className="col">
                        <ul className="loading">
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                </div>
            )
        }

    }
}

export default Card;