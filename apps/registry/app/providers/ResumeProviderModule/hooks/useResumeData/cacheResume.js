export const cacheResume = (username, resumeData, gistId) => {
  localStorage.setItem(
    `resume_${username}`,
    JSON.stringify({
      resume: resumeData,
      gistId,
      username,
    })
  );
};
