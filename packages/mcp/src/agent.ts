import { Layer } from 'effect';
import { Toolkit } from 'effect/ai';
import { AccountHandlers, AccountToolkit } from './accountTools';
import { ExploreHandlers, ExploreToolkit } from './exploreTools';
import { ExportHandlers, ExportToolkit } from './exportTools';
import { JobHandlers, JobToolkit } from './jobTools';
import { ResumeHandlers, ResumeToolkit } from './resumeTools';
import { VersionHandlers, VersionToolkit } from './versionTools';

/**
 * Every MCP tool as one toolkit, for agents inside jsonresume.org (Pathways'
 * copilot). Tools act as McpCaller, which the caller provides.
 */
export const AgentToolkit = Toolkit.merge(
  ResumeToolkit,
  ExportToolkit,
  AccountToolkit,
  ExploreToolkit,
  JobToolkit,
  VersionToolkit
);

/** Needs what the MCP server needs: Accounts, AnalyticsStore, Explore, JobBoard, JobMatcher, ResumeVersions. */
export const AgentHandlers = Layer.mergeAll(
  ResumeHandlers,
  ExportHandlers,
  AccountHandlers,
  ExploreHandlers,
  JobHandlers,
  VersionHandlers
);
