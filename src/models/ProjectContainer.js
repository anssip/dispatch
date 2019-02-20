import requestContainer from "./RequestContainer";

import contextContainer from "./ContextContainer";
import { Container } from "overstated";

const { homedir } = require('os');
const R = require('ramda');

const APP_SETTINGS_DIR = `${homedir}/.dispatch`;
const SETTINGS_FILE = `${APP_SETTINGS_DIR}/settings.json`;

// An unstated container which stores the currently open project file/path

class ProjectContainer extends Container {
  constructor(fileUtil) {
    super();
    this.fileUtil = fileUtil;
    this.state = { files: [] };
    this.init();
  }

  async loadSettings() {
    if (await this.fileUtil.fileExists(APP_SETTINGS_DIR)) {
      console.log("App settings dir exists");
      const contents = await this.fileUtil.readFile(SETTINGS_FILE);
      const data = JSON.parse(contents);
      this.setState(data);
      return data;
    } else {
      await this.initSettingsFile();
      return [];
    }
  }

  async initSettingsFile() {
    await this.fileUtil.mkdir(APP_SETTINGS_DIR);
    this.fileUtil.writeFile(SETTINGS_FILE, JSON.stringify({ files: [] }));
  }

  async loadProject(path) {
    console.log(`loading project file ${JSON.stringify(path)}`);
    const contents = await this.fileUtil.readFile(path);
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

  async saveProject(path) {
    console.log(`Saving projet to path ${path}`);
    await this.fileUtil.writeFile(path, this.getProjectFileData());
    const files = this.updateMostRecent(path);
    console.log(`We have ${files.length} recent files`);
    console.log(`Saving settings to ${SETTINGS_FILE}`);
    await this.fileUtil.writeFile(SETTINGS_FILE, JSON.stringify({ files }));
  }

  updateMostRecent(path) {
    const files = R.uniq(R.prepend(path, this.state.files));
    this.setState({ files });
    return files;
  }

  getProjectFileData() {
    return JSON.stringify({
      requests: requestContainer.getRequests(),
      context: contextContainer.getValue()
    }, null, 2);
  }

  // opens a new project (not saved yet)
  newProject() {
  }

  addRequest(request) {
    return requestContainer.addRequest(request);
  }

  setContext(context) {
    return contextContainer.setValue(context);
  }
}

// module.exports = new ProjectContainer(); 

export { ProjectContainer, SETTINGS_FILE };
