
import React, { Component } from 'react';
import './App.css';
import MainWindow from './views/containers/MainWindow';
import { Provider } from 'overstated';
import ProjectContainer from "./models/ProjectContainer";
import fileUtil from "./models/file_util";
import ApplicationController from "./controller/ApplicationController";

const { ipcRenderer } = window.require("electron");
const { homedir } = window.require('os');

console.log(`homedir ${homedir()}`);
const projectContainer = new ProjectContainer(fileUtil, homedir);
const controller = new ApplicationController(projectContainer);

// TODO: emit the files using IPC and catch em in main.js/menu.js

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { initialized: false };
    this.init();
  }

  async init() {
    await projectContainer.init();

    const recentFiles = projectContainer.getFiles();
    const filename = projectContainer.getActive();

    console.log(`sending recent files of length ${recentFiles.length}`);
    ipcRenderer.send('recent-files', { filename, recentFiles });
    this.setState({ initialized: true });
  }


  render() {

    return (
      this.state.initialized ?
        <div className="App bp3-dark">
          <Provider>
            <MainWindow />
          </Provider>
        </div>
        : "loading"
    );
  }
}

export default App;