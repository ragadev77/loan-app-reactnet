import React, { Component } from 'react';

export class DbLoggerPage extends Component {
  static displayName = DbLoggerPage.name;

  constructor(props) {
    super(props);
    this.state = { dbloggers: [], loading: true };
  }

  componentDidMount() {
    this.populateData();
  }

  static renderTable(dbloggers) {
    return (
      <table className='table table-striped table-bordered' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Message</th>
            <th>Error</th>
            <th>Code</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {dbloggers.map(d =>
            <tr key={d.id}>
                <td>{d.log_name}</td>
                <td>{d.log_category}</td>
                <td>{d.log_message}</td>
                <td>{d.log_error}</td>
                <td>{d.log_code}</td>
                <td>{d.log_time}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
        : DbLoggerPage.renderTable(this.state.dbloggers);

    return (
      <div>
        <h1 id="tabelLabel" >Database Logger </h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

  async populateData() {
    const apiUrl = process.env.REACT_APP_URL_CREDITLOAN_LOG;     
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    this.setState({ dbloggers: data, loading: false });
  }
}
