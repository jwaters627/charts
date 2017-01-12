'use strict';

import React from 'react';

require('./Cover.scss');

class Cover extends React.Component {
    static propTypes = {
        onClick: React.PropTypes.func.isRequired,
        style: React.PropTypes.object
    };

    render() {
        return (
            <div id="cover" className="cover" onClick={this.props.onClick} style={this.props.style}></div>
        );
    }
}

export default Cover;