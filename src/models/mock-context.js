const context = JSON.stringify({
  source: {
    name: "{{connectorName}}",
    config: {
      "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
      "key.converter": "io.confluent.connect.avro.AvroConverter",
      "key.converter.schema.registry.url": "http://localhost:8081",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable": "false",
      "connection.url": "{{jdbcUrl}}",
      "table.whitelist": "{{tableName}}",
      "mode": "timestamp",
      "timestamp.column.name": "{{timestampColumn}}",
      "validate.non.null": "false",
      "topic.prefix": "{{topicPrefix}}",
      "table.types": "VIEW",
      "batch.max.rows": 100
    }
  }
});

const environments = {
  default: {
    name: 'default',
    jdbcUrl: 'jdbc://default.server.com/foobar',
    tableNmae: 'users',
    topicPrefix: 'default_'
  },
  production: {
    name: 'procuction',
    jdbcUrl: 'jdbc://mycorp.com/production',
    tableNmae: 'users',
    topicPrefix: 'prod_'
  },
};

export { context as context, environments as environments };


/*

* The context is a dictionary (map) of JSON objects. One can use one or more of these objects in a request.
* The Context sidebar shows both contexts objects and environments in a list, by their names
    - Context and env editing happens in a JSON editor in the main pane

*/