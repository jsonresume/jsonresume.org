const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { username } = req.body;

  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

  const resume = JSON.parse(data[0].resume);
  const completion = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: JSON.stringify({
      skills: resume.skills,
      work: resume.work,
      summary: resume.summary,
      education: resume.education,
      awards: resume.awards,
      basics: resume.basics,
      interests: resume.interests,
    }),
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
    match_threshold: 0.14, // Choose an appropriate threshold for your data
    match_count: 80, // Choose the number of matches
  });

  console.log({ documents });
  // similarity is on documents, it is a flow, i want to sort from highest to lowest
  // then get the job ids
  const sortedDocuments = documents.sort((a, b) => b.similarity - a.similarity);
  const jobIds = documents ? sortedDocuments.map((doc) => doc.id) : [];

  const { data: jobs } = await supabase.from('jobs').select().in('id', jobIds);
  // sort jobs in the same order as jobIds by id
  const sortedJobs = jobIds.map((id) => jobs.find((job) => job.id === id));

  const filteredJobs = sortedJobs.filter(
    (job) =>
      new Date(job.created_at) > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  );

  return res.status(200).send(filteredJobs);
}
