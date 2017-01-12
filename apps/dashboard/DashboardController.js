'use strict';

import React from 'react';
import _ from 'lodash';
import Header from '../../common/components/header';
import ReportList from './components/ReportList/ReportList';
import Report from './components/Report/Report';


require('./scss/dashboard.scss');

class DashboardController extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            open: false,
            reports: [{name: 'First Report'}, {name: 'Second Report'}],
            selectedReport: 2,
        };
        this.burgerClick = this.burgerClick.bind(this);
        this.createNewReport = this.createNewReport.bind(this);
    }

    burgerClick(){
        this.setState({open: !this.state.open})
    }

    createNewReport(){
        this.setState({selectedReport: this.state.reports.length + 1})
    }

    render() {
        let reportToRender;
        if(!this.state.selectedReport && this.state.selectedReport !== 0){
            reportToRender = (<ReportList 
                                reports={this.state.reports}
                                createNewReport={this.createNewReport}
                            />)
        }
        else{
            reportToRender=(
                    <Report />
                )
        }
        return (
            <div className="controller">
                <Header burgerClick={this.burgerClick}/>
                {reportToRender}
            </div>
        );
    }
};

export default DashboardController;