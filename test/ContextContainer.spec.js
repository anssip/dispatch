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
    const v = container.getVariableByName("prod", "added");
    expect(v).to.be.eq("variable");
  });

  it("Should modify an existring variable", () => {
    const newVars = container.setVariable("prod", "author", "Kuopio");
    console.log(JSON.stringify(newVars, null, 2));
    const v = container.getVariableByName("prod", "author");
    console.log(v);
    expect(v).to.be.eq("Kuopio");
  });

  it("Should update a variable name in all envs", () => {
    const newVars = container.setVariableNameAt(1, "authorName" );
    console.log(JSON.stringify(newVars, null, 2));
    expect(newVars[1].name).to.be.eq("authorName");
    // other vars should keep their orig values
    expect(newVars[0].name).to.be.eq("appName");
    expect(newVars[2].name).to.be.eq("email");
  });

  it("Should update environtment name", () => {
    const newVars = container.setEnvironmentName("prod", "stage");
    console.log(JSON.stringify(newVars, null, 2));
    const envs = container.getEnvs();
    expect(envs.length).to.be.eq(2);
    expect(envs[0]).to.be.eq("test");
    expect(envs[1]).to.be.eq("stage");
  });

  it("should add an empty variable", () => {
    let newVars = container.addEmptyVariable();
    console.log(JSON.stringify(newVars, null, 2));

    const pos = newVars.length - 1;
    newVars = container.setVariableAt("prod", pos, { name: 'foobar', value: "now" });
    console.log(JSON.stringify(newVars, null, 2));
    expect(newVars[pos].name).to.be.eq("foobar");
    expect(newVars[pos].values.length).to.be.eq(1);
    expect(newVars[pos].values[0].env).to.be.eq("prod");
    expect(newVars[pos].values[0].value).to.be.eq("now");
  });

  it("should get variable value using index", () => {
    const value = container.getVariableAt("prod", 1);
    console.log(value);
    expect(value).to.be.eq("Anssi Piirainen");
  })

  it("should return null if var not found", () => {
    const value = container.getVariableAt("stage", 1);
    console.log(value);
    expect(value).to.be.null;
  })

});