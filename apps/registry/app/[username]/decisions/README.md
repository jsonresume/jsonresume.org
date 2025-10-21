# Decisions Feature - Implementation Summary

## 🎉 Phase 1 (MVP) - COMPLETE

The Decisions feature is now live! This AI-powered job matching visualization helps candidates understand why they match (or don't match) specific job opportunities through an interactive decision tree.

---

## 🌟 What's Built

### Page Structure
- **Route:** `/[username]/decisions`
- **Auth:** Required (uses ResumeProvider like editor page)
- **Layout:** Standalone fullscreen (no nav/header)
- **Design:** Inspired by nof1.ai's clean, professional aesthetic

### Three-Pane Layout

#### Left Pane (25%) - Resume Display
- Candidate name and headline
- Years of experience
- Location and contact info
- Key skills (badge display)
- Top highlights from work history
- Match result footer with detailed reasoning

#### Center Pane (50%) - Decision Tree
- React Flow visualization
- 12 nodes: 9 decision nodes + 3 outcome nodes
- Animated path traversal (200ms per edge)
- Color-coded outcomes (green/orange/red)
- MiniMap for navigation
- Zoom controls

#### Right Pane (25%) - Ranked Jobs
- Last 100 jobs from database
- Sorted by match score (0-100%)
- Click to evaluate → animates tree
- Color-coded badges (green/orange/gray)
- Displays job title, company, location, salary, skills

---

## 📊 Matching Logic

### 8 Criteria (Weighted Scoring)

1. **Core Skills** (40 points) - Hard gate, must pass
2. **Experience** (20 points) - Heavy penalty if fail
3. **Work Rights** (8 points) - Hard gate, must pass
4. **Location** (8 points) - Can fail if remote OK
5. **Timezone** (6 points) - Only checked if location fails
6. **Availability** (8 points) - Fail → possible match later
7. **Salary** (5 points) - Fail → negotiable
8. **Bonus Skills** (5 points) - Fail → still possible

### 3 Outcomes

- **✅ Strong Match** (85-100%): All criteria passed
- **🟡 Possible Match** (60-84%): Core met, some gaps
- **❌ Not a Match** (<60%): Missing critical criteria

---

## 🗂️ File Structure

```
app/[username]/decisions/
├── DECISIONS_PRD.md                  # Product requirements document
├── README.md                         # This file
├── schema.sql                        # Supabase table schemas
├── page.js                           # Main page component
├── layout.js                         # Standalone layout
├── components/
│   ├── ResumePane.jsx                # Left pane
│   ├── DecisionTreePane.jsx          # Center pane (React Flow)
│   └── JobsPane.jsx                  # Right pane
├── hooks/
│   ├── useJobMatching.js             # Scoring & ranking logic
│   └── useDecisionTree.js            # Tree state & animation
└── config/
    ├── designSystem.js               # Colors, typography, spacing
    ├── decisionTree.js               # Nodes & edges config
    └── matchingCriteria.js           # Scoring rules & weights
```

---

## 🎨 Design System

### Colors (nof1.ai inspired)
- **Background:** White (#FFFFFF), Light gray (#F8FAFC)
- **Text:** Dark slate (#1E293B), Slate gray (#64748B)
- **Paths:** Blue, purple, green, orange, teal
- **Outcomes:** Green (strong), orange (possible), red (reject)

### Typography
- **Sans:** System font stack
- **Mono:** SF Mono for metrics/numbers
- **Sizes:** 12px - 36px scale
- **Weights:** 400, 500, 600, 700

### Components
- **Cards:** Rounded (24px), subtle shadow
- **Badges:** Pill-shaped with color coding
- **Spacing:** 4px base unit (4, 8, 12, 16, 24, 32px)

---

## 🔧 Technical Details

### Dependencies
- **@xyflow/react** (v12.4.2) - Decision tree visualization
- **ai** (v5.0.60) - AI SDK (for Phase 2)
- **zod** - Schema validation (for Phase 2)
- **@supabase/supabase-js** - Database client

### Performance
- **Lazy loading:** React Flow code-split
- **Memoization:** useCallback, useMemo for re-render optimization
- **Virtualization:** (Future) for 100+ jobs

### Accessibility
- **Keyboard nav:** All interactive elements
- **ARIA labels:** Decision tree nodes
- **Screen reader:** State announcements
- **Color contrast:** WCAG AA compliant

---

## 🚀 Usage

### For Users
1. Navigate to `https://registry.jsonresume.org/[your-username]/decisions`
2. Wait for resume and jobs to load
3. Top job auto-selected and evaluated
4. Click any job to see its decision path
5. Watch the tree animate to show the evaluation
6. See match result and reasoning in left pane

### For Developers
```javascript
// Scoring a job
import { scoreCandidateForJob } from './config/matchingCriteria';
const { score, breakdown } = scoreCandidateForJob(resume, job);

// Determining outcome
import { determineOutcome } from './config/matchingCriteria';
const outcome = determineOutcome(scoreResult); // 'strongMatch' | 'possibleMatch' | 'noMatch'
```

---

## 📦 Database Schema (Supabase)

### Tables (for Phase 2 caching)

```sql
-- Cache AI job analysis (7-day TTL)
decisions_job_analysis
  - job_id (FK to jobs)
  - required_skills, implicit_requirements
  - seniority_level, responsibilities
  - analyzed_at, analysis_version

-- Cache candidate analysis (7-day TTL)
decisions_candidate_analysis
  - username
  - core_competencies, experience_level
  - industries, specializations
  - analyzed_at, analysis_version

-- Cache match results (7-day TTL)
decisions_match_results
  - username, job_id (FK)
  - overall_fit, score
  - strengths, weaknesses (JSONB)
  - matched_at, analysis_version
```

Run `schema.sql` to create tables.

---

## 🔮 Phase 2: AI-Enhanced Matching (Next Steps)

### Features to Build
1. **Semantic Skill Matching** - GPT-4o-mini analyzes skill similarities
2. **Job Analysis** - Extract implicit requirements from descriptions
3. **Candidate Profiling** - Generate comprehensive candidate summaries
4. **Match Reasoning** - AI-generated explanations for decisions

### Files to Create
```
app/api/decisions/
├── route.js                          # Main API endpoint
├── tools/
│   ├── matchingToolSchema.js         # Zod schemas
│   └── resumeAnalysisSchema.js
├── utils/
│   ├── analyzeResume.js              # AI resume analysis
│   ├── analyzeJob.js                 # AI job analysis
│   └── generateMatchReasoning.js     # AI reasoning
└── config/
    └── systemPrompt.js               # System prompts
```

### API Endpoints

**POST `/api/decisions/analyze-resume`**
- Input: Resume JSON
- Output: AI-generated candidate profile
- Cache: Supabase (7 days)

**POST `/api/decisions/analyze-job`**
- Input: Job object
- Output: AI-extracted requirements
- Cache: Supabase (7 days)

**POST `/api/decisions/match-reasoning`**
- Input: Candidate + job + rules-based score
- Output: AI-generated reasoning & recommendations
- Cache: Supabase (7 days)

---

## 🧪 Testing

### Manual Testing
1. Login to registry
2. Navigate to `/[username]/decisions`
3. Verify three panes render
4. Click different jobs
5. Verify tree animates correctly
6. Check match results update
7. Test with different resume data

### Automated Testing (Future)
- Unit tests for scoring functions
- Integration tests for hooks
- E2E tests with Playwright

---

## 📈 Metrics to Track

### Usage
- Page views
- Time on page (target: 3+ minutes)
- Jobs evaluated per session (target: 5+)
- Return visits (target: 30% within 7 days)

### Quality
- Error rate (target: <1%)
- API response times (target: <2s)
- User feedback sentiment

---

## 🎯 Success Criteria (Met!)

- [x] Three-pane layout renders correctly
- [x] Jobs load from database (last 100)
- [x] Resume loads from ResumeProvider
- [x] Decision tree animates properly
- [x] Match results display accurately
- [x] Desktop-optimized (mobile later)
- [x] No console errors
- [x] All files <200 lines ✅
- [x] Clean, professional design (nof1.ai inspired)
- [x] Authenticated access (like editor)

---

## 🐛 Known Issues

None! 🎉

---

## 💡 Future Enhancements

### Near-Term (Phase 2)
- AI semantic skill matching
- Detailed match reasoning
- Supabase caching layer

### Long-Term (Phase 3)
- Skill gap analysis
- Career path suggestions
- Resume optimization tips
- Interview prep insights
- Salary negotiation data
- Application tracking
- Export match reports (PDF)

---

## 📝 Notes

- **Authentication:** Uses existing ResumeProvider (GitHub OAuth)
- **Jobs API:** Reuses `/api/jobs` endpoint from jobs page
- **React Flow:** Already installed (@xyflow/react v12.4.2)
- **Design:** Clean, professional, data-dense (nof1.ai aesthetic)
- **Performance:** Optimized with memoization, lazy loading
- **Codebase:** All files under 200 lines per CLAUDE.md

---

## 👨‍💻 Developer Notes

### Adding New Criteria
1. Add check function to `config/matchingCriteria.js`
2. Update `WEIGHTS` object (must sum to 100)
3. Add node to `config/decisionTree.js`
4. Add edges to connect new node
5. Update `evaluateJob` in `hooks/useDecisionTree.js`
6. Test thoroughly!

### Customizing Design
- Edit `config/designSystem.js` for colors, spacing, etc.
- All components use design system constants
- nof1.ai aesthetic: clean, professional, data-focused

### Debugging
- Check browser console for errors
- Use React DevTools to inspect state
- Check Network tab for API calls
- Verify resume data structure matches JSON Resume schema

---

**Status:** Phase 1 MVP Complete ✅
**Next:** Phase 2 AI Enhancement (when requested)
**Created:** 2025-10-21
**Last Updated:** 2025-10-21
