# Pathways Feature - Current State & Analysis

> **Last Updated:** 2026-01-07
> **Purpose:** Comprehensive documentation of the Pathways feature for planning refactoring and new feature development

---

## Executive Summary

Pathways is an AI-powered career coaching feature that combines:

- **Conversational resume editing** via GPT-4.1
- **Visual job exploration** via an interactive graph
- **Voice interaction** for hands-free usage
- **File upload** for resume parsing

The feature is **functionally complete** for its MVP but needs:

- Testing infrastructure
- Performance optimization
- UX polish
- Missing API endpoints

---

## 1. File Structure

```
apps/registry/app/pathways/
├── page.js                          # Entry point (client wrapper)
├── Pathways.js                      # Main container (~91 lines)
├── CLAUDE.md                        # Technical documentation
│
├── Components/
│   ├── CopilotChat.js              # Main chat interface (~270 lines)
│   ├── Messages.js                  # Message list with auto-scroll
│   ├── Message.js                   # Single message renderer
│   ├── Part.js                      # Message part renderer (~275 lines)
│   ├── ChatHeader.js                # Voice controls
│   ├── ChatInput.js                 # Input with file/voice buttons
│   ├── FileUpload.js                # Drag-drop file upload
│   ├── ResumePreview.js             # Full resume display (~397 lines)
│   ├── ResumeParseResult.js         # Uploaded resume preview
│   ├── PathwaysGraph.js             # Job graph visualization (~174 lines)
│   ├── PathwaysGraphControls.js     # Graph filter controls
│   ├── PathwaysJobPanel.js          # Job details panel
│   └── PathwaysGraphLoading.js      # Loading skeleton
│
├── context/
│   └── PathwaysContext.js           # Global state management (~312 lines)
│
├── hooks/
│   ├── usePathwaysSession.js        # Anonymous session migration
│   ├── usePathwaysJobData.js        # Job data fetching
│   ├── useResumeUpdater.js          # Resume update handling
│   ├── useJobToolsHandler.js        # Job tool processing (~205 lines)
│   ├── useSpeech.js                 # OpenAI TTS (~125 lines)
│   └── useVoiceRecording.js         # Audio recording (~220 lines)
│
├── utils/
│   └── applyResumeChanges.js        # Deep merge with _delete support (~133 lines)
│
└── api/pathways/
    ├── route.js                     # Main chat endpoint (~165 lines)
    ├── embedding/route.js           # Text embeddings
    ├── jobs/route.js                # Job matching (~200 lines)
    ├── upload/route.js              # File upload & parsing (~320 lines)
    └── tools/jobTools.js            # Tool definitions (~143 lines)
```

**Total Lines of Code:** ~2,500+ lines across 20+ files

---

## 2. Current User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ARRIVES                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │     Logged in?                │
              └───────────────────────────────┘
                    │              │
                   YES            NO
                    │              │
                    ▼              ▼
        ┌──────────────────┐  ┌──────────────────┐
        │ Load GitHub Gist │  │ Load Sample      │
        │ Resume           │  │ Resume (Jane Doe)│
        └──────────────────┘  └──────────────────┘
                    │              │
                    └──────┬───────┘
                           ▼
              ┌───────────────────────────────┐
              │   Generate Resume Embedding    │
              │   (text-embedding-3-large)     │
              └───────────────────────────────┘
                           │
                           ▼
              ┌───────────────────────────────┐
              │   Fetch Matching Jobs (200)    │
              │   via Supabase Vector Search   │
              └───────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MAIN INTERFACE                               │
│  ┌─────────────────────────────┐ ┌────────────────────────────┐ │
│  │     Content Tabs            │ │     Chat Sidebar           │ │
│  │  ┌─────┬─────────┬───────┐  │ │  ┌──────────────────────┐  │ │
│  │  │Graph│ Preview │ JSON  │  │ │  │   Greeting Message   │  │ │
│  │  └─────┴─────────┴───────┘  │ │  └──────────────────────┘  │ │
│  │                             │ │  ┌──────────────────────┐  │ │
│  │  [Interactive Job Graph]    │ │  │   Message History    │  │ │
│  │                             │ │  └──────────────────────┘  │ │
│  │                             │ │  ┌──────────────────────┐  │ │
│  │                             │ │  │ Input + File + Voice │  │ │
│  └─────────────────────────────┘ │  └──────────────────────┘  │ │
│                                  └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Functionality

### 3.1 Chat Interface

- **Model:** GPT-4.1 via Vercel AI SDK v5
- **Streaming:** Real-time token streaming with smooth UX
- **Auto-scroll:** Smart scroll that respects user position
- **Voice Output:** 6 OpenAI TTS voices (alloy, echo, fable, onyx, nova, shimmer)

### 3.2 AI Tools

| Tool                | Purpose                             | Status     |
| ------------------- | ----------------------------------- | ---------- |
| `updateResume`      | Apply changes to resume JSON        | ✅ Working |
| `filterJobs`        | Mark jobs as read/interested/hidden | ✅ Working |
| `searchJobs`        | Find jobs by text query             | ✅ Working |
| `showJobs`          | Display specific jobs in graph      | ✅ Working |
| `getJobInsights`    | Salary, companies, skills analysis  | ✅ Working |
| `refreshJobMatches` | Re-fetch jobs after resume change   | ✅ Working |

### 3.3 Resume Management

- **Edit via Chat:** "Add my job at Microsoft as a Senior Engineer"
- **JSON Editor:** Monaco editor for direct JSON editing
- **Preview:** Formatted resume with all sections
- **File Upload:** PDF, DOC, DOCX, TXT, images supported
- **Merge Strategy:** Deep merge with `_delete` markers for removals

### 3.4 Job Graph

- **Visualization:** ReactFlow with ~200 job nodes
- **Filters:** Text search, remote only, salary range
- **Keyboard:** Arrow navigation, M to mark read
- **Clustering:** Jobs grouped by similarity
- **Real-time:** Updates when resume changes

---

## 4. Data Architecture

### 4.1 State Management

```javascript
// PathwaysContext provides:
{
  // Resume State
  resume: Object,           // Parsed resume object
  resumeJson: String,       // Raw JSON string
  setResume: Function,
  setResumeJson: Function,

  // Embedding State
  embedding: Array,         // 3072-dim vector
  refreshEmbedding: Function,

  // Graph State
  graphVersion: Number,     // Increment to refresh graph
  incrementGraphVersion: Function,

  // Job State
  readJobIds: Set,
  interestedJobIds: Set,
  hiddenJobIds: Set,
  markAsRead: Function,
  markAsInterested: Function,
  markAsHidden: Function,

  // Session State
  sessionId: String,        // Anonymous user ID
  isLoggedIn: Boolean,
  migrateToUser: Function,  // Convert anonymous → user
}
```

### 4.2 API Endpoints

| Endpoint                  | Method | Purpose                    |
| ------------------------- | ------ | -------------------------- |
| `/api/pathways`           | POST   | Main chat with AI          |
| `/api/pathways/embedding` | POST   | Generate resume embedding  |
| `/api/pathways/jobs`      | POST   | Fetch matched jobs         |
| `/api/pathways/upload`    | POST   | Parse uploaded resume file |
| `/api/speech`             | POST   | TTS audio generation       |
| `/api/transcribe`         | POST   | Voice transcription        |

### 4.3 Database (Supabase)

```sql
-- Job matching uses RPC function
SELECT * FROM match_jobs_v5(
  query_embedding := [3072-dim vector],
  match_threshold := 0.5,
  match_count := 200,
  created_after := NOW() - INTERVAL '65 days'
);
```

---

## 5. Tech Stack

| Category   | Technology                        |
| ---------- | --------------------------------- |
| Framework  | Next.js 14 (App Router)           |
| AI         | Vercel AI SDK v5, GPT-4.1         |
| Embeddings | text-embedding-3-large (3072-dim) |
| UI         | Tailwind CSS, @repo/ui            |
| Graph      | @xyflow/react (ReactFlow)         |
| Editor     | @monaco-editor/react              |
| Icons      | lucide-react                      |
| Validation | Zod                               |
| Database   | Supabase (PostgreSQL + pgvector)  |
| TTS        | OpenAI TTS API                    |

---

## 6. Known Issues & Gaps

### 6.1 Missing API Endpoints

| Endpoint                  | Status    | Impact                              |
| ------------------------- | --------- | ----------------------------------- |
| `/api/speech`             | NOT FOUND | Voice output won't work             |
| `/api/transcribe`         | NOT FOUND | Voice input won't work              |
| `/api/job-states/migrate` | UNKNOWN   | Anonymous → user migration may fail |

### 6.2 Code Quality Issues

- **Debug logs:** `upload/route.js` has 6+ console.log statements
- **Error handling:** Some generic "Unknown error" fallbacks
- **No tests:** Zero test coverage despite documented test strategy

### 6.3 UX Issues

- **No conversation persistence:** Messages lost on refresh
- **No loading indicators:** Some async operations lack feedback
- **Mobile:** Responsive design exists but untested

### 6.4 Performance Concerns

- **No debouncing:** Graph refreshes on every change
- **Large payloads:** Full resume sent with each message
- **No caching:** Job results fetched fresh each time

---

## 7. Feature Completeness

| Feature              | Status      | Notes                           |
| -------------------- | ----------- | ------------------------------- |
| Chat Interface       | ✅ Complete | Streaming, tools work well      |
| Resume Editing       | ✅ Complete | Via chat or JSON editor         |
| Resume Preview       | ✅ Complete | All sections rendered           |
| File Upload          | ✅ Complete | PDF, DOC, images supported      |
| Job Graph            | ✅ Complete | Embedded, filtered, interactive |
| Voice Output         | ⚠️ Blocked  | API endpoint missing            |
| Voice Input          | ⚠️ Blocked  | API endpoint missing            |
| Conversation History | ❌ Missing  | Not persisted anywhere          |
| Tests                | ❌ Missing  | No test files exist             |
| Error States         | ⚠️ Partial  | Some cases not handled          |

---

## 8. Refactoring Opportunities

### 8.1 Large Files to Split

| File                 | Lines | Suggested Split                 |
| -------------------- | ----- | ------------------------------- |
| `ResumePreview.js`   | 397   | Extract section components      |
| `PathwaysContext.js` | 312   | Split into multiple contexts    |
| `CopilotChat.js`     | 270   | Extract message handling        |
| `Part.js`            | 275   | Extract tool-specific renderers |
| `upload/route.js`    | 320   | Extract parsers, validators     |

### 8.2 Code Consolidation

- Merge `useJobToolsHandler` logic into `PathwaysContext`
- Extract shared job-graph utilities to package
- Create shared API response helpers

### 8.3 Architecture Improvements

- Add React Query for caching & deduplication
- Implement optimistic updates for job states
- Add WebSocket for real-time sync

---

## 9. Recommended Priorities

### Phase 1: Foundation (Critical)

1. **Add missing API endpoints** (`/api/speech`, `/api/transcribe`)
2. **Add basic error boundaries**
3. **Remove debug console.logs**
4. **Add loading states to all async operations**

### Phase 2: Polish (High Value)

1. **Conversation persistence** (localStorage or DB)
2. **Mobile responsive fixes**
3. **Performance: debounce graph refreshes**
4. **Better error messages**

### Phase 3: Scale (Medium Priority)

1. **Add test coverage** (start with utilities)
2. **Split large components**
3. **Add React Query for caching**
4. **Implement job bookmarking**

### Phase 4: Enhance (Lower Priority)

1. **Multiple AI models support**
2. **Conversation export/sharing**
3. **Career goal tracking**
4. **Integration with job boards**

---

## 10. Integration Points

### With Main App

```
pathways/ ←──→ [username]/jobs-graph/  (shares hooks/utilities)
pathways/ ←──→ [username]/resume/      (same JSON Resume format)
pathways/ ←──→ api/resumes/            (loads user resume)
```

### External Services

```
OpenAI API ──→ GPT-4.1 (chat)
OpenAI API ──→ text-embedding-3-large (embeddings)
OpenAI API ──→ TTS (speech synthesis)
Supabase   ──→ pgvector (job matching)
Supabase   ──→ PostgreSQL (job states)
```

---

## 11. Development Notes

### Running Locally

```bash
cd apps/registry
pnpm dev
# Visit http://localhost:3000/pathways
```

### Environment Variables Required

```env
OPENAI_API_KEY=sk-...
SUPABASE_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
```

### Testing Changes

1. Start with sample resume (anonymous mode)
2. Try chat: "Add a job at Google as a Software Engineer"
3. Check graph updates automatically
4. Try file upload with a PDF resume
5. Verify voice toggle (won't work until API added)

---

## 12. Open Questions

1. **Should conversation history persist to DB or localStorage?**
2. **What's the desired mobile experience?**
3. **Should anonymous users be able to export resumes?**
4. **Rate limiting strategy for AI calls?**
5. **Multi-language support planned?**

---

## Appendix: File Line Counts

```
Component Files:
  CopilotChat.js         270 lines
  Part.js                275 lines
  ResumePreview.js       397 lines  ⚠️ Over 200 limit
  PathwaysGraph.js       174 lines
  PathwaysContext.js     312 lines  ⚠️ Over 200 limit

API Routes:
  route.js               165 lines
  jobs/route.js          200 lines
  upload/route.js        320 lines  ⚠️ Over 200 limit

Hooks:
  useJobToolsHandler.js  205 lines  ⚠️ Over 200 limit
  useVoiceRecording.js   220 lines  ⚠️ Over 200 limit
  useSpeech.js           125 lines
```

---

_This document should be updated as refactoring progresses._
