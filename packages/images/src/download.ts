import { mayFetch, publicAddress } from '@repo/resume-pdf/policy';
import { Effect, Schema } from 'effect';
import { lookup, type LookupAddress, type LookupOptions } from 'node:dns';
import http, { type IncomingMessage } from 'node:http';
import https from 'node:https';

/** Why an image couldn't be had: answered with a 404 and the initials. */
export class ImageFailed extends Schema.TaggedError<ImageFailed>()(
  'ImageFailed',
  { reason: Schema.String }
) {}

/** Avatars are small; anything past this is not one. */
const MAX_BYTES = 8 * 1024 * 1024;
const TIMEOUT_MS = 6000;
const MAX_REDIRECTS = 3;

type LookupCallback = (
  error: Error | null,
  address: string | LookupAddress[],
  family?: number
) => void;

/**
 * DNS for the proxy's connections: a name that resolves to this machine or
 * its network is refused at connect time, so a name can't pass a check and
 * then rebind to a private address.
 */
const publicLookup = (
  hostname: string,
  options: LookupOptions,
  callback: LookupCallback
) =>
  lookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) return callback(error, []);
    const ok =
      addresses.length > 0 && addresses.every((a) => publicAddress(a.address));
    if (!ok) return callback(new Error(`${hostname} is not public`), []);
    if (options.all) return callback(null, addresses);
    const [first] = addresses;
    return callback(null, first?.address ?? '', first?.family);
  });

const request = (url: URL) =>
  Effect.callback<IncomingMessage, ImageFailed>((resume, signal) => {
    const client = url.protocol === 'https:' ? https : http;
    const req = client.get(
      url,
      {
        lookup: publicLookup,
        signal,
        timeout: TIMEOUT_MS,
        headers: {
          accept: 'image/avif,image/webp,image/*',
          'user-agent': 'jsonresume.org image proxy (+https://jsonresume.org)',
        },
      },
      (res) => resume(Effect.succeed(res))
    );
    req.on('timeout', () => req.destroy(new Error('timed out')));
    req.on('error', (e) =>
      resume(Effect.fail(new ImageFailed({ reason: e.message })))
    );
  });

const body = (res: IncomingMessage) =>
  Effect.callback<Buffer, ImageFailed>((resume) => {
    const chunks: Buffer[] = [];
    let size = 0;
    res.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BYTES) {
        res.destroy();
        resume(Effect.fail(new ImageFailed({ reason: 'too large' })));
      } else chunks.push(chunk);
    });
    res.on('end', () => resume(Effect.succeed(Buffer.concat(chunks))));
    res.on('error', (e) =>
      resume(Effect.fail(new ImageFailed({ reason: e.message })))
    );
  });

/** An image's bytes from the public web, following a few redirects. */
export const download = Effect.fn('download')(function* (src: string) {
  let url = src;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!mayFetch(url) || url.startsWith('data:')) {
      return yield* new ImageFailed({ reason: 'not a public URL' });
    }
    const res = yield* request(new URL(url));
    const status = res.statusCode ?? 0;
    const location = res.headers.location;
    if (status >= 300 && status < 400 && location) {
      res.resume();
      url = new URL(location, url).href;
      continue;
    }
    const type = res.headers['content-type'] ?? '';
    if (status !== 200 || !/^image\//i.test(type)) {
      res.resume();
      return yield* new ImageFailed({ reason: `${status} ${type}` });
    }
    return yield* body(res);
  }
  return yield* new ImageFailed({ reason: 'too many redirects' });
});
