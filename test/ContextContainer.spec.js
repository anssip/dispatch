import container from "../src/models/ContextContainer";
const { expect } = require("chai"); 

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
        { name: "authorEmail", value: "anssi@dispatch.rest" },
        { name: "www", value: "https://dispatch.rest/docs" }
      ]
    }
  ];

  before(() => {
    container.init({}, testEnvs);
  });

  it("Should return the environmets", () => {
    const envs = container.getEnvs();
    expect(envs.length).to.be.eq(2);
    expect(envs[0].name).to.be.eq("test");
    expect(envs[1].name).to.be.eq("prod");
  });

  it("Should add a new env variable", () => {

  });

  it("Should modify an env variable", () => {

  });

});