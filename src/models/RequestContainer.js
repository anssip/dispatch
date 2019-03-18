import { Container } from "overstated";

const R = require("ramda");
const object = require("json-templater").object;

class RequestContainer extends Container {
  constructor() {
    super();
    this.state = { isModified: false, requests: [] };
  }

  // @ts-ignore
  setState(state, cb) {
    super.setState({ isModified: true, ...state }, cb);
  }
  mapRequests(requests) {
    return (requests || []).map(r =>
      typeof r.body === "string" ? r : { ...r, body: JSON.stringify(r.body) }
    );
  }
  init(requests) {
    this.setState({ isModified: false, requests: this.mapRequests(requests) });
  }
  reset() {
    this.setState({ isModified: false, requests: [] });
  }
  setModified(isModified) {
    this.setState({ isModified });
  }
  isModified() {
    return this.state.isModified;
  }
  addNewRequest() {
    this.addRequest(this.createEmptyRequest(true));
  }
  addRequest(request) {
    this.setState({
      requests: R.append(
        request,
        R.map(R.assoc("selected", false), this.state.requests || [])
      )
    });
  }
  replaceSelectedRequest(replaceWith) {
    return this.setState({
      isModified: true,
      requests: R.map(
        R.when(R.prop("selected"), R.partial(R.identity, [replaceWith])),
        this.state.requests
      )
    });
  }
  getRequests() {
    return this.state.requests;
  }
  getItems() {
    return this.getRequests();
  }
  getRequestCount() {
    return this.getRequests().length;
  }
  isEmpty() {
    return this.getRequests().length == 0;
  }
  createEmptyRequest(selected = true) {
    return {
      method: "GET",
      name: this.getNamePlaceholder(),
      url: "http://echo.dispatch.rest",
      selected,
      body: ""
    };
  }
  getNamePlaceholder() {
    // @ts-ignore
    const oldWithNum = this.state.requests
      .reverse()
      .find(r => r.name.indexOf("request-") >= 0);
    return oldWithNum
      ? `request-${Number(oldWithNum.name.split("request-")[1]) + 1}`
      : "request-0";
  }
  cloneNonSelected(request) {
    if (!request) throw new Error("request not specified");
    const newRequest = R.clone(request);
    newRequest.selected = false;
    return newRequest;
  }
  select(index) {
    console.log(`selecting request at ${index}`);
    const selectedLens = R.lensProp("selected");
    const noneSelectedRequests = R.map(
      R.assoc("selected", false),
      this.state.requests
    );
    const requests = R.over(
      R.lensIndex(index),
      R.set(selectedLens, true),
      noneSelectedRequests
    );
    return this.setState({ requests });
  }
  getSelected() {
    console.log("getSelected");
    if (this.isEmpty()) return {};
    return R.find(R.prop("selected"))(this.state.requests) || {};
    // return selected || this.state.requests[0];
  }
  setProp(prop, value) {
    const newReq = R.assoc(prop, value, R.clone(this.getSelected()));
    return this.replaceSelectedRequest(newReq);
  }
  setMethod(value) {
    return this.setProp("method", value);
  }
  setName(value) {
    return this.setProp("name", value);
  }
  setUrl(value) {
    return this.setProp("url", value);
  }
  setBody(value) {
    return this.setProp("body", value);
  }
  _addReqComponent({ component = "headers", name = null, value = null }) {
    const req = this.getSelected();
    if (!req) throw new Error("No request selected");

    const newValues = R.append({ name, value }, req[component] || []);
    const newReq = R.assoc(component, newValues, req);
    this.replaceSelectedRequest(newReq);
    return newReq;
  }
  _setCompProp(index, prop, value, component = "headers") {
    const req = this.getSelected();
    if (!req) throw new Error("No request selected");
    if (!req[component] || req[component].length < index) return;
    if (req[component].length <= index) {
      return this._addReqComponent({ component, [prop]: value });
    }

    const newValues = R.over(
      R.lensIndex(index),
      R.assoc(prop, value),
      req[component]
    );
    const newReq = R.assoc(component, newValues, req);
    this.replaceSelectedRequest(newReq);
    return newReq;
  }
  _deleteComp(index, component = "headers") {
    const req = this.getSelected();
    if (!req) return;
    if (!req[component] || req[component].length < index) return;

    const newReq = R.assoc(component, R.remove(index, 1, req[component]), req);
    this.replaceSelectedRequest(newReq);
    return newReq;
  }
  addHeader() {
    return this._addReqComponent({});
  }
  setHeaderName(index, name) {
    return this._setCompProp(index, "name", name);
  }
  setHeaderValue(index, value) {
    return this._setCompProp(index, "value", value);
  }
  deleteHeader(index) {
    this._deleteComp(index);
  }
  addParam() {
    return this._addReqComponent({ component: "params" });
  }
  setParamName(index, name) {
    console.log(`setParamName ${index}: `, name);
    return this._setCompProp(index, "name", name, "params");
  }
  setParamValue(index, value) {
    return this._setCompProp(index, "value", value, "params");
  }
  deleteParam(index) {
    this._deleteComp(index, "params");
  }
  getPreview(ctx, env, value) {
    const evalObject = value => {
      let tmpValue = `let __x = ${value}; __x;`;
      tmpValue = eval(tmpValue);
      return tmpValue;
    };
    const fill = (tmpl, ...rest) =>
      [evalObject(ctx), ...rest, env].reduce(
        (acc, curr) => object(acc, curr),
        tmpl
      );
    // @ts-ignore
    try {
      console.log(`======> about to fill`, value);
      let tmpValue = evalObject(value);
      // console.log(`afer initial eval`, tmpValue);
      tmpValue = fill(tmpValue);
      // console.log(`after ctx fill`, tmpValue);
      const result = JSON.stringify(tmpValue, null, 2);
      // console.log(`result ${JSON.stringify(result)}`);
      return result;
    } catch (e) {
      // console.error(e);
      return "";
    }
  }
}

export default new RequestContainer();
