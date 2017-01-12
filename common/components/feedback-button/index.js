'use strict';

import React from 'react';

require('./feedback.scss');

class FeedbackButton extends React.Component {
    render() {
        return (
            <a href={this.props.url} target="_blank" className="feedback-btn hidden-sm-down">Share your Beta feedback!</a>
        );
    }
}

export default FeedbackButton;