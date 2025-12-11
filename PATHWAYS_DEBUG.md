# Pathways Resume Update Bug - Debug Documentation

## STATUS: FIXED

The bug was that `updateResume` in PathwaysContext expects a **direct value**, not a functional update.
The hook was calling `setResumeData((prev) => ...)` but that function was being passed AS the value instead of being called.

**Fix**: Changed useResumeUpdater to:

1. Receive `resumeData` prop (current resume)
2. Use a ref (`resumeDataRef`) to always have latest value
3. Call `setResumeData(updated)` with the merged result directly

---

## Problem Summary

When a user asks the AI to update their resume (e.g., "update my name to Thomas"), the tool executes successfully and returns correct data, but **the editor/UI does not update** to reflect the changes.

## Current Behavior

1. User types: "update my name to thomas"
2. AI calls `updateResume` tool with changes
3. Tool shows success in chat UI (blue box with "Updating resume...")
4. `applyResumeChanges` is called and logs correct merged result
5. **BUT**: The Monaco editor and resume preview do NOT update

## Console Log Analysis

The logs show the tool IS being detected and processed:

```
[useResumeUpdater] Part type: tool-updateResume {type: 'tool-updateResume', toolCallId: '...', state: 'input-available', ...}
[useResumeUpdater] v6 tool-updateResume input-available!
[useResumeUpdater] Applying changes (input-avail)...
[applyResumeChanges] Called with:
[applyResumeChanges] Final result: { "basics": { "name": "Thomas", ... }, "work": [...], ... }
```

The `applyResumeChanges` function correctly:

- Receives the changes (full basics object with name="Thomas" + empty work/education/skills arrays)
- Merges them with existing resume (preserves work/education/skills from original)
- Returns the correct merged result

## The Root Problem

There are actually **TWO separate issues**:

### Issue 1: AI Returns Full Resume Instead of Diff

When user asks "update my name to Thomas", the AI returns:

```json
{
  "basics": {
    "name": "Thomas",
    "label": "Full-Stack Developer",
    "email": "jane.doe@example.com"
    // ... ALL other basics fields
  },
  "work": [],
  "education": [],
  "skills": []
}
```

**Expected** (diff-only):

```json
{
  "basics": {
    "name": "Thomas"
  }
}
```

The empty arrays (`work: []`, `education: []`, `skills: []`) would wipe out existing data if we didn't have the smart merge logic. The `applyResumeChanges` function now handles this by using key-based matching for arrays (not index-based), so empty arrays don't delete existing entries.

### Issue 2: State Update Not Triggering Re-render (THE MAIN BUG)

Even though `applyResumeChanges` returns the correct merged result, the UI doesn't update. This suggests:

1. `setResumeData()` is being called but React isn't re-rendering
2. OR the state is updating but the Monaco editor isn't receiving the new value
3. OR there's a stale closure issue

## Code Flow

### 1. CopilotChat.js receives props and passes to hook

```javascript
// CopilotChat.js line 30-34
export default function CopilotChat({
  resumeData,
  setResumeData,
  setResumeJson,
}) {
  // ...

  // Line 89-94: Hook receives the setters
  useResumeUpdater({
    messages,
    addToolResult,
    setResumeData,
    setResumeJson,
  });
```

### 2. useResumeUpdater.js detects tool and calls setters

```javascript
// useResumeUpdater.js - when tool-updateResume with input-available detected
if (changes && typeof changes === 'object') {
  console.log('[useResumeUpdater] Applying changes (input-avail)...');
  setResumeData((prev) => applyResumeChanges(prev, changes));
  setResumeJson((prev) => {
    try {
      return JSON.stringify(
        applyResumeChanges(JSON.parse(prev), changes),
        null,
        2
      );
    } catch {
      return prev;
    }
  });
}
```

### 3. Where do setResumeData and setResumeJson come from?

Looking at `Pathways.js`:

```javascript
// Pathways.js
const { resume, resumeJson, updateResume, updateResumeJson, setResumeJson } =
  usePathways();
```

And the context provides these. The actual state is in `PathwaysContext.js`.

### 4. PathwaysContext.js state management

```javascript
// PathwaysContext.js
const [resume, setResume] = useState(null);
const [resumeJson, setResumeJsonState] = useState('');

// These are exposed to children
const value = {
  resume,
  setResume, // This might be named setResumeData in some places
  resumeJson,
  setResumeJson: setResumeJsonState,
  // ...
};
```

## Hypothesis: Naming Mismatch

The CopilotChat component receives props named:

- `setResumeData`
- `setResumeJson`

But these might not be connected to the actual context state. Let me check how Pathways.js passes these props...

## Files Involved

| File                                       | Purpose                                        |
| ------------------------------------------ | ---------------------------------------------- |
| `app/pathways/Pathways.js`                 | Main page, renders CopilotChat with props      |
| `app/pathways/context/PathwaysContext.js`  | Context provider with resume state             |
| `app/pathways/components/CopilotChat.js`   | Chat component, passes props to hooks          |
| `app/pathways/hooks/useResumeUpdater.js`   | Hook that detects tool calls and updates state |
| `app/pathways/utils/applyResumeChanges.js` | Pure function to merge resume changes          |

## Key Questions

1. **Is `setResumeData` in CopilotChat connected to the actual context state?**

   - Need to trace how Pathways.js passes this prop

2. **Is the Monaco editor reading from the same state that's being updated?**

   - Editor might be reading from `resumeJson` while we're updating `resume`

3. **Is there a stale closure in useResumeUpdater?**

   - The `setResumeData` function might be captured at component mount and not updated

4. **Are we calling the right setter?**
   - Context has `setResume` but component receives `setResumeData` - are these the same?

## Next Steps to Debug

1. Add console.log BEFORE and AFTER `setResumeData` call to confirm it's being invoked
2. Add console.log in PathwaysContext where the state is defined to see if state changes
3. Check if Monaco editor has its own internal state that needs explicit update
4. Verify prop names match between Pathways.js and what CopilotChat expects

## Relevant Console Output (Full)

```
[useResumeUpdater] Processing messages, count: 2
[useResumeUpdater] Message: {id: 'e34FqnVHiyWOX23o', role: 'user', partsCount: 1, partTypes: ['text']}
[useResumeUpdater] Part type: text {type: 'text', text: 'update my name to thomas'}
[useResumeUpdater] Message: {id: 'mKa1LNj2j2l8Kk0n', role: 'assistant', partsCount: 2, partTypes: ['step-start', 'tool-updateResume']}
[useResumeUpdater] Part type: step-start {type: 'step-start'}
[useResumeUpdater] Part type: tool-updateResume {type: 'tool-updateResume', toolCallId: 'call_jWVJ4v2MTyVMziPIeHeyh8ft', state: 'input-available', ...}
[useResumeUpdater] v6 tool-updateResume input-available!
[useResumeUpdater] Part: {type: 'tool-updateResume', toolCallId: '...', state: 'input-available', input: {...}}
[useResumeUpdater] Changes: {
  "basics": { "name": "Thomas", ... },
  "work": [],
  "education": [],
  "skills": []
}
[useResumeUpdater] Applying changes (input-avail)...
[applyResumeChanges] Called with:
[applyResumeChanges] prev keys: ['basics', 'work', 'education', 'skills']
[applyResumeChanges] changes: { "basics": {...}, "work": [], "education": [], "skills": [] }
[applyResumeChanges] changes keys: ['basics', 'work', 'education', 'skills']
[applyResumeChanges] Final result: {
  "basics": { "name": "Thomas", ... },
  "work": [{ "name": "Tech Solutions Inc.", ... }, { "name": "StartupCo", ... }],
  "education": [{ "institution": "University of California, Berkeley", ... }],
  "skills": [{ "name": "JavaScript", ... }, { "name": "Backend", ... }]
}
```

Note: The final result DOES have the work/education/skills preserved (the merge logic works), but the UI still doesn't update.

## AI SDK v6 Tool Format Reference

From the AI SDK v6 docs, the correct format is:

- `part.type === 'tool-{toolName}'` (e.g., `'tool-updateResume'`)
- `part.state` can be: `'input-streaming'`, `'input-available'`, `'output-available'`
- `part.input` contains the tool arguments
- `part.output` contains the tool result (when state is 'output-available')

Our code now correctly handles this format.
