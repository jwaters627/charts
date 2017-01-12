import React from 'react';
import classnames from 'classnames';

export default class EventTable extends React.Component {

  render() {
    const events = this.props.events.map( ( row ) => {
      let activeClass = classnames({"text-success": row.active}),
          activeIconClass = classnames([
            "fa",
            "fa-fw",
            row.active ? "fa-check-square-o" : "fa-square-o"
          ]),
          tdStyleOverride = {
            "verticalAlign":"baseline",
            width: "20%"
          };

      return (
        <tr key={row.id}>
          <td style={tdStyleOverride}>{row.event_label}</td>
          <td style={tdStyleOverride}>{row.event_type}</td>
          <td style={tdStyleOverride}>{row.event_selector}</td>
          <td style={tdStyleOverride} className={activeClass} onClick={()=>this.props.onToggleEventActive(row.id)}><i className={activeIconClass}></i></td>
          <td id={'event-'+row.id} style={tdStyleOverride}>
            <button style={ {"marginRight":8} } onClick={()=>this.props.onEditEvent(row)} className="button secondary">Edit</button>
            <button onClick={()=>this.props.onDeleteEvent(row.id)} className="button secondary">Delete</button>
          </td>
        </tr>
      );
    } );
    return (
      <div>
        <table className="ch-table bigTable">
          <thead>
            <tr>
              <th>Label</th>
              <th>Type</th>
              <th>Selector</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events}
          </tbody>
        </table>
      </div>
      );
  }
};
