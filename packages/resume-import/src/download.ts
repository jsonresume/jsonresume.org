import { IMPORT_MAX_BYTES, ImportTooLarge, UnsupportedImport } from '@repo/api';
import { mayFetch, publicAddress } from '@repo/resume-pdf/policy';
import { Context, Effect, Layer } from 'effect';
import { lookup, type LookupAddress, type LookupOptions } from 'node:dns';
import http, { type IncomingMessage } from 'node:http';
import https from 'node:https';
import type { Upload } from './detect';

const TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 3;

type DownloadError = UnsupportedImport | ImportTooLarge;

const failed = (why: string) =>
  new UnsupportedImport({
    message: `That URL couldn’t be downloaded: ${why}.`,
  });

type LookupCallback = (
  error: Error | null,
  address: string | LookupAddress[],
  family?: number
) => void;

/**
 * DNS for downloads: a name that resolves to this machine or its network
 * is refused at connect time, so it can't pass a check and then rebind.
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
  Effect.callback<IncomingMessage, DownloadError>((resume, signal) => {
    const client = url.protocol === 'https:' ? https : http;
    const req = client.get(
      url,
      {
        lookup: publicLookup,
        signal,
        timeout: TIMEOUT_MS,
        headers: {
          'user-agent':
            'jsonresume.org resume import (+https://jsonresume.org)',
        },
      },
      (res) => resume(Effect.succeed(res))
    );
    req.on('timeout', () => req.destroy(new Error('timed out')));
    req.on('error', (e) => resume(Effect.fail(failed(e.message))));
  });

const body = (res: IncomingMessage) =>
  Effect.callback<Uint8Array, DownloadError>((resume) => {
    const chunks: Buffer[] = [];
    let size = 0;
    res.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > IMPORT_MAX_BYTES) {
        res.destroy();
        resume(Effect.fail(new ImportTooLarge({ maxBytes: IMPORT_MAX_BYTES })));
      } else chunks.push(chunk);
    });
    res.on('end', () =>
      resume(Effect.succeed(new Uint8Array(Buffer.concat(chunks))))
    );
    res.on('error', (e) => resume(Effect.fail(failed(e.message))));
  });

/** A file from the public web, for agents importing a resume by URL. */
export class Downloader extends Context.Service<
  Downloader,
  { download(url: string): Effect.Effect<Upload, DownloadError> }
>()('@repo/resume-import/Downloader') {
  /** Over HTTP(S), public addresses only, a few redirects, at most 5 MB. */
  static readonly layer = Layer.succeed(
    Downloader,
    Downloader.of({
      download: Effect.fn('Downloader.download')(function* (src: string) {
        let url = src;
        for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
          if (!mayFetch(url) || !/^https?:/i.test(url))
            return yield* failed('it isn’t a public web address');
          const res = yield* request(new URL(url));
          const status = res.statusCode ?? 0;
          const location = res.headers.location;
          if (status >= 300 && status < 400 && location) {
            res.resume();
            url = new URL(location, url).href;
            continue;
          }
          if (status !== 200) {
            res.resume();
            return yield* failed(`the server answered ${status}`);
          }
          const length = Number(res.headers['content-length'] ?? 0);
          if (length > IMPORT_MAX_BYTES) {
            res.resume();
            return yield* new ImportTooLarge({ maxBytes: IMPORT_MAX_BYTES });
          }
          return {
            bytes: yield* body(res),
            name: new URL(url).pathname.split('/').pop(),
            contentType: res.headers['content-type'],
          };
        }
        return yield* failed('too many redirects');
      }),
    })
  );
}
