import { Container } from 'overstated'; 

const R = require('ramda');

class ContextContainer extends Container {
  constructor() {
    super();
    this.state = { ctx: null };
  }

  getValue() {
    return this.state.ctx;
  }

  setValue(value) {
    this.setState({ctx: value});
  }

  reset() {
    this.setState({ ctx: null });
  }
}

export default new ContextContainer();