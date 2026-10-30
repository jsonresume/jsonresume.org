import { Schema } from 'effect';

/** A square on the career tree (TreeMap's tones). */
export const CareerTreeNode = Schema.Struct({
  id: Schema.String,
  kind: Schema.Literals(['skill', 'gap', 'experience', 'direction', 'job']),
  label: Schema.String,
  detail: Schema.NullOr(Schema.String),
  tone: Schema.Literals(['open', 'success', 'attention', 'active', 'closable']),
  /** For a job: its id, and how well it fits. */
  jobId: Schema.NullOr(Schema.Number),
  score: Schema.NullOr(Schema.Number),
});
export type CareerTreeNode = typeof CareerTreeNode.Type;

/**
 * Where a resume could go, as what rests on what: skills (and the missing
 * ones jobs ask for), experience, kinds of role, jobs. Edges run from the
 * foundation (`from`, an index into nodes) to what rests on it.
 */
export const CareerTree = Schema.Struct({
  nodes: Schema.Array(CareerTreeNode),
  edges: Schema.Array(
    Schema.Struct({ from: Schema.Number, to: Schema.Number })
  ),
});
export type CareerTree = typeof CareerTree.Type;
