import sampleResume from '../../../lib/samples/resume';
import template from '../../../lib/formatters/template';

export default async function handler(req, res) {
  const { theme } = req.query;
  const { resume } = req.body || {};

  try {
    const rendered = await template.format(resume || sampleResume, { theme });
    return res.status(200).send(rendered.content);
  } catch (e) {
    if (e.message === 'theme-missing') {
      return res.status(404).json({ error: `Unknown theme: ${theme}` });
    }
    throw e;
  }
}
