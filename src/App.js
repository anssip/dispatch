import React, { Component } from 'react';
import './App.css';
import MainWindow from './views/containers/MainWindow';
import { Provider } from 'overstated';
import requestContainer from "./models/RequestContainer";
import contextContainer from "./models/ContextContainer";

const projectContainer = require("./models/ProjectContainer");

// @ts-ignore
const { app } = window.require('electron').remote;
const path = require('path');

class App extends Component {
  render() {

    return (
      <div className="App bp3-dark">
        <Provider>
          <MainWindow />
        </Provider>
      </div>
    );
  }
}

export default App;