/**
 * Aggregates all tool definitions for the Pathways API
 */
import { resumeTools } from './resume';
import { jobTools } from './jobs';

// Export all tools as a single object for use in streamText
export const allTools = {
  ...resumeTools,
  ...jobTools,
};

// Export individual tool groups for selective use
export { resumeTools } from './resume';
export { jobTools } from './jobs';

// Export tool names for type safety
export const TOOL_NAMES = Object.keys(allTools);
