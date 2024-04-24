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
    <title>Resume - ${resume.basics.name}</title>
      ${styleTag}
    </head>
    <body>${html}</body>
  </html>`;
};

export { Resume };
