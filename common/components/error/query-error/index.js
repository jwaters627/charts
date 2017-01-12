import React from 'react';
import {textDir} from 'ch-ui-lib';
import Icon from '../../../icons';

require('./query-error.scss');

export default class QueryError extends React.Component {

  render() {
    return <div className="query-error container">
              <div className="row">
                <div className="col-xs-12">
                  <h4 className="header">{this.props.title}: <span className="query" dir={textDir(this.props.query)}>{this.props.query}</span></h4>
                  <h5>
                    <Icon name="sad-search"/>
                    {this.props.subtitle}:
                  </h5>
                  {this.props.messages && this.props.messages.length &&
                    <ul>
                      {this.props.messages.map( (msg, i) =>
                        <li key={i}>{msg}</li>
                      )}
                    </ul>
                  }
                </div>
            </div>
      </div>;
  }
}
