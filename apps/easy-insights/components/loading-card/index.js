import React from 'react';

require('./loading-card.scss');

export default class LoadingCard extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
      return <div className="ei-card loading-card">
              <div className="card-block text-center card-content">
                  <p className="card-text">
                  </p>
                  <div className="grid-row">
                      <div className="col">
                          <ul className="loading">
                              <li></li>
                              <li></li>
                              <li></li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>;
   }
}
