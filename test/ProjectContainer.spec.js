import ProjectContainer from "../src/models/ProjectContainer";
import fileUtil from "../src/models/file_util";
const {
  expect
} = require("chai");
const path = require("path");
const TEMP_PROJECT_PATH = path.join(process.cwd(), "test", "out", "testproj.json")

describe("project container", () => {
  let projectContainer;
  // runs before all tests in this block
  before(async function () {
    fileUtil.setFs(require("fs"));
    await fileUtil.unlink(TEMP_PROJECT_PATH);
    projectContainer = new ProjectContainer(fileUtil, require('os').homedir);
    await projectContainer.init();
  });

  describe("load recent files", () => {
    it("Should load the recent files", async () => {
      expect(projectContainer).to.not.be.undefined;
      const settings = await projectContainer.loadSettings();
      console.log(`got settings`, settings);
      expect(settings.files.length).to.be.greaterThan(0);
    });
    it("Should automatically load the recent files when created", async () => {
      expect(projectContainer).to.not.be.undefined;
      const files = await projectContainer.getFiles();
      console.log(`got recent files`, files);
      expect(files.length).to.be.greaterThan(0);
    });
  });

  it("Should save the project", async () => {
    // add some requests and context to the project
    const data = await fileUtil.readFile(path.join(process.cwd(), "test", "project.json"));
    const expected = JSON.parse(data);
    console.log(`loaded project ${data}`);

    expected.requests.forEach(r => {
      projectContainer.addRequest(r);
    });
    projectContainer.setContext(expected.context);

    await projectContainer.saveProject(TEMP_PROJECT_PATH);

    // verify saved files
    const resultData = await fileUtil.readFile(TEMP_PROJECT_PATH);
    const result = JSON.parse(data);

    expect(result.requests.length).to.be.equal(expected.requests.length);
    expect(result.context.source.name).to.be.equal(expected.context.source.name);

    const settingsData = await fileUtil.readFile(projectContainer.SETTINGS_FILE);
    const settings = JSON.parse(settingsData);

    expect(settings.files.length).to.be.greaterThan(0);
    expect(settings.files).to.be.an('array').that.does.includes(TEMP_PROJECT_PATH);
  });
})