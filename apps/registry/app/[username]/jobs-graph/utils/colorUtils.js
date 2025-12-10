import { parseSalary } from './salaryParser';

/**
 * Calculates relative luminance of an RGB color (WCAG formula)
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number} Luminance value (0-1)
 */
export const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Determines if a background color needs light text for contrast
 * Uses WCAG luminance threshold
 * @param {string} bgColor - RGB color string like "rgb(30, 64, 175)"
 * @returns {boolean} True if text should be light/white
 */
export const needsLightText = (bgColor) => {
  if (!bgColor || bgColor === 'white') return false;
  if (bgColor.startsWith('#')) {
    // Handle hex colors
    const hex = bgColor.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return getLuminance(r, g, b) < 0.4;
  }
  const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return false;
  const [, r, g, b] = match.map(Number);
  // Threshold of 0.4 provides good contrast - below this, use light text
  return getLuminance(r, g, b) < 0.4;
};

/**
 * Calculates background color for a node based on salary gradient
 * @param {Object} node - React Flow node
 * @param {Object} jobData - Job data for this node
 * @param {Object} options - Color options
 * @returns {string} RGB color string
 */
export const getNodeBackground = ({
  node,
  jobData,
  username,
  readJobs,
  showSalaryGradient,
  salaryRange,
  filterText,
  filteredNodes,
}) => {
  if (node.data.isResume) return 'white';

  const key = `${username}_${node.id}`;
  if (readJobs.has(key)) return '#f1f5f9';

  if (showSalaryGradient && jobData) {
    const salary = parseSalary(jobData.salary);
    if (salary) {
      // Use percentile range for gradient calculation to handle outliers
      const p5 = salaryRange.p5 || salaryRange.min;
      const p95 = salaryRange.p95 || salaryRange.max;

      // Clamp salary to percentile range for better gradient distribution
      const clampedSalary = Math.max(p5, Math.min(p95, salary));
      const range = p95 - p5;
      const percentage = range > 0 ? (clampedSalary - p5) / range : 0;

      const lightBlue = [219, 234, 254]; // bg-blue-100
      const darkBlue = [30, 64, 175]; // bg-blue-800

      const r = Math.round(
        lightBlue[0] + (darkBlue[0] - lightBlue[0]) * percentage
      );
      const g = Math.round(
        lightBlue[1] + (darkBlue[1] - lightBlue[1]) * percentage
      );
      const b = Math.round(
        lightBlue[2] + (darkBlue[2] - lightBlue[2]) * percentage
      );

      return `rgb(${r}, ${g}, ${b})`;
    }
    return '#e2e8f0'; // Light gray for no salary
  }

  return filterText && !node.data.isResume && !filteredNodes.has(node.id)
    ? '#f1f5f9'
    : 'rgb(255 241 143)';
};

/**
 * Calculates edge style based on selection and path finding
 * @param {Object} edge - React Flow edge
 * @param {Set} pathEdges - Set of edge IDs in the path to resume
 * @returns {Object} Edge style object
 */
export const getEdgeStyle = (edge, pathEdges) => {
  if (!pathEdges || pathEdges.size === 0) {
    return { stroke: '#94a3b8', strokeWidth: 2 };
  }

  if (pathEdges.has(edge.id)) {
    return {
      stroke: '#3b82f6',
      strokeWidth: 2,
    };
  }

  return { stroke: '#94a3b8', strokeWidth: 2 };
};
