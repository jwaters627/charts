'use strict';

import React from 'react';
import classNames from 'classNames';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./chartOptions.scss');




class ChartOptions extends React.Component {


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
                   open: false,
                   openCalendar: false,
                   startDate: 'Start Date',
                   endDate: 'End Date',
        };
        this.setChartOptions = this.setChartOptions.bind(this);
    }

    
    setChartOptions(item){
        let myClasses = classNames(
            'sourceContainer',
            {
                "open": item.selected,

            }
        );

        let chartOptionsClass = classNames(
            'chartOptionText',
            {
                "selectedOption": this.props.selectedChartOption === this.props.chartOptions[item.id].type
            }
        );

        let chartOptionsImageClass = classNames(
            'chartOptionImage',
            {
                "selectedOptionImage": this.props.selectedChartOption === this.props.chartOptions[item.id].type
            }
        );
            
            return(
                <div className={myClasses} id={item.name} onClick={ ( e ) => { this.props.setVizChartType( e, item ) } }>
                     <img className={chartOptionsImageClass} src={item.source} />
                     <p className={chartOptionsClass}>{item.text}</p>
                </div>
                )
    
    }


render(){
    let showClass = classNames(
        'allOptionsContainer',
        { 
            open: this.props.chartOptionOpen
        }
        );

        return(
            <div className={showClass}>
                <h4 className='chartTypeLabel'>Chart Type</h4>
                {this.props.chartOptions.map(this.setChartOptions)}
            </div>
            )
    }
}



export default ChartOptions;