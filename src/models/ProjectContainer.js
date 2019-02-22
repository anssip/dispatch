import requestContainer from "./RequestContainer";
import contextContainer from "./ContextContainer";
import { Container } from "overstated";

const R = require('ramda');

class ProjectContainer extends Container {
  constructor(fileUtil, homedir) {
    super();

    this.APP_SETTINGS_DIR = `${homedir()}/.dispatch`;
    this.SETTINGS_FILE = `${this.APP_SETTINGS_DIR}/settings.json`;

    this.fileUtil = fileUtil;
    this.state = { recentIsActive: true, files: [] };
  }

  async init() {
    await this.loadSettings();

    const activeProjectFile = this.getActive();
    if (!activeProjectFile) return;
    
    const project = await this.loadProject(activeProjectFile);
    requestContainer.init(project ? project.requests : []);
    contextContainer.setValue(project ? project.context : null);
  }

  async loadSettings() {
    if (! await this.fileUtil.fileExists(this.APP_SETTINGS_DIR)) {
      await this.fileUtil.mkdir(this.APP_SETTINGS_DIR);
    }
    if (! await this.fileUtil.fileExists(this.SETTINGS_FILE)) {
      this.fileUtil.writeFile(this.SETTINGS_FILE, JSON.stringify({ files: [] }));
    }
    const contents = await this.fileUtil.readFile(this.SETTINGS_FILE);
    const data = JSON.parse(contents);
    this.setState(data);
    return data;
  }


  async loadProject(path) {
    console.log(`loading project file ${JSON.stringify(path)}`);
    try {
      const contents = await this.fileUtil.readFile(path);
      const data = JSON.parse(contents);
  
      return {
        requests: data.requests.map(r => ({ ...r, body: JSON.stringify(r.body) })),
        context: JSON.stringify(data.context)
      };
    } catch (err) {
      // the project file does not exist
      return null;
    }
  }

  getFiles() {
    return this.state.files;
  }

  isEmpty() {
    return this.getFiles().length == 0;
  }

  getActive() {
    if (! this.state.recentIsActive) return null;
    return this.state.files[0]; }

  setActive(path) {
    this.updateMostRecent(path);
    this.setState({ recentIsActive: true });
  }

  closeActive() {
    this.setState({ recentIsActive: false });
  }

  async saveProject(path) {
    console.log(`Saving projet to path ${path}`);
    await this.fileUtil.writeFile(path, this.getProjectFileData());
    const files = this.updateMostRecent(path);
    console.log(`We have ${files.length} recent files`);
    console.log(`Saving settings to ${this.SETTINGS_FILE}`);
    await this.fileUtil.writeFile(this.SETTINGS_FILE, JSON.stringify({ files }));
    return files;
  }

  async openProject(path) {
    const project = await this.loadProject(path);
    if (project) {
      requestContainer.init(project.requests);
      contextContainer.setValue(project.context);
      return this.updateMostRecent(path);
    }
    return null;
  }

  saveActiveProject() {
    const active = this.getActive();
    if (!active) throw new Error("Active project not set");
    return this.saveProject(active);
  }

  updateMostRecent(path) {
    const files = R.uniq(R.prepend(path, this.state.files));
    this.setState({ files });
    console.log(`updateMostRecent(): returning recent files ${files}`);
    return files;
  }

  getProjectFileData() {
    // TODO: Preserve requests & contexts when stringifying
    return JSON.stringify({
      requests: requestContainer.getRequests(),
      context: contextContainer.getValue()
    }, null, 2);
  }

  newProject() {
    requestContainer.reset();
    contextContainer.reset();
    this.closeActive();
  }

  addRequest(request) {
    return requestContainer.addRequest(request);
  }

  setContext(context) {
    return contextContainer.setValue(context);
  }
}

// module.exports = new ProjectContainer(); 

export default ProjectContainer;
