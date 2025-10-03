/**
 * Gets the highest education level attained
 * @param {Object} resume - JSON resume object
 * @returns {string} Highest education level
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
