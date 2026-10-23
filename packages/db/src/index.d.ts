import type { Pool, PoolClient } from 'pg';

export declare const MAX_ROWS: number;

export declare function getPool(): Pool;

export declare function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]>;

export declare function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null>;

export declare function querySingle<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T>;

export declare class NotFoundError extends Error {
  code: 'PGRST116';
}

export declare function transaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T>;

export declare function toVector(embedding: number[] | string): string;

export declare function isoTimestamp(value: string): string;

export declare function closePool(): Promise<void>;
