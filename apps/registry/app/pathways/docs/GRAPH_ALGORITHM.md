# Pathways Graph Algorithm

## Overview

The Pathways feature visualizes job opportunities as a tree graph emanating from the user's resume. Jobs are positioned based on semantic similarity, creating "career pathways" - chains of related opportunities that branch out from the user's current experience.

## Algorithm

### Input

- Resume embedding (vector representation of user's resume)
- List of job postings with embeddings
- `primaryBranches` parameter (default: 20)

### Step-by-Step Process

```
1. PLACE resume node at center

2. CALCULATE similarity scores
   - For each job, compute cosine similarity to resume embedding
   - Sort jobs by resume similarity (highest first)

3. SPLIT jobs into two groups
   - Primary jobs: top N jobs (default 20) most similar to resume
   - Secondary jobs: all remaining jobs

4. PLACE primary jobs
   - All connect directly to resume node
   - These form the "main branches" of the career tree

5. PLACE secondary jobs (incrementally)
   For each secondary job in order:
     a. Compare to ALL already-placed nodes (resume + primary + earlier secondary)
     b. Find the most similar placed node
     c. Connect to that node
     d. Add this job to the "placed" pool
     e. Next job now has more nodes to compare against
```

### Visual Example

```
                         [RESUME]
                        /   |    \
                       /    |     \
                    [J1]  [J2]   [J3] ... [J20]   ← Primary: top 20 connect to resume
                    /|\    |       \
                   / | \   |        \
               [J21][J22][J23]     [J24]          ← Secondary: compare to ALL placed
                 |       |
               [J25]   [J26]                      ← Can branch from other secondary
                 |
               [J27]                              ← Creates deep pathway chains
```

### Placement Order Example

| Step | Job    | Compares Against         | Connects To        |
| ---- | ------ | ------------------------ | ------------------ |
| 1    | J1-J20 | resume only              | resume             |
| 2    | J21    | resume, J1-J20           | J3 (most similar)  |
| 3    | J22    | resume, J1-J20, J21      | J1 (most similar)  |
| 4    | J23    | resume, J1-J20, J21, J22 | J22 (most similar) |
| 5    | J24    | resume, J1-J20, J21-J23  | J7 (most similar)  |
| ...  | ...    | growing pool             | best match         |

---

## Pros

### 1. Guaranteed Structure

- Always exactly N branches from resume (configurable)
- Predictable, balanced initial layout
- Resume stays central and prominent

### 2. Semantic Clustering

- Related jobs naturally cluster together
- Creates intuitive "career pathways" (e.g., all ML jobs branch from one node)
- Users can visually explore job families

### 3. Meaningful Depth

- Deep branches indicate specialized niches
- Shallow branches indicate diverse opportunities
- Tree depth conveys information about job market structure

### 4. Incremental Placement

- O(n²) complexity but simple to understand
- Each job finds its natural home in the existing structure
- No post-processing or layout adjustments needed

### 5. Deterministic

- Same input always produces same graph
- Cacheable results
- Consistent user experience across sessions

---

## Cons

### 1. Order Dependency

- Secondary job placement depends on processing order
- Jobs sorted by resume similarity, so less relevant jobs placed last
- Late-placed jobs have more options, which could create uneven branches

### 2. No Rebalancing

- Once placed, a job never moves
- Early poor placements can cascade
- Some branches may become overloaded while others stay sparse

### 3. Resume Similarity Bias

- Primary branches are the 20 most resume-similar jobs
- Diverse/exploratory career paths may be buried deep in branches
- Users seeking career changes may find relevant jobs far from center

### 4. Fixed Primary Count

- 20 branches works for most cases but may not suit all
- Too few: clusters too large, hard to navigate
- Too many: cluttered center, shallow exploration

### 5. Computational Cost

- Each secondary job compares to all placed nodes
- With 300 jobs: ~280 secondary jobs × growing comparison pool
- Approximately 40,000 similarity calculations (acceptable, but scales quadratically)

---

## Overall Assessment

### Strengths of This Approach

This algorithm strikes a good balance between **structure** and **organic clustering**. The fixed primary branches ensure the graph always has a clean, navigable structure emanating from the resume, while the incremental secondary placement creates natural semantic groupings without requiring complex clustering algorithms.

The key insight is that **placement order matters**. By processing jobs in order of resume similarity, the most relevant jobs get "prime real estate" close to the resume, while niche opportunities naturally end up in deeper branches. This matches user intent - they typically want to see the best matches first.

### When This Works Well

- **Career exploration**: Users can follow branches to discover related roles
- **Job market understanding**: Tree structure reveals how jobs relate to each other
- **Focused searches**: Primary branches show the most relevant opportunities immediately

### When This May Struggle

- **Career changers**: Someone pivoting careers may find their target jobs buried
- **Very diverse resumes**: Generalists may see a flat, wide tree with little depth
- **Niche roles**: Highly specialized jobs may all cluster on one branch

### Potential Improvements

1. **Weighted primary selection**: Instead of pure resume similarity, factor in job recency, salary, or user preferences
2. **Dynamic branch count**: Adjust primary count based on job diversity (more diverse = more branches)
3. **Bidirectional edges**: Allow jobs to connect to multiple related nodes (graph instead of tree)
4. **User-guided restructuring**: Let users drag nodes to reorganize branches
5. **Cluster-first approach**: Run k-means on embeddings first, then build tree within clusters

### Conclusion

The current algorithm is **pragmatic and effective** for the primary use case of career exploration. It's simple enough to understand, fast enough for real-time use, and produces intuitive visualizations. The main trade-off is flexibility - the rigid tree structure may not capture all the nuances of job relationships, but it provides a clear mental model for users to navigate.

For a v1 implementation, this is a solid foundation. Future iterations could introduce more sophisticated clustering or user customization without fundamentally changing the core approach.

---

## Configuration

| Parameter         | Default | Description                                  |
| ----------------- | ------- | -------------------------------------------- |
| `primaryBranches` | 20      | Number of jobs connecting directly to resume |
| `MAX_JOBS`        | 300     | Maximum jobs to fetch and display            |

Pass `primaryBranches` in the API request to customize:

```javascript
const response = await fetch('/api/pathways/jobs', {
  method: 'POST',
  body: JSON.stringify({
    embedding: resumeEmbedding,
    timeRange: '1m',
    primaryBranches: 15, // Fewer main branches, deeper trees
  }),
});
```
