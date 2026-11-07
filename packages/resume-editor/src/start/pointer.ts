import type { Path } from '../values';

/** A JSON pointer (RFC 6901) as a path: "/work/0/name" is work, 0, name. */
export const pathOf = (pointer: string): Path =>
  pointer
    .split('/')
    .slice(1)
    .map((k) => k.replace(/~1/g, '/').replace(/~0/g, '~'))
    .map((k) => (/^\d+$/.test(k) ? Number(k) : k));

const words = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

/**
 * A pointer as people read it: "/work/0/startDate" is "Work 1 › start
 * date", "/basics/location/city" is "Location › city".
 */
export const pointerLabel = (pointer: string) =>
  pathOf(pointer)
    .filter((k) => k !== 'basics')
    .map((k, i) =>
      typeof k === 'number'
        ? `${k + 1}`
        : i === 0
        ? words(k).replace(/^./, (c) => c.toUpperCase())
        : words(k)
    )
    .join(' › ')
    .replace(/ › (\d+)/g, ' $1');
