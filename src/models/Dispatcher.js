const request = require("request");

class Dispatcher {
  constructor(requestBuilder) {
    this.builder = requestBuilder;
  }
  req() {
    return this.builder.req;
  }
  dispatch() {
    const options = {
      method: this.req().method,
      url: this.builder.getUrl(),
      json: this.req().contentType === "application/json",
      headers: this.builder
        .getHeaders()
        .reduce((acc, h) => ({ ...acc, [h.name]: h.value }), {}),
      body: this.builder.getBody(false)
    };
    console.log("Dispatching with options", options);

    return new Promise((resolve, reject) => {
      request(options, (error, resp, responseBody) => {
        console.log("Dispatcher: error", error);
        console.log("Dispatcher: resp", resp);
        console.log("Dispatcher: responseBody", responseBody);

        const response = resp
          ? {
              statusCode: resp.statusCode,
              headers: resp.headers,
              body: resp.body
            }
          : null;

        if (error) {
          console.log(
            `Dispatcher: request failed with error: ${JSON.stringify(error)}`,
            error
          );
          return resolve({ error: new Error(error), response });
        }
        resolve({ response });
      });
    });
  }
}

export default Dispatcher;
