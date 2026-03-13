import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  getSupabase,
  parseJobContent,
  extractUserSkills,
  EMPTY_REPORT,
} from './helpers';
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
import {
  computeAntiResume,
  computeSkillAdjacency,
  computeArchetypes,
  computeMarketDrift,
  computeReadinessScores,
} from './analytics-v2';

export const dynamic = 'force-dynamic';

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
        'Error fetching feedback'
      );
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!feedback.length) {
      return NextResponse.json({
        username,
        days,
        timeline: computeTimeline([], days),
        ...EMPTY_REPORT,
      });
    }

    const { count: totalJobsInDb } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .not('gpt_content', 'is', null)
      .gte('posted_at', cutoff);

    const jobIds = [...new Set(feedback.map((f) => f.job_id).filter(Boolean))];
    const numericIds = jobIds.map(Number).filter((n) => !isNaN(n));

    let parsedJobs = [];
    if (numericIds.length > 0) {
      const { data: jobs, error: jobsErr } = await supabase
        .from('jobs')
        .select('id, gpt_content, salary_usd, posted_at')
        .in('id', numericIds);
      if (jobsErr)
        logger.warn({ error: jobsErr.message }, 'Error fetching jobs');
      parsedJobs = (jobs || []).map(parseJobContent).filter(Boolean);
    }

    const jobMap = Object.fromEntries(parsedJobs.map((j) => [String(j.id), j]));
    const sets = { interested: [], not_interested: [] };
    for (const f of feedback) {
      const job = jobMap[f.job_id];
      if (!job) continue;
      if (f.sentiment === 'interested' || f.sentiment === 'applied')
        sets.interested.push(job);
      if (f.sentiment === 'not_interested' || f.sentiment === 'dismissed')
        sets.not_interested.push(job);
    }

    const userSkills = extractUserSkills(resume);

    const salary = computeSalary(parsedJobs, sets.interested);

    const report = {
      username,
      days,
      generatedAt: new Date().toISOString(),
      pipeline: {
        ...computePipeline(feedback),
        totalJobsInDb: totalJobsInDb || 0,
      },
      timeline: computeTimeline(feedback, days),
      salary,
      remoteIndex: computeRemoteIndex(parsedJobs, sets.interested),
      dealBreakers: computeDealBreakers(sets.interested, sets.not_interested),
      skills: computeSkillGaps(parsedJobs, sets.interested, userSkills),
      momentum: computeMomentum(feedback),
      topCompanies: computeTopCompanies(feedback),
      secondLook: findSecondLookJobs(
        sets.not_interested,
        sets.interested,
        parsedJobs
      ),
      recentActivity: computeRecentActivity(feedback),
      antiResume: computeAntiResume(sets.interested, sets.not_interested),
      skillAdjacency: computeSkillAdjacency(parsedJobs, userSkills),
      archetypes: computeArchetypes(sets.interested),
      marketDrift: computeMarketDrift(parsedJobs),
      readiness: computeReadinessScores(
        sets.interested,
        userSkills,
        resume,
        salary
      ),
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
