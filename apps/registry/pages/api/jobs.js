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

  // Generate a natural language description of the resume
  const resumeCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
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
    match_threshold: -1, // Choose an appropriate threshold for your data
    match_count: 500, // Choose the number of matches
  });

  // Log initial match count
  console.log('Total matched jobs:', documents.length);

  // similarity is on documents, it is a flow, i want to sort from highest to lowest
  const sortedDocuments = documents.sort((a, b) => b.similarity - a.similarity);
  const jobIds = documents ? sortedDocuments.map((doc) => doc.id) : [];

  const { data: sortedJobs } = await supabase
    .from('jobs')
    .select('*')
    .in('id', jobIds)
    .order('created_at', { ascending: false });

  // Add similarity scores to jobs
  const jobsWithSimilarity = sortedJobs.map((job) => {
    const doc = sortedDocuments.find((d) => d.id === job.id);
    return {
      ...job,
      similarity: doc ? doc.similarity : 0,
    };
  });

  // Get date distribution
  const validDates = jobsWithSimilarity
    .map((job) => {
      const date = new Date(job.created_at);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log('Invalid date found:', {
          id: job.id,
          created_at: job.created_at,
        });
        return null;
      }
      return date;
    })
    .filter(Boolean); // Remove null values

  if (validDates.length > 0) {
    const oldestDate = new Date(Math.min(...validDates));
    const newestDate = new Date(Math.max(...validDates));

    console.log('Date range of jobs:', {
      oldest: oldestDate.toISOString(),
      newest: newestDate.toISOString(),
      daysBetween: Math.floor(
        (newestDate - oldestDate) / (1000 * 60 * 60 * 24)
      ),
      validDatesCount: validDates.length,
      invalidDatesCount: jobsWithSimilarity.length - validDates.length,
    });
  } else {
    console.log('No valid dates found in the jobs');
  }

  const filteredJobs = jobsWithSimilarity.filter(
    (job) =>
      new Date(job.created_at) > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  );

  return res.status(200).send(filteredJobs);
}
