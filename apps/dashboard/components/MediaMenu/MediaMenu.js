'use strict';

import React from 'react';
import Cover from '../Cover/Cover';

class MediaMenu extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        mediaMenuProps: React.PropTypes.object.isRequired,
        userMenuOpen: React.PropTypes.bool.isRequired
    };

    openEmbedMenu = () => {
        this.context.flux.getActions('dashboard-actions').toggleEmbedMenu({ className: 'open'});

        if (this.props.mediaMenuProps.className !== '') {
            this.context.flux.getActions('dashboard-actions').toggleMediaMenu({ className: 'open' });
        }
    };

    openLibMenu = () => {
        this.context.flux.getActions('dashboard-actions').toggleLibraryMenu({ className: 'open' });

        if (this.props.mediaMenuProps.className !== '') {
            this.context.flux.getActions('dashboard-actions').toggleMediaMenu({ className: 'open' });
        }
    };

    onClose = () => {
        this.context.flux.getActions('dashboard-actions').toggleMediaMenu({ className: 'closed' });
    };

    render() {
        let props = this.props.mediaMenuProps;
        let hasClass = (typeof(props.className) !== 'undefined' && props.className !== '' && props.className !== 'open');
        let cover = (hasClass) ? null : (<Cover onClick={this.onClose} style={{zIndex: '-1', right:'17px'}} />);

        return (
            <div id="mediaMenu" className={'media-menu ' + props.className}>
                <h1>Start Adding Your Media</h1>

                <div className="menu-title">
                    <span className="add-menu-title no-back">Add Media</span>
                    <span className="add-menu-close" onClick={this.onClose}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </div>

                <ul>
                    <li>
                        <i className="fa fa-link fa-3x" aria-hidden="true" onClick={this.openEmbedMenu}></i>
                        <span>Add Embed Code</span>
                        <i className="fa fa-question media-info" aria-hidden="true">
                            <span className="info-text">Embed third-party media (YouTube, Imgur, etc.)</span>
                        </i>
                    </li>
                    <li>
                        <i className="fa fa-pie-chart fa-3x" aria-hidden="true" onClick={this.openLibMenu}></i>
                        <span onClick={this.openLibMenu}>Add From Library</span>
                        <i className="fa fa-question media-info" aria-hidden="true">
                            <span className="info-text">Select a visual from any of your monitors</span>
                        </i>
                    </li>
                    <li className="disabled">
                        <i className="fa fa-th-large fa-3x" aria-hidden="true"></i>
                        <span>Add From Template</span>
                        <i className="fa fa-question" aria-hidden="true"></i>
                    </li>
                </ul>

                {cover}
            </div>
        );
    }
}

export default MediaMenu;