
class Dispatcher {

  constructor(requestContainer, contextContainer) {
    this.requestContainer = requestContainer;
    this.requestContainer = contextContainer;
  }

  dispatch(req) {
    console.log(`Dispatching ${JSON.stringify(req)}`);

    /*

    TODO:
      - build the request based on data from the req argument and with requestContainer.getPreview() logic
      - dispatch using node-fetch
      - collect the response data
      - a new ResponseContainer to receive the response data
      - ResponseView connects to the ResponseContainer
      - Responses are also persisted

    */
  }

};

export default Dispatcher;