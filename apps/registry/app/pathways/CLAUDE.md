# Pathways Career Copilot - Technical Documentation

## Overview

The Pathways Career Copilot is an AI-powered career coaching interface built with AI SDK v5. It provides real-time, conversational guidance for career development while automatically updating and maintaining a user's resume in JSON Resume format.

## Architecture

### Core Technologies

- **AI SDK v5**: Latest version of Vercel's AI SDK for streaming AI interactions
- **Next.js 14**: App router for modern React applications
- **OpenAI GPT-4**: AI model for intelligent career guidance
- **Web Speech API**: Browser-native text-to-speech for natural voice interactions

## Key Components

### 1. CopilotChat Component (`components/CopilotChat.js`)

The main chat interface that handles:

#### Message Management

```javascript
const { messages, sendMessage, status, addToolResult } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/pathways',
    body: { currentResume: resumeData },
  }),
  initialMessages: [...]
});
```

#### Speech Synthesis

- **Toggle Control**: Users can enable/disable voice output
- **Natural Speech Configuration**:
  - Rate: 0.95 (slightly slower for clarity)
  - Pitch: 1.1 (friendly tone)
  - Volume: 0.9
- **Voice Selection**: Prioritizes natural-sounding voices (Google US English, Microsoft Zira, Samantha)
- **Smart Timing**: Waits for streaming to complete before speaking

#### Tool Invocation Handling

```javascript
// Monitors message parts for tool invocations
if (part.type === 'tool-updateResume' && part.state === 'input-available') {
  const { changes } = part.input ?? {};
  // Apply changes to resume state
  setResumeData((prev) => applyResumeChanges(prev, changes));
  // Notify AI that changes were applied
  addToolResult({ toolCallId: part.toolCallId, result: 'Changes applied' });
}
```

### 2. API Route (`app/api/pathways/route.js`)

Handles AI streaming with tool support:

#### Tool Definition

```javascript
export const updateResume = tool({
  name: 'updateResume',
  description: 'Update specific sections of the resume',
  inputSchema: z.object({
    changes: z.object({
      basics: z.object({...}),
      work: z.array(...),
      education: z.array(...),
      skills: z.array(...)
    }),
    explanation: z.string()
  })
});
```

#### Streaming Configuration

```javascript
const result = await streamText({
  model: openai('gpt-4.1'),
  system: `Career copilot prompt with current resume context`,
  messages: convertToModelMessages(messages),
  tools: { updateResume },
  experimental_transform: smoothStream({
    delayInMs: 20,
    chunking: 'word',
  }),
});

return result.toUIMessageStreamResponse();
```

### 3. Message Rendering (`components/Message.js` & `components/Part.js`)

#### Message Structure

- Handles both simple content strings and complex parts arrays
- Supports text, tool invocations, and step indicators

#### Part Rendering

```javascript
switch (part.type) {
  case 'text':
  // Render plain text
  case 'tool-updateResume':
  // Render resume updates with collapsible details
  case 'step-start':
  case 'step-finish':
  // Silent handling of step indicators
}
```

## AI SDK v5 Migration Notes

### Key Changes from v4

1. **Transport-Based Architecture**

   - Use `DefaultChatTransport` for streaming configuration
   - Body parameters passed through transport

2. **Message Format**

   - `sendMessage({ text: input })` instead of role/content
   - Parts array structure for complex messages

3. **Tool Invocations**

   - Part type: `tool-${toolName}` (e.g., `tool-updateResume`)
   - States: `input-streaming`, `input-available`, `output-available`
   - Access via `part.input` not `part.args`

4. **Response Format**
   - Use `toUIMessageStreamResponse()` for useChat compatibility
   - `convertToModelMessages()` for message conversion

## Speech Implementation (OpenAI TTS)

### Architecture

Uses AI SDK v5's `experimental_generateSpeech` with OpenAI's TTS models for high-quality, natural speech synthesis.

### API Route (`/api/speech/route.js`)

```javascript
const { audioData } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: messageText,
  voice: selectedVoice, // alloy, echo, fable, onyx, nova, shimmer
});
```

### Features

1. **OpenAI Voice Options**:
   - **Alloy**: Neutral, balanced tone
   - **Echo**: Male voice
   - **Fable**: British accent
   - **Onyx**: Deep, authoritative
   - **Nova**: Warm and friendly (default)
   - **Shimmer**: Female voice
2. **Voice Selection UI**: Dropdown to choose preferred voice
3. **Visual Feedback**: Pulsing indicator during speech generation
4. **Conversational Timing**: 300ms delay after message completion
5. **Smart Content Extraction**: Speaks both text and tool explanations
6. **Audio Management**: Proper cleanup of audio resources

### Technical Details

- **Model**: Uses `tts-1` for fast generation (can upgrade to `tts-1-hd` for higher quality)
- **Caching**: 1-hour cache headers for repeated phrases
- **Error Handling**: Graceful fallback on generation failure
- **Audio Format**: MP3 audio stream
- **Volume Control**: Set to 0.9 for comfortable listening

## Resume Update Flow

1. **User Input**: "I worked at McDonald's"
2. **AI Processing**: Recognizes work experience intent
3. **Tool Invocation**: Generates structured resume update
4. **Client Handling**:
   - Displays update in chat with explanation
   - Applies changes to resume state
   - Updates JSON editor
   - Speaks explanation (if enabled)
5. **Feedback**: Sends confirmation to AI

## Development Guidelines

### Code Organization Principles

- **File Size**: Keep all files under 150 lines for maintainability
- **Modularity**: Prefer many small, focused files over large monolithic ones
- **Single Responsibility**: Each component/function should do one thing well
- **Separation of Concerns**:
  - UI components separate from business logic
  - API routes separate from data processing
  - Utilities in dedicated files

### File Structure Best Practices

```
components/
  CopilotChat.js      # Main container (~150 lines max)
  Messages.js         # Message list component
  Message.js          # Single message renderer
  Part.js            # Message part renderer
  SpeechControls.js  # Speech toggle UI (could be extracted)

utils/
  applyResumeChanges.js  # Resume update logic
  speechHelpers.js       # Speech synthesis utilities (could be extracted)

hooks/
  useSpeech.js          # Speech synthesis hook (future refactor)
  useResumeUpdater.js   # Resume update logic (future refactor)
```

### Refactoring Opportunities

Current `CopilotChat.js` could be split into:

- `useCopilotChat.js` - Chat logic hook
- `useSpeechSynthesis.js` - Speech functionality
- `useToolHandler.js` - Tool invocation handling
- `CopilotChat.js` - UI component only

### Adding New Tools

1. Define tool schema in API route using Zod
2. Add to tools object in streamText
3. Handle in CopilotChat useEffect
4. Create rendering logic in Part component

### Customizing Speech

- **Voice Selection**: Choose from 6 OpenAI voices via dropdown
- **Model Quality**: Switch between `tts-1` (fast) and `tts-1-hd` (high quality)
- **Volume**: Adjust `audio.volume` (0-1) in CopilotChat component
- **Caching**: Modify cache duration in API route response headers

### Debugging

- Console logs part types during development
- Check `part.state` for tool invocation lifecycle
- Monitor `handledToolCalls` Set for duplicate prevention

## Performance Optimizations

1. **Streaming**: Smooth streaming with 20ms delay chunks
2. **Deduplication**: Tracks handled tool calls to prevent duplicates
3. **Speech Queueing**: Cancels previous utterances before new ones
4. **Lazy Voice Loading**: Voices loaded on first use

## Future Enhancements

- [ ] Add voice input for two-way conversation
- [ ] Implement conversation history persistence
- [ ] Add more resume update tools (projects, certifications)
- [ ] Support multiple AI models
- [ ] Add conversation export/sharing
- [ ] Implement voice customization settings
- [ ] Add career goal tracking
- [ ] Integration with job boards

## Security Considerations

- Resume data stays client-side until explicitly saved
- Tool invocations validated through Zod schemas
- No automatic external API calls without user consent
- Speech synthesis runs entirely in browser

## Testing Framework

### Overview

The Pathways feature has comprehensive test coverage using Jest and React Testing Library, ensuring reliable functionality across all components, API routes, and utilities.

### Test Structure

```
__tests__/
├── pathways/
│   ├── components/
│   │   ├── CopilotChat.test.js    # Main chat component tests
│   │   ├── Message.test.js        # Message rendering tests
│   │   └── Part.test.js          # Part component tests
│   └── utils/
│       └── applyResumeChanges.test.js  # Resume update utility tests
└── api/
    ├── pathways/
    │   └── route.test.js         # AI streaming API tests
    ├── speech/
    │   └── route.test.js         # Speech synthesis API tests
    └── transcribe/
        └── route.test.js         # Voice transcription API tests
```

### Running Tests

```bash
# Run all tests
npm run test

# Run with watch mode during development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test suites
npm run test:pathways     # Pathways feature tests only
npm run test:api         # API route tests only
npm run test:components  # Component tests only
npm run test:utils       # Utility function tests only

# Run all tests (unit + e2e)
npm run test:all
```

### Test Coverage Areas

#### 1. Component Tests (`CopilotChat.test.js`)

**UI Interaction Testing:**

- Message input and submission
- Form validation and empty message handling
- Button states and accessibility
- Keyboard navigation support

**Speech Functionality Testing:**

- Voice toggle on/off behavior
- Voice selection dropdown
- Speech API integration
- Error handling for speech failures
- Audio cleanup on component unmount

**Recording Feature Testing:**

- Microphone permission handling
- Recording start/stop functionality
- Transcription API integration
- Loading states during transcription
- Error handling for transcription failures

**Resume Update Testing:**

- Tool call processing from AI responses
- Resume data state updates
- JSON editor synchronization
- Duplicate tool call prevention
- Tool call state management

#### 2. API Route Tests

**Pathways API (`api/pathways/route.test.js`):**

- AI streaming configuration
- Tool schema validation
- Resume context inclusion in system prompt
- Error handling for invalid requests
- Model configuration (GPT-4.1)

**Speech API (`api/speech/route.test.js`):**

- OpenAI TTS integration
- Voice selection support
- Audio format handling (MP3)
- Error handling for generation failures
- Caching headers configuration

**Transcription API (`api/transcribe/route.test.js`):**

- Whisper model integration
- Multiple audio format support (WAV, WebM, OGG, MP4)
- FormData processing
- Error handling for invalid audio
- Response format validation

#### 3. Utility Function Tests (`applyResumeChanges.test.js`)

**Resume Update Logic:**

- Deep merging of nested objects
- Array item updates by index
- Deletion marker handling (`_delete: true`)
- New item insertion
- Type safety and validation

**Edge Cases:**

- Empty resume objects
- Invalid change formats
- Null and undefined values
- Complex nested structures

#### 4. Message Rendering Tests

**Message Component (`Message.test.js`):**

- Content string rendering
- Parts array rendering
- Role display and formatting
- Special character handling
- Empty content graceful handling

**Part Component (`Part.test.js`):**

- Text part rendering
- Tool invocation display
- Collapsible change details
- State-based rendering
- JSON formatting in tool outputs

### Test Configuration

**Jest Configuration (`jest.config.js`):**

- Next.js integration with `next/jest`
- JSDOM environment for browser APIs
- Module path mapping for imports
- Coverage collection settings
- Custom transform rules

**Test Setup (`jest.setup.js`):**

- React Testing Library matchers
- Web API mocks (MediaRecorder, AudioContext, fetch)
- Next.js router mocking
- Console log filtering
- Global cleanup

### Mocking Strategy

**External Dependencies:**

- AI SDK hooks (`useChat`) with controlled responses
- Next.js navigation and dynamic imports
- Web APIs (MediaRecorder, AudioContext, getUserMedia)
- Fetch requests to API endpoints

**Browser APIs:**

- IntersectionObserver and ResizeObserver
- matchMedia for responsive design
- URL object methods for audio handling
- Audio constructor for playback

### Testing Best Practices

**Component Testing:**

- Test user interactions, not implementation details
- Mock external dependencies appropriately
- Use semantic queries (getByRole, getByLabelText)
- Test error states and edge cases

**API Testing:**

- Test both success and failure scenarios
- Validate request/response formats
- Mock AI SDK functions consistently
- Test error handling and logging

**Utility Testing:**

- Test pure functions with various inputs
- Cover edge cases and error conditions
- Ensure immutability where expected
- Test type safety and validation

### Coverage Goals

- **Components**: 90%+ coverage for user interactions
- **API Routes**: 95%+ coverage including error paths
- **Utilities**: 100% coverage for business logic
- **Integration**: Key user flows tested end-to-end

### Manual Testing Checklist

#### Core Functionality

- [ ] Message streaming works smoothly
- [ ] Tool invocations update resume correctly
- [ ] Speech toggles on/off properly
- [ ] Voice selection changes speech output
- [ ] Recording captures and transcribes audio
- [ ] Resume changes persist in UI
- [ ] Error states handled gracefully

#### Voice Features

- [ ] All 6 OpenAI voices work correctly
- [ ] Speech generation handles long text
- [ ] Audio cleanup prevents memory leaks
- [ ] Speech stops when disabled mid-playback
- [ ] Recording handles microphone permissions

#### Resume Updates

- [ ] Work experience updates correctly
- [ ] Skills section modifications work
- [ ] Education entries can be added/removed
- [ ] Basic information updates properly
- [ ] Complex nested changes apply correctly

#### Error Handling

- [ ] Network failures don't crash app
- [ ] Invalid audio files handled gracefully
- [ ] AI API errors show user-friendly messages
- [ ] Microphone access denial handled properly
- [ ] Speech generation failures degrade gracefully

### Continuous Integration

Tests run automatically on:

- Pull request creation
- Commits to main branch
- Before deployment

**GitHub Actions Integration:**

```yaml
- name: Run Tests
  run: |
    npm run test:coverage
    npm run test:e2e
```

### Performance Testing

**Load Testing:**

- Multiple concurrent API requests
- Large resume data processing
- Memory usage during long conversations

**Audio Testing:**

- Speech generation latency
- Audio file size optimization
- Multiple voice requests

### Future Testing Enhancements

- [ ] Visual regression testing with Chromatic
- [ ] Accessibility testing with axe-core
- [ ] Performance monitoring with Lighthouse CI
- [ ] Cross-browser testing with BrowserStack
- [ ] Mobile device testing
- [ ] Voice recognition accuracy testing
