/**
 * Bron-Kerbosch algorithm for finding maximal cliques
 * @param {Array} r - Current clique being constructed
 * @param {Array} p - Candidate vertices
 * @param {Array} x - Already processed vertices
 * @param {Array} adj - Adjacency matrix
 * @param {Array} cliques - Array to store found cliques
 */
export function bronKerbosch(r, p, x, adj, cliques) {
  if (p.length === 0 && x.length === 0) {
    if (r.length >= 3) {
      // Only consider cliques of size 3 or larger
      cliques.push([...r]);
    }
    return;
  }

  const pivot = [...p, ...x][0];
  const candidates = p.filter((v) => !adj[pivot][v]);

  for (const v of candidates) {
    const newR = [...r, v];
    const newP = p.filter((u) => adj[v][u]);
    const newX = x.filter((u) => adj[v][u]);
    bronKerbosch(newR, newP, newX, adj, cliques);
    p = p.filter((u) => u !== v);
    x.push(v);
  }
}
