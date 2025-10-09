import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Dynamic import to avoid webpack bundling issues
async function getPDFParser() {
  const pdf = (await import('pdf-parse')).default;
  return pdf;
}

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
    const { resume, username, theme } = body;

    // Validation
    if (!resume) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    if (typeof resume !== 'object' || Array.isArray(resume)) {
      return NextResponse.json(
        { error: 'Resume must be a valid object' },
        { status: 400 }
      );
    }

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required for PDF analysis' },
        { status: 400 }
      );
    }

    logger.debug(
      { username, theme: theme || 'professional' },
      'Analyzing PDF parseability'
    );

    // Analyze PDF parseability (inline to avoid bundling issues)
    const selectedTheme = theme || 'professional';

    // Use localhost in development, production domain otherwise
    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://registry.jsonresume.org';

    // Fetch PDF
    const pdfUrl = `${baseUrl}/${username}.pdf?theme=${selectedTheme}`;
    logger.debug({ pdfUrl, isDev }, 'Fetching PDF for analysis');

    const pdfResponse = await fetch(pdfUrl);

    if (!pdfResponse.ok) {
      logger.error(
        {
          status: pdfResponse.status,
          statusText: pdfResponse.statusText,
          pdfUrl,
        },
        'PDF fetch failed'
      );
      throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    // Parse PDF
    const pdfParser = await getPDFParser();
    const pdfData = await pdfParser(pdfBuffer);
    const extractedText = pdfData.text;

    // Analyze field extraction
    const analysis = analyzeFieldExtraction(resume, extractedText);
    const score = calculatePDFScore(analysis);

    const result = {
      score,
      rating: getScoreRating(score),
      analysis,
      theme: selectedTheme,
      metadata: {
        pages: pdfData.numpages,
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
  return NextResponse.json(
    {
      endpoint: '/api/ats/pdf',
      method: 'POST',
      description: 'Analyzes PDF parseability for ATS compatibility',
      notice: 'This endpoint simulates uploading your PDF to an ATS system',
      howItWorks: [
        '1. Generates PDF with specified theme',
        '2. Extracts text using PDF parsing',
        '3. Checks if all resume fields are extractable',
        '4. Returns parseability score (0-100)',
      ],
      requestBody: {
        resume: 'JSON Resume object (required)',
        username: 'Username for PDF generation (required)',
        theme: 'Theme to use for PDF (optional, default: professional)',
      },
      response: {
        score: 'Parseability score (0-100)',
        rating: 'Excellent | Good | Fair | Needs Improvement | Poor',
        analysis: {
          contactInfo: 'Contact field extraction results',
          sections: 'Work/education/skills extraction results',
          keywords: 'Keyword density metrics',
        },
        theme: 'Theme used for PDF generation',
        metadata: 'PDF pages and text length',
        summary: 'Human-readable summary',
      },
      scoringBreakdown: {
        'Contact Information': '30 points',
        'Work Experience': '25 points',
        Education: '20 points',
        Skills: '25 points',
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    }
  );
}

// Helper functions for PDF analysis
function analyzeFieldExtraction(resume, extractedText) {
  const text = extractedText.toLowerCase();
  const analysis = {
    contactInfo: {},
    sections: {},
    keywords: {},
  };

  // Contact Information Extraction
  const basics = resume.basics || {};
  analysis.contactInfo = {
    name: basics.name ? text.includes(basics.name.toLowerCase()) : false,
    email: basics.email ? text.includes(basics.email.toLowerCase()) : false,
    phone: basics.phone
      ? text.includes(basics.phone.replace(/[\s()-]/g, ''))
      : false,
    location: basics.location?.city
      ? text.includes(basics.location.city.toLowerCase())
      : false,
    summary: basics.summary
      ? checkTextOverlap(basics.summary, extractedText, 0.5)
      : false,
  };

  // Work Experience Extraction
  const work = resume.work || [];
  analysis.sections.work = {
    totalEntries: work.length,
    extracted: 0,
    companies: [],
  };

  work.forEach((job) => {
    const companyFound = job.name
      ? text.includes(job.name.toLowerCase())
      : false;
    const positionFound = job.position
      ? text.includes(job.position.toLowerCase())
      : false;

    if (companyFound || positionFound) {
      analysis.sections.work.extracted++;
      analysis.sections.work.companies.push({
        name: job.name,
        found: companyFound,
        position: job.position,
        positionFound,
      });
    }
  });

  // Education Extraction
  const education = resume.education || [];
  analysis.sections.education = {
    totalEntries: education.length,
    extracted: 0,
    institutions: [],
  };

  education.forEach((edu) => {
    const institutionFound = edu.institution
      ? text.includes(edu.institution.toLowerCase())
      : false;
    const areaFound = edu.area ? text.includes(edu.area.toLowerCase()) : false;

    if (institutionFound || areaFound) {
      analysis.sections.education.extracted++;
      analysis.sections.education.institutions.push({
        institution: edu.institution,
        found: institutionFound,
        area: edu.area,
        areaFound,
      });
    }
  });

  // Skills Extraction
  const skills = resume.skills || [];
  analysis.sections.skills = {
    totalSkills: 0,
    extracted: 0,
    categories: [],
  };

  skills.forEach((skillSet) => {
    const keywords = skillSet.keywords || [];
    const categoryAnalysis = {
      name: skillSet.name,
      total: keywords.length,
      found: 0,
      keywords: [],
    };

    keywords.forEach((keyword) => {
      const found = text.includes(keyword.toLowerCase());
      if (found) {
        categoryAnalysis.found++;
        analysis.sections.skills.extracted++;
      }
      categoryAnalysis.keywords.push({ keyword, found });
    });

    analysis.sections.skills.totalSkills += keywords.length;
    analysis.sections.skills.categories.push(categoryAnalysis);
  });

  // Keyword Density Check
  const totalWords = extractedText.split(/\s+/).length;
  analysis.keywords = {
    totalWords,
    density:
      totalWords > 0 ? (extractedText.length / totalWords).toFixed(1) : 0,
  };

  return analysis;
}

function calculatePDFScore(analysis) {
  let score = 0;

  // Contact Information (30 points)
  const contactFields = Object.values(analysis.contactInfo);
  const contactScore =
    (contactFields.filter((f) => f).length / contactFields.length) * 30;
  score += contactScore;

  // Work Experience (25 points)
  const workScore =
    analysis.sections.work.totalEntries > 0
      ? (analysis.sections.work.extracted /
          analysis.sections.work.totalEntries) *
        25
      : 25;
  score += workScore;

  // Education (20 points)
  const eduScore =
    analysis.sections.education.totalEntries > 0
      ? (analysis.sections.education.extracted /
          analysis.sections.education.totalEntries) *
        20
      : 20;
  score += eduScore;

  // Skills (25 points)
  const skillsScore =
    analysis.sections.skills.totalSkills > 0
      ? (analysis.sections.skills.extracted /
          analysis.sections.skills.totalSkills) *
        25
      : 25;
  score += skillsScore;

  return Math.round(Math.min(score, 100));
}

function checkTextOverlap(source, target, threshold = 0.5) {
  if (!source || !target) return false;

  const sourceWords = source.toLowerCase().split(/\s+/);
  const targetLower = target.toLowerCase();

  const matchedWords = sourceWords.filter((word) =>
    targetLower.includes(word)
  ).length;
  const overlapRatio = matchedWords / sourceWords.length;

  return overlapRatio >= threshold;
}

function getScoreRating(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  if (score >= 60) return 'Needs Improvement';
  return 'Poor';
}

function generatePDFSummary(score, analysis) {
  const issues = [];

  // Contact info issues
  const contactMissing = Object.entries(analysis.contactInfo)
    .filter(([_, found]) => !found)
    .map(([field]) => field);

  if (contactMissing.length > 0) {
    issues.push(`Missing contact fields: ${contactMissing.join(', ')}`);
  }

  // Work experience issues
  if (
    analysis.sections.work.totalEntries > 0 &&
    analysis.sections.work.extracted < analysis.sections.work.totalEntries
  ) {
    const missing =
      analysis.sections.work.totalEntries - analysis.sections.work.extracted;
    issues.push(`${missing} work experience entries not extracted`);
  }

  // Skills issues
  if (
    analysis.sections.skills.totalSkills > 0 &&
    analysis.sections.skills.extracted < analysis.sections.skills.totalSkills
  ) {
    const missing =
      analysis.sections.skills.totalSkills - analysis.sections.skills.extracted;
    issues.push(`${missing} skills not found in PDF text`);
  }

  if (score >= 90) {
    return 'PDF is highly parseable by ATS systems! All major fields are extractable.';
  } else if (score >= 80) {
    return `PDF is parseable with minor issues: ${issues.join('; ')}`;
  } else if (score >= 70) {
    return `PDF has moderate parseability issues: ${issues.join('; ')}`;
  } else {
    return `PDF has significant parseability issues: ${issues.join('; ')}`;
  }
}
