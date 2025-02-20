import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { scoreResume } from './recommendations';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  console.log(' [POST] /api/recommendations - Starting request processing');
  
  if (request.method !== 'POST') {
    console.warn(' Invalid method:', request.method);
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { username, jobPosting } = body;
    console.log(' Processing request for username:', username);
    console.log(' Job posting details:', {
      title: jobPosting?.title,
      company: jobPosting?.company,
      type: jobPosting?.type,
      remote: jobPosting?.remote
    });

    if (!username || !jobPosting) {
      console.warn(' Missing parameters:', { username: !!username, jobPosting: !!jobPosting });
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get the user's resume from Supabase
    console.log(' Fetching resume from Supabase for user:', username);
    const { data, error } = await supabase
      .from('resumes')
      .select('resume')
      .eq('username', username)
      .single();

    if (error || !data) {
      console.error(' Error fetching resume:', error);
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    console.log(' Resume found for user:', username);
    const resume = JSON.parse(data.resume);
    console.log(' Resume details:', {
      name: resume.basics?.name,
      title: resume.basics?.label,
      skills: resume.skills?.length || 0,
      experience: resume.work?.length || 0
    });

    // Score the resume against the job posting
    console.log(' Starting resume analysis...');
    const result = await scoreResume(resume, jobPosting);
    if (!result) {
      console.error(' Analysis failed - no result returned');
      throw new Error('Failed to analyze resume');
    }

    console.log(' Analysis complete:', {
      score: result.score,
      keyMatches: result.keyMatches?.length,
      gapsIdentified: result.gapsIdentified?.length,
      cultureFitScore: result.cultureFit?.score,
      remoteScore: result.remoteWorkReadiness?.score
    });

    return NextResponse.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error(' Error in job recommendations:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch available jobs
export async function GET(request) {
  console.log(' [GET] /api/recommendations - Fetching available jobs');
  
  try {
    // For now, return some sample jobs
    const jobs = [
      {
        title: "Founding Frontend Engineer",
        company: "Pincites",
        type: "Full-time",
        remote: "Full",
        description: "Pincites uses AI to help legal teams identify negotiation patterns...",
        skills: [
          { name: "React", level: "Expert" },
          { name: "TypeScript", level: "Expert" },
          { name: "Next.js", level: "Expert" }
        ]
      },
      // Add more sample jobs here
    ];

    console.log(' Returning sample jobs:', {
      count: jobs.length,
      companies: jobs.map(j => j.company)
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error(' Error fetching jobs:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
