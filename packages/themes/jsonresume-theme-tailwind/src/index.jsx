import { renderToString } from 'react-dom/server';
import Resume from './ui/Resume';
import { setup } from 'twind';
import { virtualSheet, getStyleTag, shim } from 'twind/shim/server';

export const render = (resume) => {
  const sheet = virtualSheet();
  setup({ sheet });
  sheet.reset();

  const html = shim(renderToString(<Resume resume={resume} />));

  const styleTag = getStyleTag(sheet);

  return `<!DOCTYPE html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${resume.basics.name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      ${styleTag}
    </head>
    <body>${html}</body>
  </html>`;
};

export { Resume };
