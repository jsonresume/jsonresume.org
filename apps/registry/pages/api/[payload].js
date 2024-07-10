import generateResume from '../../lib/generateResume';
import trackView from '../../lib/trackView';

export default async function handler(req, res) {
  const { forceJSON, payload } = req.query;
  const payloadSplit = payload.split('.');

  const username = payloadSplit[0];

  let extension = null; // default formatter type

  if (payloadSplit.length === 2) {
    extension = payloadSplit[1];
  }

  const { error, content, headers } = await generateResume(
    username,
    extension || 'template',
    req.query
  );

  if (error) {
    return res.status(400).send(error);
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

  trackView(username);

  if (content instanceof Buffer || content instanceof ReadableStream) {
    // handles images/binary
    content.pipe(res);
  } else {
    return res
      .status(200)
      .send(forceJSON !== undefined ? { content } : content);
  }
}
