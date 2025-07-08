import generateResume from '../../lib/generateResume';
import errorTemplate from '../../lib/errorTemplate';
import trackView from '../../lib/trackView';

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
    if (error?.extra?.validation) {
      return res.status(400).send(errorTemplate(error));
    } else {
      return res.status(400).send(error);
    }
  }

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Origin', '*');

  // if there is an extension, render the file as if it were present
  // some formatters require special response headers
  headers.forEach((header) => {
    res.setHeader(header.key, header.value);
  });

  trackView(usernameBase);

  if (content instanceof Buffer || content instanceof ReadableStream) {
    // handles images/binary
    content.pipe(res);
  } else {
    return res
      .status(200)
      .send(forceJSON !== undefined ? { content } : content);
  }
}
