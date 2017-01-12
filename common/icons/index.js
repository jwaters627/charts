import './load-ch-icons.js';
import React from 'react';
require('./ch-icon.scss');

const ChIcon = ({name, className, style, onClick}) =>
  <svg className={'ch-icon icon-'+name+(className ? ' '+className: '')} style={style} onClick={onClick}>
    <use xlinkHref={'#icon-'+name}></use>
  </svg>

export default ChIcon;
