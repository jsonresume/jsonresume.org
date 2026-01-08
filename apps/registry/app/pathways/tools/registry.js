/**
 * Tool Registry - Central metadata store for all Pathways tools
 *
 * This registry enables:
 * - Auto-generated UI with consistent styling
 * - Easy tool addition (just add metadata here)
 * - Category-based organization for future tool groups
 */

export const toolRegistry = {
  // Resume Tools
  updateResume: {
    name: 'updateResume',
    displayName: 'Update Resume',
    icon: '📝',
    color: 'blue',
    category: 'resume',
    description: 'Modifies resume sections',
    processingMessage: 'Updating resume...',
    successMessage: 'Resume updated',
  },

  // Job Tools
  filterJobs: {
    name: 'filterJobs',
    displayName: 'Filter Jobs',
    icon: '🔍',
    color: 'purple',
    category: 'jobs',
    description: 'Filters jobs by criteria',
    processingMessage: 'Filtering jobs...',
    successMessage: 'Filter applied',
  },

  showJobs: {
    name: 'showJobs',
    displayName: 'Show Jobs',
    icon: '👁️',
    color: 'indigo',
    category: 'jobs',
    description: 'Focuses graph on matching jobs',
    processingMessage: 'Finding jobs...',
    successMessage: 'Jobs found',
  },

  getJobInsights: {
    name: 'getJobInsights',
    displayName: 'Job Insights',
    icon: '📊',
    color: 'amber',
    category: 'jobs',
    description: 'Analyzes job market data',
    processingMessage: 'Analyzing jobs...',
    successMessage: 'Analysis complete',
  },

  refreshJobMatches: {
    name: 'refreshJobMatches',
    displayName: 'Refresh Matches',
    icon: '🔄',
    color: 'green',
    category: 'jobs',
    description: 'Updates job recommendations',
    processingMessage: 'Refreshing matches...',
    successMessage: 'Matches updated',
  },

  saveJobFeedback: {
    name: 'saveJobFeedback',
    displayName: 'Save Feedback',
    icon: '💬',
    color: 'teal',
    category: 'jobs',
    description: 'Records job feedback',
    processingMessage: 'Saving feedback...',
    successMessage: 'Feedback saved',
  },
};

/**
 * Get metadata for a tool by name
 * @param {string} toolName - The tool name
 * @returns {object} Tool metadata with defaults for unknown tools
 */
export function getToolMeta(toolName) {
  return (
    toolRegistry[toolName] || {
      name: toolName,
      displayName: toolName,
      icon: '🔧',
      color: 'gray',
      category: 'other',
      description: 'Tool action',
      processingMessage: `${toolName}...`,
      successMessage: 'Complete',
    }
  );
}

/**
 * Get all tools by category
 * @param {string} category - Category to filter by
 * @returns {object[]} Array of tool metadata
 */
export function getToolsByCategory(category) {
  return Object.values(toolRegistry).filter((t) => t.category === category);
}

/**
 * Get all tool names
 * @returns {string[]} Array of tool names
 */
export function getAllToolNames() {
  return Object.keys(toolRegistry);
}
