import buildError, { ERROR_CODES } from './error/buildError';
import getResumeGist from './getResumeGist';
import formatters from './formatters/formatters';
import { validateExtension, validateResume } from './generateResume/validation';
import { cacheResume } from './generateResume/cacheResume';
import { formatResume } from './generateResume/formatResume';
import { getRandomTheme } from './formatters/template/themeConfig';

const generateResume = async (username, extension = 'template', query = {}) => {
  const { theme, gistname } = query;
  const formatter = formatters[extension];

  const { error: extensionError } = validateExtension(extension);
  if (extensionError) return extensionError;

  if (!formatter) {
    return buildError(ERROR_CODES.UNKNOWN_FORMATTER);
  }

  // retrieve the users github gist
  const { error: gistError, resume } = await getResumeGist(username, gistname);

  if (gistError) {
    return buildError(gistError);
  }

  const { error: validationError } = validateResume(resume);
  if (validationError) return validationError;

  let selectedTheme = theme || resume.meta?.theme || 'elegant';
  selectedTheme = selectedTheme.toLowerCase();

  // Handle ?theme=random by returning a redirect page
  if (selectedTheme === 'random') {
    const randomTheme = getRandomTheme();
    const redirectUrl = `/${username}?theme=${randomTheme}${
      gistname ? `&gistname=${gistname}` : ''
    }`;
    const redirectHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Random Theme - Redirecting...</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            text-align: center;
            padding: 2rem;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1.5rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          h1 {
            font-size: 2rem;
            margin: 0 0 0.5rem;
          }
          p {
            font-size: 1.1rem;
            opacity: 0.9;
            margin: 0;
          }
          .theme-name {
            font-weight: 600;
            color: #ffd700;
          }
        </style>
        <script>
          window.location.href = '${redirectUrl}';
        </script>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h1>🎨 Picking a random theme...</h1>
          <p>Redirecting to <span class="theme-name">${randomTheme}</span></p>
          <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;">
            If you're not redirected, <a href="${redirectUrl}" style="color: #ffd700;">click here</a>
          </p>
        </div>
      </body>
      </html>
    `;

    return {
      content: redirectHtml,
      headers: [{ key: 'Content-Type', value: 'text/html; charset=utf-8' }],
    };
  }

  // @todo - using as a resume cache for extra features
  (async () => {
    await cacheResume(username, resume);
  })();

  const options = { ...query, theme: selectedTheme, username };

  return formatResume(resume, formatter, options);
};

export default generateResume;
