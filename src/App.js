import React, { Component } from 'react';
import './App.css';
import './containers/MainWindow'
import MainWindow from './containers/MainWindow';
import requestStore from './models/RequestContainer';
import { Provider } from 'overstated';

// @ts-ignore
const { app } = window.require('electron').remote;

class App extends Component {
  render() {
    return (
      <div className="App bp3-dark">
        <Provider>
          <MainWindow requestStore={requestStore} />
        </Provider>
      </div>
    );
  }
}

export default App;
