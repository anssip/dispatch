const requests = [
  {
    name: "Create gametrans source",
    method: "POST",
    url: "https://localhost:8000/connectors/gt-source",
    headers: {},
    body: {
      config: {
        templateRef: "source.config"
      }
    },
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
    url: "https://localhost:8000/connectors/gt-sink"
  }
];

export default requests;
