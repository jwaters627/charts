import React from 'react';
import T from '../../i18n';
import Icon from '../../../../common/icons';
require('./feedback.scss');

export default class FeedbackButton extends React.Component {

  render() {
    return <a href="https://crimsonhexagon.ideas.aha.io/ideas/new" target="_blank" className="feedback-btn hidden-sm-down">
            {T('feedbackButton.linkText')} <Icon name="feedback" />
          </a>
  }
}
