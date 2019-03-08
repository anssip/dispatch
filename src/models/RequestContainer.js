import { Container } from 'overstated';

const R = require('ramda');
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
    return (requests || []).map(r => typeof r.body === "string" ? r : { ...r, body: JSON.stringify(r.body) } );
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
    this.addRequest(this.createEmptyRequest());
  }

  addRequest(request) {
    this.setState({ requests: [... R.map(this.cloneNonSelected, this.state.requests || []), request] });
  }

  replaceSelectedRequest(replaceWith) {
    return this.setState({ 
      isModified: true,
      requests: R.map( R.when(R.prop('selected'), R.partial(R.identity, [replaceWith])), this.state.requests)
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
  createEmptyRequest() {
    return {
      method: 'GET',
      name: this.getNamePlaceholder(),
      url: 'http://echo.dispatch.rest',
      selected: true,
      body: ""
    };
  }
  getNamePlaceholder() {
    // @ts-ignore
    const oldWithNum = this.state.requests.reverse().find(r => r.name.indexOf('request-') >= 0);
    return oldWithNum ? `request-${Number(oldWithNum.name.split('request-')[1]) + 1}` : 'request-0';
  }
  cloneNonSelected(request) {
    if (! request) throw new Error('request not specified');
    const newRequest = R.clone(request);
    newRequest.selected = false;
    return newRequest;
  }
  select(index) {
    console.log(`selecting request at ${index}`);
    const req = this.cloneNonSelected(this.state.requests[index]);
    req.selected = true;
    const newRequests = R.map(this.cloneNonSelected, this.state.requests);
    this.setState({ 
      requests: newRequests.map((r, i) => i === index ? req : r)
    });
  }
  getSelected() {
    console.log('getSelected');
    if (this.isEmpty()) return {};
    return R.find(R.prop('selected'))(this.state.requests) || {};
    // return selected || this.state.requests[0];
  }
  setProp(prop, req, value) {
    const newRequet = R.clone(req);
    newRequet[prop] = value;
    return this.replaceSelectedRequest(newRequet);
  }
  setMethod(req, value) {
      return this.setProp('method', req, value);
  } 
  setName(req, value) {
    return this.setProp('name', req, value);
  }
  setUrl(req, value) {
    return this.setProp('url', req, value);
  }
  setBody(req, value) {
    return this.setProp('body', req, value);
  }

  getPreview(ctx, env, value) {
    const evalObject = value => {
      let tmpValue = `let __x = ${value}; __x;`;
      tmpValue = eval(tmpValue);
      return tmpValue;
    }
    const fill = (tmpl, ...rest) => [evalObject(ctx), ...rest, env].reduce((acc, curr) => object(acc, curr), tmpl);


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
      return '';
    }
  }
}


export default new RequestContainer();