import React, { Component } from 'react';
import './App.css';
import './containers/MainWindow'
import MainWindow from './containers/MainWindow';

// This should be replace with real data / state mgmt
import requests from './models/mock-requests';

// @ts-ignore
const {app} = window.require('electron').remote;

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>React + Electron = <span role="img" aria-label="love">😍</span></h2>
        </div>
        <p className="App-intro">
          Version: {app.getVersion()}
        </p>

        <MainWindow requests={requests} />
      </div>
    );
  }
}

export default App;
