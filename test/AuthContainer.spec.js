import container from "../src/models/AuthContainer";
const { expect } = require("chai");
const R = require("ramda");

const print = json => console.log(JSON.stringify(json, null, 2));

describe("AuthContainer", () => {
  const testMethods = [
    {
      type: "basic",
      username: "anssi",
      password: "secretx"
    },
    {
      type: "basic",
      username: "anssi"
    }
  ];

  beforeEach(() => {
    container.init(testMethods);
  });

  it("should add basic auth username to a request without any existing auth", () => {
    container.select(1);
    const method = container.setProp("username", "carlos");
    print(method);
    expect(method.username).to.be.eq("carlos");
    expect(method.password).to.be.undefined;
  });
  it("should update basic auth username", () => {
    container.select(0);
    const method = container.setProp("username", "hank");
    print(method);
    expect(method.username).to.be.eq("hank");
    expect(method.password).to.be.eq("secretx");
  });
  it("should change the selected auth type", () => {
    container.select(0);
    const method = container.setProp("type", "bearer");
    expect(method.username).to.be.eq("anssi");
    expect(method.password).to.be.eq("secretx");
  });
});
