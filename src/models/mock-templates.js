const templates = [
  {
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
  }
];

export default templates;


/*

Templates collection is a dictionary (map) of JSON objects. One can use one or more of these objects in a request.

The request shows the complete structure which references to the tempate objects. Clicking a referenced template
opens a dialog where one can fill in variables by pointing them to environment variables or by entering text straight there.

*/