import nlp from 'compromise';

/**
 * Counts total skills and keywords
 * @param {Object} resume - JSON resume object
 * @returns {Object} Total skills and keywords count
 */
export function countSkillsAndKeywords(resume) {
  const skills = resume.skills || [];
  let totalSkills = 0;
  let totalKeywords = 0;

  skills.forEach((skill) => {
    totalSkills += 1;
    if (skill.keywords) {
      totalKeywords += skill.keywords.length;
    }
  });

  return { totalSkills, totalKeywords };
}

/**
 * Extracts skill evolution over time using NLP
 * @param {Object} resume - JSON resume object
 * @returns {Array} Skill evolution with year and skills
 */
export function skillEvolution(resume) {
  const workHistory = resume.work;
  const skillMap = new Map();

  workHistory.forEach((job) => {
    const startDate = new Date(job.startDate);
    const startYear = startDate.getFullYear();

    if (!skillMap.has(startYear)) {
      skillMap.set(startYear, new Set());
    }

    const jobSummary = job.summary ? job.summary : '';
    const jobHighlights = job.highlights ? job.highlights.join(' ') : '';

    const text = `${jobSummary} ${jobHighlights}`;
    const doc = nlp(text);

    // Extract nouns and proper nouns as potential skills
    const potentialSkills = doc.nouns().out('array');

    potentialSkills.forEach((skill) => {
      skillMap.get(startYear).add(skill);
    });
  });

  const evolution = [];
  skillMap.forEach((skills, year) => {
    evolution.push({
      year: year,
      skills: Array.from(skills),
    });
  });

  // Sort evolution by year
  evolution.sort((a, b) => a.year - b.year);

  return evolution;
}
