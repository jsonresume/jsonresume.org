import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from 'effect/http-api';
import { Authentication } from './Authentication';
import { NoResume } from './errors';
import { Seniority } from './JobsApi';

/** TreeMap's tones. */
const Tone = Schema.Literals([
  'open',
  'success',
  'danger',
  'attention',
  'active',
  'closable',
]);

/** The career graph's views: which level each node sits on in each. */
export const CareerView = Schema.Literals([
  'meaning',
  'distance',
  'seniority',
  'time',
]);
export type CareerView = typeof CareerView.Type;

export const CareerNodeKind = Schema.Literals([
  'foundation',
  'skill',
  'gap',
  'evidence',
  'strength',
  'direction',
  'job',
  'destination',
  'step',
]);

/** A square on the career graph, and its level in each view (null: not shown there). */
export const CareerNode = Schema.Struct({
  id: Schema.String,
  kind: CareerNodeKind,
  label: Schema.String,
  detail: Schema.NullOr(Schema.String),
  tone: Tone,
  levels: Schema.Struct({
    meaning: Schema.NullOr(Schema.Number),
    distance: Schema.NullOr(Schema.Number),
    seniority: Schema.NullOr(Schema.Number),
    time: Schema.NullOr(Schema.Number),
  }),
  /** For a job: its id and fit; for a destination, a share of people (0-100). */
  jobId: Schema.NullOr(Schema.Number),
  score: Schema.NullOr(Schema.Number),
  /** For evidence: the year it ended (now when current). */
  year: Schema.NullOr(Schema.Number),
});
export type CareerNode = typeof CareerNode.Type;

/** From a foundation to what rests on it: how strongly, and why, in the resume's words. */
export const CareerEdge = Schema.Struct({
  from: Schema.Number,
  to: Schema.Number,
  /** 0 to 1: how strong and recent the evidence is. */
  weight: Schema.Number,
  why: Schema.NullOr(Schema.String),
});
export type CareerEdge = typeof CareerEdge.Type;

/** A move people with the same role made next, and how often. */
export const CareerMove = Schema.Struct({
  family: Schema.String,
  name: Schema.String,
  seniority: Seniority,
  /** Of the people who held the role, the share who moved here next (0-100). */
  share: Schema.Number,
  people: Schema.Number,
  medianYears: Schema.NullOr(Schema.Number),
  /** Whose moves: people in the role at that level, in the role at any level, or at that level in any role. */
  basis: Schema.Literals(['role', 'family', 'level']),
});
export type CareerMove = typeof CareerMove.Type;

export const PlanStepKind = Schema.Literals([
  'skill',
  'project',
  'resume',
  'apply',
  'learn',
  'network',
]);

export const PlanStep = Schema.Struct({
  id: Schema.String,
  kind: PlanStepKind,
  title: Schema.String,
  detail: Schema.String,
  skill: Schema.NullOr(Schema.String),
  jobId: Schema.NullOr(Schema.Number),
  done: Schema.Boolean,
});
export type PlanStep = typeof PlanStep.Type;

/** Where someone wants to go, and the steps to get there. */
export const PathwayPlan = Schema.Struct({
  id: Schema.String,
  destination: Schema.String,
  family: Schema.NullOr(Schema.String),
  seniority: Schema.NullOr(Seniority),
  summary: Schema.String,
  steps: Schema.Array(PlanStep),
  createdAt: Schema.String,
});
export type PathwayPlan = typeof PathwayPlan.Type;

export const CareerGraph = Schema.Struct({
  nodes: Schema.Array(CareerNode),
  edges: Schema.Array(CareerEdge),
  /** What the resume shows most, in a few words each. */
  strengths: Schema.Array(Schema.String),
  /** Whether the AI parts are still being worked out (call again shortly). */
  pending: Schema.Boolean,
  /** Months the graph was saved, newest first ("2026-10"). */
  snapshots: Schema.Array(Schema.String),
  /** Each view's band names, by level. */
  bands: Schema.Struct({
    meaning: Schema.Array(Schema.String),
    distance: Schema.Array(Schema.String),
    seniority: Schema.Array(Schema.String),
    time: Schema.Array(Schema.String),
  }),
  /** The plan the graph's next steps come from, if any. */
  planId: Schema.NullOr(Schema.String),
});
export type CareerGraph = typeof CareerGraph.Type;

export class PlanNotFound extends Schema.TaggedError<PlanNotFound>()(
  'PlanNotFound',
  {},
  { httpApiStatus: 404 }
) {}

/**
 * The signed-in user's career: the graph Pathways draws (and past months'),
 * where people in their role went next, and plans to get somewhere.
 */
export class CareerApi extends HttpApiGroup.make('career')
  .add(
    HttpApiEndpoint.get('graph', '/', {
      success: CareerGraph,
      error: NoResume,
    }),
    HttpApiEndpoint.get('snapshot', '/snapshots/:month', {
      params: { month: Schema.String },
      success: CareerGraph,
      error: PlanNotFound,
    }),
    HttpApiEndpoint.get('moves', '/moves', {
      success: Schema.Array(CareerMove),
      error: NoResume,
    }),
    HttpApiEndpoint.get('plans', '/plans', {
      success: Schema.Array(PathwayPlan),
    }),
    HttpApiEndpoint.post('createPlan', '/plans', {
      payload: Schema.Struct({ destination: Schema.String }),
      success: PathwayPlan.pipe(HttpApiSchema.status(201)),
      error: NoResume,
    }),
    HttpApiEndpoint.put('setStep', '/plans/:planId/steps/:stepId', {
      params: { planId: Schema.String, stepId: Schema.String },
      payload: Schema.Struct({ done: Schema.Boolean }),
      success: PathwayPlan,
      error: PlanNotFound,
    }),
    HttpApiEndpoint.delete('deletePlan', '/plans/:planId', {
      params: { planId: Schema.String },
      error: PlanNotFound,
    })
  )
  .middleware(Authentication)
  .prefix('/me/career') {}
