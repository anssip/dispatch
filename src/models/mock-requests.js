const requests = [
  {
    name: "Create gametrans source",
    method: "POST",
    url: "https://localhost:8000/connectors/gt-source",
    headers: {},
    body: JSON.stringify({
      req1_config: "{{ctx.source.config}}"
    }),
    teampalteVars: {
      "source.config": {
        jdbcUrl: "",
        tableName: "v_player"
      }
    }
  },
  {
    name: "Create gametrans sink",
    method: "POST",
    url: "https://localhost:8000/connectors/gt-sink",
    body: JSON.stringify({
      anotherConfig: "{{ctx.source.config}}",
      nunjucks: { foo:100 }
    })
  }
];

export default requests;

/*
> var object = require('json-templater/object');

> object({ body: "{{foo}}"}, { foo: {a:1,b:2} })
==> { body: { a: 1, b: 2 } }
> object({ body: "{{foo.bar}}"}, { foo: {a:1,b:2,bar:{ jee:'geee', juu: 7 }} })
==> { body: { jee: 'geee', juu: 7 } }
> object({ body: "{{foo.bar}}"}, { foo: {a:1,b:2,bar:{ jee: '{{geee}}', juu: 7 }} })

*/