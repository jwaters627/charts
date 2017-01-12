'use strict';

import React from 'react';
import _ from 'lodash';

require('./BarsCard.scss');

class BarsCard extends React.Component {
    static propTypes = {
        data: React.PropTypes.array.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.forceUpdate();
        }
    }
  
        
 
    

    render() {
        const styles = {
            width: this.props.width,
            height: this.props.height
        };
        let color = this.props.data.colors[0]
        let data = this.props.data.cardData;
        let max = _.max(_.map(data[0], function(d) { return d.count; }));
        if (data.length % 2 != 0) {
            data.push({label: '', value: 0, addlClass: 'last-odd'});
        }

        return (
            <div className="bars-card" style={styles}>
                {data[0].map(function(d, i) {
                    let width = Math.round((d.count / max) * 100) + '%';
                    let addlClass = (d.addlClass) ? d.addlClass : '';

                    return (
                        <div key={i} className={'bar-row ' + addlClass}>
                            <div className="label">{d.hashtag}</div>
                            <div className="bar"><span style={{width: width, backgroundColor: color}}></span></div>
                            <div className="count">{d.count}+</div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default BarsCard;