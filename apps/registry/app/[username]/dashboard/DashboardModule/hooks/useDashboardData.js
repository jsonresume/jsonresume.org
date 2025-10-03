import { useResume } from '../../../../providers/ResumeProvider';
import { getMetrics } from '../utils/metrics';

/**
 * Hook to manage dashboard data and state
 * @returns {Object} Dashboard data, loading, and error states
 */
export function useDashboardData() {
  const { resume, loading, error } = useResume();

  const metrics = resume ? getMetrics({ resume }) : null;

  return {
    resume,
    metrics,
    loading,
    error,
  };
}
