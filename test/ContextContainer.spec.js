import container from "../src/models/ContextContainer";
const { expect } = require("chai"); 
const R = require("ramda");

describe("ContextContainer", () => {
  const testEnvs = [
    {
      name: "test",
      variables: [
        { name: "appName", value: "Dispatch" },
        { name: "author", value: "Anssi Piirainen" },
        { name: "authorEmail", value: "api@iki.fi" },
        { name: "www", value: "https://dispatch.rest" }
      ]
    },
    {
      name: "prod",
      variables: [
        { name: "appName", value: "Dispatch.prod" },
        { name: "author", value: "Anssi J. Piirainen" },
        { name: "authorCity", value: "Espoo" },
        { name: "www", value: "https://dispatch.rest/docs" }
      ]
    }
  ];

  beforeEach(() => {
    container.init({}, testEnvs);
  });

  it("Should return the environmets", () => {
    const envs = container.getEnvs();
    expect(envs.length).to.be.eq(2);
    expect(envs[0].name).to.be.eq("test");
    expect(envs[1].name).to.be.eq("prod");
  });

  it("Adding a variable should throw and error when no env has been selected", () => {
    expect(R.bind(container.addNewVariable, container)).to.throw(Error, "Environment not selected");
  });

  it("Should add a new variable", () => {
    container.selectEnv(0).addNewVariable("added", "variable");
    const v = container.getVariable(4);
    expect(v.name).to.be.eq("added");
    expect(v.value).to.be.eq("variable");
    expect(container.getSelectedEnv().variables.length).to.be.eq(5);
  });

  it("Should modify an existring variable", () => {
    container.selectEnv(1).setVariable(2, { name: "authorHomeTown", value: "Kuopio" });
    expect(container.getSelectedEnv().variables.length).to.be.eq(4);
    const v = container.getVariable(2);
    expect(v.name).to.be.eq("authorHomeTown");
    expect(v.value).to.be.eq("Kuopio");
  });

  it("Should modify only the variable value", () => {
    container.selectEnv(1).setVariable(2, { value: "Helsinki" });
    expect(container.getSelectedEnv().variables.length).to.be.eq(4);
    const v = container.getVariable(2);
    expect(v.name).to.be.eq("authorCity");
    expect(v.value).to.be.eq("Helsinki");
  });

});