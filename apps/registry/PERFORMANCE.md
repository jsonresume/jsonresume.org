# Performance Optimization Guidelines

This document outlines performance best practices and optimizations implemented in the JSON Resume registry application.

## Key Performance Improvements

### 1. Similarity Graph Algorithm (Oct 2025)

**Problem**: O(n²×m²) complexity when comparing embeddings between position groups

- Was comparing every embedding in group A with every embedding in group B
- For 100 nodes with 10 embeddings each: 1,000,000 comparisons

**Solution**: Pre-compute average embeddings

- Now uses single average embedding per group: O(n²)
- For same dataset: 10,000 comparisons (100x faster)

**Files**:

- `app/similarity/SimilarityModule/utils/dataProcessing.js`
- `app/utils/vectorUtils.js` - `getAverageEmbedding()` function

### 2. Vector Calculations Optimization (Oct 2025)

**Problem**: Multiple array iterations for similarity calculations

- `cosineSimilarity`: 3 separate reduce operations
- `getAverageEmbedding`: Multiple map operations creating intermediate arrays

**Solution**: Single-pass algorithms

- `cosineSimilarity`: Combined into single loop (3x faster)
- `getAverageEmbedding`: In-place accumulation, no intermediate arrays
- Better edge case handling (zero vectors return 0 instead of NaN)

**Files**:

- `app/utils/vectorUtils.js`

### 3. Resume State Management (Oct 2025)

**Problem**: JSON.stringify called on every render

- Large resume objects stringified repeatedly to check for changes
- Caused lag in editor on every keystroke

**Solution**: useMemo hook

- Memoized stringification result
- Only recalculates when resume actually changes

**Files**:

- `app/components/ResumeEditorModule/hooks/useResumeState.js`

### 4. Graph Canvas Window Access (Oct 2025)

**Problem**: Direct window.innerWidth access during render

- Caused unnecessary re-renders
- No handling for window resize

**Solution**: State + debounced resize handler

- Window dimensions stored in state
- 150ms debounce on resize events
- Prevents thrashing on window resize

**Files**:

- `app/job-similarity/components/GraphCanvas.jsx`

## Performance Best Practices

### Array Operations

❌ **Avoid**: Multiple passes over the same array

```javascript
const result = data
  .map((item) => transform(item))
  .filter((item) => item.valid)
  .map((item) => item.value);
```

✅ **Prefer**: Single pass with reduce

```javascript
const result = data.reduce((acc, item) => {
  const transformed = transform(item);
  if (transformed.valid) {
    acc.push(transformed.value);
  }
  return acc;
}, []);
```

### JSON Operations

❌ **Avoid**: Repeated JSON.parse/stringify

```javascript
useEffect(() => {
  const str = JSON.stringify(largeObject);
  setHasChanges(str !== original);
}, [largeObject]);
```

✅ **Prefer**: Memoized operations

```javascript
const memoizedStr = useMemo(() => JSON.stringify(largeObject), [largeObject]);
```

### Vector Calculations

❌ **Avoid**: Multiple iterations

```javascript
const dot = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
```

✅ **Prefer**: Single loop

```javascript
let dot = 0,
  magA = 0,
  magB = 0;
for (let i = 0; i < a.length; i++) {
  dot += a[i] * b[i];
  magA += a[i] * a[i];
  magB += b[i] * b[i];
}
```

### React Component Optimization

❌ **Avoid**: Window access in render

```javascript
<Component width={window.innerWidth} />
```

✅ **Prefer**: State with resize handler

```javascript
const [width, setWidth] = useState(800);
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Algorithm Complexity

When comparing n items with m properties each:

| Approach                 | Complexity            | 100 nodes, 10 props |
| ------------------------ | --------------------- | ------------------- |
| Nested loops (all pairs) | O(n²×m²)              | 1,000,000 ops       |
| Pre-compute averages     | O(n×m + n²)           | 11,000 ops          |
| With memoization         | O(n×m) + O(1) lookups | 1,000 ops           |

## Monitoring Performance

### Adding Performance Logs

```javascript
import { logger } from '@/lib/logger';

const start = Date.now();
// ... expensive operation ...
const duration = Date.now() - start;
logger.debug({ duration, count: items.length }, 'Operation completed');
```

### Performance Testing

```javascript
// In test files
import { performance } from 'perf_hooks';

it('completes in reasonable time', () => {
  const start = performance.now();
  const result = expensiveOperation(largeDataset);
  const duration = performance.now() - start;

  expect(duration).toBeLessThan(100); // 100ms threshold
  expect(result).toBeDefined();
});
```

## Common Performance Issues to Watch For

1. **O(n²) or worse algorithms** - Always consider if there's a more efficient approach
2. **Repeated JSON operations** - Cache parsed/stringified results
3. **Unnecessary re-renders** - Use React.memo, useMemo, useCallback appropriately
4. **Large bundle sizes** - Code-split heavy dependencies
5. **Unoptimized database queries** - Add indexes, use pagination
6. **Memory leaks** - Clean up event listeners, intervals, subscriptions

## Performance Benchmarks

Target performance metrics:

- Similarity graph rendering: < 2s for 1000 nodes
- Resume editor operations: < 50ms
- Vector similarity calculation: < 1ms per comparison
- API response times: < 500ms (p95)
- Page load time: < 3s (LCP)

## Future Optimization Opportunities

- [ ] Request deduplication/caching layer
- [ ] Database query optimization (indexes verification)
- [ ] Code splitting for heavy visualization libraries
- [ ] Virtual scrolling for large lists
- [ ] Web Workers for CPU-intensive calculations
- [ ] Service Worker for offline caching

---

Last updated: October 2025
