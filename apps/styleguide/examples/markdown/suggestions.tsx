import { Markdown } from '@jsonresume/ui';

const suggestions = `## Suggestions for your resume

1. **Quantify impact.** "Cut p95 latency by 40%" beats "improved performance".
2. Add dates to your two most recent roles.

| Section | Status |
| --- | --- |
| Basics | Complete |
| Work | Missing dates |

- [x] Summary under 60 words
- [ ] Skills grouped by area

Read the [schema](https://jsonresume.org/schema) for every field.`;

// Raw HTML in the source is ignored, so model output is safe to render.
export default function MarkdownSuggestions() {
  return <Markdown externalLinks>{suggestions}</Markdown>;
}
