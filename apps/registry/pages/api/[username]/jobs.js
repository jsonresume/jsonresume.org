const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers to allow any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Respond to preflight/OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Get username from the dynamic route parameter
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

  if (!data || data.length === 0) {
    return res
      .status(404)
      .json({ error: 'Resume not found for this username' });
  }

  const resume = JSON.parse(data[0].resume);
  const resumeCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          "You are a professional resume analyzer. Create a detailed professional summary that describes this candidate's background, skills, and experience in natural language. Focus on their expertise, achievements, and what makes them unique. Write it in a style similar to job descriptions to optimize for semantic matching. Do not include the candidates name. Make sure to include everything significant to the users career. Describe the type of industries they have experience in.",
      },
      {
        role: 'user',
        content: JSON.stringify(resume),
      },
    ],
    temperature: 0.85,
  });

  const resumeDescription = resumeCompletion.choices[0].message.content;
  console.log({ resumeDescription });

  const completion = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: resumeDescription,
  });

  const desiredLength = 3072;
  let embedding = completion.data[0].embedding;
  if (embedding.length < desiredLength) {
    embedding = embedding.concat(
      Array(desiredLength - embedding.length).fill(0)
    );
  }

  const { data: documents } = await supabase.rpc('match_jobs_v5', {
    query_embedding: embedding,
    match_threshold: -1,
    match_count: 500,
    created_after: new Date(
      Date.now() - 65 * 24 * 60 * 60 * 1000
    ).toISOString(),
  });

  const sortedDocuments = documents.sort((a, b) => b.similarity - a.similarity);
  const jobIds = documents ? sortedDocuments.map((doc) => doc.id) : [];

  const { data: jobsData } = await supabase
    .from('jobs')
    .select('*')
    .in('id', jobIds)
    .gte(
      'created_at',
      new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString()
    )
    .order('created_at', { ascending: false });

  // Build a map of job details for quick lookup
  const jobMap = {};
  jobsData.forEach((job) => {
    jobMap[job.id] = job;
  });

  // Create the final list of the 500 most relevant jobs, sorted by similarity score desc
  const jobsResult = sortedDocuments.slice(0, 500).map((doc) => {
    const job = jobMap[doc.id] || {};
    return {
      jobId: doc.id,
      score: doc.similarity,
      url: job.url,
      raw: job.gpt_content,
    };
  });

  // Set cache control headers for CDN caching
  const etag = `"${username}-jobs-v1"`; // Make ETag deterministic and unique for jobs endpoint
  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('Vary', 'Accept-Encoding');
  res.setHeader('CDN-Cache-Control', 'public, max-age=86400');
  res.setHeader('Cloudflare-CDN-Cache-Control', 'public, max-age=86400');

  return res.status(200).json(jobsResult);
}
