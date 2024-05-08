// @todo - needs a lot of work

const format = async function format(resume) {
  let content = `
${resume.basics.name}
${resume.basics.label}
${resume.basics.location.address}
${resume.basics.location.city}
${resume.basics.location.region}
${resume.basics.location.postalCode}
${resume.basics.location.countryCode}
${resume.basics.phone}
${resume.basics.email}

PROFESSIONAL SUMMARY
============================
${resume.basics.summary}

`;

  if (resume.work?.length) {
    content += `
WORK HISTORY
============================
${(resume.work ?? []).map(
  (work) => `
${work.startDate} – ${work.endDate}
${work.name}
${work.position}

${work.summary}

${(work.highlights ?? []).map((highlight) => `+ ${highlight}`).join('\n')}

`
)}
`;
  }

  if (resume.volunteer?.length) {
    content += `
VOLUNTEER
============================
${(resume.volunteer ?? []).map(
  (volunteer) => `
${volunteer.startDate} – ${volunteer.endDate}
${volunteer.organization} 
${volunteer.position}

${volunteer.summary}

${(volunteer.highlights ?? []).map((highlight) => `+ ${highlight}`).join('\n')}


`
)}
`;
  }
  if (resume.projects?.length) {
    content += `EDUCATION
============================
${(resume.education ?? []).map(
  (education) => `
${education.startDate} – ${education.endDate || ''}
${education.institution} 
${education.area} - ${education.studyType}

${(education.courses ?? []).map((course) => `+ ${course}`).join('\n')}


`
)}
`;
  }
  if (resume.awards?.length) {
    content += `AWARDS
============================
${(resume.awards ?? []).map(
  (award) => `
${award.title} – ${award.date || ''}
${award.awarder} 

`
)}
`;
  }

  if (resume.certificates?.length) {
    content += `CERTIFICATES
============================
${(resume.certificates ?? []).map(
  (certificate) => `
${certificate.name} – ${certificate.date || ''}
${certificate.issuer} 


`
)}
  `;
  }

  if (resume.publications?.length) {
    content += `
PUBLICATIONS
============================
${(resume.publications ?? []).map(
  (publication) => `
${publication.name} – ${publication.date || ''}
${publication.issuer} 

${publication.summary}


`
)}
`;
  }

  if (resume.skills?.length) {
    content += `
SKILLS
============================
${(resume.skills ?? [])
  .map(
    (skill) => `
${skill.name}
-------------
${(skill.keywords ?? []).map((keyword) => `+ ${keyword}`).join('\n')}
`
  )
  .join('\n')}
`;
  }
  return { content, headers: [] };
};

const exports = { format };

export default exports;
