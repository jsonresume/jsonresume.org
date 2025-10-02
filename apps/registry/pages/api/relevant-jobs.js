const { generateText } = require('ai');
const { openai } = require('@ai-sdk/openai');
const OpenAI = require('openai');

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

  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Lazy load Supabase
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
  const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

  const resume = JSON.parse(data[0].resume);

  const { text: resumeDescription } = await generateText({
    model: openai('gpt-4o-mini', {
      apiKey: process.env.OPENAI_API_KEY,
    }),
    system:
      "You are a professional resume analyzer. Create a detailed professional summary that describes this candidate's background, skills, and experience in natural language. Focus on their expertise, achievements, and what makes them unique. Write it in a style similar to job descriptions to optimize for semantic matching. Do not include the candidates name. Make sure to include everything significant to the users career. Describe the type of industries they have experience in.",
    prompt: JSON.stringify(resume),
    temperature: 0.85,
  });
  console.log({ resumeDescription });
  //   const resumeDescription = `
  // Professional Summary
  // Dynamic and accomplished Full-Stack Web Developer with extensive experience in building scalable, user-focused applications from the ground up, particularly in startup environments. Adept at wearing multiple hats to deliver robust, product-driven solutions that prioritize user feedback and high-impact results. A recognized leader in the open-source community and a trusted contributor to several high-profile initiatives, with a proven track record of driving innovation and collaboration.

  // Key Expertise & Skills
  // Frontend Development: Advanced skills in HTML, SCSS/CSS (BEM, Styled Components), JavaScript/TypeScript, React, Next.js, Redux, and Apollo.
  // Backend Development: Expertise in Node.js, Ruby, Python, PostgreSQL, Redis, and serverless architectures.
  // DevOps: Proficient in AWS, Google Cloud, Heroku, and caching strategies with Fastly and Cloudflare. Experienced in Docker and Kubernetes, holding a Certified Kubernetes Administrator credential.
  // Leadership: Demonstrated success in team management, including CTO-level responsibilities, with a history of scaling startups and rescuing critical projects under tight deadlines.
  // Open-Source Advocacy: Founder of initiatives like JSON Resume and Cdnjs, serving millions of developers and websites globally, with a strong commitment to fostering community-driven solutions.`;

  // Use OpenAI SDK for embeddings (not yet supported in Vercel AI SDK)
  const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openaiClient.embeddings.create({
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
  const etag = `"${username}-v1"`; // Make ETag deterministic
  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('Vary', 'Accept-Encoding');
  res.setHeader('CDN-Cache-Control', 'public, max-age=86400');
  res.setHeader('Cloudflare-CDN-Cache-Control', 'public, max-age=86400');

  return res.status(200).json(jobsResult);
}
