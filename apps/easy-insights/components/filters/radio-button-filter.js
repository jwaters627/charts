import React from 'react';
import ClassNames from 'classnames';
import T from '../../i18n';

export default class RadioButtonFilter extends React.Component {

  constructor(props, context) {
    super(props, context);
    let fstate = props.filters[props.type];
    this.state = {
      type: props.type,
      selected: !!props.filters.genders[0] ? props.filters.genders[0] : '',
      value: props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    let gender = !!nextProps.filters.genders[0] ? nextProps.filters.genders[0] : '';
    if(gender != this.state.selected) {
      this.setState({
        selected: gender
      });
    }
  }

  handleButtonSelected(event) {
    let newGender = this.state.selected === event.target.value ? '' : event.target.value;
    this.context.flux.getActions('easyactions').updateFilter({
      type : this.props.type,
      value : newGender
    });
    this.setState({
      selected: newGender
    });
  }

  render() {
    return <div className="filter">
      <label className={ClassNames(this.state.selected == 'M' && 'active', 'radio-label-btn male')}
             htmlFor="maleFilter">{T('filters.gender.male')}</label>
      <input className="radio"
             type="radio"
             ref="male"
             id="maleFilter"
             value="M"
             checked={this.state.selected == 'M' ? true : false}
             onChange={this.handleButtonSelected.bind(this)}>
      </input>
      <label className={ClassNames(this.state.selected == 'F' && 'active', 'radio-label-btn female')}
             htmlFor="femaleFilter">{T('filters.gender.female')}</label>
      <input className="radio"
             type="radio"
             ref="female"
             id="femaleFilter"
             value="F"
             checked={this.state.selected == 'F' ? true : false}
             onChange={this.handleButtonSelected.bind(this)}>
      </input>
    </div>
  }
}

RadioButtonFilter.contextTypes = {
  flux: React.PropTypes.object
};
