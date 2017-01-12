'use strict';

import React from 'react';
import Cover from '../Cover/Cover';

require('./Menu.scss');

const EMBED_TYPE = 'html';

class Menu extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        menuProps: React.PropTypes.object.isRequired,
        dashboard: React.PropTypes.object.isRequired,
        userMenuOpen: React.PropTypes.bool.isRequired
    };

    onClose = () => {
        this.context.flux.getActions('dashboard-actions').toggleMenu({ display: 'none', y: 0, x: 0 });
    }

    onConfirmDelete = () => {
        this.context.flux.getActions('dashboard-actions').confirmDelete({
            display: 'block',
            header: 'Delete \'' + this.props.menuProps.name + '\'?',
            text: 'Are you sure you want to delete this ' + this.props.menuProps.type + ' visualization?',
            onDelete: this.props.menuProps.onDelete
        });
    }

    onEditVisualization = () => {
        this.context.flux.getActions('dashboard-actions').toggleMenu({ display: 'none', y: 0, x: 0 });
        if (this.props.userMenuOpen) {
            this.context.flux.getActions('commonActions').toggleMenu({});
        }

        if (this.props.menuProps.type == EMBED_TYPE) {
            this.context.flux.getActions('dashboard-actions').toggleEmbedMenu({
                className: 'open',
                id: this.props.menuProps.vizId,
                data: this.props.menuProps.data
            });
        } else {
            let name = this.props.menuProps.type[0].toUpperCase() + this.props.menuProps.type.substr(1);
            this.context.flux.getActions('dashboard-actions').toggleVisualizationMenu({
                className: 'open',
                name: name,
                id: this.props.menuProps.vizId,
                monitorId: this.props.menuProps.monitorId,
                monitorType: this.props.menuProps.monitorType,
                button: 'Update',
                type: this.props.menuProps.type,
                dateRange: this.props.menuProps.dateRange
            });
        }
    }

    render() {
        let props = this.props.menuProps;
        let top = (props.y + 15) || 0, left = props.x || 0;

        return (
            <div className="menu" style={{ display: props.display, top: top, left: left }}>
                <div className="menu-source">
                    <span>{props.source}</span>
                </div>
                <div className="menu-list">
                    <span onClick={this.onEditVisualization} >Edit</span>
                </div>
                <ul>
                    <li id="delete" className="menu-delete" onClick={this.onConfirmDelete}>Delete</li>
                </ul>
                <Cover id="cover" onClick={this.onClose} style={{zIndex: '-1'}} />
            </div>
        );
    }
}

export default Menu;