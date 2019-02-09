import React from 'react';
import { render } from 'react-dom';
import { Provider, Subscribe, Container } from 'overstated';
import mockRequests from './mock-requests';
import { identity } from 'rxjs';

const R = require('ramda');

class RequestContainer extends Container {
  state = { requests: mockRequests, context: [] };

  addRequest() {
    this.setState({ requests: [...this.state.requests, this.createEmptyRequest()] });
  }
  replaceSelectedRequest(replaceWith) {
    this.setState({ 
      requests: R.map( R.when(R.prop('selected'), R.partial(R.identity, [replaceWith])), this.state.requests)
    });
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
    const newRequests = R.map(this.cloneNonSelected, this.state.requests);
    const arrayIndexes = [...Array(newRequests.length).keys()];
    this.setState({ 
      requests: R.map(R.ifElse(R.equals(index), R.partial(R.identity, [req]), R.partialRight(R.prop, [newRequests])), arrayIndexes)
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
    this.replaceSelectedRequest(newRequet);
  }
  setMethod = R.partial(R.bind(this.setProp, this), ['method']);
  setName = R.partial(R.bind(this.setProp, this), ['name']);
}

export default RequestContainer;