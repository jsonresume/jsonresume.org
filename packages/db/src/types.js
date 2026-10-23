import pg from 'pg';

/**
 * Make pg return values the way PostgREST (supabase-js) did, so code ported
 * from supabase-js sees the same JSON-shaped data:
 *   - int8 and numeric as numbers, not strings
 *   - timestamps as ISO strings in to_json() format, not Date objects
 *   - dates as 'YYYY-MM-DD' strings
 * vector columns stay strings ('[0.1,0.2,...]'), as PostgREST returned them.
 */

const OID = {
  INT8: 20,
  NUMERIC: 1700,
  DATE: 1082,
  TIMESTAMP: 1114,
  TIMESTAMPTZ: 1184,
};

/**
 * '2026-10-23 08:36:48.12+00' -> '2026-10-23T08:36:48.12+00:00', matching
 * to_json(). Infinity and BC dates pass through unchanged.
 * @param {string} value
 */
export function isoTimestamp(value) {
  if (!/^\d{4}-\d\d-\d\d \d/.test(value)) return value;
  return value.replace(' ', 'T').replace(/([+-]\d\d)$/, '$1:00');
}

let installed = false;

/** Install the parsers once per process (they are global to pg). */
export function installTypeParsers() {
  if (installed) return;
  installed = true;
  pg.types.setTypeParser(OID.INT8, (v) => Number(v));
  pg.types.setTypeParser(OID.NUMERIC, (v) => parseFloat(v));
  pg.types.setTypeParser(OID.DATE, (v) => v);
  pg.types.setTypeParser(OID.TIMESTAMP, isoTimestamp);
  pg.types.setTypeParser(OID.TIMESTAMPTZ, isoTimestamp);
}
