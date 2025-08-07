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

## Testing Checklist

- [ ] Message streaming works smoothly
- [ ] Tool invocations update resume correctly
- [ ] Speech toggles on/off properly
- [ ] Voice speaks complete messages
- [ ] Resume changes persist across refreshes
- [ ] Error states handled gracefully
