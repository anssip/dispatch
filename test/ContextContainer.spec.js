import container from "../src/models/ContextContainer";
const { expect } = require("chai");
const R = require("ramda");

describe("ContextContainer", () => {
  const testVars = [
    {
      name: "appName",
      values: [
        { env: "test", value: "Dispatch" },
        { env: "prod", value: "Dispatch" }
      ]
    },
    {
      name: "author",
      values: [
        { env: "test", value: "Anssi" },
        { env: "prod", value: "Anssi Piirainen" }
      ]
    },
    {
      name: "email",
      values: [
        { env: "test", value: "api@iki.fi" },
        { env: "prod", value: "anssi@dispatch.rest" }
      ]
    },
    {
      name: "version",
      values: [
        { env: "prod", value: "1.0" }
      ]
    },
    {
      name: "license",
      values: [
        { env: "prod", value: "GPL" }
      ]
    }
  ];

  beforeEach(() => {
    container.init({}, testVars);
  });

  it("Should return the environmets", () => {
    const envs = container.getEnvs();
    console.log(envs);
    expect(envs.length).to.be.eq(2);
    expect(envs[0]).to.be.eq("test");
    expect(envs[1]).to.be.eq("prod");
  });

  it("Should get all varaibles from the specified env", () => {
    const vars = container.getEnvironment("prod");
    console.log(vars);
  });


  it("Should add a new variable", () => {
    const newVars = container.setVariable("prod", "added", "variable");
    const v = container.getVariable("prod", "added");
    expect(v).to.be.eq("variable");
  });

  it("Should modify an existring variable", () => {
    const newVars = container.setVariable("prod", "author", "Kuopio");
    console.log(JSON.stringify(newVars));
    const v = container.getVariable("prod", "author");
    console.log(v);
    expect(v).to.be.eq("Kuopio");
  });

  it("Should update environtment name", () => {
    const newVars = container.setEnvironmentName("prod", "stage");
    console.log(JSON.stringify(newVars));
    const envs = container.getEnvs();
    expect(envs.length).to.be.eq(2);
    expect(envs[0]).to.be.eq("test");
    expect(envs[1]).to.be.eq("stage");
  });

  it("should add a new environment", () => {
    const newVars = container.addNewEnvironment("local");
    console.log(JSON.stringify(newVars, null, 2));
  });

});