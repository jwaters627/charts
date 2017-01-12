import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import _ from 'lodash';
import classNames from 'classnames';

export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.focus = false;
  }

  handleChange(event) {
    let value = event.target.value;
    let date = moment( value, this.props.dateFormat, true );

    if ( date.isValid() ) {
      this.props.setSelected( new DateUtil( date ) );
    }
  }

  handleClick(event) {
    event.target.select();
    event.preventDefault();
    this.props.handleClick(event);
  }

  handleChange(event) {
    return;
  }

  handleFocus(event) {
    event.target.select();
  }

  componentDidMount() {
    if (this.props.focus && this.props.focus != this.focus) {
      this.refs[this.props.id].focus();
      this.focus = true;
    }
  }

  componentDidUpdate() {
    if (this.props.focus && !this.focus) {
      this.refs[this.props.id].focus();
      this.focus = true;
    } else if (!this.props.focus && this.focus) {
      this.refs[this.props.id].blur();
      this.focus = false;
    }
  }

  render() {
    return <input
        id={this.props.id}
        ref={this.props.id}
        type='text'
        readOnly='true'
        name={this.props.name}
        value={this.props.date}
        onChange={this.handleChange.bind(this)}
        onBlur={this.props.onBlur}
        onMouseDown={this.handleClick.bind(this)}
        className={this.props.className}
        required={this.props.required}
        placeholder={this.props.placeholderText}
      />;
  }

}

DateInput.defaultProps = {
  className: 'datepicker__input',
  onBlur: function() {}
};
