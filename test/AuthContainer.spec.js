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
      username: "anssdfi",
      password: "secrasdfetx"
    },
    {
      type: "basic",
      username: "anssip",
      password: "secregggtx"
    },
    {
      type: "basic",
      username: "anssijp",
      password: "secretsadfx"
    },
    {
      type: "basic",
      username: "anssi"
    }
  ];

  beforeEach(() => {
    container.init(testMethods);
  });

  it("should move a method", () => {
    const methods = container.move({ oldIndex: 1, newIndex: 3 });
    console.log(methods);
    expect(methods[0].oldIndex).to.be.eq(0);
    expect(methods[0].username).to.be.eq("anssi");
    expect(methods[1].oldIndex).to.be.eq(2);
    expect(methods[1].username).to.be.eq("anssip");
    expect(methods[3].oldIndex).to.be.eq(1);
    expect(methods[3].username).to.be.eq("anssdfi");
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
