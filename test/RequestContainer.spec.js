import container from "../src/models/RequestContainer";
const { expect } = require("chai");
const R = require("ramda");

const print = json => console.log(JSON.stringify(json, null, 2));

describe("RequestContainer", () => {
  const testRequests = [
    {
      method: "POST",
      name: "request-0",
      url: "http://echo.dispatch.rest",
      selected: false,
      body: "Heippa homot!",
      authMethod: 0
    },
    {
      name: "Create test source",
      method: "POST",
      url: "https://localhost:8000/connectors/gt-source",
      headers: [
        { name: "Cache-Control", value: "max-age=0" },
        { name: "Connection", value: "keep-alive" }
      ],
      params: [
        { name: "param1", value: "value1" },
        { name: "param2", value: "value2" }
      ],
      body: '{req1_config:"{{ctx.source.config}}"}',
      selected: false,
      authMethod: 2
    },
    {
      name: "Create foobar sink",
      method: "POST",
      url: "https://localhost:8000/connectors/gt-sink",
      body:
        '{\n  anotherConfig: "{{source.config}}",\n  numFoos:{"foo":1001}\n}',
      selected: true,
      authMethod: 0
    },
    {
      method: "DELETE",
      name: "testX",
      url: "http://echo.dispatch.rest",
      selected: false,
      body: '{\n\tblob: "blob1"\n}',
      authMethod: 1
    }
  ];

  beforeEach(() => {
    container.init(testRequests);
  });

  it("Should update the authMethod", () => {
    const methods = [
      { oldIndex: 0 },
      { oldIndex: 3 },
      { oldIndex: 1 },
      { oldIndex: 2 }
    ];
    const requests = container.updateAuthMethods(methods);
    console.log(requests);
    // TODO: add expectations
  });

  it("Should add a new request header", () => {
    container.select(0);
    const req = container.addHeader();
    print(req);
    expect(req.headers[0].name).to.be.eq(null);
    expect(req.headers[0].value).to.be.eq(null);
  });

  it("Should set a header name & value", () => {
    container.select(0);
    container.addHeader();
    container.setHeaderName(0, "content-type");
    container.setHeaderValue(0, "application/json");
    const req = container.getSelected();
    expect(req.headers[0].name).to.be.eq("content-type");
    expect(req.headers[0].value).to.be.eq("application/json");
  });

  it("Should delete a request header", () => {
    container.select(1);
    container.deleteHeader(0);
    const req = container.getSelected();
    expect(req.headers.length).to.be.eq(1);
    expect(req.headers[0].name).to.be.eq("Connection");
    expect(req.headers[0].value).to.be.eq("keep-alive");
  });

  it("Should add a new param", () => {
    container.select(0);
    const req = container.addParam();
    print(req);
    expect(req.params[0].name).to.be.eq(null);
    expect(req.params[0].value).to.be.eq(null);
  });

  it("Should set a param name & value", () => {
    container.select(0);
    container.addParam();
    container.setParamName(0, "download");
    container.setParamValue(0, 1);
    const req = container.getSelected();
    expect(req.params[0].name).to.be.eq("download");
    expect(req.params[0].value).to.be.eq(1);
  });

  it("Should delete a request param", () => {
    container.select(1);
    container.deleteParam(0);
    const req = container.getSelected();
    expect(req.params.length).to.be.eq(1);
    expect(req.params[0].name).to.be.eq("param2");
    expect(req.params[0].value).to.be.eq("value2");
  });
});
