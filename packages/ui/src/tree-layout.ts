/**
 * `@jsonresume/ui/tree-layout`: the tree layout on its own, with no DOM and
 * no React, so a server can place a graph and send the browser coordinates.
 */
export { layoutTree } from './components/viz/tree/layout';
export { cone as treeCone } from './components/viz/tree/scene-index';
export type {
  PlacedEdge,
  PlacedNode,
  TreeBand,
  TreeEdgeStrength,
  TreeLayout,
  TreeLayoutEdge,
  TreeLayoutOptions,
} from './components/viz/tree/layout-types';
