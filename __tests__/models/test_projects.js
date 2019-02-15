const projects = require("../../src/models/Projects")
const path = require('path');

it('should load a project file', async done => {
  const data = await projects.load(path.join(process.cwd(), "__tests__", "project.json"));
  console.log(data);
  expect(data.requests).toBeDefined();
  expect(data.context).toBeDefined();
  done();
});