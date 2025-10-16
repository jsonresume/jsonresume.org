import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { validatePDFRequest } from './utils/validation';
import { fetchAndParsePDF } from './utils/pdfFetcher';
import { analyzeFieldExtraction } from './utils/fieldAnalysis';
import { calculatePDFScore, getScoreRating } from './utils/scoring';
import { generatePDFSummary } from './utils/summary';
import { getEndpointDocumentation } from './utils/documentation';

/**
 * POST /api/ats/pdf
 * Analyzes PDF parseability for ATS systems
 *
 * Body:
 * {
 *   resume: { ... JSON Resume object ... },
 *   username: "johndoe",
 *   theme: "professional" (optional, defaults to professional)
 * }
 *
 * Returns:
 * {
 *   score: 95,
 *   rating: "Excellent",
 *   analysis: { ... detailed field extraction analysis ... },
 *   theme: "professional",
 *   metadata: { pages: 2, textLength: 5432 },
 *   summary: "PDF is highly parseable by ATS systems!"
 * }
 */
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate request
    const validation = validatePDFRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      );
    }

    const { resume, username, theme } = validation.data;

    logger.debug({ username, theme }, 'Analyzing PDF parseability');

    // Fetch and parse PDF
    const { text: extractedText, numpages } = await fetchAndParsePDF(
      username,
      theme
    );

    // Analyze field extraction
    const analysis = analyzeFieldExtraction(resume, extractedText);
    const score = calculatePDFScore(analysis);

    const result = {
      score,
      rating: getScoreRating(score),
      analysis,
      theme,
      metadata: {
        pages: numpages,
        textLength: extractedText.length,
      },
      summary: generatePDFSummary(score, analysis),
    };

    logger.debug(
      { score: result.score, rating: result.rating, username },
      'PDF analysis completed'
    );

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    logger.error(
      { error: error.message, stack: error.stack },
      'PDF analysis error'
    );

    return NextResponse.json(
      {
        error: 'PDF analysis failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ats/pdf
 * Returns endpoint documentation
 */
export async function GET() {
  const documentation = getEndpointDocumentation();

  return NextResponse.json(documentation, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
