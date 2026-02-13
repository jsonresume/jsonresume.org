const GREETING_TEXT = `Welcome to **Pathways** — your AI career copilot.

Here's how it works:
1. **Your resume** is loaded on the left (edit it anytime in the Resume tab)
2. **The Graph** shows jobs matched to your skills — closer nodes = better fit
3. **Ask me anything** — I can update your resume, filter jobs, or explain why a role is a good match

Try saying:
- "Add 3 years of Python experience to my resume"
- "Show me remote engineering jobs"
- "What salary range do these roles offer?"`;

export const INITIAL_MESSAGE = {
  id: 'initial-greeting',
  role: 'assistant',
  status: 'ready',
  content: GREETING_TEXT,
  parts: [
    {
      type: 'text',
      text: GREETING_TEXT,
    },
  ],
};
