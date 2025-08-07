# JSONResume.org Development Guidelines

## Code Organization Principles

### File Size and Modularity

- **Maximum file length**: 150 lines
- **Prefer small, focused files** over large monolithic ones
- **Single responsibility**: Each component/function should do one thing well
- **Clear separation of concerns**: UI, business logic, and data handling should be separate

### File Structure Best Practices

```
components/
  ComponentName.js       # Main component (max 150 lines)
  ComponentNameLogic.js  # Business logic (if needed)
  ComponentName.css      # Styles (if not using CSS-in-JS)

hooks/
  useFeatureName.js      # Custom hooks for reusable logic

utils/
  featureHelpers.js      # Pure utility functions

api/
  routeName/
    route.js            # API endpoint handler
```

### When to Split Files

Split a file when:

- It exceeds 150 lines
- It handles multiple unrelated concerns
- Multiple components could benefit from shared logic
- Testing would be easier with separated concerns

### Example Refactoring Pattern

Before (monolithic):

```javascript
// BigComponent.js (300+ lines)
function BigComponent() {
  // State management
  // Data fetching
  // Event handlers
  // Complex render logic
  // Multiple sub-components
}
```

After (modular):

```javascript
// hooks/useBigComponentData.js
export function useBigComponentData() {
  /* data logic */
}

// components/BigComponent/index.js
export { default } from './BigComponent';

// components/BigComponent/BigComponent.js
import { useBigComponentData } from '../../hooks/useBigComponentData';
import SubComponentA from './SubComponentA';
import SubComponentB from './SubComponentB';

function BigComponent() {
  /* main component, <150 lines */
}

// components/BigComponent/SubComponentA.js
function SubComponentA() {
  /* focused sub-component */
}

// components/BigComponent/SubComponentB.js
function SubComponentB() {
  /* focused sub-component */
}
```

## Project-Specific Guidelines

### Apps Structure

- `apps/homepage2/` - Marketing site
- `apps/registry/` - Main application

### Registry App Architecture

- **Pages**: Use Next.js app router
- **Components**: Reusable UI components
- **API Routes**: Edge functions for AI and data operations
- **Hooks**: Custom React hooks for shared logic
- **Utils**: Pure utility functions

### AI SDK v5 Implementation

See `apps/registry/app/pathways/CLAUDE.md` for detailed AI SDK v5 implementation patterns.

### Testing Approach

#### Jest Testing Framework

**Test Structure**:

```
apps/registry/__tests__/
├── pathways/
│   ├── components/     # Component tests
│   └── utils/          # Utility tests
└── api/
    ├── pathways/       # API route tests
    ├── speech/         # Speech API tests
    └── transcribe/     # Transcription tests
```

**Running Tests**:

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
npm run test:pathways     # Pathways tests only
npm run test:components   # Component tests
npm run test:utils        # Utility tests
npm run test:api          # API tests
```

**Test Coverage Areas**:

- Unit tests for utilities (applyResumeChanges)
- Component tests for UI (CopilotChat, Message, Part)
- Integration tests for API routes (pathways, speech, transcribe)
- Mock browser APIs (MediaRecorder, AudioContext, getUserMedia)
- E2E tests with Playwright for critical user flows

**Testing Best Practices**:

- Use @testing-library/react for component testing
- Mock external dependencies (AI SDK, OpenAI)
- Test user interactions, not implementation details
- Maintain test files under 150 lines
- Group related tests in describe blocks

## Commit Guidelines

- Keep commits focused and atomic
- Use clear, descriptive commit messages
- Include AI SDK version in migration commits
- Reference issue numbers when applicable

## Performance Considerations

- Lazy load heavy components
- Use React.memo for expensive renders
- Implement proper loading states
- Optimize bundle size with dynamic imports

## Accessibility Standards

- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Security Best Practices

- Validate all user inputs
- Sanitize data before rendering
- Use environment variables for secrets
- Implement proper authentication checks

## Documentation Requirements

- JSDoc comments for utilities
- PropTypes or TypeScript for components
- README files for complex features
- Inline comments for non-obvious logic
