const { THEMES } = require('./formatters/template');

export default async function handler(req, res) {
  // res.status(200).json(rendered);
  //map over themes and extract key and value
  const themes = {};
  Object.keys(THEMES).forEach((value) => {
    themes[
      value
    ] = `https://registry.jsonresume.org/thomasdavis?theme=${value}`;
  });

  res.status(200).send(themes);
}
