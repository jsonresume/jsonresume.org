import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

/** Paper sizes a resume prints on. */
export type Paper = 'a4' | 'letter';

/** Where Letter is the usual paper; A4 everywhere else. */
const LETTER = new Set(['US', 'CA', 'MX', 'PH', 'CL', 'CO', 'VE', 'GT']);

/**
 * The paper for a print: ?paper= when it names one, else the paper where
 * the resume's owner lives (basics.location.countryCode), else A4.
 */
export const paperFor = (
  asked: string | null | undefined,
  countryCode: string | undefined
): Paper => {
  const value = asked?.toLowerCase();
  if (value === 'a4' || value === 'letter') return value;
  return LETTER.has(countryCode?.toUpperCase() ?? '') ? 'letter' : 'a4';
};

/** Addresses a page must never reach. */
const privateV4 = (ip: string) => {
  const [a = 0, b = 0] = ip.split('.').map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b < 128) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b < 32) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
};

const privateV6 = (ip: string) => {
  const v = ip.toLowerCase();
  // IPv4 behind IPv6 (::ffff:7f00:1 is 127.0.0.1), as URL writes it.
  const mapped = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(v);
  if (mapped) {
    const [hi, lo] = [mapped[1], mapped[2]].map((h) => parseInt(h ?? '0', 16));
    const bytes = [
      (hi ?? 0) >> 8,
      (hi ?? 0) & 255,
      (lo ?? 0) >> 8,
      (lo ?? 0) & 255,
    ];
    return privateV4(bytes.join('.'));
  }
  return v === '::' || v === '::1' || /^f[cd]|^fe[89ab]/.test(v);
};

/**
 * Whether the printing browser may load a URL. A resume names images and a
 * theme names fonts and stylesheets, all on the public web; nothing may
 * reach this machine or its network, so private addresses, local names and
 * non-web schemes are refused. Names are checked again once resolved, by
 * mayLoad.
 */
export const mayFetch = (raw: string): boolean => {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol === 'data:' || raw === 'about:blank') return true;
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
  const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  const kind = isIP(host);
  if (kind === 4) return !privateV4(host);
  if (kind === 6) return !privateV6(host);
  return (
    host.includes('.') &&
    !/(^|\.)(localhost|local|internal|lan|home|corp)$/.test(host)
  );
};

/** Whether an address is on the public internet. */
export const publicAddress = (ip: string) =>
  isIP(ip) === 4 ? !privateV4(ip) : !privateV6(ip);

/**
 * mayFetch, then the name resolved: a public name pointing at a private
 * address (127.0.0.1.nip.io) is refused too.
 */
export const mayLoad = async (raw: string): Promise<boolean> => {
  if (!mayFetch(raw)) return false;
  const url = new URL(raw);
  if (url.protocol === 'data:' || raw === 'about:blank') return true;
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (isIP(host)) return true;
  const addresses = await lookup(host, { all: true }).catch(() => []);
  return (
    addresses.length > 0 && addresses.every((a) => publicAddress(a.address))
  );
};
