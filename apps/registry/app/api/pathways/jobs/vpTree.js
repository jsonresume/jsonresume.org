import { dotProduct } from './vectorOps';

/**
 * Cosine distance for pre-normalized vectors (1 - dotProduct)
 */
function cosineDistance(a, b) {
  return 1 - dotProduct(a, b);
}

/**
 * Vantage-Point Tree for fast k-nearest-neighbor queries.
 * Expects pre-normalized embeddings (cosine distance = 1 - dot product).
 * Reduces per-query comparisons from N to ~log(N).
 */
export class VPTree {
  constructor(points) {
    this.root = this._build([...points]);
  }

  _build(points) {
    if (points.length === 0) return null;
    if (points.length === 1) {
      return { point: points[0], threshold: 0, left: null, right: null };
    }

    // Use last element as vantage point (avoids splice overhead)
    const vp = points.pop();
    const dists = points.map((p, i) => ({
      idx: i,
      dist: cosineDistance(vp.embedding, p.embedding),
    }));
    dists.sort((a, b) => a.dist - b.dist);

    const mid = Math.floor(dists.length / 2);
    const threshold = dists[mid].dist;

    const left = dists.slice(0, mid).map((d) => points[d.idx]);
    const right = dists.slice(mid).map((d) => points[d.idx]);

    return {
      point: vp,
      threshold,
      left: this._build(left),
      right: this._build(right),
    };
  }

  /**
   * Find k nearest neighbors to a query embedding.
   * @param {number[]} query - Pre-normalized embedding vector
   * @param {number} k - Number of neighbors to return
   * @param {Set|null} allowedIds - If provided, only return points with these IDs
   * @returns {Array<{id: string, similarity: number}>} Sorted by similarity desc
   */
  kNearest(query, k, allowedIds = null) {
    const heap = [];
    this._search(this.root, query, k, heap, allowedIds);
    return heap
      .sort((a, b) => b.similarity - a.similarity)
      .map(({ id, similarity }) => ({ id, similarity }));
  }

  _search(node, query, k, heap, allowedIds) {
    if (!node) return;

    const dist = cosineDistance(query, node.point.embedding);

    // Only consider this point if it passes the filter
    if (!allowedIds || allowedIds.has(node.point.id)) {
      if (heap.length < k) {
        heap.push({ id: node.point.id, similarity: 1 - dist, dist });
        if (heap.length === k) heap.sort((a, b) => b.dist - a.dist);
      } else if (dist < heap[0].dist) {
        heap[0] = { id: node.point.id, similarity: 1 - dist, dist };
        heap.sort((a, b) => b.dist - a.dist);
      }
    }

    // Branch-and-bound pruning using triangle inequality
    const tau = heap.length < k ? Infinity : heap[0].dist;

    if (dist < node.threshold) {
      if (dist - tau < node.threshold) {
        this._search(node.left, query, k, heap, allowedIds);
      }
      const newTau = heap.length < k ? Infinity : heap[0].dist;
      if (dist + newTau >= node.threshold) {
        this._search(node.right, query, k, heap, allowedIds);
      }
    } else {
      if (dist + tau >= node.threshold) {
        this._search(node.right, query, k, heap, allowedIds);
      }
      const newTau = heap.length < k ? Infinity : heap[0].dist;
      if (dist - newTau < node.threshold) {
        this._search(node.left, query, k, heap, allowedIds);
      }
    }
  }
}
