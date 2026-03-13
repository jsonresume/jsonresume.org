import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import {
  computePipeline,
  computeTimeline,
  computeSalary,
  computeRemoteIndex,
  computeDealBreakers,
  computeSkillGaps,
  computeMomentum,
  computeTopCompanies,
  computeRecentActivity,
  findSecondLookJobs,
} from './analytics';

export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

function getSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_KEY);
}

function truncCompany(name) {
  if (!name) return 'Unknown';
  const trimmed = name.split(/\.|,| is | builds | provides | turns /)[0].trim();
  return trimmed.length > 60 ? trimmed.slice(0, 57) + '...' : trimmed;
}

function parseJobContent(job) {
  try {
    const parsed = JSON.parse(job.gpt_content);
    if (!parsed?.title) return null;
    return {
      id: job.id,
      title: parsed.title,
      company: truncCompany(parsed.company),
      remote: parsed.remote,
      experience: parsed.experience,
      type: parsed.type,
      salary: parsed.salary,
      salary_usd: job.salary_usd,
      skills: parsed.skills || [],
      location: parsed.location,
      description: parsed.description,
      posted_at: job.posted_at,
    };
  } catch {
    return null;
  }
}

function extractUserSkills(resume) {
  const skills = [];
  for (const s of resume.skills || []) {
    if (s.name) skills.push(s.name);
    for (const kw of s.keywords || []) skills.push(kw);
  }
  return skills;
}

/**
 * GET /api/v1/report/[username] — public job search analytics
 * Query: ?days=30
 */
export async function GET(request, { params }) {
  const { username } = await params;
  const { searchParams } = new URL(request.url);
  const days = Math.min(parseInt(searchParams.get('days')) || 30, 365);

  try {
    const supabase = getSupabase();
    const cutoff = new Date(Date.now() - days * 86400000).toISOString();

    // Fetch resume + feedback in parallel
    const [resumeRes, feedbackRes] = await Promise.all([
      fetch(`https://registry.jsonresume.org/${username}.json`),
      supabase
        .from('pathways_job_feedback')
        .select(
          'job_id, sentiment, feedback, job_title, job_company, created_at'
        )
        .eq('user_id', username)
        .gte('created_at', cutoff)
        .order('created_at', { ascending: false }),
    ]);

    if (!resumeRes.ok) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const resume = await resumeRes.json();
    const feedback = feedbackRes.data || [];

    if (feedbackRes.error) {
      logger.error(
        { error: feedbackRes.error.message },
        'Error fetching feedback for report'
      );
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!feedback.length) {
      return NextResponse.json({
        username,
        days,
        pipeline: computePipeline([]),
        timeline: computeTimeline([], days),
        salary: { market: null, interested: null, distribution: [] },
        remoteIndex: { market: {}, interested: {} },
        dealBreakers: [],
        skills: { gaps: [], topDemanded: [], userSkills: [] },
        momentum: {
          score: 0,
          label: 'no-data',
          reviewsThisWeek: 0,
          reviewsLastWeek: 0,
        },
        topCompanies: [],
        secondLook: [],
        recentActivity: [],
      });
    }

    // Count total jobs in the DB for the date range
    const { count: totalJobsInDb } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .not('gpt_content', 'is', null)
      .gte('posted_at', cutoff);

    // Collect unique job IDs from feedback and fetch job details
    const jobIds = [...new Set(feedback.map((f) => f.job_id).filter(Boolean))];
    const numericIds = jobIds.map(Number).filter((n) => !isNaN(n));

    let parsedJobs = [];
    if (numericIds.length > 0) {
      const { data: jobs, error: jobsErr } = await supabase
        .from('jobs')
        .select('id, gpt_content, salary_usd, posted_at')
        .in('id', numericIds);

      if (jobsErr) {
        logger.warn(
          { error: jobsErr.message },
          'Error fetching jobs for report'
        );
      }
      parsedJobs = (jobs || []).map(parseJobContent).filter(Boolean);
    }

    // Build sentiment sets
    const jobMap = Object.fromEntries(parsedJobs.map((j) => [String(j.id), j]));
    const sentimentSets = {
      interested: [],
      not_interested: [],
      maybe: [],
      applied: [],
    };
    for (const f of feedback) {
      const job = jobMap[f.job_id];
      if (!job) continue;
      if (f.sentiment === 'interested' || f.sentiment === 'applied') {
        sentimentSets.interested.push(job);
      }
      if (f.sentiment === 'not_interested' || f.sentiment === 'dismissed') {
        sentimentSets.not_interested.push(job);
      }
    }

    const userSkills = extractUserSkills(resume);

    // Compute all analytics
    const report = {
      username,
      days,
      generatedAt: new Date().toISOString(),
      pipeline: {
        ...computePipeline(feedback),
        totalJobsInDb: totalJobsInDb || 0,
      },
      timeline: computeTimeline(feedback, days),
      salary: computeSalary(parsedJobs, sentimentSets.interested),
      remoteIndex: computeRemoteIndex(parsedJobs, sentimentSets.interested),
      dealBreakers: computeDealBreakers(
        sentimentSets.interested,
        sentimentSets.not_interested
      ),
      skills: computeSkillGaps(
        parsedJobs,
        sentimentSets.interested,
        userSkills
      ),
      momentum: computeMomentum(feedback),
      topCompanies: computeTopCompanies(feedback),
      secondLook: findSecondLookJobs(
        sentimentSets.not_interested,
        sentimentSets.interested,
        parsedJobs
      ),
      recentActivity: computeRecentActivity(feedback),
    };

    return NextResponse.json(report);
  } catch (err) {
    logger.error({ error: err.message, username }, 'Error generating report');
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
