'use strict';

import React from 'react';
import Cover from '../Cover/Cover';

class LibraryMenu extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        libraryMenuProps: React.PropTypes.object.isRequired,
        monitors: React.PropTypes.array.isRequired,
        userMenuOpen: React.PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            monitors: this.props.monitors
        };
    }

    componentWillReceiveProps(props) {
        this.state = {
            monitors: props.monitors
        };
    }

    openVizMenu = (e) => {
        if (this.props.userMenuOpen) {
            this.context.flux.getActions('commonActions').toggleMenu({});
        }
        this.context.flux.getActions('dashboard-actions').toggleVisualizationMenu({
            className: 'open',
            name: e.target.dataset.name,
            monitorId: e.target.dataset.id,
            button: 'Add',
            monitorType: e.target.dataset.type
        });
    }

    onBack = () => {
        this.context.flux.getActions('dashboard-actions').toggleLibraryMenu({ className: 'closed' });
    }

    onClose = () => {
        this.context.flux.getActions('dashboard-actions').toggleLibraryMenu({ className: 'closed' });
        this.context.flux.getActions('dashboard-actions').toggleMediaMenu({ className: 'closed' });
    }

    searchByName = (e) => {
        let value = e.target.value.toLowerCase();
        this.setState({
            monitors: this.props.monitors.filter(function(m) {
                return (m.name.toLowerCase().indexOf(value) != -1);
            })
        });
    }

    clearInput = () => {
        document.getElementById('search').value = '';
    }

    render() {
        let self = this;
        let props = this.props.libraryMenuProps;

        let isClosed = (typeof(props.className) !== 'undefined' && props.className == 'closed');
        let cover = (isClosed) ? null : (<Cover id="cover" onClick={this.onClose} style={{zIndex: '-1', right:'17px'}} />);

        let monitors = this.state.monitors.map(function(m, i) {
            return (<li onClick={self.openVizMenu} data-id={m.id} data-name={m.name} data-type={m.type} key={i} className='monitor-list-display'>{m.name}</li>);
        });

        return (
            <div id="libraryMenu" className={'media-menu ' + props.className}>
                <div className="menu-title">
                    <span className="add-menu-back" onClick={this.onBack}>
                        <i className="fa fa-caret-left fa-2" aria-hidden="true"></i>
                    </span>
                    <span className="add-menu-title">Library</span>
                    <span className="add-menu-close" onClick={this.onClose}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </div>

                <div className="menu-search">
                    <input type="text" placeholder="&#xF002; Search Monitors" id='search' onChange={this.searchByName} onBlur={this.clearInput}/>
                </div>

                <ul>{monitors}</ul>

                {cover}
            </div>
        );
    }
}

export default LibraryMenu;