
import React, { Component } from 'react';
import './App.css';
import MainWindow from './views/containers/MainWindow';
import { Provider } from 'overstated';
import ProjectContainer from "./models/ProjectContainer";
import fileUtil from "./models/file_util";
import ApplicationController from "./controller";

const { ipcRenderer} = window.require("electron");
const { homedir } = window.require('os');

console.log(`homedir ${homedir()}`);
const projectContainer = new ProjectContainer(fileUtil, homedir);
const controller = new ApplicationController(projectContainer);

const initProject = async () => {
  await projectContainer.init();
  const recentFiles = projectContainer.getFiles();
  console.log(`sending recent files of length ${recentFiles.length}`);
  ipcRenderer.send('recent-files', recentFiles);  
};
initProject();

// TODO: emit the files using IPC and catch em in main.js/menu.js

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