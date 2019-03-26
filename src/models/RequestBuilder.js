const R = require("ramda");
const object = require("json-templater").object;
const string = require("json-templater").string;

class RequestBuilder {
  constructor(ctx, env, req, auth) {
    console.log("PreviewBuilder", req);
    this.ctx = ctx;
    this.env = env;
    this.req = req;
    this.auth = auth;
  }

  evalObject(value) {
    const fill = R.bind(this.fill, this); // make fill also available to be used in the body editor UI
    const env = R.bind(this.renderEnv, this); // make env also available to be used in the body editor UI
    let tmpValue = `let __x = ${value}; __x;`;
    console.log(`RequestBuilder:: eval`, tmpValue);
    tmpValue = eval(tmpValue);
    return tmpValue;
  }

  /*
   * Renders context, objects passed as parameters, and environment variables, in this order,
   * to the specified template string.
   */
  fill(tmpl, ...rest) {
    return [this.evalObject(this.ctx), ...rest, this.env].reduce(
      (acc, curr) => object(acc, curr),
      tmpl
    );
  }

  /*
   * Renders environment variables to the specified template string.
   */
  renderEnv(tmpl) {
    if (!tmpl) return tmpl;
    console.log(`Rendering to ${tmpl}`, this.env);
    return string(tmpl, this.env);
  }

  getBody() {
    if (!this.req.body || this.req.body === "") return null;
    if (this.req.contentType !== "application/json") {
      // TODO: also fill in this case
      return this.req.body;
    }

    // @ts-ignore
    try {
      console.log(`======> about to fill`, this.req.body);
      let tmpValue = this.evalObject(this.req.body);
      console.log(`RequestBuilder:: afer initial eval`, tmpValue);
      tmpValue = this.fill(tmpValue);
      console.log(`RequestBuilder:: after ctx fill`, tmpValue);
      const result = JSON.stringify(tmpValue, null, 2);
      console.log(`RequestBuilder:: result ${JSON.stringify(result)}`);
      return result;
    } catch (e) {
      // TODO: show an error indicator when evaluation fails
      // 1st make sure the context object is valid JSON
      console.error(e);
      return null;
    }
  }

  getBodyContentType() {
    if (!this.req.contentType) return null;
    return { name: "Content-Type", value: this.req.contentType };
  }

  getAuthHeader() {
    console.log("getAuthHeader", this.auth);
    if (!this.auth) return null;

    if (this.auth.type === "oAuth2" && this.auth.access_token) {
      return {
        name: "Authorization",
        value: `Bearer ${this.auth.access_token}`
      };
    }
    if (
      this.auth.type === "basic" &&
      this.auth.username &&
      this.auth.password
    ) {
      return {
        name: "Authorization",
        value: `Basic ${Buffer.from(
          `${this.auth.username}:${this.auth.password}`
        ).toString("base64")}`
      };
    }
    return null;
  }

  getHeaders() {
    const env = R.bind(this.renderEnv, this);
    const hasHeader = (headers, name) =>
      !!headers
        .map(h => ({ name: h.name.toLowerCase(), value: h.value }))
        .find(h => h.name === name);
    const addHeader = (headers, name, newHeader) => {
      if (!newHeader) return headers || [];
      const myHeaders = headers || [];
      return hasHeader(myHeaders, name) ? myHeaders : [newHeader, ...myHeaders];
    };
    const headers = addHeader(
      addHeader(this.req.headers, "authorization", this.getAuthHeader()),
      "content-type",
      this.req.body && this.getBodyContentType()
    );
    return headers.map(h => ({ name: env(h.name), value: env(h.value) }));
  }

  getQueryString() {
    const env = R.bind(this.renderEnv, this);
    return this.req.params && this.req.params.length > 0
      ? `?${this.req.params
          .map(p => `${env(p.name)}=${encodeURIComponent(env(p.value))}`)
          .join("&")}`
      : "";
  }

  getUrl() {
    const env = R.bind(this.renderEnv, this);
    return `${env(this.req.url)}${this.getQueryString()}`;
  }

  // TODO: memoize previous value, and return that if evaluation fails
  getCurl() {
    const methodPart =
      this.req.method === "GET" ? "" : `-X "${this.req.method}"`;
    const body = this.getBody();
    const bodyPart = body ? `-d $'${body}'` : "";
    const headerStrings = this.getHeaders().map(
      h => `-H '${h.name}: ${h.value}'`
    );
    const append = (first, ...rest) => {
      return rest
        .filter(p => !!p)
        .reduce((acc, curr) => acc + " \\\n\t" + curr, first);
    };
    return append(
      `curl ${methodPart} "${this.getUrl()}"`,
      ...headerStrings,
      bodyPart
    );
  }
}

export default RequestBuilder;
