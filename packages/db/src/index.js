import pg from 'pg';
import { installTypeParsers } from './types.js';

export { isoTimestamp } from './types.js';

/**
 * Postgres access for jsonresume.org, replacing supabase-js.
 *
 * Connects with DATABASE_URL. The pool is created on first use, so importing
 * this module never needs a database (CI builds and tests run without one).
 *
 * Porting notes for supabase-js call sites:
 *   .single()       -> querySingle() (throws unless exactly one row)
 *   .maybeSingle()  -> queryOne()    (null when no row)
 *   no .range/.limit -> add `LIMIT ${MAX_ROWS}`; PostgREST capped results there
 *   embeddings      -> pass toVector(array) and cast the param: $1::vector
 */

/** PostgREST's row cap on the old Supabase project; keep it where no limit was set. */
export const MAX_ROWS = 5000;

const globalKey = Symbol.for('@repo/db.pool');

/** @returns {pg.Pool} */
export function getPool() {
  const existing = globalThis[globalKey];
  if (existing) return existing;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  installTypeParsers();
  const pool = new pg.Pool({
    connectionString,
    max: Number(process.env.DB_POOL_MAX || 10),
    idleTimeoutMillis: 30_000,
    options: '-c timezone=UTC',
  });
  // An idle client erroring (e.g. Postgres restart) must not crash the app.
  pool.on('error', () => {});
  // Survives Next.js dev reloads, which re-evaluate modules.
  globalThis[globalKey] = pool;
  return pool;
}

/**
 * Run a parameterized query and return its rows.
 * @param {string} text SQL with $1, $2 placeholders
 * @param {unknown[]} [params]
 */
export async function query(text, params = []) {
  const result = await getPool().query(text, params);
  return result.rows;
}

/** First row or null, like supabase-js .maybeSingle(). */
export async function queryOne(text, params = []) {
  const rows = await query(text, params);
  return rows[0] ?? null;
}

export class NotFoundError extends Error {
  constructor(message = 'Expected exactly one row') {
    super(message);
    this.name = 'NotFoundError';
    this.code = 'PGRST116'; // the code supabase-js callers checked for
  }
}

/** Exactly one row, like supabase-js .single(); throws NotFoundError otherwise. */
export async function querySingle(text, params = []) {
  const rows = await query(text, params);
  if (rows.length !== 1) {
    throw new NotFoundError(`Expected exactly one row, got ${rows.length}`);
  }
  return rows[0];
}

/**
 * Run `fn` inside a transaction; commits on success, rolls back on throw.
 * @template T
 * @param {(client: pg.PoolClient) => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function transaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Format an embedding for a vector parameter: query('... $1::vector', [toVector(e)]).
 * Accepts an array or the '[...]' string supabase-js returned for vector columns.
 * @param {number[] | string} embedding
 */
export function toVector(embedding) {
  return typeof embedding === 'string' ? embedding : JSON.stringify(embedding);
}

/** Close the pool (scripts call this before exiting). */
export async function closePool() {
  const pool = globalThis[globalKey];
  if (!pool) return;
  globalThis[globalKey] = undefined;
  await pool.end();
}
