# @repo/pathways

Pathways' career copilot (`/dashboard/pathways`): a conversation with an
OpenAI model (`PATHWAYS_MODEL`, default gpt-5-mini) that has every MCP tool
(`AgentToolkit` from `@repo/mcp`), acting as the signed-in user. `Copilot.reply`
streams `CopilotEvent`s (text as it's written, each tool it uses); the app
serves them as server-sent events at `POST /api/pathways/chat`
(`@repo/api-server`). Tool schemas aren't strict: the resume tools take
free-form JSON.

The rest of Pathways is data the dashboard reads: directions
(`careerDirections` in `@repo/jobs`, also the `get_career_directions` MCP
tool) and job marks for the swipe deck.
