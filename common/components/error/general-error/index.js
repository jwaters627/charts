import React from 'react';
import Icon from '../../../icons';

require('./general-error.scss');

export default class GeneralError extends React.Component {

  render () {
    return <div className="container container-general-error">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-general-error">
          <h1>{this.props.title}</h1>
          <div className="message-general-error">
            <Icon name="sad-hexagon"/>{this.props.subtitle}
          </div>
          {this.props.messages && this.props.messages.length &&
            <ul className="error-msg-points">
              {this.props.messages.map( (msg, i) =>
                <li key={i}>{msg}</li>
              )}
            </ul>
          }
          {this.props.content &&
            <div className="error-content">{this.props.content}</div>
          }
          {this.props.onBackButtonClick &&
            <div className="btns">
              <button type="button" onClick={this.props.onBackButtonClick}>Head back</button>
            </div>
          }
        </div>
      </div>
    </div>
  }
}
