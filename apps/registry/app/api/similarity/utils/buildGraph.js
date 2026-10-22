/**
 * Build the position-similarity graph on the server so the client never has
 * to download every resume embedding.
 *
 * Two groups are linked when the average pairwise cosine similarity of their
 * members' embeddings exceeds the threshold. That average equals the dot
 * product of each group's mean unit vector, which turns an
 * O(members² × dims) comparison into O(groups² × dims). Vectors of different
 * lengths count as similarity 0 (as cosineSimilarity does), so means are kept
 * per vector length.
 */

const unit = (vector) => {
  let norm = 0;
  for (const x of vector) norm += x * x;
  norm = Math.sqrt(norm);
  return norm ? vector.map((x) => x / norm) : null;
};

const groupMeans = (members) => {
  const means = new Map();
  for (const { embedding } of members) {
    const u = unit(embedding);
    if (!u) continue;
    if (!means.has(u.length)) means.set(u.length, new Float64Array(u.length));
    const sum = means.get(u.length);
    for (let k = 0; k < u.length; k++) sum[k] += u[k] / members.length;
  }
  return means;
};

const averageSimilarity = (a, b) => {
  let total = 0;
  for (const [length, meanA] of a) {
    const meanB = b.get(length);
    if (!meanB) continue;
    for (let k = 0; k < length; k++) total += meanA[k] * meanB[k];
  }
  return total;
};

/**
 * @param {Array<{username: string, position: string, embedding: number[]}>} items
 * @param {number} threshold - minimum average similarity for a link
 * @returns {{nodes: Array, links: Array}}
 */
export const buildSimilarityGraph = (items, threshold) => {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.position)) groups.set(item.position, []);
    groups.get(item.position).push(item);
  }

  const nodes = [];
  const means = [];
  for (const [position, members] of groups) {
    nodes.push({
      id: position,
      group: nodes.length,
      count: members.length,
      usernames: members.map((m) => m.username),
    });
    means.push(groupMeans(members));
  }

  const links = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const value = averageSimilarity(means[i], means[j]);
      if (value > threshold) {
        links.push({ source: nodes[i].id, target: nodes[j].id, value });
      }
    }
  }

  return { nodes, links };
};
