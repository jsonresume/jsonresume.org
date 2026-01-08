# Tinder-Style Job Swipe Layout for Pathways

## Overview

A swipeable card-based interface that allows users to quickly browse through job matches, similar to dating apps like Tinder. This provides a mobile-friendly, engaging alternative to the graph view while maintaining all existing functionality.

## User Experience

### Core Interaction Pattern

```
┌─────────────────────────────────────┐
│  [← Back to Graph]    [Filters ▾]   │
├─────────────────────────────────────┤
│                                     │
│    ┌─────────────────────────────┐  │
│    │                             │  │
│    │      Senior Engineer        │  │
│    │      @ Acme Corp            │  │
│    │                             │  │
│    │   💰 $150k-180k  🌍 Remote   │  │
│    │                             │  │
│    │   React • TypeScript • AWS  │  │
│    │                             │  │
│    │   "Building next-gen..."    │  │
│    │                             │  │
│    │   ────────────────────────  │  │
│    │   87% match                 │  │
│    │                             │  │
│    └─────────────────────────────┘  │
│                                     │
│    ← SWIPE LEFT    SWIPE RIGHT →    │
│       (Skip)        (Interested)    │
│                                     │
├─────────────────────────────────────┤
│   [✗]      [★]      [ℹ]      [✓]   │
│   Skip   Save    Details  Interest  │
└─────────────────────────────────────┘
```

### Swipe Actions

| Action         | Gesture     | Keyboard   | Result                             |
| -------------- | ----------- | ---------- | ---------------------------------- |
| Skip           | Swipe Left  | ← or S     | Mark as read, next card            |
| Interested     | Swipe Right | → or I     | Add to interested, prompt feedback |
| Save for Later | Swipe Up    | ↑ or B     | Bookmark without marking read      |
| Details        | Tap card    | Enter or D | Expand to full job panel           |

### Card States

1. **Fresh** - Unread job, prominent styling
2. **Seen** - Previously viewed but not actioned
3. **Interested** - User expressed interest (purple accent)
4. **Skipped** - User passed on this job (dimmed)
5. **Saved** - Bookmarked for later review

## Technical Architecture

### Component Structure

```
app/pathways/
├── components/
│   ├── swipe/
│   │   ├── SwipeView.js           # Main container
│   │   ├── JobCard.js             # Individual swipeable card
│   │   ├── CardStack.js           # Card deck management
│   │   ├── SwipeControls.js       # Bottom action buttons
│   │   ├── SwipeFilters.js        # Filter dropdown
│   │   ├── CardDetails.js         # Expanded card view
│   │   ├── SwipeProgress.js       # Progress indicator
│   │   ├── SwipeEmptyState.js     # No more cards state
│   │   └── SwipeAnimations.css    # Animation styles
│   └── PathwaysLayout.js          # Toggle between views
├── hooks/
│   ├── useSwipeGestures.js        # Touch/mouse gesture handling
│   ├── useCardStack.js            # Card queue management
│   └── useSwipePreferences.js     # Persist swipe settings
└── utils/
    └── cardSorting.js             # Card order algorithms
```

### Data Flow

```
┌──────────────────┐
│ PathwaysContext  │ (existing)
│ - embedding      │
│ - resume         │
│ - readJobIds     │
│ - interestedIds  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ usePathwaysJobData│ (existing)
│ - jobs[]         │
│ - jobInfo{}      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ useCardStack     │ (new)
│ - sortedCards[]  │
│ - currentIndex   │
│ - nextCard()     │
│ - prevCard()     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ SwipeView        │
│ - CardStack      │
│ - SwipeControls  │
└──────────────────┘
```

## Implementation Plan

### Phase 1: Core Swipe Mechanics

**Goal**: Basic swipeable card stack with touch/mouse support

**Files to Create**:

1. `hooks/useSwipeGestures.js` - Handle swipe detection
2. `hooks/useCardStack.js` - Manage card queue and navigation
3. `components/swipe/JobCard.js` - Card component
4. `components/swipe/CardStack.js` - Deck with animation

**Key Implementation Details**:

```javascript
// useSwipeGestures.js - Core gesture detection
export function useSwipeGestures({ onSwipeLeft, onSwipeRight, onSwipeUp }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Touch handlers
  const handleTouchStart = (e) => {
    /* ... */
  };
  const handleTouchMove = (e) => {
    /* ... */
  };
  const handleTouchEnd = (e) => {
    const threshold = 100; // px
    if (offset.x > threshold) onSwipeRight?.();
    else if (offset.x < -threshold) onSwipeLeft?.();
    else if (offset.y < -threshold) onSwipeUp?.();
    // Animate back to center if below threshold
  };

  return { offset, isDragging, handlers };
}
```

```javascript
// useCardStack.js - Card queue management
export function useCardStack({
  jobs,
  jobInfo,
  readJobIds,
  sortBy = 'similarity',
}) {
  const sortedJobs = useMemo(() => {
    const unread = jobs.filter((j) => !readJobIds.has(j.uuid));
    return sortJobs(unread, sortBy, jobInfo);
  }, [jobs, readJobIds, sortBy, jobInfo]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = sortedJobs[currentIndex];
  const nextCards = sortedJobs.slice(currentIndex + 1, currentIndex + 3);

  return {
    currentCard,
    nextCards, // For preview stack effect
    progress: { current: currentIndex + 1, total: sortedJobs.length },
    nextCard: () => setCurrentIndex((i) => Math.min(i + 1, sortedJobs.length)),
    prevCard: () => setCurrentIndex((i) => Math.max(i - 1, 0)),
    goToCard: (index) => setCurrentIndex(index),
  };
}
```

### Phase 2: Card UI Design

**Goal**: Polished card design showing job summary

**Card Layout**:

```jsx
<div className="job-card">
  {/* Header */}
  <div className="card-header">
    <h2>{jobInfo.title}</h2>
    <span className="company">{jobInfo.company}</span>
    <span className="match-score">
      {Math.round(job.similarity * 100)}% match
    </span>
  </div>

  {/* Quick Info Pills */}
  <div className="card-pills">
    {salary && <span className="pill salary">💰 {formatSalary(salary)}</span>}
    {remote && <span className="pill remote">🌍 {remote}</span>}
    {experience && <span className="pill exp">📊 {experience}</span>}
  </div>

  {/* Skills */}
  <div className="card-skills">
    {skills.slice(0, 5).map((skill) => (
      <span key={skill} className="skill-tag">
        {skill}
      </span>
    ))}
  </div>

  {/* Description Preview */}
  <p className="card-description">{truncate(jobInfo.description, 150)}</p>

  {/* Swipe Indicator Overlay */}
  <div className="swipe-indicator" style={{ opacity: swipeOpacity }}>
    {swipeDirection === 'right' && (
      <span className="interested">INTERESTED</span>
    )}
    {swipeDirection === 'left' && <span className="skip">SKIP</span>}
  </div>
</div>
```

**Animations**:

```css
/* Card exit animations */
.card-exit-left {
  animation: exitLeft 0.3s ease-out forwards;
}
@keyframes exitLeft {
  to {
    transform: translateX(-150%) rotate(-20deg);
    opacity: 0;
  }
}

.card-exit-right {
  animation: exitRight 0.3s ease-out forwards;
}
@keyframes exitRight {
  to {
    transform: translateX(150%) rotate(20deg);
    opacity: 0;
  }
}

/* Card stack depth effect */
.card-stack .card:nth-child(2) {
  transform: scale(0.95) translateY(10px);
  opacity: 0.8;
}
.card-stack .card:nth-child(3) {
  transform: scale(0.9) translateY(20px);
  opacity: 0.6;
}
```

### Phase 3: Integration with Existing Systems

**Goal**: Connect to PathwaysContext for read/interested state

**Updates Required**:

1. **PathwaysContext** - Already has `markAsRead`, `interestedJobIds`
2. **PathwaysLayout** - Add view toggle (Graph/Swipe)
3. **Preferences** - Persist view mode preference

```jsx
// PathwaysLayout.js
export default function PathwaysLayout() {
  const [viewMode, setViewMode] = useState('graph'); // or 'swipe'

  return (
    <div className="pathways-layout">
      <ViewToggle mode={viewMode} onChange={setViewMode} />

      {viewMode === 'graph' ? <PathwaysGraph /> : <SwipeView />}
    </div>
  );
}
```

### Phase 4: Detailed Card View

**Goal**: Expandable card showing full job details

**Interaction Flow**:

1. User taps card or presses Enter
2. Card expands to full screen (or modal on desktop)
3. Shows complete job information
4. Action buttons at bottom
5. Swipe or button to return to stack

```jsx
// CardDetails.js
export function CardDetails({ job, jobInfo, onClose, onAction }) {
  return (
    <motion.div
      className="card-details"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
    >
      <button className="close-btn" onClick={onClose}>
        ×
      </button>

      <div className="details-content">
        <h1>{jobInfo.title}</h1>
        <h2>{jobInfo.company}</h2>

        <section className="section">
          <h3>Overview</h3>
          <p>{jobInfo.description}</p>
        </section>

        <section className="section">
          <h3>Requirements</h3>
          <ul>
            {jobInfo.qualifications?.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h3>Responsibilities</h3>
          <ul>
            {jobInfo.responsibilities?.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        {/* Reuse existing PathwaysJobPanel sections */}
      </div>

      <div className="details-actions">
        <button onClick={() => onAction('skip')}>Skip</button>
        <button onClick={() => onAction('save')}>Save</button>
        <button onClick={() => onAction('interested')}>Interested</button>
      </div>
    </motion.div>
  );
}
```

### Phase 5: Filters & Sorting

**Goal**: Filter and sort the card stack

**Sort Options**:

- **Best Match** (default) - By similarity score
- **Newest First** - By created_at
- **Highest Salary** - By salary_usd
- **Remote First** - Remote jobs prioritized

**Filter Options** (reuse from graph):

- Search text
- Remote only
- Time range
- Salary range

```jsx
// SwipeFilters.js
export function SwipeFilters({ filters, onChange }) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost">
          <Filter className="w-4 h-4 mr-2" />
          Filters {hasActiveFilters && '•'}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="filter-section">
          <label>Sort by</label>
          <Select value={filters.sortBy} onChange={...}>
            <option value="similarity">Best Match</option>
            <option value="date">Newest</option>
            <option value="salary">Highest Salary</option>
            <option value="remote">Remote First</option>
          </Select>
        </div>

        <div className="filter-section">
          <label>Time Range</label>
          <Select value={filters.timeRange} onChange={...}>
            <option value="1m">Last Month</option>
            <option value="2m">Last 2 Months</option>
            <option value="3m">Last 3 Months</option>
          </Select>
        </div>

        <div className="filter-section">
          <Checkbox checked={filters.remoteOnly}>Remote Only</Checkbox>
        </div>

        <Input
          placeholder="Search jobs..."
          value={filters.searchText}
          onChange={...}
        />
      </PopoverContent>
    </Popover>
  );
}
```

### Phase 6: Progress & Empty States

**Goal**: Show progress and handle edge cases

**Progress Bar**:

```jsx
// SwipeProgress.js
export function SwipeProgress({ current, total, skipped, interested }) {
  return (
    <div className="swipe-progress">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <div className="progress-stats">
        <span>
          {current} of {total}
        </span>
        <span className="stat-skip">{skipped} skipped</span>
        <span className="stat-interested">{interested} interested</span>
      </div>
    </div>
  );
}
```

**Empty States**:

```jsx
// SwipeEmptyState.js
export function SwipeEmptyState({ reason, onAction }) {
  const states = {
    noJobs: {
      icon: '📭',
      title: 'No jobs found',
      description: 'Try adjusting your filters or time range',
      action: { label: 'Clear Filters', onClick: onAction.clearFilters },
    },
    allReviewed: {
      icon: '🎉',
      title: 'All caught up!',
      description: `You've reviewed all ${count} jobs`,
      action: { label: 'View Interested', onClick: onAction.viewInterested },
    },
    noMatches: {
      icon: '🔍',
      title: 'No matching jobs',
      description: 'Update your resume to find better matches',
      action: { label: 'Edit Resume', onClick: onAction.editResume },
    },
  };

  const state = states[reason];

  return (
    <div className="empty-state">
      <span className="empty-icon">{state.icon}</span>
      <h2>{state.title}</h2>
      <p>{state.description}</p>
      <Button onClick={state.action.onClick}>{state.action.label}</Button>
    </div>
  );
}
```

### Phase 7: Keyboard & Accessibility

**Goal**: Full keyboard navigation and a11y compliance

**Keyboard Shortcuts**:

```javascript
// In SwipeView.js
useEffect(
  () => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 's':
          handleSkip();
          break;
        case 'ArrowRight':
        case 'i':
          handleInterested();
          break;
        case 'ArrowUp':
        case 'b':
          handleSave();
          break;
        case 'Enter':
        case 'd':
          handleShowDetails();
          break;
        case 'Escape':
          handleCloseDetails();
          break;
        case 'ArrowDown':
        case 'u':
          handleUndo();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  },
  [
    /* handlers */
  ]
);
```

**Accessibility**:

```jsx
<div
  role="application"
  aria-label="Job card browser"
  aria-describedby="swipe-instructions"
>
  <div id="swipe-instructions" className="sr-only">
    Swipe right or press I for interested, left or S to skip. Press Enter for
    details.
  </div>

  <div
    role="listitem"
    aria-label={`${jobInfo.title} at ${jobInfo.company}, ${matchPercent}% match`}
    tabIndex={0}
  >
    {/* Card content */}
  </div>

  <div role="group" aria-label="Actions">
    <button aria-label="Skip this job">Skip</button>
    <button aria-label="Mark as interested">Interested</button>
  </div>
</div>
```

### Phase 8: Polish & Animations

**Goal**: Smooth, delightful interactions

**Animation Library**: Use Framer Motion for complex animations

```jsx
// CardStack with animations
import { motion, AnimatePresence } from 'framer-motion';

export function CardStack({ cards, onSwipe }) {
  return (
    <div className="card-stack">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.uuid}
            className="card-wrapper"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{
              scale: 1 - index * 0.05,
              y: index * 10,
              opacity: 1 - index * 0.2,
              zIndex: cards.length - index,
            }}
            exit={(direction) => ({
              x: direction === 'right' ? 500 : -500,
              y: direction === 'up' ? -300 : 0,
              rotate: direction === 'right' ? 20 : -20,
              opacity: 0,
            })}
            drag={index === 0}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.05 }}
          >
            <JobCard job={card} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

**Haptic Feedback** (mobile):

```javascript
const triggerHaptic = (type) => {
  if ('vibrate' in navigator) {
    const patterns = {
      swipe: [10],
      interested: [10, 50, 10],
      skip: [5],
    };
    navigator.vibrate(patterns[type] || [10]);
  }
};
```

## Mobile Responsiveness

### Breakpoints

```css
/* Mobile-first approach */
.swipe-view {
  /* Mobile (default) */
  padding: 1rem;
}

@media (min-width: 640px) {
  /* Tablet */
  .swipe-view {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (min-width: 1024px) {
  /* Desktop - side by side with graph? */
  .swipe-view {
    max-width: 450px;
  }
}
```

### Touch Optimizations

```javascript
// Prevent scroll while swiping
useEffect(() => {
  if (isDragging) {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  } else {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }
}, [isDragging]);
```

## Testing Strategy

### Unit Tests

- Card sorting algorithms
- Gesture threshold calculations
- Filter logic

### Integration Tests

- Card stack state management
- Integration with PathwaysContext
- Persistence of preferences

### E2E Tests

- Complete swipe flow
- Keyboard navigation
- View switching
- Filter application

### Manual Testing Checklist

- [ ] Swipe gestures work on mobile
- [ ] Keyboard shortcuts work
- [ ] Cards animate smoothly
- [ ] Interested/skip state persists
- [ ] Filters update card stack
- [ ] Progress shows correctly
- [ ] Empty states display properly
- [ ] Details view works
- [ ] Undo functionality works
- [ ] Screen reader announces correctly

## Performance Considerations

1. **Virtualization**: Only render 3-4 cards at a time
2. **Image lazy loading**: For company logos if added
3. **Debounced filters**: Don't refilter on every keystroke
4. **Memoization**: Memoize sorted/filtered card list
5. **Animation performance**: Use CSS transforms, not layout properties

## Dependencies

**Required**:

- `framer-motion` - Animation library (may already be installed)

**Optional**:

- `@use-gesture/react` - Advanced gesture handling
- `react-spring` - Alternative animation library

## Timeline Estimate

| Phase   | Scope                   |
| ------- | ----------------------- |
| Phase 1 | Core swipe mechanics    |
| Phase 2 | Card UI design          |
| Phase 3 | Integration             |
| Phase 4 | Detailed view           |
| Phase 5 | Filters & sorting       |
| Phase 6 | Progress & empty states |
| Phase 7 | Keyboard & a11y         |
| Phase 8 | Polish & animations     |

## Future Enhancements

1. **Batch Actions**: "Skip all remote" or "Interested in all senior roles"
2. **AI Suggestions**: "Based on your interests, you might like..."
3. **Comparison Mode**: Compare 2-3 jobs side by side
4. **Share Cards**: Share a job card to social/messaging
5. **Offline Support**: Cache cards for offline browsing
6. **Push Notifications**: Alert when new matching jobs arrive
7. **Swipe History**: Review and change previous decisions
8. **Quick Apply**: Integrate with job application flow

## Questions to Resolve

1. Should swipe view completely replace graph, or be an alternative?
2. How many cards to preload for smooth animation?
3. Should we show job URL/source on the card?
4. Integration with copilot chat - discuss jobs while swiping?
5. What happens to jobs you skip - can you see them again?
