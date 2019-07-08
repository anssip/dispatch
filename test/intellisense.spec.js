import { getCompletions } from "../src/models/intellisense";

const environment = {
  jdbcUrl: "jdbc://mydb.cloud/users",
  jdbcUrlFallback: "jdbc://mydb.cloud/fallback",
  prefix: "users1"
};

const context = {
  dbSource: {
    jdbcTemplate: "nope",
    name: "{{connectorName}}",
    config: {
      "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
      "key.converter": "io.confluent.connect.avro.AvroConverter",
      "key.converter.schema.registry.url": "http://localhost:8081",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable": "false",
      "connection.url": "{{jdbcUrl}}",
      "table.whitelist": "{{tableName}}",
      mode: "incrementing",
      "incrementing.column.name": "id",
      "validate.non.null": "false",
      "topic.prefix": "{{topicPrefix}}",
      "table.types": "VIEW",
      "batch.max.rows": 100
    }
  },
  source: {
    config: {
      desc: "sourceconfig, username: {{username}}",
      nicest: 104
    }
  }
};

it("Should collect all matching autocomplete matches", () => {});

it("should return completions", () => {
  const completions = getCompletions("jdbc", context, environment);
  console.log("got completions", completions);
});
