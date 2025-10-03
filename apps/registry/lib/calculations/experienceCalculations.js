import {
  calculateDurationInDays,
  daysToYearsMonthsDays,
  mergeOverlappingRanges,
} from './dateUtils';

/**
 * Calculates total non-overlapping work experience
 * @param {Object} resume - JSON resume object
 * @returns {Object} Total experience in years, months, days
 */
export function totalExperience(resume) {
  const workHistory = resume.work || [];
  const dateRanges = workHistory.map((job) => ({
    startDate: new Date(job.startDate),
    endDate: job.endDate ? new Date(job.endDate) : new Date(),
  }));

  const mergedRanges = mergeOverlappingRanges(dateRanges);

  // Calculate total from merged ranges
  const totalDays = mergedRanges.reduce((total, range) => {
    return total + calculateDurationInDays(range.startDate, range.endDate);
  }, 0);

  return daysToYearsMonthsDays(totalDays);
}

/**
 * Calculates average job duration
 * @param {Object} resume - JSON resume object
 * @returns {Object} Average duration in years, months, days
 */
export function averageJobDuration(resume) {
  const workHistory = resume.work;

  if (!workHistory || workHistory.length === 0) {
    return { years: 0, months: 0, days: 0 };
  }

  const totalDays = workHistory.reduce((total, job) => {
    const startDate = new Date(job.startDate);
    const endDate = job.endDate ? new Date(job.endDate) : new Date();
    return total + calculateDurationInDays(startDate, endDate);
  }, 0);

  const averageDays = totalDays / workHistory.length;
  return daysToYearsMonthsDays(averageDays);
}

/**
 * Calculates career progression with summed durations per position
 * @param {Object} resume - JSON resume object
 * @returns {Array} Career progression with title and duration
 */
export function careerProgression(resume) {
  const workHistory = resume.work || [];
  const progressionMap = new Map();

  workHistory.forEach((job) => {
    const startDate = new Date(job.startDate);
    const endDate = job.endDate ? new Date(job.endDate) : new Date();
    const durationInDays = calculateDurationInDays(startDate, endDate);
    const { years, months } = daysToYearsMonthsDays(durationInDays);

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
    // Normalize months to years
    while (duration.months >= 12) {
      duration.years += 1;
      duration.months -= 12;
    }
    progression.push({ title, duration });
  });

  return progression;
}
