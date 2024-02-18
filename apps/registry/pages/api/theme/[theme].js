const sampleResume = require('../samples/resume');
import template from '../formatters/template';

export default async function handler(req, res) {
  const { theme } = req.query;
  const { resume } = req.body;
  const rendered = await template.format(resume || sampleResume, { theme });

  return res.status(200).send(rendered.content);
}
