'use strict';

import React from 'react';
import Cover from '../Cover/Cover';
import _ from 'lodash';

const VALID_LOGO_TYPES = ['image/jpeg', 'image/png'];
const UPLOAD_FORMATS_TEXT = 'You can upload images in the following formats: PNG, JPG';

require('./Customize.scss');

const Y_POS_OFFSET = 100;

class Customize extends React.Component {
    static contextTypes = {
        flux: React.PropTypes.object
    };

    onClose = () => {
        let placeholder;
        let title = document.getElementById('dash-title');
        this.props.dashboard && this.props.customizeProps.edit ? placeholder = this.props.dashboard.name : placeholder = 'Dashboard Title';
        this.context.flux.getActions('dashboard-actions').toggleCustomize({ display: 'none'});
        title.value = "";
        title.setAttribute("placeholder", placeholder);
        document.getElementById('preview').setAttribute("src", "");
        document.getElementById('logo-upload').reset();
    }

    uploadFile = () => {
        let type = this.refs.logo.files[0].type;

        if (VALID_LOGO_TYPES.indexOf(type) == -1) {
            alert(UPLOAD_FORMATS_TEXT);
            return false;
        } else {
            let self = this;
            let preview = this.refs.preview;
            let file = this.refs.logo.files[0];
            this.reader = new FileReader();
            this.reader.addEventListener("load", function () {
                preview.src = self.reader.result;
            }, false);

            if (file) {
                this.reader.readAsDataURL(file);
            }
        }
    }

    updateDashboard = () => {
        let title = this.refs.dashboardTitle.value;
        let self = this;

        if (title == '' || !title.replace(/\s/g, '').length) {
            document.getElementById('error').style.display = "block";
            return false;
        }

        if (this.props.customizeProps && this.props.customizeProps.edit) {
            this.context.flux.getActions('dashboard-actions').editDashboard({
                id: this.props.dashboard.id,
                name: title.replace(/^[ ]+|[ ]+$/g,''),
                logo: self.reader ? self.reader.result : ''
            });
            this.onClose();
        } else {
            this.context.flux.getActions('dashboard-actions').createDashboard({name: title, logo: self.reader ? self.reader.result : ''});
            this.onClose();
        }

    }

    render() {
        let cover;
        let top = window.scrollY + Y_POS_OFFSET + 'px';
        let props = this.props;
        props.customizeProps.cover ? cover = (<Cover onClick={this.onClose} style={{backgroundColor: '#FFF', opacity: '0.9', zIndex: '1500'}}/>) : cover = '';

        return (
            <div style={{display: props.customizeProps.display}}>
                <div className="wrapper" style={{top: top}}>
                    <div id="customize">
                        <div className="close" onClick={this.onClose}><i className="fa fa-times" aria-hidden="true"></i></div>
                        <h1 className="header" >{props.customizeProps.title}</h1>
                        <h4 id="error"> * Please name your dashboard </h4>
                        <input id="dash-title" ref="dashboardTitle" className="title" maxLength="65" placeholder={this.props.dashboard && this.props.customizeProps.edit? this.props.dashboard.name : "Dashboard Title"} />
                        <h2> Logo </h2>
                        <h3> 100x30px (or 200px60px for retina) </h3>
                        <img src="" id="preview" ref="preview" />
                        <form id="logo-upload" ref="logoUpload" method="PUT" action="/ch/newdashboard" encType="multipart/form-data">
                            <input type="hidden" name="dashboardId" readOnly />
                            <input type="file"  name="logo" ref="logo" className="logo-input" onChange={this.uploadFile} />
                        </form>
                        <button onClick={this.updateDashboard}>{props.customizeProps.button}</button>
                    </div>
                </div>
                {cover}
            </div>
        )
    }

}

export default Customize;