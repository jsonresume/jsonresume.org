/**
 * PDF field extraction analysis utilities
 */

/**
 * Analyze how well resume fields can be extracted from PDF text
 * @param {Object} resume - JSON Resume object
 * @param {string} extractedText - Text extracted from PDF
 * @returns {Object} Analysis results with field extraction metrics
 */
export function analyzeFieldExtraction(resume, extractedText) {
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

/**
 * Check if source text has significant overlap with target text
 * @param {string} source - Source text to check
 * @param {string} target - Target text to search in
 * @param {number} threshold - Minimum overlap ratio (default 0.5)
 * @returns {boolean} True if overlap meets threshold
 */
export function checkTextOverlap(source, target, threshold = 0.5) {
  if (!source || !target) return false;

  const sourceWords = source.toLowerCase().split(/\s+/);
  const targetLower = target.toLowerCase();

  const matchedWords = sourceWords.filter((word) =>
    targetLower.includes(word)
  ).length;
  const overlapRatio = matchedWords / sourceWords.length;

  return overlapRatio >= threshold;
}
