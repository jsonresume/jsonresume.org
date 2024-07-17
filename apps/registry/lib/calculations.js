import nlp from 'compromise';

/**
 * Calculates the total non-overlapping work experience in years, months, and days from the given JSON resume work history.
 *
 * @param {Object} resume - The JSON resume object containing the work history.
 * @returns {Object} - An object containing the total work experience in years, months, and days.
 */
export function totalExperience(resume) {
  const workHistory = resume.work;
  const dateRanges = workHistory.map((job) => ({
    startDate: new Date(job.startDate),
    endDate: job.endDate ? new Date(job.endDate) : new Date(),
  }));

  // Sort the date ranges by start date
  dateRanges.sort((a, b) => a.startDate - b.startDate);

  // Merge overlapping date ranges
  const mergedRanges = [];
  let currentRange = dateRanges[0];

  for (let i = 1; i < dateRanges.length; i++) {
    const nextRange = dateRanges[i];
    if (currentRange.endDate >= nextRange.startDate) {
      // Extend the current range to include the next range
      currentRange.endDate = new Date(
        Math.max(currentRange.endDate, nextRange.endDate)
      );
    } else {
      // No overlap, push the current range and start a new range
      mergedRanges.push(currentRange);
      currentRange = nextRange;
    }
  }
  // Push the last range
  mergedRanges.push(currentRange);

  // Calculate total experience from merged ranges
  let totalExperienceInDays = 0;

  mergedRanges.forEach((range) => {
    const experience =
      (range.endDate - range.startDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    totalExperienceInDays += experience;
  });

  const years = Math.floor(totalExperienceInDays / 365);
  const remainingDaysAfterYears = totalExperienceInDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = Math.round(remainingDaysAfterYears % 30);

  return { years, months, days };
}

/**
 * Converts total years as a decimal into an object with integer years, months, and days.
 *
 * @param {number} totalYears - The total years as a decimal.
 * @returns {Object} - An object containing the integer years, months, and days.
 */
export function convertYearsToYearsMonthsDays(totalYears) {
  const years = Math.floor(totalYears);
  const totalMonths = (totalYears - years) * 12;
  const months = Math.floor(totalMonths);
  const days = Math.round((totalMonths - months) * 30); // Approximating a month as 30 days

  return { years, months, days };
}

/**
 * Counts the total number of skills and keywords from the given JSON resume.
 *
 * @param {Object} resume - The JSON resume object containing the skills section.
 * @returns {Object} - An object containing the total number of skills and keywords.
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
 * Calculates the average job duration from the given JSON resume work history.
 *
 * @param {Object} resume - The JSON resume object containing the work history.
 * @returns {Object} - An object containing the average job duration in years, months, and days.
 */
export function averageJobDuration(resume) {
  const workHistory = resume.work;

  if (!workHistory || workHistory.length === 0) {
    return { years: 0, months: 0, days: 0 };
  }

  let totalDurationInDays = 0;

  workHistory.forEach((job) => {
    const startDate = new Date(job.startDate);
    const endDate = job.endDate ? new Date(job.endDate) : new Date();
    const duration = (endDate - startDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    totalDurationInDays += duration;
  });

  const averageDurationInDays = totalDurationInDays / workHistory.length;
  const years = Math.floor(averageDurationInDays / 365);
  const remainingDaysAfterYears = averageDurationInDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = Math.round(remainingDaysAfterYears % 30);

  return { years, months, days };
}

/**
 * Calculates the career progression with summed durations for each position.
 *
 * @param {Object} resume - The JSON resume object containing the work history.
 * @returns {Array} - An array of objects representing the career progression with title and duration in years and months.
 */
export function careerProgression(resume) {
  const workHistory = resume.work;
  const progressionMap = new Map();

  workHistory.forEach((job) => {
    const startDate = new Date(job.startDate);
    const endDate = job.endDate ? new Date(job.endDate) : new Date();
    const durationInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const years = Math.floor(durationInDays / 365);
    const remainingDaysAfterYears = durationInDays % 365;
    const months = Math.floor(remainingDaysAfterYears / 30);

    if (!progressionMap.has(job.position)) {
      progressionMap.set(job.position, { years: 0, months: 0 });
    }

    const currentDuration = progressionMap.get(job.position);
    currentDuration.years += years;
    currentDuration.months += months;
    progressionMap.set(job.position, currentDuration);
  });

  const progression = [];
  progressionMap.forEach((duration, title) => {
    while (duration.months >= 12) {
      duration.years += 1;
      duration.months -= 12;
    }
    progression.push({
      title,
      duration,
    });
  });

  return progression;
}

/**
 * Gets the highest education level attained from the given JSON resume.
 *
 * @param {Object} resume - The JSON resume object containing the education history.
 * @returns {string} - The highest education level attained.
 */
export function getEducationLevel(resume) {
  if (!resume.education || resume.education.length === 0) {
    return 'No education information available';
  }

  let latestEducation = resume.education[0];
  resume.education.forEach((edu) => {
    const eduEndDate = new Date(edu.endDate);
    const latestEduEndDate = new Date(latestEducation.endDate);
    if (eduEndDate > latestEduEndDate) {
      latestEducation = edu;
    }
  });

  return latestEducation.studyType;
}

/**
 * Extracts the skills mentioned in job summaries and highlights over time using NLP.
 *
 * @param {Object} resume - The JSON resume object containing the work history.
 * @returns {Array} - An array of objects representing the skill evolution with year and skills.
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
