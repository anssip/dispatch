import requestContainer from "./RequestContainer";
import contextContainer from "./ContextContainer";
import authContainer from "./AuthContainer";
import { Container } from "overstated";

const R = require("ramda");

class ProjectContainer extends Container {
  constructor() {
    super();
    console.log("Creating new ProjectContainer");

    this.state = {
      recentIsActive: true,
      files: [],
      activeSidebarTab: "requests"
    };
  }
  // @ts-ignore
  setState(state, cb) {
    super.setState({ isModified: true, ...state }, cb);
  }

  async init(fileUtil, homedir) {
    this.APP_SETTINGS_DIR = `${homedir}/.dispatch`;
    this.SETTINGS_FILE = `${this.APP_SETTINGS_DIR}/settings.json`;
    this.fileUtil = fileUtil;

    await this.loadSettings();
    const activeProjectFile = this.getActive();
    if (!activeProjectFile) return;

    const project = await this.load(activeProjectFile);
    if (project) {
      requestContainer.init(project.requests);
      contextContainer.init(project.context, project.vars);
      authContainer.init(project.methods);
    }
  }

  async loadSettings() {
    if (!(await this.fileUtil.fileExists(this.APP_SETTINGS_DIR))) {
      await this.fileUtil.mkdir(this.APP_SETTINGS_DIR);
    }
    if (!(await this.fileUtil.fileExists(this.SETTINGS_FILE))) {
      this.fileUtil.writeFile(
        this.SETTINGS_FILE,
        JSON.stringify({ files: [], activeSidebarTab: "requests" })
      );
    }
    const contents = await this.fileUtil.readFile(this.SETTINGS_FILE);
    const data = JSON.parse(contents);
    this.setState(data);
    return data;
  }

  async load(path) {
    console.log(`loading project file ${path}`);
    try {
      const contents = await this.fileUtil.readFile(path);
      return JSON.parse(contents);
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
    if (!this.state.recentIsActive) return null;
    return this.state.files[0];
  }

  setActive(path) {
    this.updateMostRecent(path);
  }

  closeActive() {
    this.setState({ recentIsActive: false });
  }

  async save(path) {
    console.log(`Saving projet to path ${path}`);
    await this.fileUtil.writeFile(path, this.getProjectFileData());
    const files = this.updateMostRecent(path);
    console.log(`We have ${files.length} recent files`);
    console.log(`Saving settings to ${this.SETTINGS_FILE}`);
    await this.fileUtil.writeFile(
      this.SETTINGS_FILE,
      JSON.stringify({ files, activeSidebarTab: this.state.activeSidebarTab })
    );
    requestContainer.setModified(false);
    contextContainer.setModified(false);
    authContainer.setModified(false);
    return files;
  }

  async open(path) {
    const project = await this.load(path);
    if (project) {
      requestContainer.init(project.requests);
      contextContainer.init(project.context, project.vars);
      authContainer.init(project.methods);
      return this.updateMostRecent(path);
    }
    return null;
  }

  saveActiveProject() {
    const active = this.getActive();
    if (!active) throw new Error("Active project not set");
    return this.save(active);
  }

  saveToFile(filePath, data) {
    return this.fileUtil.writeFile(filePath, data);
  }

  updateMostRecent(path) {
    const files = R.uniq(R.prepend(path, this.state.files));
    this.setState({ recentIsActive: true, files });
    console.log(`updateMostRecent(): returning recent files ${files}`);
    return files;
  }

  // TODO: delegate to requestContainer.getPersistedData() and contextContainer.getPersistedData()
  getProjectFileData() {
    return JSON.stringify(
      {
        requests: requestContainer.getRequests(),
        context: contextContainer.getValue(),
        vars: contextContainer.getVariables(),
        methods: authContainer.getMethods()
      },
      null,
      2
    );
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

  isModified() {
    const isModified =
      requestContainer.isModified() || contextContainer.isModified();
    console.log(`ProjectContainer: isModified ? ${isModified}`);
    return isModified;
  }

  setActiveSidebarTab(activeSidebarTab) {
    this.setState({ activeSidebarTab });
  }

  getActiveSidebarTab() {
    return this.state.activeSidebarTab;
  }
}

export default new ProjectContainer();
