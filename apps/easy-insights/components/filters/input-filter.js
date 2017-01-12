import React from 'react';
import ClassNames from 'classnames';
import TokenAutocomplete from '../react-token-autocomplete/src/TokenAutocomplete';
import {ControllerView} from 'ch-flux';
import {tryInt} from '../../utils/utils';
import _ from 'lodash';

const MAX_VISIBLE = 100;

@ControllerView({
  stores  : [['cardstore', state => {
    return {
          'interests': state.autoCompleteInterests,
          'languages': state.autoCompleteLanguages,
          'locations': state.autoCompleteLocations,
          'sentiment': state.autoCompleteSentiment,
          'filters': state.filters
    }
  }]],
  actions : 'easyactions'
})
export default class InputFilter extends React.Component {

  constructor(props) {
    super(props);
    // init values
    let vals = this.getInputValuesFromStore(props);

    this.state = {
      selected : false,
      values: vals
    };

    this.extraTokenProps = {};

    if (props.filterOption) {
      this.extraTokenProps.filterOption = props.filterOption;
    }
    if (props.displayOption) {
      this.extraTokenProps.displayOption = props.displayOption;
    }
    if (props.formInputOption) {
      this.extraTokenProps.formInputOption = props.formInputOption;
    }
  }

  getInputValuesFromStore(props) {
    props = !!props ? props : this.props;
    if (props.filters[props.type]
        && props.filters[props.type].length
        && props[props.type]
        && props[props.type].length) {
      return props[props.type].filter(v =>
        props.filters[props.type].map(tryInt).indexOf(tryInt(v[props.formInputOption])) != -1
      );
    }
    return [];
  }

  // TODO: this whole thing should be remade with an autocomplete endpoint.
  componentWillReceiveProps(newProps) {
    if (newProps[newProps.type]
      && newProps[newProps.type].length) {
      let vals = this.getInputValuesFromStore(newProps);
      this.setState({values: vals});
    }
  }

  handleTokenAdded(token) {
    let newValues = this.state.values;
    newValues.push(token);
    this.setState({
      values: newValues
    });
    this.props.actions.updateFilter({
      type: this.props.type,
      value: newValues.map(v=>v[this.props.formInputOption])
    });
  }

  handleTokenRemoved(token) {
    const field = this.props.formInputOption;
    let newValues = this.state.values.filter(v => v[field] != token[field]);
    this.setState({values: newValues});
    this.props.actions.updateFilter({
      type: this.props.type,
      value: newValues.map(v=>v[field])
    });
  }

  render() {
    let passProps = {
      type: this.props.type,
      className: {input: 'form-control'},
      id: this.props.id,
      placeholder: this.props.name,
      defaultValues: this.state.values,
      options: this.props[this.props.type],
      maxVisible: MAX_VISIBLE,
      empty: this.state.values == 0 ? true : false
    };
    return  <div className="filter">
      <TokenAutocomplete
        onAdd={this.handleTokenAdded.bind(this)}
        onRemove={this.handleTokenRemoved.bind(this)}
        ref="token-autocomplete"
        {...passProps} />
    </div>
  }
}
