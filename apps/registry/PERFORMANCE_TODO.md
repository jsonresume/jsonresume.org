# Additional Performance Optimization Suggestions

This document contains performance optimization suggestions that were identified but not implemented in this PR. These can be addressed in future work.

## High Priority

### 1. Code Splitting for Heavy Dependencies

**Current State**: Large visualization libraries (react-force-graph-2d, @xyflow/react, plotly) are bundled eagerly

**Impact**: Increases initial bundle size by ~500KB+

**Suggestion**:

```javascript
// Already using dynamic imports in some places, but could be more aggressive
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <LoadingSpinner />, // Add loading state
});

// Consider lazy loading entire routes
const JobSimilarity = dynamic(() => import('./job-similarity/page'), {
  loading: () => <PageLoader />,
});
```

**Files to update**:

- `app/similarity/SimilarityModule/components/SimilarityGraph.js`
- `app/job-similarity/components/GraphCanvas.jsx`
- Route-level code splitting in `app/layout.js`

### 2. Request Deduplication and Caching

**Current State**: Multiple components can fetch the same data simultaneously

**Impact**: Duplicate network requests, slower page loads

**Suggestion**: Use SWR or React Query

```javascript
// Install: pnpm add swr
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export function useSimilarityData() {
  const { data, error, isLoading } = useSWR('/api/similarity', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // Dedupe requests within 1 minute
  });

  return { data, error, isLoading };
}
```

**Benefits**:

- Automatic request deduplication
- Built-in caching
- Optimistic updates
- Better error handling

### 3. Database Query Optimization

**Current Issues Identified**:

- `/api/similarity` fetches up to 1000 records without pagination
- `/api/resumes` defaults to 2000 records
- No obvious indexes on frequently queried columns

**Suggestions**:

a) **Add pagination everywhere**:

```javascript
// In route.js
const limit = Math.min(parseInt(searchParams.get('limit')) || 100, 100); // Cap at 100
const offset = parseInt(searchParams.get('offset')) || 0;

const { data } = await supabase
  .from('resumes')
  .select('*')
  .range(offset, offset + limit - 1);
```

b) **Verify Supabase indexes** (run in Supabase dashboard):

```sql
-- Check existing indexes
SELECT * FROM pg_indexes WHERE tablename IN ('resumes', 'jobs');

-- Suggested indexes if missing:
CREATE INDEX IF NOT EXISTS idx_resumes_username ON resumes(username);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_embedding ON resumes(embedding) WHERE embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_uuid ON jobs(uuid);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_embedding_v5 ON jobs(embedding_v5) WHERE embedding_v5 IS NOT NULL;
```

c) **Use database-level text search indexes**:

```sql
-- For full-text search on resumes
CREATE INDEX IF NOT EXISTS idx_resumes_resume_text_search
ON resumes USING GIN (to_tsvector('english', resume));
```

### 4. Virtual Scrolling for Large Lists

**Current State**: Resume and job lists render all items at once

**Impact**: Slow rendering with 100+ items

**Suggestion**: Use react-window or react-virtual

```javascript
import { FixedSizeList } from 'react-window';

function ResumeList({ resumes }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ResumeCard resume={resumes[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={800}
      itemCount={resumes.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**Files to update**:

- `app/explore/ClientResumesModule/`
- `app/jobs/ClientJobBoard.js`

## Medium Priority

### 5. Memoize Expensive Computations

Several components recalculate expensive values on every render:

**Example in job similarity**:

```javascript
// Current - recalculates on every render
function JobSimilarityPage() {
  const graphData = processGraphData(jobs); // Expensive!
  // ...
}

// Better - memoize the result
function JobSimilarityPage() {
  const graphData = useMemo(() => processGraphData(jobs), [jobs]);
  // ...
}
```

### 6. Optimize Resume JSON Parsing

**Current State**: Resume JSON is parsed multiple times in different places

**Suggestion**: Parse once, pass the object around

```javascript
// In API routes, store both string and parsed versions
const resumeData = {
  username: row.username,
  resumeRaw: row.resume, // String for caching
  resumeParsed: JSON.parse(row.resume), // Object for use
  updated_at: row.updated_at,
};
```

### 7. Web Workers for CPU-Intensive Operations

**Good candidates**:

- Similarity calculations (already fast, but could be parallelized)
- Large resume parsing/validation
- Graph layout calculations

**Example**:

```javascript
// workers/similarity.worker.js
self.addEventListener('message', (e) => {
  const { nodes } = e.data;
  const links = calculateLinks(nodes);
  self.postMessage(links);
});

// In component
const worker = useMemo(() => new Worker('/workers/similarity.worker.js'), []);
worker.postMessage({ nodes });
worker.onmessage = (e) => setLinks(e.data);
```

### 8. Service Worker for Offline Caching

**Benefits**:

- Faster repeat visits
- Offline functionality
- Cache static assets aggressively

**Implementation**: Use Next.js PWA plugin

```bash
pnpm add next-pwa
```

## Low Priority

### 9. Image Optimization

**Current State**: Gravatar images loaded without optimization

**Suggestion**:

```javascript
import Image from 'next/image';

<Image
  src={gravatarUrl}
  width={200}
  height={200}
  alt={name}
  loading="lazy"
  placeholder="blur"
  blurDataURL={blurData}
/>;
```

### 10. Reduce Bundle Size

**Current bundle analysis** (run `pnpm build` and check output):

- Many themes bundled (40+ theme packages)
- Consider lazy loading themes on-demand

**Suggestion**:

```javascript
// Instead of importing all themes upfront
const loadTheme = async (themeName) => {
  const theme = await import(`jsonresume-theme-${themeName}`);
  return theme;
};
```

### 11. Optimize Graph Physics

**Current State**: D3 force simulation runs until cooldown

**Suggestion**: Add stop conditions for better performance

```javascript
<ForceGraph2D
  // ... other props
  d3AlphaMin={0.01} // Stop simulation earlier
  d3VelocityDecay={0.5} // Stabilize faster
  cooldownTime={3000} // Max 3 seconds
/>
```

## Performance Monitoring

### Add Real User Monitoring (RUM)

```javascript
// app/layout.js
import { Analytics } from '@vercel/analytics';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Custom Performance Marks

```javascript
// Track specific operations
performance.mark('similarity-start');
const data = await calculateSimilarity(nodes);
performance.mark('similarity-end');

performance.measure('similarity', 'similarity-start', 'similarity-end');
const measure = performance.getEntriesByName('similarity')[0];
console.log(`Similarity took ${measure.duration}ms`);
```

## Testing Performance

### Add Performance Tests

```javascript
// vitest.config.js - add performance test threshold
test('similarity calculation is fast enough', () => {
  const largeDataset = generateNodes(1000);
  const start = performance.now();

  const result = createLinks(largeDataset);

  const duration = performance.now() - start;
  expect(duration).toBeLessThan(2000); // Should complete in under 2 seconds
  expect(result.length).toBeGreaterThan(0);
});
```

### Lighthouse CI

Add to CI/CD pipeline:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://jsonresume.org
            https://jsonresume.org/explore
          temporaryPublicStorage: true
```

## Performance Budget

Suggested targets:

- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s
- **Total Bundle Size**: < 200KB (gzipped)
- **API Response Time (p95)**: < 500ms

Monitor these in production and fail builds if they regress.

---

Last updated: October 2025
