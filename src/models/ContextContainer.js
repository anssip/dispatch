import { Container } from 'overstated'; 

const R = require('ramda');

class ContextContainer extends Container {
  constructor() {
    super();
    this.state = { isModified: false, ctx: null };
  }

  getValue() {
    return this.state.ctx;
  }

  setValue(value) {
    this.setState({ isModified: true, ctx: value});
  }

  init(value) {
    this.setState({ isModified: false, ctx: value});
  }

  reset() {
    this.setState({ isModified: false, ctx: null });
  }

  isModified() {
    return this.state.isModified;
  }

  setModified(isModified) {
    this.setState({ isModified });
  }
}

export default new ContextContainer();