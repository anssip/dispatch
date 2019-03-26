const request = require("request");

class Dispatcher {
  constructor(requestBuilder) {
    this.builder = requestBuilder;
  }

  req() {
    return this.builder.req;
  }

  dispatch(req) {
    const options = {
      method: "POST",
      url: this.builder.getUrl(),
      headers: this.builder
        .getHeaders()
        .reduce((acc, h) => ({ ...acc, [h.name]: h.value }), {}),
      body: this.builder.getBody()
    };
    console.log("Dispatching with options", options);

    return new Promise((resolve, reject) => {
      request(options, (error, resp, responseBody) => {
        if (error) {
          console.log("request failed with error", error);
        }
        console.log("resp", resp);
        console.log("responseBody", responseBody);

        // TODO: set the resonse to the request via RequestContainer

        resolve({
          error,
          resp,
          responseBody
        });
      });
    });
  }
}

export default Dispatcher;
