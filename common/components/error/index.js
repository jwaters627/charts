import React from 'react';
import GeneralError from './general-error';
import QueryError from './query-error';
import T from '../../i18n';

export Error403 from './error-403';

export const Error404 = (props) =>
    <GeneralError
      title={T('error.404.title')}
      subtitle={T('error.404.subtitle')}
      onBackButtonClick={props.onBackButtonClick}
    />

export const Error500 = (props) =>
    <GeneralError
      title={T('error.500.title')}
      subtitle={T('error.500.subtitle')}
      onBackButtonClick={props.onBackButtonClick}
    />

export const QueryValidationError = (props) =>
  <QueryError
    title={T('error.queryValidation.title')}
    subtitle={T('error.queryValidation.subtitle')}
    query={props.query}
    messages={props.messages}
  />

export const BadRequestError = (props) =>
  <GeneralError
    title={T('error.badRequest.title')}
    subtitle={T('error.badRequest.subtitle')}
    onBackButtonClick={props.onBackButtonClick}
  />

export const NoResultsError = (props) =>
  <QueryError
    query={props.query}
    title={T('error.noResults.title')}
    subtitle={T('error.noResults.subtitle')}
    messages={[T('error.noResults.msg1'),
               T('error.noResults.msg2'),
               T('error.noResults.msg3'),
               T('error.noResults.msg4')]}
  />
