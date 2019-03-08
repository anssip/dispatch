
class Dispatcher {

  constructor(requestContainer, contextContainer) {
    this.requestContainer = requestContainer;
    this.requestContainer = contextContainer;
  }

  dispatch(req) {
    console.log(`Dispatching ${JSON.stringify(req)}`);
  }

};

export default Dispatcher;