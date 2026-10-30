/*
 * Tree layout types. An edge runs from a foundation to what rests on it, with
 * one of three strengths:
 * - "same": the same thing under another name. Both share a level, side by side.
 * - "strong": a relation that cannot be wrong about direction. Always kept; a
 *   loop of them is one level.
 * - "weak": a relation that may point either way. Strong edges decide
 *   direction: a weak edge against a chain of strong ones is left out; weak
 *   edges that loop among themselves share a level.
 */

export type TreeEdgeStrength = 'strong' | 'weak' | 'same';

export interface TreeLayoutEdge {
  /** The foundation. */
  from: string;
  /** What rests on it. */
  to: string;
  strength: TreeEdgeStrength;
}

export interface TreeLayoutOptions {
  /** Distance between neighbouring squares in a row, in world units. */
  spacing?: number;
  /** Distance between rows of one level, when a level wraps. */
  rowGap?: number;
  /** Extra distance between levels, on top of the row gap. */
  levelGap?: number;
  /** The width:height the whole picture aims for, so it fills a screen. */
  aspect?: number;
}

export interface PlacedNode {
  x: number;
  y: number;
  /** 0 rests on nothing here; -1 is the shelf of nodes with no edges at all. */
  level: number;
  /** How many nodes rest on this one, directly or not. */
  support: number;
}

export interface PlacedEdge {
  /** Index of the foundation in `nodes`. */
  from: number;
  /** Index of what rests on it. */
  to: number;
  /** Index into the edges passed in, for the caller's own details. */
  source: number;
}

export interface TreeBand {
  level: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface TreeLayout {
  /** In the order the nodes were passed. */
  nodes: PlacedNode[];
  /** Equivalence or cycle group for each node, before visual ordering. */
  groups?: number[];
  /** Edges the picture draws: every kept edge, always pointing up the tree. */
  edges: PlacedEdge[];
  /** One per level, top to bottom, then the shelf if there is one. */
  bands: TreeBand[];
  width: number;
  height: number;
  /** Weak edges left out because they pointed against a chain of strong ones. */
  dropped: number;
  /** Large graphs count direct dependants only, to bound memory; callers should say so. */
  supportMode?: 'transitive' | 'direct';
}

/** An edge resolved to node indices: `i` is its index in the edges passed in. */
export interface ResolvedEdge {
  a: number;
  b: number;
  strength: TreeEdgeStrength;
  i: number;
}
