'use client';

import { useState } from 'react';
import { Card, CardContent } from '@repo/ui';

export default function ApiKeysPage() {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch('/api/v1/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to generate key');
      } else {
        setResult(data);
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="max-w-lg w-full shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">API Key</h1>
            <p className="text-gray-500 mt-2">
              Generate an API key for the{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                @jsonresume/job-search
              </code>{' '}
              CLI and Claude Code skill.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                GitHub Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. thomasdavis"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                You must have a resume.json gist on GitHub.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Generate API Key'}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm font-medium text-green-800 mb-2">
                  Key generated for <strong>{result.username}</strong>
                </p>
                <code className="block bg-white border rounded px-3 py-2 text-sm font-mono break-all select-all">
                  {result.key}
                </code>
              </div>

              <div className="bg-gray-50 border rounded-md p-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Quick start</p>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">1. Export your key:</p>
                  <code className="block bg-white border rounded px-3 py-2 text-xs font-mono select-all">
                    export JSONRESUME_API_KEY={result.key}
                  </code>
                  <p className="text-xs text-gray-500">2. Search for jobs:</p>
                  <code className="block bg-white border rounded px-3 py-2 text-xs font-mono select-all">
                    npx @jsonresume/job-search search
                  </code>
                  <p className="text-xs text-gray-500">
                    3. Or use the Claude Code skill:
                  </p>
                  <code className="block bg-white border rounded px-3 py-2 text-xs font-mono select-all">
                    /jsonresume-hunt
                  </code>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
