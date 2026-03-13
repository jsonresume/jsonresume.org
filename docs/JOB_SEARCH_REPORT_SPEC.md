# Job Search Analytics Report — Full Specification

> A full-page, shareable analytics dashboard for every JSON Resume user's job search journey.
> Endpoint: `GET /[username]/jobs/report` (Next.js page) + `GET /api/v1/report/[username]` (JSON API)

---

## Executive Summary

Every user on JSON Resume who uses the `@jsonresume/jobs` CLI generates a rich trail of signals: which jobs they're interested in, which they pass on, which companies they research via dossiers, and how their search evolves over time. **This report turns that exhaust data into insight.**

The report is a single, stunning, full-page dashboard — shareable via URL, embeddable, and optionally anonymizable. It combines:

- **Pipeline metrics** — funnel from discovery to application
- **Preference intelligence** — algorithmically inferred deal-breakers and hidden preferences
- **Market positioning** — where the user sits relative to the jobs they want
- **Behavioral patterns** — decision speed, momentum, fatigue detection
- **Market intelligence** — trends in the jobs the user cares about
- **Actionable recommendations** — resume improvements, overlooked jobs, strategy nudges

### Key Numbers at a Glance (Hero Section)

| Metric             | Source                                     |
| ------------------ | ------------------------------------------ |
| Total jobs matched | `match_jobs_v5` result count               |
| Jobs reviewed      | `pathways_job_feedback` rows (non-dossier) |
| Review rate        | reviewed / matched × 100                   |
| Interested rate    | interested / reviewed × 100                |
| Applied count      | sentiment = 'applied'                      |
| Dossiers generated | sentiment = 'dossier'                      |
| Days active        | first feedback → last feedback             |
| Avg. jobs/day      | reviewed / days active                     |

---

## 1. Report Sections & Features

### 1.1 Pipeline Overview

#### 1.1.1 Job Search Funnel (P0)

**What:** A vertical funnel chart showing job flow through stages: Matched → Reviewed → Interested → Applied, with "Maybe" as a side branch and "Not Interested" as the exit flow.

**Algorithm:**

```
matched = total jobs in DB within user's date range
reviewed = COUNT(DISTINCT job_id) FROM pathways_job_feedback WHERE sentiment != 'dossier'
interested = COUNT WHERE sentiment = 'interested'
maybe = COUNT WHERE sentiment = 'maybe'
applied = COUNT WHERE sentiment = 'applied'
not_interested = COUNT WHERE sentiment IN ('not_interested', 'dismissed')
unreviewed = matched - reviewed
```

**Data:** `pathways_job_feedback` table + `jobs` table count.

**Visualization:** Funnel chart (Recharts `<Funnel>` or custom SVG). Each stage is a trapezoid with the count and conversion rate on hover. Color gradient from cool (top) to warm (bottom). "Maybe" branches off to the side as an amber pool.

**Priority:** P0 — this is the anchor visualization, first thing users see.

---

#### 1.1.2 Sankey Flow Diagram (P1)

**What:** A Sankey diagram showing the flow of jobs through the entire decision tree, including time-based transitions (e.g., jobs that went from "maybe" to "interested" to "applied").

**Algorithm:**

```sql
-- Get all state transitions per job (ordered by created_at)
SELECT job_id, sentiment, created_at
FROM pathways_job_feedback
WHERE user_id = $1 AND sentiment != 'dossier'
ORDER BY job_id, created_at ASC;

-- Build transition pairs: [from_state, to_state, count]
-- First state for each job has from_state = 'new'
-- Jobs with only one state: 'new' → that_state
```

**Data:** `pathways_job_feedback` with temporal ordering per job_id.

**Visualization:** D3 Sankey (`d3-sankey`). Nodes: New, Interested, Maybe, Applied, Not Interested. Links show volume of jobs flowing between states. Thick links = common paths. Color-coded by destination state.

**Priority:** P1 — visually stunning but requires state transition tracking.

---

#### 1.1.3 Daily Activity Timeline (P0)

**What:** A GitHub-style contribution heatmap showing daily review activity, plus a line chart of cumulative reviews over time.

**Algorithm:**

```sql
SELECT DATE(created_at) as day, sentiment, COUNT(*) as count
FROM pathways_job_feedback
WHERE user_id = $1 AND sentiment != 'dossier'
GROUP BY DATE(created_at), sentiment
ORDER BY day;
```

**Visualization:** Two-part:

1. Calendar heatmap (like GitHub contributions) — intensity = reviews that day
2. Stacked area chart below — daily counts by sentiment, showing momentum

**Priority:** P0 — simple to implement, immediately insightful.

---

### 1.2 User Market Position

#### 1.2.1 Market Fit Score (P0)

**What:** A single 0-100 score indicating how well the user's resume matches the current job market. Computed from the average cosine similarity of their top-N matched jobs.

**Algorithm:**

```javascript
// Fetch top 100 matched jobs via match_jobs_v5
const topMatches = await supabase.rpc('match_jobs_v5', {
  query_embedding: resumeEmbedding,
  match_threshold: -1,
  match_count: 100,
  created_after: thirtyDaysAgo,
});

// Market fit = average similarity of top 20, scaled to 0-100
const top20 = topMatches.slice(0, 20);
const avgSimilarity = top20.reduce((s, j) => s + j.similarity, 0) / 20;
const marketFitScore = Math.round(avgSimilarity * 100);

// Percentile ranking (compare against other users' avg similarities)
// Could precompute this as a Supabase view
```

**Visualization:** Large circular gauge (like a speedometer). 0-40 = red "Niche", 40-70 = amber "Moderate", 70-100 = green "Strong demand". Animated on page load.

**Priority:** P0 — the single most compelling number.

---

#### 1.2.2 Skill Gap Analysis (P1)

**What:** Compare skills listed in the user's resume against skills appearing in jobs they marked "interested" or "applied". Surface missing skills ranked by frequency.

**Algorithm:**

```javascript
// 1. Extract user skills from resume
const userSkills = new Set(
  resume.skills
    .flatMap((s) => [s.name, ...(s.keywords || [])])
    .map((s) => s.toLowerCase())
);

// 2. Get all interested/applied jobs
const { data: feedback } = await supabase
  .from('pathways_job_feedback')
  .select('job_id')
  .eq('user_id', username)
  .in('sentiment', ['interested', 'applied']);

// 3. Fetch those jobs' gpt_content, extract skills
const jobSkills = {}; // skill → count
for (const job of interestedJobs) {
  const parsed = JSON.parse(job.gpt_content);
  for (const skill of parsed.skills || []) {
    const name = skill.name.toLowerCase();
    if (!userSkills.has(name)) {
      jobSkills[name] = (jobSkills[name] || 0) + 1;
    }
  }
}

// 4. Rank by frequency — top missing skills
const gaps = Object.entries(jobSkills)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);
```

**Visualization:** Horizontal bar chart. Each bar = a missing skill, length = how many interested jobs require it. Color intensity increases with frequency. Include a "You have" vs "They want" Venn diagram for top skills.

**Priority:** P1 — actionable and differentiating.

---

#### 1.2.3 Resume-Job Radar Chart (P1)

**What:** A radar/spider chart comparing the user's profile strength across dimensions (frontend, backend, devops, leadership, etc.) against the average requirements of their interested jobs.

**Algorithm:**

```javascript
// Define 6-8 skill dimensions from gpt_content skill categories
const dimensions = [
  'Frontend',
  'Backend',
  'DevOps/Infra',
  'Data/ML',
  'Mobile',
  'Leadership',
  'Security',
  'Design',
];

// Score user's resume on each dimension (keyword matching + embedding similarity)
// Score interested jobs on each dimension
// Normalize both to 0-1 scale
// Overlay on radar chart
```

**Visualization:** Recharts `<RadarChart>` with two overlaid polygons — blue for user, green for market demand. Gap areas highlighted in red tint.

**Priority:** P1 — visually compelling comparison.

---

#### 1.2.4 Salary Positioning (P0)

**What:** Where the user's interested/applied jobs fall on the salary spectrum, compared to the overall market.

**Algorithm:**

```sql
-- All jobs with salary data in the user's date range
SELECT salary_usd FROM jobs
WHERE salary_usd IS NOT NULL AND posted_at > $date;

-- User's interested jobs with salary
SELECT j.salary_usd FROM jobs j
JOIN pathways_job_feedback f ON f.job_id = CAST(j.id AS TEXT)
WHERE f.user_id = $1 AND f.sentiment IN ('interested', 'applied')
AND j.salary_usd IS NOT NULL;
```

**Visualization:** Distribution plot (violin or box plot). Full market distribution in gray, user's interested jobs highlighted as colored dots overlaid on the distribution. Median lines for both. Shows whether user is targeting above/below market.

**Priority:** P0 — salary is always the most-viewed metric.

---

#### 1.2.5 Competitive Positioning (P2)

**What:** For the user's interested jobs, how many OTHER resumes in the registry also match well? Higher competition = harder to land.

**Algorithm:**

```javascript
// For each interested job, run match_jobs_v5 in reverse:
// embed the job, query against resume embeddings
// Count resumes with similarity > 0.7

// This requires a resume embedding table (already exists: generate-embeddings-resumes.js)
// Could precompute as a materialized view
```

**Visualization:** Bubble chart. Each bubble = a job the user is interested in. Size = competition level (number of matching resumes). Color = user's match score. X-axis = salary, Y-axis = match score.

**Priority:** P2 — computationally expensive, but fascinating.

---

### 1.3 Preference Intelligence

#### 1.3.1 Deal-Breaker Detector (P0)

**What:** Algorithmically determine what factors consistently lead to rejection. Compare attribute distributions between accepted and rejected jobs.

**Algorithm:**

```javascript
// Split jobs into accepted (interested/applied) vs rejected (not_interested/dismissed)
// For each attribute, compute distribution in both groups

const attributes = [
  'remote', // categorical: Full, Hybrid, None
  'experience', // categorical: Junior, Mid, Senior, Lead
  'salary_usd', // numeric: bucket into ranges
  'company_size', // from enrichment data
  'tech_stack', // from skills array
  'location.countryCode', // geographic
  'type', // Full-time, Contract, etc.
];

// Chi-squared test for categorical, KS test for numeric
// Rank attributes by discriminative power
// Top discriminators = deal-breakers

// Example output:
// "Remote: None" → 89% rejection rate (vs 34% for Remote: Full)
// "Salary < $100k" → 92% rejection rate
// "Experience: Junior" → 95% rejection rate
```

**Visualization:** Horizontal diverging bar chart. Left side (red) = rejection correlation. Right side (green) = acceptance correlation. Each bar = an attribute value. Most discriminative at top.

**Priority:** P0 — the "aha moment" feature.

---

#### 1.3.2 Preference Fingerprint (P1)

**What:** A multi-dimensional "taste profile" derived from the user's decisions. Like a Spotify Wrapped for job preferences.

**Algorithm:**

```javascript
// Compute weighted centroid of interested job embeddings
const interestedEmbeddings = interestedJobs.map((j) => j.embedding_v5);
const centroid = averageVectors(interestedEmbeddings);

// Compare centroid to resume embedding
// The delta vector points toward what the user wants that their resume doesn't show

// Also compute variance — low variance = focused search, high = exploring
const variance = computeEmbeddingVariance(interestedEmbeddings);

// Extract top features via embedding decomposition
// (or just aggregate gpt_content attributes of interested jobs)
const profile = {
  topSkills: mostCommonSkills(interestedJobs),
  preferredRemote: modeOf(interestedJobs.map((j) => j.remote)),
  salaryRange: [min(salaries), max(salaries)],
  companyTypes: mostCommonTypes(interestedJobs),
  searchFocus: variance < 0.3 ? 'laser-focused' : 'exploring',
};
```

**Visualization:** A "baseball card" style panel with the preference fingerprint. Icon-based attributes with confidence bars. Think Spotify's audio features radar for songs.

**Priority:** P1 — shareable and fun.

---

#### 1.3.3 Preference Drift Timeline (P1)

**What:** Track how the user's preferences evolve over their job search. Are they getting pickier? Broadening their search? Shifting industries?

**Algorithm:**

```javascript
// Bucket feedback by week
// For each week, compute:
//   - Acceptance rate (interested / reviewed)
//   - Average salary of interested jobs
//   - Dominant skills in interested jobs
//   - Remote preference ratio
//   - Average embedding centroid

// Plot each metric over time
// Detect inflection points (significant week-over-week changes)

// Centroid drift: cosine distance between weekly centroids
// Shows whether the user is consistently searching or pivoting
```

**Visualization:** Multi-line sparkline panel. Each row = a preference dimension. Each sparkline = weekly trend. Annotate inflection points with "You started prioritizing X here".

**Priority:** P1 — requires enough data (2+ weeks of activity).

---

#### 1.3.4 Hidden Preference Discovery (P2)

**What:** Find non-obvious factors that predict the user's decisions. Things they might not even realize they care about.

**Algorithm:**

```javascript
// Extract meta-features from gpt_content:
const features = jobs.map((job) => ({
  descriptionLength: job.description.length,
  numSkillsRequired: job.skills.length,
  numResponsibilities: job.responsibilities?.length || 0,
  hasEquity: /equity|stock|options/i.test(JSON.stringify(job)),
  hasBenefits: /401k|health|dental/i.test(JSON.stringify(job)),
  buzzwordDensity:
    countBuzzwords(job.description) / job.description.split(' ').length,
  sentimentScore: analyzeSentiment(job.description), // positive/negative language
  companyDescLength: job.company_description?.length || 0,
  isYC: /YC|Y Combinator/i.test(JSON.stringify(job)),
  isRemoteFirst: /remote.first|fully.remote|distributed/i.test(job.description),
  mentionsSalary: job.salary_usd !== null,
}));

// Logistic regression or decision tree to predict interested vs not_interested
// Extract feature importances
// Report surprising features (e.g., "You're 3x more likely to be interested in jobs with shorter descriptions")
```

**Visualization:** "Surprising insights" card list. Each card has an icon, a stat, and a one-liner. E.g., "You prefer jobs that mention equity (78% acceptance vs 32% baseline)".

**Priority:** P2 — requires ML, but the insights are gold.

---

#### 1.3.5 Regret Predictor — "Second Look" (P1)

**What:** Find jobs the user dismissed that are suspiciously similar to jobs they later marked as interested. These are potential "regrets" worth revisiting.

**Algorithm:**

```javascript
// 1. Compute centroid of interested jobs (embedding space)
const interestedCentroid = averageVectors(
  interestedJobs.map((j) => j.embedding_v5)
);

// 2. Find dismissed/not_interested jobs that are close to this centroid
const dismissed = allFeedback.filter((f) => f.sentiment === 'not_interested');
const dismissedJobs = await fetchJobsByIds(dismissed.map((f) => f.job_id));

const regretCandidates = dismissedJobs
  .map((j) => ({
    ...j,
    regretScore: cosineSimilarity(j.embedding_v5, interestedCentroid),
  }))
  .filter((j) => j.regretScore > 0.75) // high similarity to interested cluster
  .sort((a, b) => b.regretScore - a.regretScore)
  .slice(0, 10);

// 3. For each, explain why they match: "This job at X shares Y skills with
//    3 jobs you're interested in"
```

**Visualization:** Card list with "⚡ Worth a second look" header. Each card shows the job, its similarity to the interested cluster, and the specific overlapping attributes. Swipe-to-reconsider interaction.

**Priority:** P1 — immediately actionable, high value.

---

### 1.4 Job Similarity & Clustering

#### 1.4.1 Embedding Space Map (P1)

**What:** A 2D scatter plot of ALL jobs the user has reviewed, colored by their decision. Reveals clusters of similar jobs and shows patterns in what's accepted/rejected by region.

**Algorithm:**

```javascript
// 1. Collect embeddings of all reviewed jobs
// 2. Dimensionality reduction: UMAP or t-SNE (3072d → 2d)
//    Use umap-js library (pure JS, runs in browser)
// 3. Color points by sentiment: green=interested, red=not_interested, amber=maybe, blue=applied
// 4. Add user's resume embedding as a special marker (star)

import { UMAP } from 'umap-js';

const umap = new UMAP({
  nNeighbors: 15,
  minDist: 0.1,
  nComponents: 2,
});
const projected = umap.fit(embeddings); // [[x,y], ...]
```

**Visualization:** Interactive scatter plot (D3 or visx). Each dot = a job. Hover shows job title + company. Click opens detail. User's resume position shown as a pulsing star. Clusters naturally emerge — annotate the biggest ones with auto-detected labels (e.g., "DevOps cluster", "Frontend cluster").

**Priority:** P1 — the "wow" visualization. Computationally intensive but can be precomputed.

---

#### 1.4.2 Skill Co-occurrence Network (P1)

**What:** A force-directed graph showing which skills appear together in jobs. Node size = frequency, edge thickness = co-occurrence strength. Colored by the user's acceptance rate for jobs with that skill.

**Algorithm:**

```javascript
// Build co-occurrence matrix from gpt_content.skills
const cooccurrence = {};
for (const job of reviewedJobs) {
  const skills = parsed.skills.map((s) => s.name);
  for (let i = 0; i < skills.length; i++) {
    for (let j = i + 1; j < skills.length; j++) {
      const key = [skills[i], skills[j]].sort().join('|');
      cooccurrence[key] = (cooccurrence[key] || 0) + 1;
    }
  }
}

// Filter to edges with count >= 3
// Nodes colored by user's acceptance rate for jobs with that skill
// Green = tends to accept, Red = tends to reject
```

**Visualization:** D3 force-directed graph. Draggable nodes. Hover highlights all connected skills. Filter toggle: show only skills from interested jobs vs all. The user's resume skills are outlined in gold.

**Priority:** P1 — beautiful and informative.

---

#### 1.4.3 Company DNA Fingerprinting (P2)

**What:** Categorize each company by a multi-dimensional "DNA" profile: stage, size, industry, tech stack, remote policy, compensation tier. Show the user's preferred company archetype.

**Algorithm:**

```javascript
// Extract company features from gpt_content + enrichment data
const companyDNA = {
  stage: classifyStage(job), // Seed, Series A-D, Public, Bootstrap
  size: classifySize(job), // <10, 10-50, 50-200, 200-1000, 1000+
  industry: job.meta?.industry, // from enrichment
  techStack: dominantStack(job), // React, Rails, Go, etc.
  remotePolicy: job.remote, // Full, Hybrid, None
  salaryTier: bucketSalary(job), // Low, Market, Premium
  ycBacked: /YC|Y Combinator/.test(JSON.stringify(job)),
};

// Cluster companies by DNA similarity
// Find the user's "ideal company archetype" from accepted jobs
// Show how each job aligns with this archetype
```

**Visualization:** Grouped horizontal bar chart showing the distribution of company types in interested vs rejected. Or a radar chart of the "ideal company" profile.

**Priority:** P2 — depends on enrichment data quality.

---

#### 1.4.4 "Jobs Like This One" Recommendations (P1)

**What:** For each job the user is interested in, show the 3-5 most similar jobs they haven't reviewed yet.

**Algorithm:**

```javascript
// For each interested job:
// 1. Get its embedding from jobs.embedding_v5
// 2. Run match_jobs_v5 with that embedding (not the resume!)
// 3. Filter out already-reviewed jobs
// 4. Return top 5 unreviewed matches

async function findSimilarJobs(jobId, reviewedJobIds) {
  const { data: job } = await supabase
    .from('jobs')
    .select('embedding_v5')
    .eq('id', jobId)
    .single();

  const { data: matches } = await supabase.rpc('match_jobs_v5', {
    query_embedding: job.embedding_v5,
    match_threshold: 0.7,
    match_count: 20,
    created_after: thirtyDaysAgo,
  });

  return matches.filter((m) => !reviewedJobIds.has(m.id)).slice(0, 5);
}
```

**Visualization:** Expandable accordion per interested job. Click to reveal similar unreviewed jobs. Each with a similarity badge. "You liked X, you might also like Y" format.

**Priority:** P1 — directly drives engagement back to the TUI.

---

### 1.5 Behavioral Insights

#### 1.5.1 Decision Speed Analysis (P1)

**What:** How quickly does the user decide on jobs? Do they review in bursts or steadily? Which types of jobs take longer to decide on?

**Algorithm:**

```javascript
// Group feedback by session (cluster timestamps within 30-minute windows)
const sessions = clusterByTime(feedbackRecords, 30 * 60 * 1000);

// Per session:
//   - Duration
//   - Jobs reviewed
//   - Acceptance rate
//   - Average time between decisions (if we have per-job timestamps)

// Compare decision speed by outcome:
//   - Time to decide "interested" vs "not interested" vs "maybe"
//   - "Maybe" should be slowest (indecision)

// Compute "decisive index" = 1 - (maybe_count / total_reviews)
```

**Visualization:** Scatter plot where X = session number, Y = jobs reviewed per session. Dot size = session duration. Color = acceptance rate that session. Trend line shows whether sessions are getting more/less productive.

**Priority:** P1.

---

#### 1.5.2 Decision Fatigue Detector (P1)

**What:** Does the rejection rate increase as the user reviews more jobs in a session? This would indicate decision fatigue.

**Algorithm:**

```javascript
// Within each session, compute rolling acceptance rate
// Position = nth job reviewed in session
// Value = acceptance rate at that position

// Aggregate across all sessions:
// At position 1-5: X% acceptance rate
// At position 6-10: Y% acceptance rate
// At position 11-20: Z% acceptance rate
// At position 20+: W% acceptance rate

// If rate drops significantly → fatigue detected
// Recommendation: "Your acceptance rate drops 40% after reviewing 15 jobs in a session.
//                  Consider shorter, more focused review sessions."
```

**Visualization:** Line chart. X = position in session (1st job, 2nd, 3rd...). Y = acceptance rate. Should show a downward trend if fatigue exists. Annotate the "fatigue threshold" with a dashed line.

**Priority:** P1 — genuinely useful behavioral insight.

---

#### 1.5.3 Search Momentum Gauge (P0)

**What:** Is the user's job search gaining or losing steam? Based on review frequency, acceptance quality, and application rate trends.

**Algorithm:**

```javascript
// Compare last 7 days vs previous 7 days:
const momentum = {
  reviewVelocity: recentReviews / previousReviews, // >1 = accelerating
  qualityTrend: recentAcceptRate / previousAcceptRate,
  applicationRate: recentApplied / recentInterested,
  dossierRate: recentDossiers / recentInterested,
};

// Composite momentum score:
// momentum = 0.4 * reviewVelocity + 0.3 * applicationRate + 0.3 * qualityTrend
// Scale to -100 (stalling) to +100 (surging)
```

**Visualization:** Gauge/speedometer with needle. Red zone (left) = "Losing steam", yellow = "Steady", green (right) = "Surging". Below: sparkline of daily momentum over last 30 days.

**Priority:** P0 — motivational and immediately understandable.

---

#### 1.5.4 Dossier Impact Analysis (P1)

**What:** Does researching a company (generating a dossier) change the user's decision? What % of dossier'd jobs get marked interested vs the baseline?

**Algorithm:**

```javascript
// Jobs with dossiers
const dossierJobIds = feedback
  .filter((f) => f.sentiment === 'dossier')
  .map((f) => f.job_id);

// Get the final sentiment for dossier'd vs non-dossier'd jobs
const withDossier = { interested: 0, not_interested: 0, maybe: 0, applied: 0 };
const withoutDossier = {
  interested: 0,
  not_interested: 0,
  maybe: 0,
  applied: 0,
};

for (const [jobId, sentiment] of Object.entries(latestStates)) {
  if (dossierJobIds.includes(jobId)) {
    withDossier[sentiment]++;
  } else {
    withoutDossier[sentiment]++;
  }
}

// Compare acceptance rates
const dossierAcceptRate =
  (withDossier.interested + withDossier.applied) / total;
const baselineAcceptRate =
  (withoutDossier.interested + withoutDossier.applied) / total;
const dossierLift = dossierAcceptRate / baselineAcceptRate;
```

**Visualization:** Side-by-side donut charts. Left = "Without dossier" outcome distribution. Right = "With dossier" outcome distribution. Big number in the middle: "Dossier uplift: +23% more likely to apply".

**Priority:** P1 — validates the dossier feature's value.

---

#### 1.5.5 FOMO Index (P2)

**What:** Identify "maybe" jobs that strongly match the user's "interested" pattern. These are the jobs they're most likely to regret passing on.

**Algorithm:**

```javascript
// Same as Regret Predictor (1.3.5) but for "maybe" jobs specifically
// Score = similarity to interested centroid × recency bonus
// Higher score = higher FOMO
// "You've been sitting on this job for 5 days.
//  It's 92% similar to jobs you've already said yes to."
```

**Visualization:** Ranked list with countdown timer aesthetic. "FOMO Score: 87/100. This job was posted 12 days ago." Urgency increases as the job ages.

**Priority:** P2 — fun but somewhat gimmicky.

---

### 1.6 Market Intelligence

#### 1.6.1 Tech Stack Trends (P1)

**What:** Which technologies are trending up/down in job postings over time? Focused on the skills that appear in the user's interested jobs.

**Algorithm:**

```sql
-- Monthly skill frequency from gpt_content
-- Parse skills from all jobs, bucket by month
-- Compute month-over-month growth rate per skill
-- Highlight skills that overlap with user's resume or interests

SELECT
  DATE_TRUNC('month', posted_at) as month,
  -- Need to parse gpt_content in app layer
FROM jobs
WHERE posted_at > NOW() - INTERVAL '6 months'
  AND gpt_content IS NOT NULL;
```

```javascript
// App-layer aggregation
const skillTrends = {};
for (const job of allJobs) {
  const month = job.posted_at.slice(0, 7);
  for (const skill of parsed.skills) {
    skillTrends[skill.name] = skillTrends[skill.name] || {};
    skillTrends[skill.name][month] = (skillTrends[skill.name][month] || 0) + 1;
  }
}

// Compute growth rate: (this_month - last_month) / last_month
// Flag: 🔥 rising, ❄️ cooling, ➡️ stable
```

**Visualization:** Small multiples line charts (sparklines grid). Each cell = a skill. Line = monthly posting count. Color: green if rising, red if falling. User's skills highlighted with a border.

**Priority:** P1 — market intelligence that feels premium.

---

#### 1.6.2 Remote Work Index (P0)

**What:** What percentage of jobs in the user's interest area are remote vs hybrid vs onsite? How is this trending?

**Algorithm:**

```javascript
// From gpt_content.remote field: 'Full', 'Hybrid', 'None', null
// Compute distribution for:
//   1. All recent jobs
//   2. Jobs matching user's skills (top 200 by similarity)
//   3. Jobs user marked interested

// Trend: compute weekly remote percentage over last 3 months
```

**Visualization:** Stacked bar chart by week. Three segments: Remote (green), Hybrid (amber), Onsite (red). User's preference highlighted with an arrow annotation. Shows whether the market is moving toward or away from their preference.

**Priority:** P0 — remote work is a top filter in the CLI.

---

#### 1.6.3 Salary Distribution by Role (P1)

**What:** Distribution of salaries for different role types, highlighting where the user's interested jobs fall.

**Algorithm:**

```sql
SELECT salary_usd, gpt_content->>'experience' as level
FROM jobs
WHERE salary_usd IS NOT NULL
  AND posted_at > NOW() - INTERVAL '60 days';
```

**Visualization:** Violin plot or ridgeline plot. One distribution per experience level (Junior, Mid, Senior, Lead, Executive). User's interested jobs shown as individual dots overlaid. Median lines annotated with exact values.

**Priority:** P1 — salary intelligence is always high-demand.

---

#### 1.6.4 Hiring Velocity Leaderboard (P2)

**What:** Which companies are posting the most jobs? Are they growing or in maintenance mode?

**Algorithm:**

```javascript
// Count jobs per company, per month
// Companies with increasing posting frequency = growing
// Companies with decreasing = contracting
// Show companies the user has interacted with

const companyVelocity = {};
for (const job of allJobs) {
  const company = parsed.company;
  const month = job.posted_at.slice(0, 7);
  companyVelocity[company] = companyVelocity[company] || {};
  companyVelocity[company][month] = (companyVelocity[company][month] || 0) + 1;
}
```

**Visualization:** Bar chart + trend arrow. Top 15 companies by total postings. Each bar has a small trend indicator (↑ growing, ↓ shrinking). User's interested companies highlighted.

**Priority:** P2 — interesting but secondary.

---

#### 1.6.5 "Unicorn Job" Detector (P2)

**What:** Find rare jobs that combine multiple desirable attributes (high salary + remote + matching skills + good company). Score based on percentile ranking across attributes.

**Algorithm:**

```javascript
const unicornScore = (job) => {
  let score = 0;
  // Top 20% salary
  if (job.salary_usd > salaryP80) score += 25;
  // Fully remote
  if (job.remote === 'Full') score += 25;
  // High skill match
  if (job.similarity > similarityP80) score += 25;
  // Good company (has enrichment, YC-backed, etc.)
  if (job.companyScore > 0.7) score += 25;
  return score;
};

// Jobs scoring 75+ = unicorns
// Usually < 5% of all jobs
```

**Visualization:** Special "✨ Unicorn" badge on qualifying jobs. Separate section in report showing these rare finds. Card format with all 4 qualifying attributes shown as filled stars.

**Priority:** P2 — gamification element.

---

### 1.7 Actionable Recommendations

#### 1.7.1 Resume Improvement Suggestions (P1)

**What:** Based on the skill gap analysis and the user's interested jobs, suggest specific resume changes that would improve match scores.

**Algorithm:**

```javascript
// 1. Identify top 5 missing skills (from 1.2.2)
// 2. Estimate match score improvement if those skills were added
//    - Add skill to resume text
//    - Re-embed
//    - Compare new similarities vs old
//    - ΔScore = average improvement across interested jobs

// 3. Suggest keyword additions from interested job descriptions
//    that aren't in the resume

// 4. Identify resume sections that are underweight:
//    - If interested jobs emphasize "leadership" but resume has no leadership keywords
//    - If jobs want specific certifications
```

**Visualization:** Checklist with estimated impact. "Add 'Kubernetes' to skills → estimated +12% match improvement for 7 of your interested jobs". Priority-sorted by impact.

**Priority:** P1 — directly actionable.

---

#### 1.7.2 "Overlooked Jobs" Feed (P0)

**What:** High-match jobs the user hasn't reviewed yet, prioritized by similarity to their interested cluster.

**Algorithm:**

```javascript
// 1. Compute interested centroid
// 2. Get all unreviewed jobs (not in pathways_job_feedback for this user)
// 3. Rank by similarity to interested centroid (not resume embedding!)
// 4. Apply user's implicit filters (deal-breakers from 1.3.1)
// 5. Return top 10
```

**Visualization:** Card list, each with match score, key attributes, and "Why you might like this" explanation based on similar interested jobs. One-click to open in TUI.

**Priority:** P0 — drives re-engagement.

---

#### 1.7.3 Application Strategy Summary (P0)

**What:** A text summary of the user's search status with strategic advice. Generated via LLM.

**Algorithm:**

```javascript
const prompt = `
Given this job search data for a candidate:
- Resume summary: ${resumeText}
- ${applied.length} applications submitted
- ${interested.length} jobs marked interested (not yet applied)
- ${maybe.length} jobs in "maybe" limbo
- ${notInterested.length} jobs rejected
- Top skills in demand: ${topGapSkills.join(', ')}
- Salary range of interests: $${minSalary}-$${maxSalary}
- Search momentum: ${momentum > 0 ? 'increasing' : 'decreasing'}
- Deal breakers: ${dealBreakers.join(', ')}

Write a 3-paragraph strategic assessment:
1. Current status and progress
2. Patterns and insights
3. Recommended next steps
`;

const { text } = await generateText({
  model: openai('gpt-4.1-mini'),
  prompt,
});
```

**Visualization:** Rich text block with styled callouts. Key stats bolded. Action items as a numbered list. Feels like advice from a career coach.

**Priority:** P0 — the narrative wrapper that ties everything together.

---

## 2. Visualization Library & Design System

### Recommended Stack

| Tool            | Purpose                                    | Why                                                                      |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| **Recharts**    | Bar, line, area, radar, funnel, pie charts | Already React-native, SSR-friendly, lightweight. Best for 70% of charts. |
| **D3** (direct) | Sankey, force graph, embedding scatter     | Needed for custom/complex visualizations that Recharts can't do.         |
| **umap-js**     | Dimensionality reduction                   | Pure JS UMAP implementation, works server-side or client-side.           |
| **Nivo**        | Heatmaps, calendar, treemap                | Beautiful defaults, great for the heatmap/calendar views.                |

### Color Palette

```css
:root {
  /* Sentiment colors */
  --applied: #2563eb; /* Blue-600 */
  --interested: #16a34a; /* Green-600 */
  --maybe: #d97706; /* Amber-600 */
  --not-interested: #dc2626; /* Red-600 */
  --unreviewed: #6b7280; /* Gray-500 */
  --dossier: #7c3aed; /* Violet-600 */

  /* Accent */
  --highlight: #f59e0b; /* Amber-500 */
  --background: #0f172a; /* Slate-900 (dark mode) */
  --surface: #1e293b; /* Slate-800 */
  --text: #f1f5f9; /* Slate-100 */

  /* Chart gradients */
  --gradient-start: #3b82f6;
  --gradient-end: #8b5cf6;
}
```

### Design Principles

1. **Dark-first** — Most developers prefer dark mode. Design for dark, adapt for light.
2. **Dense but scannable** — Pack information tightly but use clear visual hierarchy.
3. **Animated entrances** — Charts should animate in on scroll (intersection observer). Counters should count up.
4. **Print-friendly** — Add `@media print` styles. The report should look great as a PDF.
5. **Responsive** — Stack charts vertically on mobile. Use `min-width: 768px` for side-by-side layouts.
6. **Shareable** — Each section should have an anchor link. Open Graph meta tags for social sharing.

### Layout Structure

```
┌─────────────────────────────────────────────────┐
│ Hero: Name, Photo, Market Fit Score, Key Stats  │
├────────────────────┬────────────────────────────┤
│ Funnel Chart       │ Momentum Gauge + Sparkline │
├────────────────────┴────────────────────────────┤
│ Daily Activity Timeline (full width)            │
├────────────────────┬────────────────────────────┤
│ Deal-Breakers      │ Preference Fingerprint     │
├────────────────────┴────────────────────────────┤
│ Salary Positioning (full width violin plot)     │
├────────────────────┬────────────────────────────┤
│ Skill Gap Analysis │ Resume-Job Radar           │
├────────────────────┴────────────────────────────┤
│ Embedding Space Map (full width, interactive)   │
├────────────────────┬────────────────────────────┤
│ Remote Work Index  │ Tech Stack Trends          │
├────────────────────┴────────────────────────────┤
│ Overlooked Jobs Feed (cards)                    │
├─────────────────────────────────────────────────┤
│ Strategic Assessment (AI-generated text)        │
├─────────────────────────────────────────────────┤
│ Second Look / Regret Candidates (cards)         │
└─────────────────────────────────────────────────┘
```

---

## 3. API & Data Architecture

### Endpoint Design

```
Page Route:  /[username]/jobs/report     → Server-rendered Next.js page
API Route:   /api/v1/report/[username]   → JSON API (for programmatic access)
```

**Query Parameters:**
| Param | Default | Description |
|-------|---------|-------------|
| `days` | `30` | Date range for analysis |
| `sections` | `all` | Comma-separated: `funnel,salary,skills,behavior,market,recommendations` |
| `format` | `html` | `html` (page) or `json` (API) |
| `theme` | `dark` | `dark` or `light` |
| `public` | `false` | If true, anonymize company names and salary figures |

### Data Fetching Strategy

All data can be fetched in **4 parallel Supabase queries**:

```javascript
const [feedbackResult, jobsResult, searchesResult, resumeResult] =
  await Promise.all([
    // 1. All user feedback
    supabase
      .from('pathways_job_feedback')
      .select('job_id, sentiment, feedback, job_title, job_company, created_at')
      .eq('user_id', username)
      .order('created_at', { ascending: true }),

    // 2. All jobs in date range (with embeddings for clustering)
    supabase
      .from('jobs')
      .select('id, gpt_content, salary_usd, posted_at, embedding_v5')
      .not('gpt_content', 'is', null)
      .gte('posted_at', daysAgoISO),

    // 3. User's search profiles
    supabase.from('search_profiles').select('*').eq('user_id', username),

    // 4. User's resume
    fetch(`https://registry.jsonresume.org/${username}.json`).then((r) =>
      r.json()
    ),
  ]);
```

### Caching Strategy

| Data                                      | Cache TTL  | Where                                             |
| ----------------------------------------- | ---------- | ------------------------------------------------- |
| Report JSON                               | 15 minutes | Vercel Edge Cache (`Cache-Control: s-maxage=900`) |
| Market aggregates (trends, distributions) | 1 hour     | Supabase materialized view                        |
| Embedding projections (UMAP)              | 6 hours    | Computed and cached in KV or edge cache           |
| User feedback data                        | No cache   | Always fresh                                      |

### Precomputation vs On-the-fly

| Computation                 | Strategy                                 | Reason                              |
| --------------------------- | ---------------------------------------- | ----------------------------------- |
| Funnel counts               | On-the-fly                               | Simple aggregation, fast            |
| Skill gap analysis          | On-the-fly                               | Depends on current resume           |
| UMAP projection             | **Precompute**                           | Expensive (~5s for 200 embeddings)  |
| Market trends               | **Precompute** (materialized view)       | Scans all jobs, shared across users |
| Deal-breaker analysis       | On-the-fly                               | User-specific, moderate cost        |
| Similar job recommendations | **Precompute** (or lazy-compute + cache) | Requires multiple RPC calls         |

### Suggested Supabase Views

```sql
-- Monthly skill counts (for trend analysis)
CREATE MATERIALIZED VIEW skill_trends AS
SELECT
  DATE_TRUNC('month', posted_at) AS month,
  skill_name,
  COUNT(*) as job_count
FROM jobs,
  LATERAL jsonb_array_elements(gpt_content::jsonb -> 'skills') AS skill,
  LATERAL (SELECT skill->>'name' AS skill_name) AS extracted
WHERE gpt_content IS NOT NULL
  AND gpt_content != 'FAILED'
  AND posted_at > NOW() - INTERVAL '12 months'
GROUP BY month, skill_name;

-- Remote distribution by month
CREATE MATERIALIZED VIEW remote_trends AS
SELECT
  DATE_TRUNC('month', posted_at) AS month,
  gpt_content::jsonb->>'remote' AS remote_status,
  COUNT(*) as count
FROM jobs
WHERE gpt_content IS NOT NULL AND gpt_content != 'FAILED'
GROUP BY month, remote_status;

-- Salary percentiles by experience level
CREATE MATERIALIZED VIEW salary_percentiles AS
SELECT
  gpt_content::jsonb->>'experience' AS experience_level,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY salary_usd) AS p25,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY salary_usd) AS p50,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY salary_usd) AS p75,
  PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY salary_usd) AS p90
FROM jobs
WHERE salary_usd IS NOT NULL
GROUP BY experience_level;
```

### Privacy & Sharing

- **Default:** Report is private (requires auth)
- **Public mode:** Anonymizes company names ("Company A", "Company B"), removes exact salaries (shows ranges), hides dossier content
- **Shareable link:** `/thomasdavis/jobs/report?token=<signed-jwt>` — time-limited share link
- **Open Graph:** When shared, show the hero stats as a social preview card

---

## 4. Implementation Roadmap

### Phase 1: Core Report (P0 features) — ~3-4 days

1. **API route** `/api/v1/report/[username]` with parallel data fetching
2. **Next.js page** `/[username]/jobs/report` with dark theme layout
3. **Hero section** — Market Fit Score gauge, key stat counters
4. **Funnel chart** — Matched → Reviewed → Interested → Applied
5. **Daily activity timeline** — Calendar heatmap + stacked area
6. **Salary positioning** — Distribution with user overlay
7. **Remote work index** — Stacked bar trend
8. **Search momentum gauge** — Animated gauge
9. **Overlooked jobs feed** — Card list of top unreviewed matches
10. **Strategic assessment** — LLM-generated summary

### Phase 2: Advanced Analytics (P1 features) — ~4-5 days

11. **Deal-breaker detector** — Diverging bar chart
12. **Skill gap analysis** — Horizontal bars + Venn diagram
13. **Preference fingerprint** — Baseball card design
14. **Preference drift timeline** — Multi-sparkline panel
15. **Regret predictor** — "Second look" card list
16. **Embedding space map** — UMAP scatter plot with D3
17. **Skill co-occurrence network** — Force-directed graph
18. **Sankey flow diagram** — State transition flows
19. **Decision fatigue detector** — Position-based acceptance curve
20. **Dossier impact analysis** — Side-by-side donuts
21. **Resume-job radar chart** — Overlaid polygons
22. **Tech stack trends** — Sparkline grid
23. **Salary by role** — Violin/ridgeline plot
24. **Resume improvement suggestions** — Impact-sorted checklist
25. **"Jobs like this one"** — Expandable accordion

### Phase 3: Polish & Extras (P2 features) — ~2-3 days

26. **Hidden preference discovery** — Insight cards
27. **Competitive positioning** — Competition bubble chart
28. **Company DNA fingerprinting** — Archetype radar
29. **FOMO index** — Countdown-style ranked list
30. **Hiring velocity leaderboard** — Bar + trend arrows
31. **Unicorn job detector** — Special badges
32. **Print/PDF export** — `@media print` styles
33. **Social sharing** — OG tags, share links
34. **Animation polish** — Scroll-triggered entrances, counter animations

---

## 5. Cool Algorithm Deep-Dives

### 5.1 The Preference Centroid & Regret Score

The most powerful primitive in this system is the **preference centroid** — the average embedding of all interested jobs. This single vector captures "what the user actually wants" in 3072 dimensions, which is often different from what their resume says.

```javascript
/**
 * Compute the preference centroid from interested job embeddings.
 * This is the "true north" of the user's job search.
 */
function computePreferenceCentroid(interestedJobs) {
  const dim = 3072;
  const centroid = new Float64Array(dim);

  for (const job of interestedJobs) {
    const emb = job.embedding_v5;
    for (let i = 0; i < dim; i++) {
      centroid[i] += emb[i];
    }
  }

  // Normalize
  const n = interestedJobs.length;
  let magnitude = 0;
  for (let i = 0; i < dim; i++) {
    centroid[i] /= n;
    magnitude += centroid[i] * centroid[i];
  }
  magnitude = Math.sqrt(magnitude);
  for (let i = 0; i < dim; i++) {
    centroid[i] /= magnitude;
  }

  return centroid;
}

/**
 * The "drift vector" — difference between what the user wants
 * and what their resume says. Points toward aspirational direction.
 */
function computeDriftVector(resumeEmbedding, preferenceCentroid) {
  const drift = new Float64Array(3072);
  for (let i = 0; i < 3072; i++) {
    drift[i] = preferenceCentroid[i] - resumeEmbedding[i];
  }
  return drift;
}

/**
 * Regret score: how similar is a rejected job to the interested cluster?
 * High regret score = the user probably should have said yes.
 */
function computeRegretScore(rejectedJobEmbedding, preferenceCentroid) {
  return cosineSimilarity(rejectedJobEmbedding, preferenceCentroid);
}
```

**Why this is powerful:** The drift vector literally encodes the difference between who the user IS (resume) and who they WANT TO BE (interested jobs). This can drive resume suggestions, career trajectory predictions, and "you're looking for jobs that don't match your resume — here's what to change" insights.

---

### 5.2 Deal-Breaker Detection via Feature Divergence

```javascript
/**
 * Detect deal-breakers by comparing feature distributions
 * between accepted and rejected jobs.
 *
 * Uses a simplified chi-squared-like divergence score.
 */
function detectDealBreakers(acceptedJobs, rejectedJobs) {
  const features = {};

  // Extract categorical features
  const extractFeatures = (job) => ({
    remote: job.remote || 'Unknown',
    experience: job.experience || 'Unknown',
    salaryBucket: bucketSalary(job.salary_usd),
    hasEquity: /equity|stock|options|shares/i.test(JSON.stringify(job))
      ? 'Yes'
      : 'No',
    jobType: job.type || 'Unknown',
    country: job.location?.countryCode || 'Unknown',
  });

  // Count feature values in each group
  const acceptedFeatures = acceptedJobs.map(extractFeatures);
  const rejectedFeatures = rejectedJobs.map(extractFeatures);

  const featureNames = Object.keys(acceptedFeatures[0] || {});
  const dealBreakers = [];

  for (const feature of featureNames) {
    const acceptedDist = countValues(acceptedFeatures, feature);
    const rejectedDist = countValues(rejectedFeatures, feature);
    const allValues = new Set([
      ...Object.keys(acceptedDist),
      ...Object.keys(rejectedDist),
    ]);

    for (const value of allValues) {
      const acceptRate = (acceptedDist[value] || 0) / acceptedJobs.length;
      const rejectRate = (rejectedDist[value] || 0) / rejectedJobs.length;

      // Divergence score: how much more likely is this value in rejected vs accepted?
      if (rejectRate > 0.1) {
        // Only consider if it appears in >10% of rejections
        const divergence = rejectRate / Math.max(acceptRate, 0.01);
        if (divergence > 2) {
          // 2x more likely in rejections
          dealBreakers.push({
            feature,
            value,
            rejectRate: Math.round(rejectRate * 100),
            acceptRate: Math.round(acceptRate * 100),
            divergence: Math.round(divergence * 10) / 10,
            label: `${feature}: ${value}`,
            impact: divergence > 5 ? 'strong' : 'moderate',
          });
        }
      }
    }
  }

  return dealBreakers.sort((a, b) => b.divergence - a.divergence);
}

function bucketSalary(usd) {
  if (!usd) return 'Not listed';
  if (usd < 80000) return '<$80k';
  if (usd < 120000) return '$80-120k';
  if (usd < 160000) return '$120-160k';
  if (usd < 200000) return '$160-200k';
  return '$200k+';
}
```

---

### 5.3 Decision Fatigue Detection

```javascript
/**
 * Detect decision fatigue by analyzing acceptance rate
 * as a function of position within a review session.
 *
 * A session = a cluster of reviews within 30 minutes of each other.
 */
function detectDecisionFatigue(feedbackRecords) {
  // 1. Cluster into sessions (30-min gap threshold)
  const sessions = [];
  let currentSession = [];
  const GAP_MS = 30 * 60 * 1000;

  const sorted = [...feedbackRecords]
    .filter((f) => f.sentiment !== 'dossier')
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  for (const record of sorted) {
    const ts = new Date(record.created_at).getTime();
    if (
      currentSession.length === 0 ||
      ts - new Date(currentSession.at(-1).created_at).getTime() < GAP_MS
    ) {
      currentSession.push(record);
    } else {
      if (currentSession.length >= 3) sessions.push(currentSession);
      currentSession = [record];
    }
  }
  if (currentSession.length >= 3) sessions.push(currentSession);

  // 2. Compute acceptance rate by position
  const positionBuckets = {}; // position → { accepted, total }

  for (const session of sessions) {
    session.forEach((record, index) => {
      const bucket = Math.floor(index / 5) * 5; // Group by 5s: 0-4, 5-9, 10-14...
      if (!positionBuckets[bucket])
        positionBuckets[bucket] = { accepted: 0, total: 0 };
      positionBuckets[bucket].total++;
      if (['interested', 'applied', 'maybe'].includes(record.sentiment)) {
        positionBuckets[bucket].accepted++;
      }
    });
  }

  // 3. Compute rates and detect drop-off
  const rates = Object.entries(positionBuckets)
    .map(([pos, { accepted, total }]) => ({
      position: `${pos}-${parseInt(pos) + 4}`,
      rate: Math.round((accepted / total) * 100),
      total,
    }))
    .sort((a, b) => parseInt(a.position) - parseInt(b.position));

  // Fatigue detected if rate drops >20 percentage points from first to last bucket
  const firstRate = rates[0]?.rate || 0;
  const lastRate = rates.at(-1)?.rate || 0;
  const fatigueDetected = firstRate - lastRate > 20;
  const fatigueThreshold = rates.find(
    (r, i) => i > 0 && rates[0].rate - r.rate > 15
  );

  return {
    rates,
    fatigueDetected,
    fatigueThreshold: fatigueThreshold?.position || null,
    recommendation: fatigueDetected
      ? `Your acceptance rate drops from ${firstRate}% to ${lastRate}% during sessions. Consider reviewing fewer than ${
          fatigueThreshold?.position.split('-')[0] || 15
        } jobs per session.`
      : 'No significant decision fatigue detected. Your judgment stays consistent throughout sessions.',
  };
}
```

---

### 5.4 Preference Drift via Rolling Embedding Centroids

```javascript
/**
 * Track how the user's preferences drift over time by computing
 * weekly centroids of their interested jobs and measuring the
 * cosine distance between consecutive weeks.
 *
 * High drift = the user is pivoting or exploring.
 * Low drift = focused, consistent search.
 */
function computePreferenceDrift(feedbackWithEmbeddings) {
  // Group interested jobs by week
  const weeks = {};
  for (const record of feedbackWithEmbeddings) {
    if (record.sentiment !== 'interested' && record.sentiment !== 'applied')
      continue;

    const date = new Date(record.created_at);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().slice(0, 10);

    if (!weeks[weekKey]) weeks[weekKey] = [];
    weeks[weekKey].push(record.embedding_v5);
  }

  // Compute weekly centroids
  const weekKeys = Object.keys(weeks).sort();
  const centroids = weekKeys.map((week) => ({
    week,
    centroid: computePreferenceCentroid(
      weeks[week].map((e) => ({ embedding_v5: e }))
    ),
    count: weeks[week].length,
  }));

  // Compute drift between consecutive weeks
  const drifts = [];
  for (let i = 1; i < centroids.length; i++) {
    const similarity = cosineSimilarity(
      centroids[i].centroid,
      centroids[i - 1].centroid
    );
    drifts.push({
      from: centroids[i - 1].week,
      to: centroids[i].week,
      similarity: Math.round(similarity * 1000) / 1000,
      drift: Math.round((1 - similarity) * 1000) / 1000, // 0 = no change, 1 = complete pivot
      count: centroids[i].count,
    });
  }

  // Also: drift from resume embedding to latest centroid = "aspiration distance"
  // How far has the user's taste drifted from their own resume?

  return {
    weeklyDrifts: drifts,
    totalDrift:
      drifts.length > 0
        ? cosineSimilarity(centroids[0].centroid, centroids.at(-1).centroid)
        : 1.0,
    interpretation: drifts.some((d) => d.drift > 0.15)
      ? 'Significant preference shift detected — you may be pivoting your search focus.'
      : 'Your preferences have been consistent throughout your search.',
  };
}
```

---

### 5.5 Session Clustering & Momentum Score

```javascript
/**
 * Compute a composite "momentum score" that captures whether
 * the job search is gaining steam or stalling out.
 *
 * Factors:
 * - Review velocity (reviews/day trend)
 * - Quality signal (interested ratio trend)
 * - Application conversion (applied/interested ratio)
 * - Engagement depth (dossier rate)
 *
 * Returns: -100 (stalling) to +100 (surging)
 */
function computeMomentum(feedback, windowDays = 7) {
  const now = Date.now();
  const recent = feedback.filter(
    (f) => now - new Date(f.created_at).getTime() < windowDays * 86400000
  );
  const previous = feedback.filter((f) => {
    const age = now - new Date(f.created_at).getTime();
    return age >= windowDays * 86400000 && age < windowDays * 2 * 86400000;
  });

  const metrics = (records) => {
    const nonDossier = records.filter((r) => r.sentiment !== 'dossier');
    const interested = nonDossier.filter((r) =>
      ['interested', 'applied'].includes(r.sentiment)
    );
    const applied = nonDossier.filter((r) => r.sentiment === 'applied');
    const dossiers = records.filter((r) => r.sentiment === 'dossier');

    return {
      volume: nonDossier.length,
      acceptRate:
        nonDossier.length > 0 ? interested.length / nonDossier.length : 0,
      applyRate: interested.length > 0 ? applied.length / interested.length : 0,
      dossierRate:
        nonDossier.length > 0 ? dossiers.length / nonDossier.length : 0,
    };
  };

  const r = metrics(recent);
  const p = metrics(previous);

  // Compute trend ratios (>1 = improving, <1 = declining)
  const safe = (a, b) => (b > 0 ? a / b : a > 0 ? 2 : 1);

  const volumeTrend = safe(r.volume, p.volume);
  const qualityTrend = safe(r.acceptRate, p.acceptRate);
  const applyTrend = safe(r.applyRate, p.applyRate);

  // Weighted composite: scale to -100 to +100
  const raw = 0.4 * volumeTrend + 0.35 * qualityTrend + 0.25 * applyTrend;
  const momentum = Math.round(Math.max(-100, Math.min(100, (raw - 1) * 100)));

  return {
    score: momentum,
    label:
      momentum > 30
        ? 'Surging'
        : momentum > 0
        ? 'Building'
        : momentum > -30
        ? 'Steady'
        : 'Stalling',
    details: {
      reviewsThisWeek: r.volume,
      reviewsLastWeek: p.volume,
      acceptRateThisWeek: Math.round(r.acceptRate * 100),
      acceptRateLastWeek: Math.round(p.acceptRate * 100),
    },
  };
}
```

---

### 5.6 Skill Co-occurrence Graph Builder

```javascript
/**
 * Build a weighted co-occurrence graph of skills from job postings.
 * Edges connect skills that appear together in the same job.
 * Node color = user's acceptance rate for jobs with that skill.
 *
 * Returns D3-compatible { nodes: [], links: [] } format.
 */
function buildSkillGraph(reviewedJobs, feedbackMap) {
  const skillCount = {}; // skill → total appearances
  const cooccurrence = {}; // "skillA|skillB" → count
  const skillSentiment = {}; // skill → { accepted: N, total: N }

  for (const job of reviewedJobs) {
    const skills = (job.skills || [])
      .map((s) => (typeof s === 'string' ? s : s.name))
      .filter(Boolean)
      .map((s) => s.toLowerCase());

    const sentiment = feedbackMap[job.id];
    const isAccepted = ['interested', 'applied'].includes(sentiment);

    for (const skill of skills) {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
      if (!skillSentiment[skill])
        skillSentiment[skill] = { accepted: 0, total: 0 };
      skillSentiment[skill].total++;
      if (isAccepted) skillSentiment[skill].accepted++;
    }

    // Pairwise co-occurrence
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const key = [skills[i], skills[j]].sort().join('|');
        cooccurrence[key] = (cooccurrence[key] || 0) + 1;
      }
    }
  }

  // Build graph (filter to skills appearing 3+ times)
  const significantSkills = Object.entries(skillCount)
    .filter(([_, count]) => count >= 3)
    .map(([name, count]) => name);

  const significantSet = new Set(significantSkills);

  const nodes = significantSkills.map((name) => ({
    id: name,
    count: skillCount[name],
    acceptRate: skillSentiment[name].accepted / skillSentiment[name].total,
    // Color: green(high accept) → red(low accept)
    color: `hsl(${Math.round(
      (skillSentiment[name].accepted / skillSentiment[name].total) * 120
    )}, 70%, 50%)`,
  }));

  const links = Object.entries(cooccurrence)
    .filter(([key, count]) => {
      const [a, b] = key.split('|');
      return count >= 2 && significantSet.has(a) && significantSet.has(b);
    })
    .map(([key, count]) => {
      const [source, target] = key.split('|');
      return { source, target, weight: count };
    });

  return { nodes, links };
}
```

---

### 5.7 Adaptive "Overlooked Jobs" Ranker

```javascript
/**
 * Find the best unreviewed jobs by combining:
 * 1. Similarity to the user's preference centroid (not just resume!)
 * 2. Anti-deal-breaker filtering (exclude jobs with detected deal-breakers)
 * 3. Recency bonus (newer jobs ranked higher)
 * 4. Unicorn bonus (rare combinations of desirable attributes)
 *
 * This is fundamentally different from the standard job matching —
 * it uses LEARNED preferences, not just the resume.
 */
async function findOverlookedJobs(
  preferenceCentroid,
  dealBreakers,
  reviewedJobIds,
  supabase,
  { days = 30, limit = 10 } = {}
) {
  // 1. Vector search using preference centroid (not resume embedding!)
  const createdAfter = new Date(Date.now() - days * 86400000).toISOString();
  const { data: candidates } = await supabase.rpc('match_jobs_v5', {
    query_embedding: preferenceCentroid,
    match_threshold: 0.5,
    match_count: 200,
    created_after: createdAfter,
  });

  // 2. Filter out already reviewed
  const unreviewed = candidates.filter(
    (c) => !reviewedJobIds.has(String(c.id))
  );

  // 3. Fetch full job data
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, gpt_content, salary_usd, posted_at')
    .in(
      'id',
      unreviewed.map((u) => u.id)
    );

  // 4. Score with deal-breaker penalties and recency bonus
  const scored = jobs
    .map((job) => {
      const parsed = JSON.parse(job.gpt_content);
      const similarity =
        unreviewed.find((u) => u.id === job.id)?.similarity || 0;

      // Deal-breaker penalty
      let penalty = 0;
      for (const db of dealBreakers) {
        const jobValue = getFeatureValue(parsed, db.feature);
        if (jobValue === db.value) {
          penalty += db.divergence * 0.1; // Scale penalty by strength
        }
      }

      // Recency bonus (0 to 0.1)
      const ageMs = Date.now() - new Date(job.posted_at).getTime();
      const ageDays = ageMs / 86400000;
      const recencyBonus = Math.max(0, 0.1 * (1 - ageDays / days));

      const finalScore = similarity - penalty + recencyBonus;

      return {
        ...parsed,
        id: job.id,
        salary_usd: job.salary_usd,
        posted_at: job.posted_at,
        matchScore: Math.round(similarity * 100),
        finalScore,
        penalized: penalty > 0,
      };
    })
    .filter((j) => j.finalScore > 0.3)
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);

  return scored;
}
```

---

## Appendix: Data Schema Reference

### pathways_job_feedback

```
id          UUID        PK, auto-generated
user_id     TEXT        indexed
job_id      TEXT        indexed
feedback    TEXT        dossier content or feedback reason
sentiment   TEXT        indexed — interested|not_interested|maybe|applied|dismissed|dossier
job_title   TEXT        snapshot at time of feedback
job_company TEXT        snapshot at time of feedback
created_at  TIMESTAMPTZ auto-generated
```

### jobs

```
id            INT         PK
uuid          UUID
hn_item_id    INT         HN comment ID
content       TEXT        raw HTML from HN
gpt_content   TEXT        JSON string with structured job data (see below)
embedding_v5  VECTOR(3072) text-embedding-3-large
salary_usd    INT         parsed numeric salary (nullable)
posted_at     TIMESTAMPTZ
url           TEXT        HN permalink
```

### gpt_content structure

```json
{
  "title": "Senior Software Engineer",
  "company": "Acme Corp",
  "location": { "city": "SF", "countryCode": "US" },
  "position": "Senior Software Engineer",
  "type": "Full-time",
  "remote": "Full", // Full | Hybrid | None
  "salary": "$150k-$200k",
  "description": "...",
  "responsibilities": ["..."],
  "qualifications": ["..."],
  "skills": [
    {
      "name": "React",
      "level": "Expert",
      "keywords": ["TypeScript", "Next.js"]
    }
  ],
  "experience": "Senior", // Junior | Mid | Senior | Lead | Executive
  "meta": { "canonical": "...", "version": "v1.0.0" }
}
```

### search_profiles

```
id         UUID        PK
user_id    TEXT
name       TEXT
prompt     TEXT
embedding  VECTOR(3072) HyDE-generated
filters    JSONB
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```
