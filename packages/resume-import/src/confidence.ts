import type { FieldConfidence } from '@repo/api';
import { leaves, type Json } from './clean';
import { repair } from './repair';

export interface Unsure {
  path: string;
  confidence: Exclude<FieldConfidence, 'high'>;
}

/** A finished read: valid resume, how sure of each field, and what was lost. */
export interface Scored {
  resume: Json;
  confidence: Record<string, FieldConfidence>;
  warnings: string[];
  fields: number;
}

const rank = { high: 0, medium: 1, low: 2 } as const;

/** The less sure of two. */
const lower = (a: FieldConfidence, b: FieldConfidence) =>
  rank[a] >= rank[b] ? a : b;

/**
 * Repairs a read resume and scores every field it fills: high unless the
 * reader marked it (or a section around it) unsure, or repair had to
 * rewrite it to fit the schema (medium at best).
 */
export const score = (read: Json, unsure: ReadonlyArray<Unsure>): Scored => {
  const { resume, warnings, changed } = repair(read);
  const confidence: Record<string, FieldConfidence> = {};
  for (const at of leaves(resume)) {
    let level: FieldConfidence = changed.has(at) ? 'medium' : 'high';
    for (const u of unsure) {
      if (at === u.path || at.startsWith(`${u.path}/`))
        level = lower(level, u.confidence);
    }
    confidence[at] = level;
  }
  return {
    resume,
    confidence,
    warnings,
    fields: Object.keys(confidence).length,
  };
};
