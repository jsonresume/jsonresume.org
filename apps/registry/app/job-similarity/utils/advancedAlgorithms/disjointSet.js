/**
 * Disjoint Set (Union-Find) data structure for Kruskal's algorithm
 */
export class DisjointSet {
  constructor() {
    this.parent = new Map();
  }

  /**
   * Find the root of a node with path compression
   * @param {Object} node - Node to find root of
   * @returns {string} Root node ID
   */
  find(node) {
    if (!this.parent.has(node.id)) {
      this.parent.set(node.id, node.id);
    }
    if (this.parent.get(node.id) !== node.id) {
      this.parent.set(node.id, this.find({ id: this.parent.get(node.id) }));
    }
    return this.parent.get(node.id);
  }

  /**
   * Union two nodes
   * @param {Object} node1 - First node
   * @param {Object} node2 - Second node
   */
  union(node1, node2) {
    const root1 = this.find(node1);
    const root2 = this.find(node2);
    if (root1 !== root2) {
      this.parent.set(root1, root2);
    }
  }
}
