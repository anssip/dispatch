import React from 'react';
import { render } from 'react-dom';
import { Provider, Subscribe, Container } from 'overstated';
import mockRequests from './mock-requests';

const R = require('ramda');

class RequestContainer extends Container {
  state = { requests: mockRequests, context: [] };

  addRequest() {
    this.setState({ requests: [...this.state.requests, this.createEmptyRequest()] });
  }
  replaceRequest(request) {
    this.setState({ requests: this.state.requests.map((r, i) => r.selected ? request : r) });
  }
  getRequests() {
    return this.state.requests;
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
      selected: true
    };
  }
  getNamePlaceholder() {
    // @ts-ignore
    const oldWithNum = this.state.requests.reverse().find(r => r.name.indexOf('request-') >= 0);
    return oldWithNum ? `request-${Number(oldWithNum.name.split('request-')[1]) + 1}` : 'request-0';
  }
  cloneNonSelected(request) {
    const newRequest = R.clone(request);
    newRequest.selected = false;
    return newRequest;
  }
  select(index) {
    console.log(`selecting request at ${index}`);
    const req = this.cloneNonSelected(this.state.requests[index]);
    req.selected = true;
    const newRequests = this.state.requests.map(r => this.cloneNonSelected(r))
    this.setState({ requests: newRequests.map((r, i) => i === index ? req : r) });
  }
  getSelected() {
    console.log('getSelected');
    if (this.isEmpty()) return {};
    return this.state.requests.find(r => r.selected);
  }
  setMethod(req, method) {
    const newRequet = R.clone(req);
    newRequet.method = method;
    this.replaceRequest(newRequet);
  }
}

export default RequestContainer;