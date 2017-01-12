'use strict';

import React from 'react';


import classNames from 'classnames';

import dustBunnies from './dustBunnies.gif';



import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('./welcomeScreen.scss');

class WelcomeScreen extends React.Component {


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
     


render(){

        return(
            <div>
                <img className='welcomeImage' src={dustBunnies} />
            </div>
            )
    }
}



export default WelcomeScreen;