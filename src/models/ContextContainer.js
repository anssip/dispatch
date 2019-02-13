import React from 'react'; 
import { render } from 'react-dom'; 
import { Provider, Subscribe, Container } from 'overstated'; 
import { context } from './mock-context'; 

const R = require('ramda');

class ContextContainer extends Container {
  state = {
    ctx: context
  };

  getContext() {
    return this.state.ctx;
  }
}

export default ContextContainer;