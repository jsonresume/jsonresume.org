/**
 * The full research-dossier prompt sent to the Claude CLI.
 * Kept in its own module since it is a large, self-contained instruction blob.
 */

export function buildDossierPrompt(resumeText, jobText) {
  return `You are a job search research assistant. A candidate is considering applying to this role. Do thorough research and produce a comprehensive dossier.

## Candidate Resume
${resumeText}

## Job Posting
${jobText}

## Your Task

Research everything you can and produce a complete dossier covering:

### 1. Compensation Context
- Market rate for this role/level/location
- How the listed salary compares
- Negotiation leverage points

### 2. AI Engineering Culture
- Does the company use or encourage AI coding tools (Copilot, Claude Code, Cursor, agentic workflows)?
- Any public statements, blog posts, or job descriptions mentioning AI-assisted development?
- Is the engineering culture likely to embrace engineers who ship faster using AI tools, or is there resistance?
- Look for signals: do they mention "AI-native", "agentic", "LLM-augmented" workflows, or similar?
- Are there concerns about AI tool usage (IP policies, code review friction, etc.)?
- Rating: AI-Forward / AI-Friendly / Neutral / Unknown / AI-Resistant

### 3. Company Deep Dive
- What the company does, their products/services
- Funding stage, size, recent news
- Tech stack and engineering culture
- Leadership team
- Employee sentiment and Glassdoor/Blind highlights
- Any red flags or concerns

### 4. Role Analysis
- What you'd actually be doing day-to-day
- Team context — who you'd work with
- Growth trajectory for this role
- How this role fits into the company's current priorities

### 5. Fit Assessment
- Matching skills and experience (be specific, reference the candidate's actual background)
- Skill gaps to acknowledge or address
- Adjacent experience that transfers
- Overall fit rating: Strong / Good / Stretch

### 6. Cover Letter Talking Points
- 5-7 specific bullet points to mention, each referencing the candidate's real experience
- What angle to take (technical depth? leadership? domain expertise?)
- What to emphasize vs. downplay

### 7. Contact Info
- Email addresses from the posting
- Who posted (HN username from the URL if available)
- Best way to reach out

### 8. Interview Prep
- Questions they'll likely ask for this role
- Questions the candidate should ask
- Topics to research before interviewing

Be thorough, specific, and opinionated. Reference the candidate's actual experience when making recommendations.

### IMPORTANT: Structured Data Block
At the very end of your response, output a JSON code block tagged \`\`\`enrichment with corrected/discovered job metadata. Only include fields where you found better data than what's in the posting. This helps improve the job database:
\`\`\`enrichment
{
  "salary": "$X - $Y" or null if unknown,
  "remote": "Full" | "Hybrid" | "None" | null,
  "location": { "city": "...", "countryCode": "XX", "region": "..." } or null,
  "experience": "Junior" | "Mid" | "Senior" | "Staff" | "Lead" | null,
  "type": "Full-time" | "Contract" | "Part-time" | null
}
\`\`\``;
}
