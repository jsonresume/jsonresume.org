import generateResume from '../../lib/generateResume';
import errorTemplate from '../../lib/errorTemplate';
import themeErrorTemplate from '../../lib/themeErrorTemplate';
import trackView from '../../lib/trackView';
import { ERROR_CODE_STATUS } from '../../lib/error/buildError';

// Uncached .agent generation can take close to a minute (lib/formatters/agent.js)
export const config = { maxDuration: 120 };

export default async function handler(req, res) {
  const { forceJSON, username } = req.query;
  const usernameSplit = username.split('.');

  const usernameBase = usernameSplit[0];

  let extension = null; // default formatter type

  if (usernameSplit.length === 2) {
    extension = usernameSplit[1];
  }

  const { error, content, headers } = await generateResume(
    usernameBase,
    extension || 'template',
    req.query
  );

  if (error) {
    const status = ERROR_CODE_STATUS[error.code] || 400;
    // Never let an edge or browser cache hold on to an error page.
    res.setHeader('Cache-Control', 'no-store');
    if (status === 503) res.setHeader('Retry-After', '60');

    const isPage =
      (!extension || extension === 'html') && forceJSON === undefined;
    if (!isPage) {
      // Data formats (.json, .yaml, ...) and ?forceJSON get JSON for API consumers
      return res.status(status).json(error);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (error?.extra?.validation) {
      // Resume validation errors - show detailed validation error page
      return res.status(status).send(errorTemplate(error));
    }
    return res.status(status).send(themeErrorTemplate(error));
  }

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Default for every format: revalidate on each load. Cloudflare's Browser
  // Cache TTL turns short max-ages into 4 hours, but respects no-cache (#552).
  // Formatter headers and the .agent cache below can override it.
  res.setHeader('Cache-Control', 'no-cache');

  // Add 24-hour cache for agent endpoint (AI-generated, expensive)
  if (extension === 'agent') {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate=3600'
    );
  }

  // if there is an extension, render the file as if it were present
  // some formatters require special response headers
  headers.forEach((header) => {
    res.setHeader(header.key, header.value);
  });

  trackView(usernameBase);

  if (content instanceof Buffer) {
    // handles binary content (e.g. PDF)
    return res.status(200).send(content);
  } else if (content instanceof ReadableStream) {
    // handles streams (e.g. images)
    content.pipe(res);
  } else {
    return res
      .status(200)
      .send(forceJSON !== undefined ? { content } : content);
  }
}
