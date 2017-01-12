'use strict';

import React from 'react';
import Cover from '../Cover/Cover';

const EMBED_TYPE = 'html';

class EmbedMenu extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object,
        gridColumns: React.PropTypes.number
    };

    static propTypes = {
        embedMenuProps: React.PropTypes.object.isRequired,
        dashboard: React.PropTypes.object.isRequired,
        userMenuOpen: React.PropTypes.bool.isRequired
    };
    componentWillMount() {
        this.state = { data: this.props.embedMenuProps.data };
    }

    componentWillReceiveProps(props) {
        this.setState({ data: props.embedMenuProps.data });
    }

    onBack = () => {
        this.context.flux.getActions('dashboard-actions').toggleEmbedMenu({ className: 'closed' });
    }

    onClose = () => {
        this.context.flux.getActions('dashboard-actions').toggleEmbedMenu({ className: 'closed' });
        this.context.flux.getActions('dashboard-actions').toggleMediaMenu({ className: 'closed' });
    }

    onChange = (e) => {
        this.setState({ data: e.target.value });
    }

    onAddOrEditEmbed = () => {
        if (this.props.embedMenuProps.data) {
            this.context.flux.getActions('dashboard-actions').editCard({
                id: this.props.embedMenuProps.id,
                data: this.state.data
            });
        } else {
            let lastViz = this.props.dashboard.visualizations[this.props.dashboard.visualizations.length - 1];
            let lastVizX;
            lastViz ? lastVizX = lastViz.w + lastViz.x : lastVizX = 0;

            this.context.flux.getActions('dashboard-actions').createCard({
                type: EMBED_TYPE,
                dashboardId: this.props.dashboard.id,
                x: lastVizX < this.context.gridColumns ? lastVizX : 0,
                y: lastViz ? lastViz.y + lastViz.h : 0,
                monitorId: this.refs.embed.value      // This is gross and wrong
            });
        }

        this.onClose();
    }

    render() {
        let props = this.props.embedMenuProps;
        let isClosed = (typeof(props.className) !== 'undefined' && props.className == 'closed');
        let cover = (isClosed) ? null : (<Cover id="cover" onClick={this.onClose} style={{zIndex: '-1', right:'17px'}} />);
        let action = (props.data) ? 'Edit' : 'Add';

        return (
            <div id="embedMenu" className={'media-menu ' + props.className}>
                <div className="menu-title">
                    <span className="add-menu-back" onClick={this.onBack}>
                        <i className="fa fa-caret-left fa-2" aria-hidden="true"></i>
                    </span>
                    <span className="add-menu-title">Embed</span>
                    <span className="add-menu-close" onClick={this.onClose}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </div>

                <ul className="viz-list">
                    <li id="embedViz" className="viz-type expanded left">
                        <i className="fa fa-link fa-3x" aria-hidden="true"></i>
                        <label>Embed Code</label>
                        <input type="text" name="embed" id="embed" ref="embed" placeholder="Insert embed code..." value={this.state.data} onChange={this.onChange} />
                        <button onClick={this.onAddOrEditEmbed}>{action}</button>
                    </li>
                </ul>

                {cover}
            </div>
        );
    }
}

export default EmbedMenu;