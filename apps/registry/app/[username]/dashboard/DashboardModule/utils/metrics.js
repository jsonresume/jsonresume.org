import {
  totalExperience,
  averageJobDuration,
  careerProgression,
  getEducationLevel,
} from '../../../../../lib/calculations';

/**
 * Calculate all dashboard metrics from resume data
 * @param {Object} resume - Resume data object
 * @returns {Object} Calculated metrics
 */
export function getMetrics({ resume }) {
  return {
    totalExperience: totalExperience(resume),
    totalJobs: resume.work?.length,
    totalProjects: resume.projects?.length,
    totalSkills: resume.skills?.length,
    totalCertifications: resume.certifications?.length,
    totalAwards: resume.awards?.length,
    totalPublications: resume.publications?.length,
    totalVolunteer: resume.volunteer?.length,
    averageJobDuration: averageJobDuration(resume),
    mostFrequentJobTitle: 'Software Engineer',
    topSkillCategories: resume.skills?.map((skill) => skill.name),
    mostRecentSkill: 'React Native',
    topIndustries: ['Technology', 'Finance', 'Healthcare'],
    educationLevel: getEducationLevel(resume),
    geographicMobility: 3,
    careerProgression: careerProgression(resume),
  };
}
