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
        const response = resp
          ? {
              statusCode: resp.statusCode,
              headers: resp.headers,
              body: resp.body
            }
          : null;

        if (error) {
          console.log(
            `request failed with error: ${JSON.stringify(error)}`,
            error
          );
          return resolve({ error: new Error(error), response });
        }
        console.log("resp", response);
        console.log("responseBody", responseBody);
        resolve({ response });
      });
    });
  }
}

export default Dispatcher;
