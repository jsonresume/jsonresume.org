const YAML = require('json-to-pretty-yaml');

const networks = {
  facebook: 'Facebook',
  github: 'GitHub',
  gitlab: 'GitLab',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  medium: 'Medium',
  stackoverflow: 'StackOverflow',
  twitter: 'Twitter',
  youtube: 'YouTube',
};

const format = async function format(jsonResume) {
  const renderCV = {
    cv: {
      name: jsonResume.basics.name,
      location: jsonResume.basics.location
        ? jsonResume.basics.location.city +
          ', ' +
          jsonResume.basics.location.region
        : '',
      email: jsonResume.basics.email,
      phone: jsonResume.basics.phone,
      website: jsonResume.basics.website,
      social_networks: jsonResume.basics.profiles?.map((profile) => ({
        network: networks[profile.network],
        username: profile.username,
      })),
      sections: {
        summary: [jsonResume.basics.summary],
        education: jsonResume.education?.map((edu) => ({
          institution: edu.institution,
          area: edu.area,
          degree: edu.studyType,
          start_date: edu.startDate,
          end_date: edu.endDate,
          highlights: edu.courses || [],
        })),
        experience: jsonResume.work?.map((work) => ({
          company: work.name,
          position: work.position,
          location: work.location,
          start_date: work.startDate,
          end_date: work.endDate,
          highlights: work.highlights || [],
        })),
        publications: jsonResume.publications?.map((pub) => ({
          title: pub.name,
          authors: pub.authors,
          doi: pub.doi,
          date: pub.releaseDate,
        })),
        projects: jsonResume.projects?.map((proj) => ({
          name: proj.name,
          date: proj.startDate || '',
          highlights: proj.description ? [proj.description] : [],
        })),
        additional_experience_and_awards: jsonResume.awards?.map((award) => ({
          label: award.title,
          details: award.awarder,
        })),
        technologies: [
          {
            label: 'Languages',
            details:
              jsonResume.skills
                .find((skill) => skill.name === 'Languages')
                ?.keywords.join(', ') || '',
          },
          {
            label: 'Software',
            details:
              jsonResume.skills
                .find((skill) => skill.name === 'Software')
                ?.keywords.join(', ') || '',
          },
        ],
      },
    },
  };
  const content = YAML.stringify(renderCV);

  return { content, headers: [] };
};

const exports = { format };

export default exports;
