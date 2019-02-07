# gasbag
A very talkative REST automation and testing tool for developers


## TODO:

* Introduce (Overstated)[https://github.com/fabiospampinato/overstated] for requests and templates.

* Body JSON view to show request JSON which has references to the objects and variables defined in the context.
  * CTRL+SPACE opens a context picker which fills in the reference in format `{{ctx.foo.bar}}`
  * Context references can be shown with a special icon (later).
  * All variables that come from the context references are shown in the body UI, with the possibility to fill values. The values can be also supplied by the defaul tcontext. The UI should thus show a table with columns: `variable` | `value-from-context` | `override`. The value could be a large JSON object, like a Kafka topic schema.

### IDEA

* Perhaps this kind of syntax for using templates

``` javascript
{
    method: "post",
    url: "http://localhost:8081/subjects/game_transaction/versions",
    body: {
      schema: JSON.stringify(fill(ctx.schemaTemplate.data, {
        name: "game_transaction",
        fields: [
          { name: "id", type: "long" },
          { name: "userId", type: "string" },
          { name: "username", type: "string" },
          { name: "minigamesType", type: "string" },
          { name: "minigamesId", type: "long" },
          { name: "tournamentTableId", type: "long" },
          { name: "tableName", type: "string" },
          { name: "tournamentName", type: "string" },
          { name: "playGroupId", type: "string" },
          { name: "internalRef", type: "string" },
          { name: "stake", type: "float" },
          { name: "win", type: "float" },
          { name: "pot", type: "float" },
          { name: "revenue", type: "float" },
          { name: "started", type: "int" },
          { name: "ended", type: "int" },
          { name: "partnerId", type: "long" },
          { name: "partnerName", type: "string" },
          { name: "realRevenue", type: "float" },
          { name: "bonusRevenue", type: "float" },
          { name: "actualRevenue", type: "float" },
          { name: "serviceTax", type: "float" }
        ]
      }))
    },
    headers: ctx.schemaTemplate,
    bodyType: 'json'
  }
``` 

* A request preview view is needed, showing the fully rendered body

* Code editor with json-templater token highlighting
