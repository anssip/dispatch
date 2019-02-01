const requests = [
  {
    name: 'Create gametrans source',
    method: 'POST',
    url: 'https://localhost:8000/connectors/gt-source',
    headers: {

    },
    body: {

    }
  },
  {
    name: 'Create gametrans sink',
    method: 'POST',
    url: 'https://localhost:8000/connectors/gt-sink'
  },
];

export default requests;
