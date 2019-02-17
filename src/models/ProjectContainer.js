const requestContainer = require("./RequestContainer");
const contextContainer = require("./ContextContainer");
const fileUtil = require("./file_util");
const { Container } = require("overstated");
const { homedir } = require('os');
const R = require('ramda');

const APP_SETTINGS_DIR = `${homedir}/.dispatch`;
const SETTINGS_FILE = `${APP_SETTINGS_DIR}/recent.json`;

// An unstated container which stores the currently open project file/path

class ProjectContainer extends Container {
  constructor() {
    super();
    this.state = { files: [] };
    this.init();
  }

  async loadRecentFiles() {
    if (await fileUtil.fileExists(APP_SETTINGS_DIR)) {
      const contents = await fileUtil.readFile(SETTINGS_FILE);
      const files = JSON.parse(contents);
      this.setState({ files });
    } else {
      await fileUtil.mkdir(APP_SETTINGS_DIR);
      fileUtil.writeFile(SETTINGS_FILE, JSON.stringify({}));
      
    }
  }

  async loadProject(path) {
    console.log(`loading project file ${path}`);
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
    if (this.isEmpty()) return {};
    return R.find(R.prop('active'))(this.state.requests);
  }

  async init() {
    await this.loadRecentFiles();

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

// module.exports.projectContainer = new ProjectContainer();

export default new ProjectContainer();
