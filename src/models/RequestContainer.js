import React from 'react';
import { render } from 'react-dom';
import { Provider, Subscribe, Container } from 'overstated';
import mockRequests from './mock-requests';


class RequestContainer extends Container {
  state = { requests: mockRequests, context: [], selected: -1 };

  addRequest() {
    this.setState({ requests: [...this.state.requests, this.createEmptyRequest()], selected: this.state.requests.length });
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
      url: 'http://echo.dispatch.rest'
    };
  }
  getNamePlaceholder() {
    // @ts-ignore
    const oldWithNum = this.state.requests.reverse().find(r => r.name.indexOf('request-') >= 0);
    return oldWithNum ? `request-${Number(oldWithNum.name.split('request-')[1]) + 1}` : 'request-0';
  };
  select(index) {
    console.log(`selecting request at ${index}`);
    this.setState({ selected: index });
  }
  getSelected() {
    console.log('getSelected');
    if (this.isEmpty() || this.state.selected == -1) return { url: 'fooooo'};
    return this.state.requests[this.state.selected];
  }
}

export default RequestContainer;