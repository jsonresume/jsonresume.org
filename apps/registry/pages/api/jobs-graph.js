const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

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
  //   const resumeDescription = `
  // Professional Summary
  // Dynamic and accomplished Full-Stack Web Developer with extensive experience in building scalable, user-focused applications from the ground up, particularly in startup environments. Adept at wearing multiple hats to deliver robust, product-driven solutions that prioritize user feedback and high-impact results. A recognized leader in the open-source community and a trusted contributor to several high-profile initiatives, with a proven track record of driving innovation and collaboration.

  // Key Expertise & Skills
  // Frontend Development: Advanced skills in HTML, SCSS/CSS (BEM, Styled Components), JavaScript/TypeScript, React, Next.js, Redux, and Apollo.
  // Backend Development: Expertise in Node.js, Ruby, Python, PostgreSQL, Redis, and serverless architectures.
  // DevOps: Proficient in AWS, Google Cloud, Heroku, and caching strategies with Fastly and Cloudflare. Experienced in Docker and Kubernetes, holding a Certified Kubernetes Administrator credential.
  // Leadership: Demonstrated success in team management, including CTO-level responsibilities, with a history of scaling startups and rescuing critical projects under tight deadlines.
  // Open-Source Advocacy: Founder of initiatives like JSON Resume and Cdnjs, serving millions of developers and websites globally, with a strong commitment to fostering community-driven solutions.`;

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
    match_count: 100,
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

  // Add similarity scores to jobs
  const sortedJobs = jobsData.map((job) => {
    const doc = sortedDocuments.find((d) => d.id === job.id);
    return {
      ...job,
      similarity: doc ? doc.similarity : 0,
    };
  });

  // Split into most relevant (top 10) and less relevant
  const topJobs = sortedJobs.slice(0, 10);
  const otherJobs = sortedJobs.slice(10);

  // Create graph data
  const graphData = {
    nodes: [
      {
        id: username,
        group: -1,
        size: 24,
        color: resume.basics?.image ? 'url(#resumeImage)' : '#ff0000',
        x: 0,
        y: 0,
        image: resume.basics?.image || null,
      },
      ...topJobs.map((job) => ({
        id: job.uuid,
        label: JSON.parse(job.gpt_content).title,
        group: 1,
        size: 4,
        color: '#fff18f',
        vector: JSON.parse(job.embedding_v5),
      })),
      ...otherJobs.map((job) => ({
        id: job.uuid,
        label: JSON.parse(job.gpt_content).title,
        group: 2,
        size: 4,
        color: '#fff18f',
        vector: JSON.parse(job.embedding_v5),
      })),
    ],
    links: [
      ...topJobs.map((job) => ({
        source: username,
        target: job.uuid,
        value: job.similarity,
      })),
      // Process other jobs sequentially, each one only looking at previously processed jobs
      ...otherJobs.reduce((links, lessRelevantJob, index) => {
        const lessRelevantVector = JSON.parse(lessRelevantJob.embedding_v5);

        // Jobs to compare against: top jobs + already processed less relevant jobs
        const availableJobs = [...topJobs, ...otherJobs.slice(0, index)];

        const mostSimilarJob = availableJobs.reduce(
          (best, current) => {
            const similarity = cosineSimilarity(
              lessRelevantVector,
              JSON.parse(current.embedding_v5)
            );
            return similarity > best.similarity
              ? { job: current, similarity }
              : best;
          },
          { job: null, similarity: -1 }
        );

        if (mostSimilarJob.job) {
          links.push({
            source: mostSimilarJob.job.uuid,
            target: lessRelevantJob.uuid,
            value: mostSimilarJob.similarity,
          });
        }

        return links;
      }, []),
    ],
  };

  // Create job info map
  const jobInfoMap = {};
  sortedJobs.forEach((job) => {
    jobInfoMap[job.uuid] = JSON.parse(job.gpt_content);
  });

  // Set cache control headers for CDN caching
  const etag = `"${username}-v1"`; // Make ETag deterministic
  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('Vary', 'Accept-Encoding');
  res.setHeader('CDN-Cache-Control', 'public, max-age=86400');
  res.setHeader('Cloudflare-CDN-Cache-Control', 'public, max-age=86400');

  // Ensure consistent ordering of properties for better caching
  const response = {
    graphData: {
      nodes: graphData.nodes.sort((a, b) => a.id.localeCompare(b.id)),
      links: graphData.links.sort(
        (a, b) =>
          a.source.localeCompare(b.source) || a.target.localeCompare(b.target)
      ),
    },
    jobInfoMap,
    mostRelevant: topJobs,
    lessRelevant: otherJobs,
    allJobs: sortedJobs,
    resume,
  };

  res.status(200).json(response);
}
