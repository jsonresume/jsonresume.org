# Pathways: AI-Powered Career Navigation Platform

## Vision

Pathways is an intelligent career navigation system that combines conversational AI with visual job exploration. It transforms the static resume into a living document that actively helps users discover, evaluate, and pursue career opportunities.

**The core insight**: Your resume is not just a document—it's a map of where you've been and a compass for where you could go. Pathways makes this map interactive, intelligent, and actionable.

**The experience**: Users arrive and immediately engage with an AI assistant that understands their career history. They can explore a visual graph of job opportunities matched to their experience, ask questions ("What skills do I need for senior roles?"), and make changes to their resume through natural conversation ("Add my 2 years at Microsoft as a Senior Engineer"). Every interaction updates their career profile in real-time, and the job recommendations evolve accordingly.

**For anonymous users**: Start exploring immediately. Build a resume through conversation. When you sign up, everything you've created becomes your permanent profile.

**For logged-in users**: Your GitHub Gist resume loads automatically. Chat to refine it. Watch the jobs graph update as your profile evolves. Use AI tools to batch-process job listings ("Mark all gambling companies as read").

---

## Product Requirements Document

### 1. Overview

#### 1.1 Problem Statement

Job seekers face three core challenges:

1. **Resume maintenance is tedious** - Updating resumes is manual, error-prone, and disconnected from job search
2. **Job discovery is overwhelming** - Thousands of listings with no intelligent filtering based on actual career trajectory
3. **Career planning lacks intelligence** - No tools connect past experience to future opportunities

#### 1.2 Solution

Pathways unifies resume management, job discovery, and career planning into a single AI-powered interface:

- **Conversational resume editing** - Update your resume by talking to it
- **Visual job exploration** - See opportunities as a navigable graph connected to your experience
- **Intelligent matching** - Embeddings-based similarity that updates in real-time as your resume changes
- **Batch operations via AI tools** - Natural language commands for managing hundreds of job listings

#### 1.3 Success Metrics

- Time to first meaningful interaction (target: <30 seconds)
- Resume updates per session (target: 2+ for engaged users)
- Jobs explored per session (target: 10+)
- Anonymous to registered conversion rate (target: 15%)
- Return user rate (target: 40% within 7 days)

---

### 2. User Journeys

#### 2.1 Anonymous User Journey

```
1. Land on /pathways
2. See welcome message + empty chat interface
3. AI prompts: "Tell me about your work experience, or paste your resume"
4. User describes experience conversationally
5. AI builds resume JSON in real-time, shows preview
6. User can view jobs-graph with matches based on built resume
7. Prompt to sign up: "Create an account to save your resume and track jobs"
8. On signup: Resume saved as new GitHub Gist, session state preserved
```

#### 2.2 Logged-In User Journey

```
1. Land on /pathways
2. Resume automatically loaded from GitHub Gist
3. Jobs graph pre-populated with matches
4. Chat available for:
   - Resume modifications ("Add my promotion to Tech Lead in 2023")
   - Job queries ("Show me remote ML engineer roles")
   - Batch operations ("Mark all fintech jobs as interested")
   - Career advice ("What skills should I learn for staff engineer?")
5. All changes persist to Gist and update embeddings
```

#### 2.3 Power User Journey

```
1. Regular user with established resume
2. Uses AI tools for efficiency:
   - "Hide all jobs from companies with <50 employees"
   - "Mark gambling, crypto, and defense as not interested"
   - "Show me the path from my current role to CTO"
3. Receives proactive suggestions:
   - "3 new jobs match your updated skills"
   - "Your resume is missing keywords common in senior roles"
```

---

### 3. Feature Specifications

#### 3.1 Core Chat Interface

**Requirements:**

- Full-screen chat interface with collapsible jobs graph panel
- Message history persisted per session (localStorage for anon, DB for logged-in)
- Streaming responses using Vercel AI SDK v5
- Rich message types: text, resume preview, job cards, graph snippets

**AI Capabilities:**

- Resume understanding and modification
- Job search and filtering
- Career advice and planning
- Tool execution for batch operations

**Technical:**

- Endpoint: `/api/pathways/chat`
- Model: GPT-4 or Claude via AI SDK
- Tools: resume_update, job_search, job_filter, career_advice

#### 3.2 Resume Management

**For Anonymous Users:**

```javascript
// Session-based resume storage
{
  sessionId: "uuid",
  resume: { /* JSON Resume format */ },
  embedding: [/* vector */],
  createdAt: timestamp,
  expiresAt: timestamp + 7days
}
```

**For Logged-In Users:**

- Load from GitHub Gist on session start
- Save changes back to Gist on modification
- Maintain local cache for performance

**Resume Update Flow:**

```
1. User: "Add 2 years at Microsoft as Senior Engineer"
2. AI parses intent, extracts: company, title, duration
3. AI generates resume patch
4. Preview shown to user for confirmation
5. On confirm:
   a. Update resume JSON
   b. Save to Gist (if logged in) or session (if anon)
   c. Regenerate embedding
   d. Trigger jobs graph refresh
```

**Embedding Generation:**

- Use OpenAI text-embedding-3-small
- Embed on: work experience, skills, education, summary
- Store in Supabase with resume reference
- Refresh on any resume modification

#### 3.3 Jobs Graph Integration

**Current Features to Preserve:**

- [x] Visual node-based job exploration
- [x] Similarity-based connections from resume
- [x] Salary gradient visualization
- [x] Remote job filtering
- [x] Read/unread job tracking
- [x] Hide filtered nodes with reconnection
- [x] Keyboard navigation (arrows + M to mark read)
- [x] Path highlighting to resume node

**New Integration Points:**

- Graph embedded within Pathways UI (collapsible panel)
- Real-time refresh when resume embedding changes
- AI-driven filtering via chat commands
- Batch operations on graph nodes

**Graph State Sync:**

```javascript
// When resume updates
onResumeUpdate(newResume) {
  const embedding = await generateEmbedding(newResume);
  await saveEmbedding(userId, embedding);

  // Notify graph to refresh
  graphRef.current.refreshSimilarities(embedding);
}
```

#### 3.4 AI Tools System

**Tool: resume_update**

```javascript
{
  name: "resume_update",
  description: "Update the user's resume with new information",
  parameters: {
    section: "work|education|skills|basics|...",
    action: "add|update|remove",
    data: { /* section-specific data */ }
  },
  execute: async (params, context) => {
    const patch = generateResumePatch(params);
    const preview = applyPatch(context.resume, patch);
    return { preview, patch, requiresConfirmation: true };
  }
}
```

**Tool: job_filter**

```javascript
{
  name: "job_filter",
  description: "Filter or mark multiple jobs based on criteria",
  parameters: {
    criteria: {
      companies: ["list of company names or patterns"],
      industries: ["gambling", "crypto", ...],
      locations: ["remote", "San Francisco", ...],
      salaryMin: number,
      salaryMax: number,
      keywords: ["must have", "keywords"]
    },
    action: "mark_read|mark_interested|hide|show"
  },
  execute: async (params, context) => {
    const matchingJobs = await findMatchingJobs(params.criteria);
    await applyAction(matchingJobs, params.action, context.userId);
    return {
      affected: matchingJobs.length,
      jobs: matchingJobs.slice(0, 5) // preview
    };
  }
}
```

**Tool: career_advice**

```javascript
{
  name: "career_advice",
  description: "Provide career guidance based on resume and goals",
  parameters: {
    query: "string describing what user wants to know",
    targetRole: "optional target job title",
    timeframe: "optional timeframe for goals"
  },
  execute: async (params, context) => {
    const analysis = await analyzeCareerPath(
      context.resume,
      params.targetRole,
      context.availableJobs
    );
    return { advice: analysis, suggestedActions: [...] };
  }
}
```

#### 3.5 Anonymous to Registered Conversion

**State Preservation:**

```javascript
// On signup, migrate anonymous session
async function migrateAnonymousSession(sessionId, newUserId) {
  const session = await getAnonymousSession(sessionId);

  if (session.resume) {
    // Create new Gist with session resume
    const gist = await createGist(newUserId, session.resume);

    // Migrate embedding
    await migrateEmbedding(sessionId, newUserId);

    // Migrate read/interested jobs
    await migrateJobState(sessionId, newUserId);

    // Clean up anonymous session
    await deleteAnonymousSession(sessionId);
  }

  return { gistUrl: gist.url, jobsPreserved: true };
}
```

**Conversion Prompts:**

- After 5 minutes of engagement
- After first resume modification
- After marking 3+ jobs
- Before session expiration (7 days)

---

### 4. Technical Architecture

#### 4.1 Data Models

**Anonymous Session:**

```sql
CREATE TABLE anonymous_sessions (
  id UUID PRIMARY KEY,
  resume JSONB,
  embedding VECTOR(1536),
  chat_history JSONB[],
  job_states JSONB, -- {jobId: "read"|"interested"|"hidden"}
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  converted_to_user UUID REFERENCES users(id)
);
```

**User Pathways State:**

```sql
CREATE TABLE user_pathways (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  resume_embedding VECTOR(1536),
  embedding_updated_at TIMESTAMP,
  job_states JSONB,
  chat_preferences JSONB,
  last_active_at TIMESTAMP
);
```

#### 4.2 API Endpoints

| Endpoint                   | Method | Auth     | Description                            |
| -------------------------- | ------ | -------- | -------------------------------------- |
| `/api/pathways/chat`       | POST   | Optional | Main chat endpoint with streaming      |
| `/api/pathways/resume`     | GET    | Optional | Get current resume (session or user)   |
| `/api/pathways/resume`     | PATCH  | Optional | Update resume section                  |
| `/api/pathways/embedding`  | POST   | Optional | Regenerate embedding                   |
| `/api/pathways/jobs`       | GET    | Optional | Get matched jobs for current embedding |
| `/api/pathways/jobs/batch` | POST   | Optional | Batch update job states                |
| `/api/pathways/session`    | POST   | None     | Create anonymous session               |
| `/api/pathways/migrate`    | POST   | Required | Migrate anonymous to user              |

#### 4.3 Component Structure

```
app/pathways/
├── page.js                    # Main Pathways page
├── layout.js                  # Pathways-specific layout
├── components/
│   ├── PathwaysChat.js        # Main chat interface
│   ├── ChatInput.js           # Input with voice support
│   ├── ChatMessages.js        # Message list
│   ├── MessageTypes/
│   │   ├── TextMessage.js
│   │   ├── ResumePreview.js
│   │   ├── JobCard.js
│   │   └── GraphSnippet.js
│   ├── ResumePanel.js         # Collapsible resume view
│   ├── JobsGraphPanel.js      # Embedded jobs graph
│   └── ConversionPrompt.js    # Signup prompts
├── hooks/
│   ├── usePathwaysChat.js     # Chat state management
│   ├── usePathwaysResume.js   # Resume state + persistence
│   ├── usePathwaysSession.js  # Session management
│   └── useJobsGraphSync.js    # Graph synchronization
├── utils/
│   ├── resumePatching.js      # Resume modification logic
│   ├── embeddingGenerator.js  # Embedding creation
│   └── sessionManager.js      # Anonymous session handling
└── api/
    └── chat/
        ├── route.js           # Chat endpoint
        └── tools/
            ├── resumeUpdate.js
            ├── jobFilter.js
            └── careerAdvice.js
```

#### 4.4 State Management

```javascript
// Pathways context
const PathwaysContext = createContext({
  // Session
  sessionId: null,
  isAuthenticated: false,

  // Resume
  resume: null,
  resumeLoading: false,
  updateResume: async (patch) => {},

  // Embedding
  embedding: null,
  refreshEmbedding: async () => {},

  // Jobs
  jobStates: {},
  updateJobStates: async (updates) => {},

  // Chat
  messages: [],
  sendMessage: async (content) => {},

  // Graph sync
  graphRef: null,
  syncGraph: () => {},
});
```

---

### 5. UI/UX Specifications

#### 5.1 Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Pathways                              [Resume] [Graph] [?] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │                    Chat Messages                    │   │
│  │                                                     │   │
│  │  AI: Welcome! I can help you explore careers...    │   │
│  │                                                     │   │
│  │  You: Add my work at Microsoft                     │   │
│  │                                                     │   │
│  │  AI: I'll add that. [Resume Preview Component]     │   │
│  │      Does this look correct?                       │   │
│  │                                                     │   │
│  │  [Confirm] [Edit]                                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Type a message...                        [🎤] [Send]│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

[Resume Panel - Slides in from right]
┌──────────────────────────────────────┐
│ Your Resume                     [×]  │
├──────────────────────────────────────┤
│ John Doe                             │
│ Senior Software Engineer             │
│                                      │
│ Experience                           │
│ ├─ Microsoft (2021-2023)             │
│ │   Senior Engineer                  │
│ └─ Google (2018-2021)                │
│     Software Engineer                │
│                                      │
│ Skills                               │
│ Python, TypeScript, React...         │
│                                      │
│ [Edit in JSON] [Download PDF]        │
└──────────────────────────────────────┘

[Graph Panel - Slides in from right, larger]
┌──────────────────────────────────────────────────────────┐
│ Jobs Graph                                          [×]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│            [Full jobs-graph component]                   │
│                                                          │
│   Controls: [Filter] [Salary] [Remote] [Hide Read]       │
│                                                          │
│   Keyboard: ↑↓←→ Navigate | M Mark Read                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### 5.2 Responsive Behavior

- **Desktop (>1024px)**: Side-by-side panels available
- **Tablet (768-1024px)**: Full-screen panels with toggle
- **Mobile (<768px)**: Stacked view, swipe between chat/graph

#### 5.3 Interaction Patterns

**Chat Interactions:**

- Streaming text responses
- Inline action buttons (Confirm, Edit, Show More)
- Expandable job cards and resume sections
- Voice input with real-time transcription

**Graph Interactions:**

- Click node to select
- Arrow keys to navigate
- M to mark read
- Pinch/scroll to zoom
- Double-click to focus

**Panel Interactions:**

- Click toggle to show/hide
- Drag edge to resize (desktop)
- Swipe to dismiss (mobile)

---

### 6. Implementation Phases

#### Phase 1: Foundation (Week 1-2)

- [ ] Pathways page structure and layout
- [ ] Anonymous session management
- [ ] Basic chat interface with AI SDK
- [ ] Resume display (read-only initially)

#### Phase 2: Resume Intelligence (Week 3-4)

- [ ] Conversational resume building for anonymous users
- [ ] Resume modification via chat for logged-in users
- [ ] Embedding generation on resume changes
- [ ] Gist persistence for logged-in users

#### Phase 3: Jobs Graph Integration (Week 5-6)

- [ ] Embed jobs-graph component in Pathways
- [ ] Real-time graph refresh on embedding changes
- [ ] Graph state sync (read/interested/hidden)
- [ ] Panel toggle and responsive layout

#### Phase 4: AI Tools (Week 7-8)

- [ ] resume_update tool implementation
- [ ] job_filter tool for batch operations
- [ ] career_advice tool
- [ ] Tool confirmation UX

#### Phase 5: Conversion & Polish (Week 9-10)

- [ ] Anonymous to registered migration
- [ ] Conversion prompts and flows
- [ ] Onboarding experience
- [ ] Performance optimization
- [ ] Error handling and edge cases

---

### 7. Open Questions

1. **Embedding model choice**: text-embedding-3-small vs ada-002 vs custom fine-tuned?
2. **Session duration for anonymous users**: 7 days? 30 days? Until browser close?
3. **Rate limiting for anonymous AI usage**: How many messages before signup prompt?
4. **Graph rendering in panel**: Full component or simplified view?
5. **Mobile graph experience**: Worth building or desktop-only?
6. **Offline support**: Should chat history work offline?

---

### 8. Success Criteria for MVP

**Must Have:**

- [ ] Anonymous users can build resume via chat
- [ ] Logged-in users can modify resume via chat
- [ ] Changes update embeddings and refresh job matches
- [ ] Jobs graph accessible within Pathways
- [ ] Basic AI tools (resume_update, job_filter)

**Should Have:**

- [ ] Smooth anonymous → registered conversion
- [ ] Voice input for chat
- [ ] Career advice tool
- [ ] Responsive mobile layout

**Nice to Have:**

- [ ] Proactive job notifications
- [ ] Resume templates/suggestions
- [ ] Export to PDF from chat
- [ ] Integration with external job boards

---

### 9. Appendix

#### 9.1 Example Chat Flows

**Building Resume from Scratch:**

```
AI: Welcome to Pathways! I'm here to help you explore your career
    opportunities. To get started, tell me about your work experience
    or paste your existing resume.

User: I worked at Google for 3 years as a software engineer, then
      moved to Microsoft where I'm currently a senior engineer

AI: Great background! Let me create your resume.

    [Resume Preview]
    Work Experience:
    • Microsoft | Senior Software Engineer | 2021 - Present
    • Google | Software Engineer | 2018 - 2021

    Does this look right? I can adjust dates, add details about your
    work, or include skills.

User: Add that I worked on search infrastructure at Google

AI: Updated!

    [Resume Preview - Updated]
    • Google | Software Engineer | 2018 - 2021
      - Worked on search infrastructure

    Would you like to add more details, or shall we look at jobs
    that match your experience? I found 47 relevant positions.

User: Show me the jobs

AI: [Opens Jobs Graph Panel]
    Here's your career map. Your resume is at the center, with jobs
    arranged by similarity. The closer a job is, the better it matches
    your experience.

    Tips:
    • Use arrow keys to navigate
    • Press M to mark jobs as read
    • Jobs in blue pay above market rate
```

**Batch Job Management:**

```
User: Mark all gambling and crypto jobs as not interested

AI: I found 12 jobs matching those industries:
    • 5 crypto/blockchain companies
    • 7 gambling/gaming companies

    [Job List Preview]
    - Coinbase: Senior Engineer
    - DraftKings: Platform Engineer
    - ...

    Should I mark all 12 as not interested?

User: Yes

AI: Done! Marked 12 jobs as not interested. They'll be hidden from
    your graph. You can always undo this by saying "show hidden jobs".

    Your graph now shows 35 remaining matches.
```

#### 9.2 Related Documentation

- [Jobs Graph Technical Spec](./jobs-graph/README.md)
- [JSON Resume Schema](https://jsonresume.org/schema/)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Supabase Vector Search](https://supabase.com/docs/guides/ai)
