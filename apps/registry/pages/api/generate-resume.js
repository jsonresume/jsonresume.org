import { renderResume } from '../../lib/renderResume';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const { resumeData, theme = 'elegant' } = req.body;

    if (!resumeData) {
      return res
        .status(400)
        .json({ error: 'I dati del curriculum sono obbligatori' });
    }

    const html = await renderResume(resumeData, theme);
    const encodedHtml = Buffer.from(html).toString('base64');
    const url = `data:text/html;base64,${encodedHtml}`;

    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}
