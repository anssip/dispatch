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

  // TODO: memoize previous value, and return that if evaluation fails
  getCurl() {
    const env = R.bind(this.renderEnv, this);
    const methodPart =
      this.req.method === "GET" ? "" : `-X "${this.req.method}"`;
    const body = this.getBody();
    const bodyPart = body ? `-d $'${body}'` : "";

    const hasContentType = headers =>
      !!headers
        .map(h => ({ name: h.name.toLowerCase(), value: h.value }))
        .find(h => h.name === "content-type");

    const headers = this.req.headers || [];
    const contentType = this.getBodyContentType();
    const headerWithContentType = hasContentType(headers)
      ? headers
      : contentType && !!this.req.body
      ? [contentType, ...headers]
      : headers;

    const headerStrings = headerWithContentType.map(
      h => `-H '${env(h.name)}: ${env(h.value)}'`
    );

    const query =
      this.req.params && this.req.params.length > 0
        ? `?${this.req.params
            .map(p => `${env(p.name)}=${encodeURIComponent(env(p.value))}`)
            .join("&")}`
        : "";

    const append = (first, ...rest) => {
      return rest
        .filter(p => !!p)
        .reduce((acc, curr) => acc + " \\\n\t" + curr, first);
    };
    return append(
      `curl ${methodPart} "${env(this.req.url)}${query}"`,
      ...headerStrings,
      bodyPart
    );
  }
}

export default RequestBuilder;
