import { getMarks, setMark } from './localState.js';

const DEFAULT_BASE_URL = 'https://registry.jsonresume.org';

/**
 * Creates an API client for local mode — uses a resume JSON object
 * instead of registry auth. Marks are stored locally.
 */
export function createLocalApiClient({ baseUrl, resume }) {
  const base = baseUrl || DEFAULT_BASE_URL;

  return {
    mode: 'local',
    fetchJobs: async (params = {}) => {
      const body = {
        resume,
        top: params.top || 50,
        days: params.days || 30,
      };
      if (params.remote) body.remote = true;
      if (params.minSalary) body.min_salary = params.minSalary;
      if (params.search) body.search = params.search;

      const res = await fetch(`${base}/api/v1/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Non-JSON response: ${res.status}`);
      }
      if (!res.ok) throw new Error(data.error || res.statusText);

      // Overlay local marks onto results
      const marks = getMarks();
      const jobs = (data.jobs || []).map((j) => ({
        ...j,
        state: marks[String(j.id)] || j.state || null,
      }));

      return { jobs };
    },

    fetchJobDetail: async (id) => {
      // In local mode we don't have a detail endpoint — return
      // a stub so JobDetail falls back to the job data it already has.
      return { id };
    },

    markJob: async (id, state, feedback) => {
      setMark(id, state);
      return { id, state, feedback };
    },

    fetchMe: async () => ({ resume, username: 'local' }),

    // Search profiles not supported in local mode
    listSearches: async () => ({ searches: [] }),
    createSearch: async () => {
      throw new Error('Search profiles require a registry account');
    },
    updateSearch: async () => {
      throw new Error('Search profiles require a registry account');
    },
    deleteSearch: async () => {
      throw new Error('Search profiles require a registry account');
    },

    // Dossiers — local mode stores in memory only
    fetchDossier: async () => ({ content: null }),
    saveDossier: async () => ({ saved: true }),
  };
}
