'use strict';

import React from 'react';

class Spinner extends React.Component {
    static propTypes = {
        style: React.PropTypes.object.isRequired,
        text: React.PropTypes.string.isRequired
    };

    render() {
        return (
            <div style={this.props.style}>
                <img src="/chs/images/ajax-loader.gif" style={{ width: '16px' }} />
                <span style={{ margin: '0px 10px' }}>{this.props.text}</span>
            </div>
        );
    }
}

export default Spinner;