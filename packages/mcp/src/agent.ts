import { Layer } from 'effect';
import { Toolkit } from 'effect/ai';
import { AccountHandlers, AccountToolkit } from './accountTools';
import { JobHandlers, JobToolkit } from './jobTools';
import { ResumeHandlers, ResumeToolkit } from './resumeTools';

/**
 * Every MCP tool as one toolkit, for agents inside jsonresume.org (Pathways'
 * copilot). Tools act as McpCaller, which the caller provides.
 */
export const AgentToolkit = Toolkit.merge(
  ResumeToolkit,
  AccountToolkit,
  JobToolkit
);

/** Needs what the MCP server needs: Accounts, AnalyticsStore, JobBoard, JobMatcher. */
export const AgentHandlers = Layer.mergeAll(
  ResumeHandlers,
  AccountHandlers,
  JobHandlers
);
