const DEFAULT_BASE_URL = 'https://registry.jsonresume.org';

export function createApiClient({ baseUrl, apiKey }) {
  const base = baseUrl || DEFAULT_BASE_URL;

  async function request(path, options = {}) {
    const url = `${base}/api/v1${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Non-JSON response: ${res.status}`);
    }
    if (!res.ok) throw new Error(data.error || res.statusText);
    return data;
  }

  return {
    fetchJobs: (params = {}) => {
      const qs = new URLSearchParams();
      qs.set('top', String(params.top || 50));
      qs.set('days', String(params.days || 30));
      if (params.remote) qs.set('remote', 'true');
      if (params.minSalary) qs.set('min_salary', String(params.minSalary));
      if (params.search) qs.set('search', params.search);
      if (params.searchId) qs.set('search_id', params.searchId);
      if (params.rerank !== undefined) qs.set('rerank', String(params.rerank));
      return request(`/jobs?${qs}`);
    },
    fetchJobDetail: (id) => request(`/jobs/${id}`),
    markJob: (id, state, feedback) =>
      request(`/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ state, feedback: feedback || undefined }),
      }),
    fetchMe: () => request('/me'),

    // Search profiles
    listSearches: () => request('/searches'),
    createSearch: (name, prompt) =>
      request('/searches', {
        method: 'POST',
        body: JSON.stringify({ name, prompt }),
      }),
    updateSearch: (id, updates) =>
      request(`/searches/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    deleteSearch: (id) => request(`/searches/${id}`, { method: 'DELETE' }),
  };
}
