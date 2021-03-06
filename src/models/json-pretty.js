const JSON_SPACE = 2;
const prettify = jsonText => {
  try {
    return JSON.stringify(JSON.parse(jsonText), null, JSON_SPACE)
  } catch (e) {
    return jsonText;
  }
};

export default prettify;