import { createSupabaseClient } from './candidates/supabaseClient';
import { fetchJob } from './candidates/fetchJob';
import { matchResumes } from './candidates/matchResumes';
import { formatCandidates } from './candidates/formatCandidates';

export default async function handler(req, res) {
  if (!process.env.SUPABASE_KEY) {
    return res.status(503).json({ message: 'API not available during build' });
  }

  try {
    const supabase = createSupabaseClient();
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const jobResult = await fetchJob(supabase, jobId);
    if (jobResult.error) {
      return res.status(jobResult.status).json({ message: jobResult.error });
    }

    const matchResult = await matchResumes(
      supabase,
      jobResult.jobData.embedding_v5
    );
    if (matchResult.error) {
      return res
        .status(matchResult.status)
        .json({ message: matchResult.error });
    }

    const candidates = formatCandidates(matchResult.matches);

    return res.status(200).json({
      candidates,
      job: {
        title: jobResult.jobData.title,
        company: jobResult.jobData.company,
        location: jobResult.jobData.location,
        description: jobResult.jobData.description,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
