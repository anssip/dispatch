import React, { Component } from 'react';
import './App.css';
import './containers/MainWindow'
import MainWindow from './containers/MainWindow';
import { Provider } from 'overstated';
import requestContainer from "./models/RequestContainer";
import contextContainer from "./models/ContextContainer";
import {projects} from  "./models/Projects";

// @ts-ignore
const { app } = window.require('electron').remote;
const path = require('path');
// const projects = require("../lib/projects");
// projects.load(path.join(process.cwd(), "__tests__", "project.js"));

const loadProject = async () => {
  const data = await projects.load(path.join("/Users/anssipiirainen/Documents/projects/npd/gasbag", "__tests__", "project.json"));
  console.log("got data", data);
  requestContainer.init(data.requests);
  contextContainer.setValue(data.context);
}

class App extends Component {
  render() {
    loadProject();

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