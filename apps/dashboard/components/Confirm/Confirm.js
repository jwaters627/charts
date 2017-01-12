'use strict';

import React from 'react';
import Cover from '../Cover/Cover';
import _ from 'lodash';

require('./Confirm.scss');

const Y_POS_OFFSET = 250;

class Confirm extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    static propTypes = {
        confirmProps: React.PropTypes.object.isRequired,
    };

    onClose = () => {
        this.context.flux.getActions('dashboard-actions').confirmDelete({
            display: 'none',
            header: '',
            text: ''
        });
    };

    render() {
        let props = this.props.confirmProps;
        let top = window.scrollY + Y_POS_OFFSET + 'px';

        return (
            <div style={{display: props.display}} className="confirm">
                <div id="confirm" style={{top: top}}>
                    <div className="close" onClick={this.onClose}><i className="fa fa-times" aria-hidden="true"></i></div>
                    <h1>{props.header}</h1>
                    <p>{props.text}</p>
                    <button onClick={props.onDelete}>Delete</button>
                </div>
                <Cover onClick={this.onClose} style={{backgroundColor: '#FFF', opacity: '0.9', zIndex: '10001'}}/>
            </div>
        );
    }
}

export default Confirm;