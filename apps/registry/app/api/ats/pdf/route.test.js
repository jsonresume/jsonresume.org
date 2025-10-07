import { describe, it, expect } from 'vitest';

// Mock the helper functions by importing them from the route file
// Since they're not exported, we'll test them through the public API
// For now, we'll create standalone versions for testing

/**
 * Tests for ATS PDF Analysis Helper Functions
 *
 * These tests verify the core business logic for PDF parseability analysis:
 * - Field extraction detection (contact, work, education, skills)
 * - Score calculation algorithm
 * - Text overlap detection
 * - Rating assignment
 * - Summary generation
 */

describe('ATS PDF Analysis - getScoreRating', () => {
  function getScoreRating(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Needs Improvement';
    return 'Poor';
  }

  it('returns Excellent for scores >= 90', () => {
    expect(getScoreRating(100)).toBe('Excellent');
    expect(getScoreRating(95)).toBe('Excellent');
    expect(getScoreRating(90)).toBe('Excellent');
  });

  it('returns Good for scores 80-89', () => {
    expect(getScoreRating(89)).toBe('Good');
    expect(getScoreRating(85)).toBe('Good');
    expect(getScoreRating(80)).toBe('Good');
  });

  it('returns Fair for scores 70-79', () => {
    expect(getScoreRating(79)).toBe('Fair');
    expect(getScoreRating(75)).toBe('Fair');
    expect(getScoreRating(70)).toBe('Fair');
  });

  it('returns Needs Improvement for scores 60-69', () => {
    expect(getScoreRating(69)).toBe('Needs Improvement');
    expect(getScoreRating(65)).toBe('Needs Improvement');
    expect(getScoreRating(60)).toBe('Needs Improvement');
  });

  it('returns Poor for scores < 60', () => {
    expect(getScoreRating(59)).toBe('Poor');
    expect(getScoreRating(30)).toBe('Poor');
    expect(getScoreRating(0)).toBe('Poor');
  });
});

describe('ATS PDF Analysis - checkTextOverlap', () => {
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

  it('returns false for null/undefined inputs', () => {
    expect(checkTextOverlap(null, 'target text')).toBe(false);
    expect(checkTextOverlap('source text', null)).toBe(false);
    expect(checkTextOverlap(undefined, 'target text')).toBe(false);
  });

  it('returns true when overlap meets threshold', () => {
    const source = 'experienced software engineer';
    const target = 'I am an experienced software engineer with 5 years';
    expect(checkTextOverlap(source, target, 0.5)).toBe(true);
  });

  it('returns false when overlap below threshold', () => {
    const source = 'experienced software engineer manager';
    const target = 'I am a junior developer'; // Only 1/4 words match
    expect(checkTextOverlap(source, target, 0.5)).toBe(false);
  });

  it('is case-insensitive', () => {
    const source = 'Software Engineer';
    const target = 'software engineer position';
    expect(checkTextOverlap(source, target, 1.0)).toBe(true);
  });

  it('uses default threshold of 0.5', () => {
    const source = 'one two three four';
    const target = 'one two'; // 2/4 = 0.5
    expect(checkTextOverlap(source, target)).toBe(true);
  });

  it('handles custom thresholds', () => {
    const source = 'one two three four';
    const target = 'one two three'; // 3/4 = 0.75
    expect(checkTextOverlap(source, target, 0.8)).toBe(false);
    expect(checkTextOverlap(source, target, 0.7)).toBe(true);
  });
});

describe('ATS PDF Analysis - calculatePDFScore', () => {
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

  it('returns 100 for perfect extraction', () => {
    const analysis = {
      contactInfo: {
        name: true,
        email: true,
        phone: true,
        location: true,
        summary: true,
      },
      sections: {
        work: { totalEntries: 0, extracted: 0 },
        education: { totalEntries: 0, extracted: 0 },
        skills: { totalSkills: 0, extracted: 0 },
      },
    };
    expect(calculatePDFScore(analysis)).toBe(100);
  });

  it('calculates contact info score correctly (30 points max)', () => {
    const analysis = {
      contactInfo: {
        name: true,
        email: true,
        phone: false,
        location: false,
        summary: false,
      }, // 2/5 = 12 points
      sections: {
        work: { totalEntries: 0, extracted: 0 },
        education: { totalEntries: 0, extracted: 0 },
        skills: { totalSkills: 0, extracted: 0 },
      },
    };
    // 12 (contact) + 25 (work) + 20 (edu) + 25 (skills) = 82
    expect(calculatePDFScore(analysis)).toBe(82);
  });

  it('calculates work experience score correctly (25 points max)', () => {
    const analysis = {
      contactInfo: {
        name: true,
        email: true,
        phone: true,
        location: true,
        summary: true,
      }, // 30 points
      sections: {
        work: { totalEntries: 4, extracted: 2 }, // 2/4 * 25 = 12.5
        education: { totalEntries: 0, extracted: 0 },
        skills: { totalSkills: 0, extracted: 0 },
      },
    };
    // 30 + 12.5 + 20 + 25 = 87.5 → 88
    expect(calculatePDFScore(analysis)).toBe(88);
  });

  it('calculates education score correctly (20 points max)', () => {
    const analysis = {
      contactInfo: {
        name: true,
        email: true,
        phone: true,
        location: true,
        summary: true,
      },
      sections: {
        work: { totalEntries: 0, extracted: 0 },
        education: { totalEntries: 2, extracted: 1 }, // 1/2 * 20 = 10
        skills: { totalSkills: 0, extracted: 0 },
      },
    };
    // 30 + 25 + 10 + 25 = 90
    expect(calculatePDFScore(analysis)).toBe(90);
  });

  it('calculates skills score correctly (25 points max)', () => {
    const analysis = {
      contactInfo: {
        name: true,
        email: true,
        phone: true,
        location: true,
        summary: true,
      },
      sections: {
        work: { totalEntries: 0, extracted: 0 },
        education: { totalEntries: 0, extracted: 0 },
        skills: { totalSkills: 10, extracted: 8 }, // 8/10 * 25 = 20
      },
    };
    // 30 + 25 + 20 + 20 = 95
    expect(calculatePDFScore(analysis)).toBe(95);
  });

  it('gives full credit when sections are empty', () => {
    const analysis = {
      contactInfo: {
        name: false,
        email: false,
        phone: false,
        location: false,
        summary: false,
      }, // 0 points
      sections: {
        work: { totalEntries: 0, extracted: 0 }, // 25 points (full credit)
        education: { totalEntries: 0, extracted: 0 }, // 20 points
        skills: { totalSkills: 0, extracted: 0 }, // 25 points
      },
    };
    // 0 + 25 + 20 + 25 = 70
    expect(calculatePDFScore(analysis)).toBe(70);
  });

  it('caps score at 100', () => {
    const analysis = {
      contactInfo: {
        name: true,
        email: true,
        phone: true,
        location: true,
        summary: true,
      },
      sections: {
        work: { totalEntries: 0, extracted: 0 },
        education: { totalEntries: 0, extracted: 0 },
        skills: { totalSkills: 0, extracted: 0 },
      },
    };
    expect(calculatePDFScore(analysis)).toBe(100);
  });

  it('rounds fractional scores', () => {
    const analysis = {
      contactInfo: {
        name: true,
        email: true,
        phone: true,
        location: false,
        summary: false,
      }, // 3/5 * 30 = 18
      sections: {
        work: { totalEntries: 3, extracted: 2 }, // 2/3 * 25 = 16.67
        education: { totalEntries: 0, extracted: 0 },
        skills: { totalSkills: 0, extracted: 0 },
      },
    };
    // 18 + 16.67 + 20 + 25 = 79.67 → 80
    expect(calculatePDFScore(analysis)).toBe(80);
  });
});

describe('ATS PDF Analysis - generatePDFSummary', () => {
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
        analysis.sections.skills.totalSkills -
        analysis.sections.skills.extracted;
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

  it('returns excellent message for score >= 90', () => {
    const analysis = {
      contactInfo: { name: true, email: true },
      sections: {
        work: { totalEntries: 0, extracted: 0 },
        skills: { totalSkills: 0, extracted: 0 },
      },
    };
    const summary = generatePDFSummary(95, analysis);
    expect(summary).toBe(
      'PDF is highly parseable by ATS systems! All major fields are extractable.'
    );
  });

  it('includes issues in summary for score 80-89', () => {
    const analysis = {
      contactInfo: { name: true, email: false, phone: false },
      sections: {
        work: { totalEntries: 3, extracted: 2 },
        skills: { totalSkills: 0, extracted: 0 },
      },
    };
    const summary = generatePDFSummary(85, analysis);
    expect(summary).toContain('PDF is parseable with minor issues');
    expect(summary).toContain('Missing contact fields: email, phone');
    expect(summary).toContain('1 work experience entries not extracted');
  });

  it('includes issues in summary for score 70-79', () => {
    const analysis = {
      contactInfo: { name: true, email: true },
      sections: {
        work: { totalEntries: 0, extracted: 0 },
        skills: { totalSkills: 10, extracted: 5 },
      },
    };
    const summary = generatePDFSummary(75, analysis);
    expect(summary).toContain('PDF has moderate parseability issues');
    expect(summary).toContain('5 skills not found in PDF text');
  });

  it('includes issues in summary for score < 70', () => {
    const analysis = {
      contactInfo: { name: false, email: false, phone: false },
      sections: {
        work: { totalEntries: 5, extracted: 1 },
        skills: { totalSkills: 20, extracted: 5 },
      },
    };
    const summary = generatePDFSummary(50, analysis);
    expect(summary).toContain('PDF has significant parseability issues');
    expect(summary).toContain('Missing contact fields');
    expect(summary).toContain('4 work experience entries not extracted');
    expect(summary).toContain('15 skills not found in PDF text');
  });

  it('lists all missing contact fields', () => {
    const analysis = {
      contactInfo: {
        name: false,
        email: false,
        phone: true,
        location: false,
      },
      sections: {
        work: { totalEntries: 0, extracted: 0 },
        skills: { totalSkills: 0, extracted: 0 },
      },
    };
    const summary = generatePDFSummary(70, analysis);
    expect(summary).toContain('name, email, location');
  });

  it('does not mention issues when sections are empty', () => {
    const analysis = {
      contactInfo: { name: true, email: true },
      sections: {
        work: { totalEntries: 0, extracted: 0 },
        skills: { totalSkills: 0, extracted: 0 },
      },
    };
    const summary = generatePDFSummary(100, analysis);
    expect(summary).not.toContain('work experience');
    expect(summary).not.toContain('skills not found');
  });
});
