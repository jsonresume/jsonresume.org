const { createClient } = require('@supabase/supabase-js');
const gravatar = require('gravatar');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

export default async function handler(req, res) {
  if (!process.env.SUPABASE_KEY) {
    return res.status(503).json({ message: 'API not available during build' });
  }

  try {
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // Get the job's embedding
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('uuid', jobId)
      .single();

    if (jobError || !jobData) {
      console.error('Error fetching job:', jobError);
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!jobData.embedding_v5) {
      return res.status(400).json({ message: 'Job has no embedding' });
    }

    // Match resumes using vector similarity
    const { data: matches, error: matchError } = await supabase.rpc(
      'match_resumes_v5',
      {
        query_embedding: jobData.embedding_v5,
        match_threshold: 0.14,
        match_count: 100,
      }
    );

    if (matchError) {
      console.error('Error matching resumes:', matchError);
      return res.status(500).json({ message: 'Error matching resumes' });
    }

    // Format the results
    const candidates = matches.map((match) => {
      try {
        const resume = JSON.parse(match.resume);
        return {
          username: match.username,
          similarity: match.similarity,
          label: resume?.basics?.label,
          image:
            resume?.basics?.image ||
            gravatar.url(
              resume?.basics?.email || '',
              {
                s: '200',
                r: 'x',
                d: 'retro',
              },
              true
            ),
          name: resume?.basics?.name,
          location: resume?.basics?.location,
          skills: resume?.skills?.map((s) => s.name) || [],
          headline: resume?.basics?.summary,
          updated_at: match.updated_at,
          created_at: match.created_at,
        };
      } catch (e) {
        console.error('Error parsing resume:', e);
        return {
          username: match.username,
          similarity: match.similarity,
          label: 'Error parsing resume',
          image: gravatar.url('', { s: '200', r: 'x', d: 'retro' }, true),
          name: match.username,
          location: null,
          skills: [],
          headline: null,
          updated_at: match.updated_at,
          created_at: match.created_at,
        };
      }
    });

    return res.status(200).json({
      candidates,
      job: {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        description: jobData.description,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
