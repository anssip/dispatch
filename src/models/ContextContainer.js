import { Container } from 'overstated'; 

const R = require('ramda');

class ContextContainer extends Container {
  state = { ctx: null };

  getValue() {
    return this.state.ctx;
  }

  setValue(value) {
    this.setState({ctx: value});
  }
}

export default new ContextContainer();