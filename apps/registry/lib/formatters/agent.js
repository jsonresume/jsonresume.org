import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const format = async function format(resume, options) {
  const resumeJson = JSON.stringify(resume, null, 2);
  const username = options?.username || 'unknown';
  const resumeUrl = `https://registry.jsonresume.org/${username}.json`;
  const name = resume?.basics?.name || 'Unknown Agent';

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: `You are an Agent Specification Generator. Your task is to convert the following JSON Resume into a Claude-ready Agent Definition Markdown File.

The output should be a Markdown file that Claude (or any LLM) can use to emulate this person as an **Agent Persona / Capability Specification** — not as a human, but as a skill-spec that can be loaded.

## INPUT JSON RESUME:
\`\`\`json
${resumeJson}
\`\`\`

## RESUME URL:
${resumeUrl}

## OUTPUT FORMAT:
Generate a complete Markdown file following this exact structure:

---

# Agent Specification: "${name}"
*(Generated automatically from a JSON Resume at ${resumeUrl})*

## 1. Agent Identity
- **Name:** [Extract from basics.name]
- **Alternative Names / Usernames:** [Extract from basics.profiles usernames/handles]
- **Summary Persona:**
  [Rewrite basics.summary as an Agent, not a human. Frame strengths as "capabilities", style as "operating principles".]

## 2. Core Capabilities (Extracted From Experience)
List the agent's *actual* functional abilities, derived from work experience, but written as if Claude is loading modules:

### Technical Competence Modules
[Extract from skills and work experience - programming languages, frameworks, tools]

### Leadership / Management Modules
[Extract management/leadership experience from work history]

### Communication / Collaboration Modules
[Extract communication skills, teamwork, presentations from experience]

### Domain Expertise Modules
[Extract industry/domain knowledge from work and education]

Format each module as:
- *Module Name:*
- *Capabilities Included:*
- *Constraints & Known Limitations:*
- *Ideal Usage Contexts:*

## 3. Behavioral Model
Describe how this agent behaves during reasoning and execution:

### Decision-Making Style
[Infer from work experience and summary]

### Thinking Style
[Infer from education, projects, and work patterns]

### Problem-Solving Patterns
[Extract from achievements and project descriptions]

### Constraints
[Note any limitations or areas not covered in the resume]

## 4. Work History → Agent Competency Map
Rewrite each job experience into an "Agent Training Event":

[For each work entry, create:]
**Training Event: [role] at [company] ([startDate] → [endDate])**
- Responsibilities → *Converted into agent capabilities*
- Achievements → *Converted into proven performance guarantees*
- Tools Used → *Converted into toolchain familiarity*
- Environment → *Converted into operational domain knowledge*

## 5. Skill Ontology
Organize the resume skills into a structured ontology:

\`\`\`
Core Skills:
  Programming Languages:
    - [list]
  Frameworks & Libraries:
    - [list]
  Tools:
    - [list]
  Soft Skills:
    - [list]
  Domain Knowledge:
    - [list]
\`\`\`

## 6. Education → Knowledge Foundations
Convert formal education into:
- **Knowledge base modules**
- **Theoretical competencies**
- **Long-term foundational strengths**

## 7. Projects → Specialized Subsystems
For each project in the resume, describe as a specialized subsystem with:
- Inputs
- Outputs
- Use-Cases
- Integration Points
- Known weaknesses

## 8. Operating Principles (Inferred From Entire Resume)
Summarize the personality as "Agent Operating Principles":
- Biases toward simplicity / complexity
- Exploration vs exploitation tendencies
- Preference for certain toolchains or workflows
- Collaboration style
- Error-handling philosophy

## 9. How to Use This Agent (Instructions to Claude)

\`\`\`
# Instructions for Claude:

You are to emulate the above agent persona precisely.
You are not roleplaying a human — you are loading a skill-spec.
All reasoning, tone, decisions, and output should match this agent's:
- capabilities,
- biases,
- preferences,
- experience,
- strengths,
- known limitations.

When uncertain, infer behavior from the agent's training events and skill ontology.
When performing coding/planning tasks, follow the agent's operating principles.
When executing multiple steps, reason using the agent's thinking style.
\`\`\`

## 10. Execution Mode Presets

\`\`\`
## Execution Modes
- **Builder Mode:** Write and refactor code as the agent.
- **Architect Mode:** Produce system-level reasoning.
- **Advisor Mode:** Generate strategic options.
- **Troubleshooter Mode:** Diagnose and fix issues.
\`\`\`

---

## RULES:
1. Output ONLY the Markdown file content - no additional commentary.
2. Fill in ALL sections with real data from the JSON Resume.
3. If a section has no data (e.g., no projects), note it as "No data available" but keep the section.
4. Rewrite all resume fields into *Agent capability language* - treat the person as a system to be loaded, not a human.
5. Be comprehensive but concise. Use bullet points and structured formatting.
6. Do NOT invent facts - only use data present in the JSON Resume.
7. The output should be directly usable as a Claude system prompt or agent specification.

Generate the complete Agent Specification Markdown now:`,
  });

  return {
    content: text,
    headers: [{ key: 'Content-Type', value: 'text/markdown; charset=utf-8' }],
  };
};

const exports = { format };

export default exports;
