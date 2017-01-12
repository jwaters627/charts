import 'bootstrap/dist/css/bootstrap.css';
import '../../common/scss/font.scss';
import './style.scss';
import React from 'react';
import ReactDom from 'react-dom';
import ErrorApp from './error-app';

if (module.hot) {
    module.hot.accept();
}

ReactDom.render(<ErrorApp/>, document.getElementById('mainContent'));
