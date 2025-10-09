import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { calculateATSScore } from '@/lib/ats/scoring';

// This ensures the route is always dynamic
export const dynamic = 'force-dynamic';

/**
 * POST /api/ats
 * Analyze resume for ATS compatibility
 *
 * Request body:
 * {
 *   "resume": { ...JSON Resume object... },
 *   "theme": "jsonresume-theme-stackoverflow" (optional)
 * }
 *
 * Response:
 * {
 *   "score": 85,
 *   "rating": "Good",
 *   "checks": [...],
 *   "recommendations": [...],
 *   "summary": "Your resume is well-optimized..."
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { resume, theme } = body;

    // Validate resume data
    if (!resume || typeof resume !== 'object') {
      logger.warn('Invalid resume data provided to ATS endpoint');
      return NextResponse.json(
        { message: 'Resume data is required and must be a valid object' },
        { status: 400 }
      );
    }

    const analysisStart = Date.now();

    // Calculate ATS score
    const result = calculateATSScore(resume, { theme });

    const analysisDuration = Date.now() - analysisStart;
    logger.debug(
      {
        duration: analysisDuration,
        score: result.score,
        rating: result.rating,
        theme: theme || 'none',
      },
      'ATS analysis completed'
    );

    return NextResponse.json(result, {
      headers: {
        'Content-Type': 'application/json',
        // Cache for 5 minutes since scores are deterministic for same input
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  } catch (error) {
    logger.error({ error: error.message }, 'Error in ATS analysis endpoint');
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ats
 * Get information about the ATS analysis endpoint
 */
export async function GET() {
  return NextResponse.json(
    {
      endpoint: '/api/ats',
      method: 'POST',
      description:
        'Analyze resume for ATS (Applicant Tracking System) compatibility',
      requestBody: {
        resume: 'JSON Resume object (required)',
        theme: 'Theme name for compatibility check (optional)',
      },
      response: {
        score: 'Overall ATS score (0-100)',
        rating: 'Rating text (Excellent, Good, Fair, Poor, Needs Improvement)',
        checks: 'Array of individual check results with scores and issues',
        recommendations: 'Array of actionable recommendations',
        summary: 'Summary text explaining the overall result',
      },
      categories: [
        { name: 'Contact Information', maxScore: 20 },
        { name: 'Work Experience', maxScore: 20 },
        { name: 'Education', maxScore: 15 },
        { name: 'Skills', maxScore: 15 },
        { name: 'Keywords & Content', maxScore: 15 },
        { name: 'Date Formatting', maxScore: 10 },
        { name: 'Theme Compatibility', maxScore: 5 },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        // Cache the endpoint info for 1 day
        'Cache-Control': 'public, max-age=86400',
      },
    }
  );
}
