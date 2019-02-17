import requestContainer from "./RequestContainer";

import contextContainer from "./ContextContainer";
import fileUtil from"./file_util";
import { Container } from "overstated";

const { homedir } = require('os');
const R = require('ramda');

const APP_SETTINGS_DIR = `${homedir}/.dispatch`;
const SETTINGS_FILE = `${APP_SETTINGS_DIR}/settings.json`;

// An unstated container which stores the currently open project file/path

class ProjectContainer extends Container {
  constructor() {
    super();
    this.state = { files: [] };
    this.init();
  }

  async loadSettings() {
    if (await fileUtil.fileExists(APP_SETTINGS_DIR)) {
      console.log("App settings dir exists");
      const contents = await fileUtil.readFile(SETTINGS_FILE);
      const data = JSON.parse(contents);
      this.setState(data);
      return data;
    } else {
      await fileUtil.mkdir(APP_SETTINGS_DIR);
      fileUtil.writeFile(SETTINGS_FILE, JSON.stringify({ files: [] }));
      return [];
    }
  }

  async loadProject(path) {
    console.log(`loading project file ${JSON.stringify(path)}`);
    const contents = await fileUtil.readFile(path);
    const data = JSON.parse(contents);

    return {
      requests: data.requests.map(r => ({ ...r, body: JSON.stringify(r.body) })),
      context: JSON.stringify(data.context)
    };
  }

  getFiles() {
    return this.state.files;
  }

  isEmpty() {
    return this.getFiles().length == 0;
  }

  getActive() {
    console.log('getActive');
    if (this.isEmpty()) return null;
    return R.find(R.prop('active'))(this.state.files);
  }

  async init() {
    await this.loadSettings();

    const activeProjectFile = this.getActive();
    if (!activeProjectFile) return;
    const project = this.loadProject(activeProjectFile);
    requestContainer.init(project.requests);
    contextContainer.setValue(project.context);
  }

  // saves the current active project to the specified file
  saveProject(path) {
  }

  // opens a new project (not saved yet)
  newProject() {
  }
}

// module.exports = new ProjectContainer(); 

export default new ProjectContainer();
