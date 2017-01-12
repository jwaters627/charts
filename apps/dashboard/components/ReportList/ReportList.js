'use strict';

import React from 'react';

import classNames from 'classnames';

import data from '../../data';


import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./reportList.scss');

class ReportList extends React.Component {


     static childContextTypes =
    {
        muiTheme: React.PropTypes.object
    }

    getChildContext()
    {
        return {
            muiTheme: getMuiTheme()
        }
    }



    constructor(props) {
        super(props);
        this.state = {
                   
             }
           
        }


    renderReportList(item){
        return(
                <div className='reportContainer'>
                    <h4>{item.name}</h4>
                </div>
            )
    }


render(){
    

        return(
            <div className='reportListContainer'>
                <div className='reportContainer' onClick={this.props.createNewReport}>
                    <h4> + New Report</h4>
                </div>
                 {this.props.reports.map(this.renderReportList)}
            </div>
            )
    }
}



export default ReportList;