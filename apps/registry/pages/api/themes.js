const { THEMES } = require('../../lib/formatters/template');

export default async function handler(req, res) {
  const themes = {};
  Object.keys(THEMES).forEach((value) => {
    themes[
      value
    ] = `https://registry.jsonresume.org/thomasdavis?theme=${value}`;
  });

  res.status(200).send(themes);
}
