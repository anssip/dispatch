import { Container } from 'overstated';

const R = require('ramda');

class RequestContainer extends Container {
  constructor() {
    super();
    this.state = { requests: [] };
  }

  init(requests) {
    this.setState({ requests: requests || [] });
  }

  reset() {
    this.setState({ requests: [] });
  }

  addNewRequest() {
    this.addRequest(this.createEmptyRequest());
  }

  addRequest(request) {
    this.setState({ requests: [... R.map(this.cloneNonSelected, this.state.requests || []), request] });
  }

  replaceSelectedRequest(replaceWith) {
    return this.setState({ 
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
    if (! newRequest) throw new Error('failed to clone the request');
    newRequest.selected = false;
    return newRequest;
  }
  select(index) {
    console.log(`selecting request at ${index}`);
    const req = this.cloneNonSelected(this.state.requests[index]);
    console.log('clone result', req);    
    req.selected = true;
    const newRequests = R.map(this.cloneNonSelected, this.state.requests);
    const arrayIndexes = [...Array(newRequests.length).keys()];
    this.setState({ 
      requests: newRequests.map((r, i) => i === index ? req : r)
      // requests: R.map(R.ifElse(R.equals(index), R.partial(R.identity, [req]), R.partialRight(R.prop, [newRequests])), arrayIndexes)
    });
  }
  getSelected() {
    console.log('getSelected');
    if (this.isEmpty()) return {};
    return R.find(R.prop('selected'))(this.state.requests);
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
}


export default new RequestContainer();