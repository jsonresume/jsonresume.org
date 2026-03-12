const { embed } = require('ai');
const { openai } = require('@ai-sdk/openai');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

export default async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY || !process.env.SUPABASE_KEY) {
    return res.status(503).json({ error: 'API not available' });
  }

  const prompt = req.query.prompt;
  const limit = Math.min(parseInt(req.query.limit) || 100, 500);

  if (!prompt) {
    return res
      .status(400)
      .json({ error: 'prompt query parameter is required' });
  }

  const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);

  const { embedding: rawEmbedding } = await embed({
    model: openai.embedding('text-embedding-3-large'),
    value: prompt,
  });

  const desiredLength = 3072;
  let embedding = rawEmbedding;
  if (embedding.length < desiredLength) {
    embedding = embedding.concat(
      Array(desiredLength - embedding.length).fill(0)
    );
  }

  const { data: matches, error: matchError } = await supabase.rpc(
    'match_resumes_v5',
    {
      query_embedding: embedding,
      match_threshold: 0.0,
      match_count: limit,
    }
  );

  if (matchError) {
    return res
      .status(500)
      .json({ error: 'Failed to match resumes', details: matchError.message });
  }

  const resumes = matches.map((m) => ({
    username: m.username,
    similarity: m.similarity,
    resume: typeof m.resume === 'string' ? JSON.parse(m.resume) : m.resume,
  }));

  return res.status(200).json({
    prompt,
    count: resumes.length,
    resumes,
  });
}
