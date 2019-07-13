import { getCompletions, collectKeys } from "../src/models/intellisense";

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
      connector_class: "io.confluent.connect.jdbc.JdbcSourceConnector",
      key_converter: "io.confluent.connect.avro.AvroConverter",
      key_converter_schema_registry_url: "http://localhost:8081",
      value_converter: "org.apache.kafka.connect.json.JsonConverter",
      value_converter_schemas_enable: "false",
      connection_url: "{{jdbcUrl}}",
      table_whitelist: "{{tableName}}",
      mode: "incrementing",
      incrementing_column_name: "id",
      validate_non_null: "false",
      topic_prefix: "{{topicPrefix}}",
      table_types: "VIEW",
      batch_max_rows: 100
    }
  },
  source: {
    config: {
      desc: "sourceconfig, username: {{username}}",
      nicest: 104
    }
  }
};

it("Should collect all keys from context", () => {
  const keys = collectKeys(context);
  console.log("got keys", keys);
});

it("should return completions", () => {
  const completions = getCompletions("", context);
  console.log("got completions", completions);
});
