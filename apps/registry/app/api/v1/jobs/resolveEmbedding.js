/**
 * Resolve the query embedding for the authenticated GET /api/v1/jobs handler.
 *
 * Two paths:
 *  - saved search profile (`searchId`): use its stored embedding + prompt, and
 *    pull a light resume-text summary when reranking is on.
 *  - the user's own resume: embed it, optionally blending a HyDE embedding.
 *
 * Returns either { error: { message, status } } for a client-facing failure or
 * { embedding, resumeText, searchPrompt } on success.
 */
import { logger } from '@/lib/logger';
import {
  getSupabase,
  getResumeEmbedding,
  generateHydeEmbedding,
} from './matchingHelpers';

const REGISTRY_BASE = 'https://registry.jsonresume.org';

/** Build the lightweight resume-text summary used for reranking a profile. */
const buildProfileResumeText = (resume) =>
  [
    resume.basics?.label,
    resume.basics?.summary,
    ...(resume.skills || []).map(
      (s) => `${s.name}: ${(s.keywords || []).join(', ')}`
    ),
  ]
    .filter(Boolean)
    .join('\n');

const resolveFromProfile = async ({ username, searchId, shouldRerank }) => {
  const { data: profile, error: profileErr } = await getSupabase()
    .from('search_profiles')
    .select('embedding, user_id, prompt')
    .eq('id', searchId)
    .single();

  if (profileErr || !profile || profile.user_id !== username) {
    return { error: { message: 'Search profile not found', status: 404 } };
  }

  let resumeText = '';
  if (shouldRerank) {
    const res = await fetch(`${REGISTRY_BASE}/${username}.json`);
    if (res.ok) {
      resumeText = buildProfileResumeText(await res.json());
    }
  }

  return {
    embedding: profile.embedding,
    resumeText,
    searchPrompt: profile.prompt || '',
  };
};

const resolveFromResume = async ({ username, useHyde }) => {
  const res = await fetch(`${REGISTRY_BASE}/${username}.json`);
  if (!res.ok) {
    return { error: { message: 'Resume not found', status: 404 } };
  }

  const resume = await res.json();
  const result = await getResumeEmbedding(resume);
  let embedding = result.embedding;

  // HyDE: generate ideal job posting from resume for better matching
  if (useHyde) {
    try {
      embedding = await generateHydeEmbedding(result.text);
    } catch (hydeErr) {
      logger.warn({ error: hydeErr.message }, 'HyDE failed, using direct');
    }
  }

  return { embedding, resumeText: result.text, searchPrompt: '' };
};

/**
 * @param {Object} params
 * @param {string} params.username
 * @param {string} params.searchId - '' when matching against own resume
 * @param {boolean} params.shouldRerank
 * @param {boolean} params.useHyde
 */
export const resolveEmbedding = ({ searchId, ...rest }) =>
  searchId
    ? resolveFromProfile({ searchId, ...rest })
    : resolveFromResume(rest);
