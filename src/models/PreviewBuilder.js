const R = require("ramda");
const object = require("json-templater").object;

class PreviewBuilder {
  constructor(ctx, env, req, auth) {
    console.log("PreviewBuilder", req);
    this.ctx = ctx;
    this.env = env;
    this.req = req;
    this.auth = auth;
  }

  getBody() {
    if (!this.req.body || this.req.body === "") return null;

    const evalObject = value => {
      let tmpValue = `let __x = ${value}; __x;`;
      tmpValue = eval(tmpValue);
      return tmpValue;
    };
    const fill = (tmpl, ...rest) =>
      [evalObject(this.ctx), ...rest, this.env].reduce(
        (acc, curr) => object(acc, curr),
        tmpl
      );
    // @ts-ignore
    try {
      console.log(`======> about to fill`, this.req);
      let tmpValue = evalObject(this.req.body);
      // console.log(`afer initial eval`, tmpValue);
      tmpValue = fill(tmpValue);
      // console.log(`after ctx fill`, tmpValue);
      const result = JSON.stringify(tmpValue, null, 2);
      // console.log(`result ${JSON.stringify(result)}`);
      return result;
    } catch (e) {
      // console.error(e);
      return null;
    }
  }
  build() {
    // TODO: Add headers & params
    const methodPart =
      this.req.method === "GET" ? "" : `-X "${this.req.method}"`;
    const body = this.getBody();
    const bodyPart = body ? `-d $'${body}'` : "";
    const headersPart = "";

    const append = (part, rest) => {
      if (rest === "") return part;
      return part + " \\\n\t" + rest;
    };

    return append(`curl ${methodPart} "${this.req.url}"`, bodyPart);
  }
}

export default PreviewBuilder;
