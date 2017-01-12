'use strict';

import React from 'react';
import Charts from '../Charts/Charts'
import mui from 'material-ui';
import Add from 'react-material-icons/icons/content/add';
import Chart from 'react-material-icons/icons/social/poll';
import MoreHoriz from 'react-material-icons/icons/navigation/more-horiz'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import classNames from 'classnames';

require('./reportCanvas.scss');

class ReportCanvas extends React.Component {


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
            
        };
    }

   

    
   

    render() {
        let canvasClass = classNames(
            'reportCanvas',
            {
                "greyedCanvas": (this.props.selectedViz || this.props.selectedViz === 0)
            }
        );

        return (
            <div className={canvasClass} onClick={this.props.handleChartAreaClick}>
                <div className='titleContainer'>
                    <h3 className='logoInput'>+ Add Logo</h3>
                    <input className='reportTitle' defaultValue='Untitled Report'></input>
                </div>
                <Charts 
                        deleteChart={this.props.deleteChart} 
                        visualizations={this.props.visualizations}
                        handleChartAreaClick={this.props.handleChartAreaClick} 
                        openAddChart={this.props.openAddChart} 
                        handleChartClick={this.props.handleChartClick} 
                        selectedViz={this.props.selectedViz}
                        handleTitleInput={this.props.handleTitleInput} 
                        handleTitleUnfocus={this.props.handleTitleUnfocus}
                        editing={this.props.editing}
                        selectedTitle={this.props.selectedTitle}
                        clickedText={this.props.clickedText}
                        setName={this.props.setName}
                        monitors={this.props.monitors}
                        handleChartResize={this.props.handleChartResize}
                        handleEllipsisClick={this.props.handleEllipsisClick}
                        showMoreContainer={this.props.showMoreContainer}
                        duplicateChart={this.props.duplicateChart}
                        selectedAnnotation={this.props.selectedAnnotation}
                        handleAnnotationInput={this.props.handleAnnotationInput}
                        editingAnnotation={this.props.editingAnnotation}
                        setAnnotation={this.props.setAnnotation}
                        handleAnnotationUnfocus={this.props.handleAnnotationUnfocus}
                        setTitle={this.props.setTitle}
                    />
            </div>
        );
    }
}

export default ReportCanvas;