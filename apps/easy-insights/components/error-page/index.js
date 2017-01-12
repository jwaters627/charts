import React from 'react';
import {Error404, Error500, NoResultsError, QueryValidationError, BadRequestError} from '../../../../common/components/error';
import Error403 from '../../../../common/components/error/error-403';

export default class ErrorPage extends React.Component {

    static contextTypes = {
      flux: React.PropTypes.object
    };

    constructor(props) {
      super(props);
      // capture error id from
      if (this.props.route && this.props.route.errorId) {
        this.errorId = this.props.route.errorId;
      } else {
        this.errorId = this.props.errorId;
      }
    }

    handleHeadBack = () => {
      this.context.flux.getActions('easyactions').navigateBack();
    }

    gotoDashBoard = () => {
      document.location.href = '/ch/dashboard';
    }

    render() {
      switch (this.errorId) {
        case 'FORBIDDEN':
          return <Error403 onBackButtonClick={this.gotoDashBoard} />;
        case 'NOT_FOUND':
         return <Error404 onBackButtonClick={this.handleHeadBack} />;
        case 'SERVER_ERROR':
          return <Error500 onBackButtonClick={this.handleHeadBack} />;
        case 'NO_RESULTS':
          return <NoResultsError query={this.props.query} />;
        case 'VALIDATION_FAILURE':
          return <QueryValidationError query={this.props.query} messages={this.props.messages} />;
        case 'BAD_REQUEST':
          return <BadRequestError onBackButtonClick={this.handleHeadBack} />
        }
    }
}
