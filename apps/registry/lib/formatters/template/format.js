import { getTheme } from './getTheme';

export const format = async function (resume, options) {
  const theme = options.theme ?? 'elegant';
  const themeRenderer = getTheme(theme);

  if (!themeRenderer) {
    throw new Error('theme-missing');
  }

  const resumeHTML = themeRenderer.render(resume);

  return {
    content: resumeHTML,
    headers: [
      {
        key: 'Cache-control',
        value: 'public, max-age=90',
      },
      {
        key: 'Content-Type',
        value: 'text/html',
      },
    ],
  };
};
