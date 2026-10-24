/** text-embedding-3-large, at its full size. */
export const DIMENSIONS = 3072;

/** Scaled to length 1, so a dot product is the cosine. */
export const normalize = (v: ArrayLike<number>): Float32Array => {
  let sum = 0;
  for (let i = 0; i < v.length; i++) sum += (v[i] ?? 0) * (v[i] ?? 0);
  const norm = Math.sqrt(sum) || 1;
  const out = new Float32Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = (v[i] ?? 0) / norm;
  return out;
};

export const dot = (a: Float32Array, b: Float32Array): number => {
  const n = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < n; i++) sum += (a[i] ?? 0) * (b[i] ?? 0);
  return sum;
};

/** `a` moved `weight` of the way toward `b`, normalized. */
export const blend = (
  a: Float32Array,
  b: Float32Array,
  weight: number
): Float32Array =>
  normalize(a.map((v, i) => (1 - weight) * v + weight * (b[i] ?? 0)));

/** The normalized mean of some vectors; undefined for none. */
export const centroid = (
  vectors: ReadonlyArray<Float32Array>
): Float32Array | undefined => {
  const [first] = vectors;
  if (!first) return undefined;
  const sum = new Float32Array(first.length);
  for (const v of vectors)
    for (let i = 0; i < sum.length; i++) sum[i] += v[i] ?? 0;
  return normalize(sum);
};

/** As stored in Postgres: little-endian float32s in a bytea. */
export const toBytes = (v: Float32Array): Uint8Array =>
  new Uint8Array(v.buffer, v.byteOffset, v.byteLength);

export const fromBytes = (bytes: Uint8Array): Float32Array => {
  // Copied: a Buffer from the pool may not be 4-byte aligned.
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Float32Array(copy.buffer);
};

/** pgvector's text form, '[0.1,0.2,...]', for the registry backfill. */
export const parsePgVector = (text: string): Float32Array | undefined => {
  try {
    const values: unknown = JSON.parse(text);
    return Array.isArray(values) && values.length > 0
      ? normalize(values.map(Number))
      : undefined;
  } catch {
    return undefined;
  }
};
