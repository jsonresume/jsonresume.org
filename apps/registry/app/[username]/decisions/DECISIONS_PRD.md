# Decisions Feature - Product Requirements Document

**Version:** 1.0
**Date:** 2025-10-21
**Status:** Draft
**Branch:** `decisions`

---

## Executive Summary

The Decisions feature is an AI-powered job matching visualization tool that helps candidates understand why they match (or don't match) specific job opportunities through an interactive decision tree interface. This feature leverages GPT-4o-mini and React Flow to create a transparent, educational matching experience that goes beyond simple compatibility scores.

---

## 1. Product Vision

### 1.1 Problem Statement

Current job matching systems provide opaque compatibility scores without explaining the reasoning behind matches. Candidates don't understand:

- Why they were matched with certain jobs
- What specific criteria they pass or fail
- How to improve their profile for better matches
- The decision logic behind automated filtering

### 1.2 Solution

An interactive three-pane interface that visualizes the decision-making process for job matching:

- **Left Pane:** Candidate's resume displayed clearly
- **Center Pane:** Animated React Flow decision tree showing the filtering logic
- **Right Pane:** Ranked job matches from the database

The decision tree animates the path for each job evaluation, showing exactly where a candidate succeeds or fails specific criteria.

### 1.3 Success Metrics

- **User Engagement:** Time spent on page, interaction with decision tree
- **Educational Value:** Users understand why they match/don't match jobs
- **Conversion:** Increased applications to "Strong Match" jobs
- **Transparency:** Reduced confusion about matching algorithm
- **Performance:** Page load < 3s, tree animation < 500ms per job

---

## 2. User Stories

### 2.1 Primary User Stories

**As a job seeker, I want to:**

1. See my resume in a clean, digestible format
2. Understand why I match or don't match specific jobs
3. See which criteria I pass or fail for each job
4. Explore different jobs and see the decision path change
5. Identify skills or qualifications I need to acquire
6. Focus on jobs where I'm a strong match

### 2.2 Secondary User Stories

**As a developer, I want to:**

1. Maintain the decision tree logic easily
2. Add new matching criteria without major refactoring
3. Test matching logic in isolation
4. Use AI to enhance matching intelligence over time

---

## 3. Technical Architecture

### 3.1 Technology Stack

- **Frontend Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Decision Tree:** React Flow (latest version)
- **AI Model:** GPT-4o-mini via Vercel AI SDK v5
- **Schema Validation:** Zod
- **Styling:** Tailwind CSS + @repo/ui components
- **State Management:** React hooks (useState, useMemo, useCallback)
- **Data Fetching:** Server-side + client-side hybrid
- **Database:** Supabase (existing jobs table)

### 3.2 File Structure

```
app/[username]/decisions/
├── page.js                           # Main page component (orchestrator)
├── layout.js                         # Standalone layout (no standard nav)
├── DECISIONS_PRD.md                  # This document
├── components/
│   ├── ResumePane.jsx                # Left pane - resume display
│   ├── DecisionTreePane.jsx          # Center pane - React Flow
│   ├── JobsPane.jsx                  # Right pane - ranked jobs
│   ├── JobCard.jsx                   # Individual job display
│   └── ResultBanner.jsx              # Shows final match result
├── hooks/
│   ├── useDecisionTree.js            # Decision tree state & logic
│   ├── useJobMatching.js             # Job scoring & ranking
│   └── useTreeAnimation.js           # Edge/node animation logic
├── config/
│   ├── decisionNodes.js              # Decision tree node definitions
│   ├── decisionEdges.js              # Decision tree edge definitions
│   └── matchingCriteria.js           # Matching rules & weights
└── utils/
    ├── scoreCalculator.js            # Calculate match scores
    ├── pathTraversal.js              # Traverse decision tree
    └── criteriaChecks.js             # Individual check functions

app/api/decisions/
├── route.js                          # Main API endpoint
├── tools/
│   ├── matchingToolSchema.js         # Zod schema for AI matching
│   └── resumeAnalysisSchema.js       # Zod schema for resume analysis
├── utils/
│   ├── analyzeResume.js              # AI-powered resume analysis
│   ├── analyzeJob.js                 # AI-powered job analysis
│   ├── generateMatchReasoning.js     # AI-generated match explanations
│   └── fetchJobs.js                  # Query jobs from Supabase
└── config/
    └── systemPrompt.js               # System prompt for AI
```

### 3.3 Data Flow

```
1. User navigates to /[username]/decisions
2. Page fetches resume via PublicResumeProvider (client)
3. Page fetches last 100 jobs from Supabase (server)
4. AI analyzes resume → generates candidate profile (client)
5. For each job:
   - Calculate rule-based score
   - AI generates detailed matching reasoning (optional enhancement)
6. Jobs ranked by score
7. User selects job → decision tree animates evaluation path
8. Result displayed with detailed reasons
```

---

## 4. Feature Specifications

### 4.1 Page Layout

**Route:** `/[username]/decisions`

**Layout:**

- Full viewport height (100vh)
- No standard site navigation/header
- Independent page with custom styling
- Three-column grid layout:
  - Left: 25% width (3/12 cols)
  - Center: 50% width (6/12 cols)
  - Right: 25% width (3/12 cols)
- Mobile: Stack vertically (tabs or accordion)

### 4.2 Left Pane: Resume Display

**Purpose:** Show candidate's resume in clean, digestible format

**Components:**

- Name and headline
- Years of experience
- Location + timezone
- Availability (weeks until start)
- Expected salary
- Work rights status
- Key skills (badge display)
- Top highlights (bullet list)
- Links (GitHub, website, portfolio)

**Features:**

- "Randomize" button (for demo/testing purposes)
- Match result summary at bottom
- Detailed reasoning list when job selected

**Data Source:**

- Fetched via `PublicResumeProvider` (existing pattern)
- Supports `?gistname=` parameter for alternate resumes

### 4.3 Center Pane: Decision Tree

**Purpose:** Visualize the matching decision logic with animated paths

**Technology:** React Flow

**Components:**

- Decision tree nodes (question nodes)
- Outcome nodes (Strong Match, Possible Match, Reject)
- Edges with labels ("Yes", "No", conditional text)
- Minimap for navigation
- Zoom controls
- Background grid

**Node Types:**

1. **Root Node:** "Candidate → Job Match"
2. **Decision Nodes:**
   - Has ALL required skills?
   - Enough experience?
   - Location fits?
   - Timezone fits?
   - Work rights verified?
   - Available soon enough?
   - Salary within range?
   - Bonus skill overlap?
3. **Outcome Nodes:**
   - ✅ Strong Match (green)
   - 🟡 Possible Match (yellow/orange)
   - ❌ Not a Match (red)

**Animation Logic:**

- On job selection → reset all edges to default gray
- Traverse tree based on check results
- Animate edges along the path (blue → outcome color)
- Highlight final outcome node
- Show reasons in left pane footer

**Styling:**

- Clean, professional design
- Subtle shadows and borders
- Color-coded outcomes
- Smooth transitions (CSS animations)
- Accessible contrast ratios

### 4.4 Right Pane: Ranked Jobs

**Purpose:** Show jobs ranked by compatibility score

**Data Source:**

- Last 100 jobs from Supabase `jobs` table
- Filter: Created within last 60 days
- Query: `SELECT * FROM jobs ORDER BY created_at DESC LIMIT 100`

**Display:**

- Scrollable list
- Each job shows:
  - Match percentage badge
  - Job title
  - Company name
  - Location (+ Remote OK badge if applicable)
  - Timezone
  - Salary range
  - Top 6 required skills (+ count of more)
- Active job highlighted
- Click to evaluate → animate tree

**Ranking Algorithm:**

```javascript
// Weighted scoring (0-100 scale)
const weights = {
  coreSkills: 40, // Hard gate - must pass
  experience: 20, // Heavy penalty if fail
  location: 8,
  timezone: 6,
  workRights: 8, // Hard gate - must pass
  availability: 8,
  salary: 5,
  bonusSkills: 5,
};

// Score calculation:
// 1. If missing required skills → 0% (immediate rejection)
// 2. If insufficient experience → score so far (heavy penalty)
// 3. If no work rights → score so far (rejection)
// 4. All other criteria add to score
// 5. Total: 0-100%
```

**AI Enhancement (Optional):**

- Use GPT-4o-mini to generate semantic skill matching
- Analyze job description for implicit requirements
- Identify transferable skills not explicitly listed
- Generate nuanced reasoning for edge cases

### 4.5 Matching Criteria

**1. Required Skills Check**

- **Logic:** ALL job required skills must be in candidate skills
- **Pass:** All skills present
- **Fail:** Missing any required skill → immediate rejection
- **AI Enhancement:** Semantic matching (e.g., "React" ≈ "React.js", "TypeScript" ≈ "TS")

**2. Experience Check**

- **Logic:** Candidate years >= job minimum years
- **Pass:** Experience sufficient
- **Fail:** Below threshold → likely rejection
- **AI Enhancement:** Evaluate quality of experience, not just years

**3. Location Check**

- **Logic:** If remote OK → pass, else candidate location = job location
- **Pass:** Match or remote accepted
- **Fail:** Location mismatch → proceed to timezone check

**4. Timezone Check**

- **Logic:** Candidate timezone = job timezone
- **Pass:** Timezone match
- **Fail:** Timezone mismatch → rejection
- **AI Enhancement:** Analyze overlap hours, remote work patterns

**5. Work Rights Check**

- **Logic:** If job requires work rights, candidate must have verified status
- **Pass:** Verified
- **Fail:** Not verified → rejection

**6. Availability Check**

- **Logic:** Candidate available within job's start timeline
- **Pass:** Can start in time
- **Fail:** Available later → possible match (not rejection)

**7. Salary Check**

- **Logic:** Candidate salary within job's min-max range
- **Pass:** Within range
- **Fail:** Outside range → possible match (negotiable)

**8. Bonus Skills Check**

- **Logic:** Candidate has >= 50% of job's bonus skills
- **Pass:** Good overlap → strong match
- **Fail:** Limited overlap → possible match

### 4.6 Outcome Categories

**✅ Strong Match (Green)**

- All required skills present
- Experience sufficient
- Location/timezone compatible OR remote OK
- Work rights verified
- Available in time
- Salary aligned
- Strong bonus skill overlap

**🟡 Possible Match (Yellow/Orange)**

- Core requirements met (skills, experience, work rights)
- One or more of:
  - Availability later than ideal
  - Salary slightly outside range (negotiable)
  - Limited bonus skill overlap
- Worth considering with caveats

**❌ Not a Match (Red)**

- Missing required skills
- Insufficient experience
- No work rights verification
- Location/timezone incompatible (non-remote)

---

## 5. AI Integration

### 5.1 AI Use Cases

**High Priority:**

1. **Semantic Skill Matching:** Match similar skills with different names
2. **Resume Analysis:** Generate candidate profile summary
3. **Job Analysis:** Extract implicit requirements from descriptions
4. **Match Reasoning:** Generate human-readable explanations

**Medium Priority:** 5. **Skill Gap Analysis:** Identify missing skills for target jobs 6. **Career Path Suggestions:** Recommend skill acquisition paths 7. **Salary Negotiation Insights:** Analyze market rates

**Low Priority (Future):** 8. **Interview Preparation:** Generate likely questions 9. **Resume Optimization:** Suggest improvements for better matches

### 5.2 AI Tool Schemas (Zod)

**Candidate Analysis Tool:**

```javascript
import { z } from 'zod';

export const candidateAnalysisSchema = z.object({
  coreCompetencies: z.array(z.string()).describe('Primary technical skills'),
  experienceLevel: z.enum(['junior', 'mid', 'senior', 'staff', 'principal']),
  industries: z.array(z.string()).describe('Industries with experience'),
  specializations: z.array(z.string()).describe('Areas of deep expertise'),
  careerGoals: z.string().describe('Inferred career trajectory'),
  strengths: z.array(z.string()).describe('Key differentiators'),
  skillGaps: z
    .array(z.string())
    .describe('Common requirements candidate lacks'),
});
```

**Job Analysis Tool:**

```javascript
import { z } from 'zod';

export const jobAnalysisSchema = z.object({
  requiredSkills: z.array(z.string()).describe('Explicit required skills'),
  implicitRequirements: z
    .array(z.string())
    .describe('Implied from description'),
  seniorityLevel: z.enum(['junior', 'mid', 'senior', 'staff', 'principal']),
  responsibilities: z.array(z.string()).describe('Key duties'),
  culture: z.string().describe('Company culture indicators'),
  growthOpportunities: z.string().describe('Career growth potential'),
});
```

**Match Reasoning Tool:**

```javascript
import { z } from 'zod';

export const matchReasoningSchema = z.object({
  overallFit: z.enum(['strong', 'possible', 'weak']),
  strengths: z.array(
    z.object({
      criterion: z.string(),
      reason: z.string(),
    })
  ),
  weaknesses: z.array(
    z.object({
      criterion: z.string(),
      reason: z.string(),
      remediation: z.string().optional(),
    })
  ),
  recommendation: z.string().describe('Should they apply? Why/why not?'),
  confidence: z.number().min(0).max(1).describe('AI confidence in analysis'),
});
```

### 5.3 System Prompts

**Resume Analysis Prompt:**

```
You are an expert technical recruiter analyzing a candidate's resume.

Your task:
1. Identify their core technical competencies
2. Assess their experience level and seniority
3. Understand their career trajectory and specializations
4. Recognize strengths that make them stand out
5. Identify common job requirements they may lack

Focus on:
- Technical skills and tools
- Years of experience and progression
- Types of projects and their impact
- Leadership and collaboration indicators
- Industry-specific knowledge

Output a structured analysis using the provided tool schema.
```

**Job Analysis Prompt:**

```
You are an expert technical recruiter analyzing a job description.

Your task:
1. Extract all required skills (explicit and implicit)
2. Identify the seniority level required
3. Understand key responsibilities and expectations
4. Assess company culture from language and tone
5. Identify growth opportunities for the role

Look for:
- Technical stack and tools
- "Must-have" vs "nice-to-have" qualifications
- Team dynamics and collaboration needs
- Project types and complexity
- Career advancement indicators

Output a structured analysis using the provided tool schema.
```

**Match Reasoning Prompt:**

```
You are an expert career advisor evaluating job-candidate fit.

Given:
- Candidate profile (skills, experience, goals)
- Job description (requirements, responsibilities, culture)
- Rules-based match score and path

Your task:
1. Explain why this is a strong/possible/weak match
2. Highlight specific strengths that align well
3. Identify gaps or concerns
4. Suggest remediation for weaknesses (if applicable)
5. Provide a clear recommendation: should they apply?

Be:
- Honest and constructive
- Specific with examples
- Encouraging but realistic
- Focused on actionable insights

Output structured reasoning using the provided tool schema.
```

### 5.4 AI API Endpoints

**POST `/api/decisions/analyze-resume`**

Request:

```json
{
  "resume": {
    /* JSON Resume format */
  }
}
```

Response:

```json
{
  "analysis": {
    /* candidateAnalysisSchema */
  },
  "tokens": 1500
}
```

**POST `/api/decisions/analyze-job`**

Request:

```json
{
  "job": {
    /* job object from DB */
  }
}
```

Response:

```json
{
  "analysis": {
    /* jobAnalysisSchema */
  },
  "tokens": 1200
}
```

**POST `/api/decisions/match-reasoning`**

Request:

```json
{
  "candidate": {
    /* candidate profile */
  },
  "job": {
    /* job object */
  },
  "rulesBasedScore": 76,
  "rulesBasedPath": [
    /* decision path */
  ]
}
```

Response:

```json
{
  "reasoning": {
    /* matchReasoningSchema */
  },
  "tokens": 2000
}
```

---

## 6. User Experience

### 6.1 Initial Load

1. User navigates to `/[username]/decisions`
2. Loading state shown (skeleton UI)
3. Resume fetched from public API
4. Jobs fetched from database (last 100, server-side)
5. Top job auto-selected
6. Decision tree animates for top job
7. Match result shown in left pane

**Performance Target:** < 3 seconds to interactive

### 6.2 Job Selection Flow

1. User clicks a job in right pane
2. Right pane: Selected job highlighted
3. Center pane:
   - Reset all edges to gray (instant)
   - Traverse decision tree based on checks
   - Animate edges along path (200ms per edge)
   - Highlight outcome node
4. Left pane:
   - Update result badge
   - Show detailed reasons list
   - Scroll to result section

**Animation Target:** < 500ms total

### 6.3 Mobile Experience

**Approach:** Tabbed interface

- Tab 1: Resume
- Tab 2: Decision Tree (full width)
- Tab 3: Jobs

**Alternative:** Accordion panels

- Click to expand/collapse each section
- Default: Jobs expanded, tree visible

---

## 7. Implementation Phases

### Phase 1: MVP (Rules-Based Matching)

**Goal:** Build functional three-pane interface with rule-based matching

**Tasks:**

1. ✅ Set up page structure and layout
2. ✅ Create resume display component (reuse existing patterns)
3. ✅ Fetch jobs from Supabase (last 100)
4. ✅ Implement decision tree with React Flow
5. ✅ Build rule-based scoring algorithm
6. ✅ Create job card components
7. ✅ Implement path traversal logic
8. ✅ Add edge/node animation
9. ✅ Display match results with reasons
10. ✅ Test with real resume + job data

**Deliverable:** Functional decision tree matching with no AI

### Phase 2: AI-Enhanced Matching

**Goal:** Add semantic skill matching and intelligent analysis

**Tasks:**

1. ✅ Create Zod tool schemas
2. ✅ Build API endpoints for AI analysis
3. ✅ Implement resume analysis (GPT-4o-mini)
4. ✅ Implement job analysis (GPT-4o-mini)
5. ✅ Add semantic skill matching
6. ✅ Generate AI-powered match reasoning
7. ✅ Display AI insights in UI
8. ✅ Add confidence indicators

**Deliverable:** Intelligent matching with AI explanations

### Phase 3: Advanced Features

**Goal:** Add career guidance and optimization features

**Tasks:**

1. ✅ Skill gap analysis
2. ✅ Career path suggestions
3. ✅ Resume optimization recommendations
4. ✅ Interview preparation insights
5. ✅ Salary negotiation data
6. ✅ Export match reports (PDF)
7. ✅ Save favorite jobs
8. ✅ Track application status

**Deliverable:** Comprehensive career decision platform

---

## 8. Testing Strategy

### 8.1 Unit Tests

**Files to Test:**

- `utils/scoreCalculator.js` → scoring algorithm
- `utils/pathTraversal.js` → decision tree logic
- `utils/criteriaChecks.js` → individual check functions
- `hooks/useJobMatching.js` → ranking logic
- `hooks/useDecisionTree.js` → tree state management

**Test Cases:**

- Score calculation with various candidate/job combinations
- Path traversal for all outcome types
- Edge cases (missing data, invalid formats)
- Performance (large job lists)

### 8.2 Integration Tests

**Scenarios:**

1. Load page → resume + jobs fetched → top job evaluated
2. Click job → tree animates → result shown
3. Jobs ranked correctly by score
4. AI analysis returns valid structured data
5. Error handling (API failures, network issues)

### 8.3 E2E Tests (Playwright)

**User Flows:**

1. Navigate to `/testuser/decisions`
2. Verify three panes render
3. Click a job in right pane
4. Verify tree animates
5. Verify result updates
6. Test mobile responsive layout

### 8.4 Performance Tests

**Metrics:**

- Initial page load < 3s
- Time to interactive < 3s
- Tree animation < 500ms
- Job selection response < 100ms
- Memory usage < 100MB
- AI API response < 2s

---

## 9. Future Enhancements

### 9.1 Near-Term (3-6 months)

1. **Job Alerts:** Notify when new strong matches appear
2. **Application Tracking:** Track applied jobs and outcomes
3. **Comparison Mode:** Compare multiple jobs side-by-side
4. **Custom Filters:** Filter jobs by criteria (remote, salary, etc.)
5. **Share Results:** Share decision tree visualization
6. **Export Report:** PDF export of match analysis

### 9.2 Long-Term (6-12 months)

1. **Interactive Editing:** Edit resume inline and see matches update
2. **Scenario Planning:** "What if I learned React? How would matches change?"
3. **Employer View:** Reverse flow for employers matching candidates
4. **Market Insights:** Aggregate data on skill demand, salaries
5. **Learning Paths:** Recommend courses/resources for skill gaps
6. **Mentorship Matching:** Connect with others who made similar transitions

---

## 10. Success Criteria

### 10.1 Launch Criteria

**Functionality:**

- [ ] All three panes render correctly
- [ ] Jobs load from database
- [ ] Resume loads from public API
- [ ] Decision tree animates properly
- [ ] Match results display accurately
- [ ] Mobile layout works

**Performance:**

- [ ] Page load < 3s (Lighthouse)
- [ ] Core Web Vitals "Good"
- [ ] No console errors
- [ ] Works in Chrome, Firefox, Safari, Edge

**Quality:**

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] No TypeScript errors
- [ ] Accessibility score > 90
- [ ] SEO optimized

### 10.2 Post-Launch Metrics

**Usage:**

- Daily active users viewing decisions
- Average time on page (target: 3+ minutes)
- Jobs evaluated per session (target: 5+)
- Return visits (target: 30% within 7 days)

**Engagement:**

- Jobs clicked in right pane
- Tree interactions (zoom, pan)
- Resume randomizations (testing)

**Quality:**

- Error rate < 1%
- API response times < 2s
- User feedback sentiment

---

## 11. Technical Considerations

### 11.1 Performance Optimization

**Frontend:**

- Use `React.memo` for panes (prevent unnecessary re-renders)
- Memoize job scoring calculations with `useMemo`
- Virtualize job list if > 100 jobs (react-window)
- Lazy load React Flow (code splitting)
- Optimize animations (CSS transforms, not layout changes)

**Backend:**

- Cache resume analysis results (5 min TTL)
- Cache job analysis results (1 hour TTL)
- Batch AI requests if possible
- Use edge functions for low latency
- Index database queries properly

**AI:**

- Stream AI responses for better UX
- Set max tokens limits (resume: 2000, job: 1500, reasoning: 2500)
- Use GPT-4o-mini (cheaper, faster than GPT-4)
- Implement retry logic with exponential backoff
- Monitor token usage and costs

### 11.2 Error Handling

**Scenarios:**

1. **Resume not found:** Show error state with CTA to create resume
2. **No jobs available:** Show empty state with message
3. **AI API failure:** Fall back to rules-based matching only
4. **Network error:** Show retry button with exponential backoff
5. **Invalid data:** Log error, show graceful degradation

**User Feedback:**

- Toast notifications for errors
- Loading states for async operations
- Empty states with helpful CTAs
- Error boundaries for component failures

### 11.3 Accessibility

**Requirements:**

- Keyboard navigation for all interactions
- ARIA labels for decision tree nodes/edges
- Screen reader announcements for state changes
- High contrast mode support
- Focus indicators on interactive elements
- Alternative text for all visual elements
- Skip links for main content areas

**Testing:**

- Run Lighthouse accessibility audit (target: 95+)
- Test with screen reader (VoiceOver, NVDA)
- Test keyboard-only navigation
- Verify color contrast ratios

### 11.4 SEO Optimization

**Meta Tags:**

```html
<title>{username}'s Job Match Decisions | JSON Resume</title>
<meta
  name="description"
  content="Visualize job matching decisions with an interactive decision tree. See why you match or don't match specific opportunities."
/>
<meta property="og:title" content="{username}'s Job Match Decisions" />
<meta
  property="og:description"
  content="Interactive job matching visualization"
/>
<meta property="og:image" content="/og-decisions.png" />
```

**Structured Data:**

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Job Match Decisions",
  "description": "AI-powered job matching with decision tree visualization",
  "applicationCategory": "Career Planning"
}
```

---

## 12. Dependencies

### 12.1 NPM Packages

**Required:**

- `reactflow` (latest) - Decision tree visualization
- `ai` (v5) - Vercel AI SDK
- `@ai-sdk/openai` - OpenAI integration
- `zod` - Schema validation

**Already Installed:**

- `next` - Framework
- `react` - UI library
- `tailwindcss` - Styling
- `@supabase/supabase-js` - Database client

### 12.2 API Dependencies

- OpenAI API (GPT-4o-mini, embeddings)
- Supabase (jobs table, match_jobs function)
- GitHub API (resume gist fetching)

### 12.3 Environment Variables

```env
OPENAI_API_KEY=sk-...           # Existing
SUPABASE_URL=https://...        # Existing
SUPABASE_KEY=...                # Existing
NEXT_PUBLIC_APP_URL=https://... # Existing
```

---

## 13. Open Questions

1. **Should we show AI confidence scores to users?**

   - Pro: Transparency, trust
   - Con: Might confuse or overwhelm

2. **How much AI usage is too much (cost)?**

   - Analyze every job on load? (expensive)
   - Only analyze when job clicked? (slower UX)
   - Batch analyze top 10? (compromise)

3. **Should users be able to edit the decision tree?**

   - Custom weights for criteria?
   - Add/remove decision nodes?
   - Save custom configurations?

4. **Mobile-first or desktop-first?**

   - Decision trees are complex → better on desktop
   - But mobile traffic is significant
   - Should we simplify for mobile?

5. **Should this be public or require authentication?**
   - Public: Better for sharing, portfolio
   - Auth: Better for personalization, saved state
   - Hybrid: Basic version public, advanced features auth?

---

## 14. Risks & Mitigation

### 14.1 Technical Risks

**Risk:** AI API costs exceed budget
**Mitigation:** Implement caching, rate limiting, smart batching

**Risk:** Performance issues with large datasets
**Mitigation:** Virtualization, pagination, lazy loading

**Risk:** React Flow bundle size too large
**Mitigation:** Code splitting, lazy loading, tree shaking

**Risk:** Decision tree too complex for users
**Mitigation:** Progressive disclosure, tooltips, help text

### 14.2 Product Risks

**Risk:** Users don't understand the decision tree
**Mitigation:** Add tutorial, tooltips, example walkthroughs

**Risk:** Low engagement (users don't find it useful)
**Mitigation:** User testing, iterate on UX, add value-add features

**Risk:** AI explanations are unhelpful or wrong
**Mitigation:** Prompt engineering, validation, fallback to rules

**Risk:** Not enough job data to be useful
**Mitigation:** Ensure consistent job ingestion, expand sources

---

## 15. Appendix

### 15.1 Prototype Code Analysis

The provided prototype (`decision-tree-resumes.html`) demonstrates:

**Strengths:**

- Clean three-pane layout
- Effective use of React Flow
- Well-defined decision logic
- Smooth animations
- Clear scoring algorithm
- Good separation of concerns

**To Adapt:**

- Replace mock data generators with real data fetching
- Integrate with existing resume/jobs infrastructure
- Add AI analysis layer
- Improve mobile responsiveness
- Add accessibility features
- Implement proper error handling
- Use Tailwind + @repo/ui components for consistency

**To Add:**

- Persistent state (URL params, localStorage)
- Shareable links
- Export functionality
- User preferences
- Analytics tracking
- A/B testing hooks

### 15.2 Related Features

**Existing Features to Reference:**

- `/[username]/jobs` - Jobs listing and fetching patterns
- `/[username]/timeline` - Public resume display patterns
- `/[username]/editor` - Resume editing (for future interactive mode)
- `/[username]/ats` - ATS scoring (similar analysis logic)

**Code Patterns to Reuse:**

- `PublicResumeProvider` - Resume fetching
- `useJobMatching` hook (from jobs page)
- Structured logging with Pino
- Retry logic with exponential backoff
- AI SDK v5 patterns from chat API
- Zod schemas from chat tool definitions

### 15.3 References

**Documentation:**

- [React Flow Docs](https://reactflow.dev/docs)
- [Vercel AI SDK v5 Docs](https://sdk.vercel.ai/docs)
- [Zod Documentation](https://zod.dev)
- [JSON Resume Schema](https://jsonresume.org/schema/)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)

**Internal Docs:**

- `/apps/docs` - Existing documentation
- `/CLAUDE.md` - Repository instructions
- `/CONTRIBUTING.md` - Contribution guidelines

---

**Document Status:** Ready for Review
**Next Steps:**

1. Review and approve PRD
2. Begin Phase 1 implementation
3. Create GitHub issues for each task
4. Set up initial project structure
5. Build MVP with rules-based matching

**Questions?** Contact: @ajaxdavis
