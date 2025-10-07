/**
 * ATS (Applicant Tracking System) Scoring Utilities
 *
 * Analyzes resume data and rendering for ATS compatibility
 * Returns a score (0-100) and specific recommendations
 */

/**
 * Calculate ATS compatibility score for resume data
 *
 * @param {Object} resume - JSON Resume object
 * @param {Object} options - Analysis options
 * @param {string} options.theme - Theme name being used
 * @param {string} options.html - Rendered HTML (optional)
 * @returns {Object} Score and recommendations
 */
export function calculateATSScore(resume, options = {}) {
  const checks = [];
  let totalScore = 0;
  let maxScore = 0;

  // 1. Contact Information (20 points)
  const contactScore = checkContactInformation(resume);
  checks.push(contactScore);
  totalScore += contactScore.score;
  maxScore += contactScore.maxScore;

  // 2. Work Experience Structure (20 points)
  const workScore = checkWorkExperience(resume);
  checks.push(workScore);
  totalScore += workScore.score;
  maxScore += workScore.maxScore;

  // 3. Education Structure (15 points)
  const educationScore = checkEducation(resume);
  checks.push(educationScore);
  totalScore += educationScore.score;
  maxScore += educationScore.maxScore;

  // 4. Skills Section (15 points)
  const skillsScore = checkSkills(resume);
  checks.push(skillsScore);
  totalScore += skillsScore.score;
  maxScore += skillsScore.maxScore;

  // 5. Keywords and Content (15 points)
  const keywordScore = checkKeywords(resume);
  checks.push(keywordScore);
  totalScore += keywordScore.score;
  maxScore += keywordScore.maxScore;

  // 6. Date Formatting (10 points)
  const dateScore = checkDates(resume);
  checks.push(dateScore);
  totalScore += dateScore.score;
  maxScore += dateScore.maxScore;

  // 7. Theme ATS Compatibility (5 points)
  const themeScore = checkThemeCompatibility(options.theme);
  checks.push(themeScore);
  totalScore += themeScore.score;
  maxScore += themeScore.maxScore;

  // Calculate final score (0-100)
  const finalScore = Math.round((totalScore / maxScore) * 100);

  // Determine overall rating
  const rating = getScoreRating(finalScore);

  // Generate recommendations
  const recommendations = checks
    .filter((check) => check.issues.length > 0)
    .flatMap((check) => check.issues);

  return {
    score: finalScore,
    rating,
    checks,
    recommendations,
    summary: generateSummary(finalScore, checks),
  };
}

/**
 * Check contact information completeness
 */
function checkContactInformation(resume) {
  const issues = [];
  let score = 0;
  const maxScore = 20;

  const basics = resume.basics || {};

  // Name (required) - 5 points
  if (basics.name && basics.name.trim().length > 0) {
    score += 5;
  } else {
    issues.push({
      severity: 'critical',
      category: 'contact',
      message: 'Missing name - ATS requires full name',
      fix: 'Add your full name to basics.name',
    });
  }

  // Email (required) - 5 points
  if (basics.email && isValidEmail(basics.email)) {
    score += 5;
  } else {
    issues.push({
      severity: 'critical',
      category: 'contact',
      message: 'Missing or invalid email address',
      fix: 'Add a valid email to basics.email',
    });
  }

  // Phone (important) - 5 points
  if (basics.phone && basics.phone.trim().length > 0) {
    score += 5;
  } else {
    issues.push({
      severity: 'warning',
      category: 'contact',
      message: 'Missing phone number - recommended for ATS',
      fix: 'Add phone number to basics.phone',
    });
  }

  // Location (important) - 5 points
  if (
    basics.location &&
    (basics.location.city || basics.location.region || basics.location.country)
  ) {
    score += 5;
  } else {
    issues.push({
      severity: 'warning',
      category: 'contact',
      message: 'Missing location information',
      fix: 'Add city, region, or country to basics.location',
    });
  }

  return {
    name: 'Contact Information',
    score,
    maxScore,
    issues,
    passed: score === maxScore,
  };
}

/**
 * Check work experience structure
 */
function checkWorkExperience(resume) {
  const issues = [];
  let score = 0;
  const maxScore = 20;

  const work = resume.work || [];

  // Has work experience - 5 points
  if (work.length > 0) {
    score += 5;
  } else {
    issues.push({
      severity: 'warning',
      category: 'experience',
      message: 'No work experience listed',
      fix: 'Add work experience to the work array',
    });
  }

  // Check work entry quality
  work.forEach((job, index) => {
    const jobIssues = [];

    // Company name - 3 points
    if (job.name && job.name.trim().length > 0) {
      score += 3;
    } else {
      jobIssues.push('Missing company name');
    }

    // Position/title - 3 points
    if (job.position && job.position.trim().length > 0) {
      score += 3;
    } else {
      jobIssues.push('Missing job title');
    }

    // Start date - 3 points
    if (job.startDate) {
      score += 3;
    } else {
      jobIssues.push('Missing start date');
    }

    // Description or highlights - 3 points
    if (
      (job.summary && job.summary.trim().length > 0) ||
      (job.highlights && job.highlights.length > 0)
    ) {
      score += 3;
    } else {
      jobIssues.push('Missing job description or highlights');
    }

    if (jobIssues.length > 0) {
      issues.push({
        severity: 'warning',
        category: 'experience',
        message: `Work entry #${index + 1}: ${jobIssues.join(', ')}`,
        fix: `Complete all required fields for work entry #${index + 1}`,
      });
    }
  });

  // Cap score at maxScore
  score = Math.min(score, maxScore);

  return {
    name: 'Work Experience',
    score,
    maxScore,
    issues,
    passed: score >= maxScore * 0.8,
  };
}

/**
 * Check education structure
 */
function checkEducation(resume) {
  const issues = [];
  let score = 0;
  const maxScore = 15;

  const education = resume.education || [];

  // Has education - 5 points
  if (education.length > 0) {
    score += 5;
  } else {
    issues.push({
      severity: 'info',
      category: 'education',
      message: 'No education listed',
      fix: 'Add education history to the education array',
    });
  }

  // Check education entry quality
  education.forEach((edu, index) => {
    // Institution name - 5 points
    if (edu.institution && edu.institution.trim().length > 0) {
      score += 5;
    }

    // Degree or study area - 5 points
    if (
      (edu.studyType && edu.studyType.trim().length > 0) ||
      (edu.area && edu.area.trim().length > 0)
    ) {
      score += 5;
    }
  });

  // Cap score at maxScore
  score = Math.min(score, maxScore);

  return {
    name: 'Education',
    score,
    maxScore,
    issues,
    passed: score >= maxScore * 0.6,
  };
}

/**
 * Check skills section
 */
function checkSkills(resume) {
  const issues = [];
  let score = 0;
  const maxScore = 15;

  const skills = resume.skills || [];

  // Has skills listed - 5 points
  if (skills.length > 0) {
    score += 5;
  } else {
    issues.push({
      severity: 'warning',
      category: 'skills',
      message: 'No skills listed - critical for ATS keyword matching',
      fix: 'Add relevant skills to the skills array',
    });
  }

  // Has multiple skill categories - 5 points
  if (skills.length >= 3) {
    score += 5;
  } else if (skills.length > 0) {
    issues.push({
      severity: 'info',
      category: 'skills',
      message: 'Consider adding more skill categories for better ATS matching',
      fix: 'Add at least 3 skill categories (e.g., Languages, Frameworks, Tools)',
    });
  }

  // Skills have keywords - 5 points
  const totalKeywords = skills.reduce(
    (sum, skill) => sum + (skill.keywords || []).length,
    0
  );
  if (totalKeywords >= 10) {
    score += 5;
  } else if (totalKeywords > 0) {
    score += 2;
    issues.push({
      severity: 'info',
      category: 'skills',
      message: 'Add more skill keywords for better ATS matching',
      fix: 'Include at least 10 specific skills across categories',
    });
  }

  return {
    name: 'Skills',
    score,
    maxScore,
    issues,
    passed: score >= maxScore * 0.7,
  };
}

/**
 * Check keyword optimization
 */
function checkKeywords(resume) {
  const issues = [];
  let score = 0;
  const maxScore = 15;

  // Check summary/about - 5 points
  const summary = resume.basics?.summary || '';
  if (summary.length >= 50) {
    score += 5;
  } else if (summary.length > 0) {
    score += 2;
    issues.push({
      severity: 'info',
      category: 'keywords',
      message: 'Summary is too short - aim for 50+ characters',
      fix: 'Expand basics.summary with relevant keywords and achievements',
    });
  } else {
    issues.push({
      severity: 'warning',
      category: 'keywords',
      message: 'Missing professional summary',
      fix: 'Add a summary to basics.summary with key skills and experience',
    });
  }

  // Check work highlights - 5 points
  const work = resume.work || [];
  const totalHighlights = work.reduce(
    (sum, job) => sum + (job.highlights || []).length,
    0
  );
  if (totalHighlights >= 5) {
    score += 5;
  } else if (totalHighlights > 0) {
    score += 2;
    issues.push({
      severity: 'info',
      category: 'keywords',
      message: 'Add more work highlights for better keyword matching',
      fix: 'Include at least 5 highlights across work experiences',
    });
  }

  // Check for keyword density - 5 points
  const allText = extractAllText(resume);
  const wordCount = allText.split(/\s+/).length;
  if (wordCount >= 200) {
    score += 5;
  } else {
    issues.push({
      severity: 'info',
      category: 'keywords',
      message: 'Resume content is light - aim for 200+ words',
      fix: 'Add more detail to work experience, skills, and summary',
    });
  }

  return {
    name: 'Keywords & Content',
    score,
    maxScore,
    issues,
    passed: score >= maxScore * 0.6,
  };
}

/**
 * Check date formatting consistency
 */
function checkDates(resume) {
  const issues = [];
  let score = 10; // Start with perfect score
  const maxScore = 10;

  const work = resume.work || [];
  const education = resume.education || [];

  // Check for missing dates
  work.forEach((job, index) => {
    if (!job.startDate) {
      score -= 2;
      issues.push({
        severity: 'warning',
        category: 'dates',
        message: `Work entry #${index + 1} missing start date`,
        fix: 'Add startDate in YYYY-MM-DD format',
      });
    }
  });

  education.forEach((edu, index) => {
    if (!edu.startDate && !edu.endDate) {
      score -= 1;
      issues.push({
        severity: 'info',
        category: 'dates',
        message: `Education entry #${index + 1} missing dates`,
        fix: 'Add dates to improve ATS parsing',
      });
    }
  });

  score = Math.max(0, score); // Don't go below 0

  return {
    name: 'Date Formatting',
    score,
    maxScore,
    issues,
    passed: score >= maxScore * 0.8,
  };
}

/**
 * Check theme ATS compatibility
 */
function checkThemeCompatibility(theme) {
  const issues = [];
  let score = 0;
  const maxScore = 5;

  // List of known ATS-friendly themes
  const atsFriendlyThemes = [
    'jsonresume-theme-stackoverflow',
    'jsonresume-theme-professional',
    'jsonresume-theme-elegant',
    'jsonresume-theme-kendall',
    'jsonresume-theme-flat',
  ];

  // List of themes with known ATS issues
  const atsProblematicThemes = [
    'jsonresume-theme-paper',
    'jsonresume-theme-short',
  ];

  const themeName = theme || '';

  if (atsFriendlyThemes.some((t) => themeName.includes(t))) {
    score = 5;
  } else if (atsProblematicThemes.some((t) => themeName.includes(t))) {
    score = 1;
    issues.push({
      severity: 'warning',
      category: 'theme',
      message: 'This theme may have ATS compatibility issues',
      fix: `Consider using ATS-friendly themes: ${atsFriendlyThemes.join(
        ', '
      )}`,
    });
  } else {
    score = 3; // Neutral score for unknown themes
    issues.push({
      severity: 'info',
      category: 'theme',
      message: 'Theme ATS compatibility unknown',
      fix: 'For best results, use a simple, single-column theme',
    });
  }

  return {
    name: 'Theme Compatibility',
    score,
    maxScore,
    issues,
    passed: score >= 3,
  };
}

/**
 * Helper: Validate email format
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Helper: Extract all text from resume for analysis
 */
function extractAllText(resume) {
  const texts = [];

  if (resume.basics?.summary) texts.push(resume.basics.summary);
  if (resume.basics?.label) texts.push(resume.basics.label);

  (resume.work || []).forEach((job) => {
    if (job.position) texts.push(job.position);
    if (job.summary) texts.push(job.summary);
    if (job.highlights) texts.push(...job.highlights);
  });

  (resume.education || []).forEach((edu) => {
    if (edu.studyType) texts.push(edu.studyType);
    if (edu.area) texts.push(edu.area);
  });

  (resume.skills || []).forEach((skill) => {
    if (skill.name) texts.push(skill.name);
    if (skill.keywords) texts.push(...skill.keywords);
  });

  return texts.join(' ');
}

/**
 * Helper: Get rating based on score
 */
function getScoreRating(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Needs Improvement';
}

/**
 * Helper: Generate summary text
 */
function generateSummary(score, checks) {
  const failedChecks = checks.filter((c) => !c.passed);

  if (score >= 90) {
    return 'Your resume is highly optimized for ATS! Great job!';
  }

  if (score >= 75) {
    return 'Your resume is well-optimized for ATS with minor improvements needed.';
  }

  if (score >= 60) {
    return `Your resume needs some improvements for better ATS compatibility. Focus on: ${failedChecks
      .map((c) => c.name)
      .join(', ')}`;
  }

  return `Your resume needs significant improvements for ATS compatibility. Priority areas: ${failedChecks
    .slice(0, 3)
    .map((c) => c.name)
    .join(', ')}`;
}
