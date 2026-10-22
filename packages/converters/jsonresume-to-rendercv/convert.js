import YAML from 'json-to-pretty-yaml';
import { toSocialNetworks } from './networks.js';

export const convert = async function format(jsonResume) {
  const renderCV = {
    cv: {
      name: jsonResume.basics.name,
      location: [
        jsonResume.basics.location?.city,
        jsonResume.basics.location?.countryCode,
      ]
        .filter(Boolean)
        .join(', '),
      email: jsonResume.basics.email,
      // RenderCV only accepts international numbers (+<country code> ...);
      // the country can't be guessed from a local number, so drop those.
      phone: /^\+\d/.test(jsonResume.basics.phone?.trim() ?? '')
        ? jsonResume.basics.phone.trim()
        : undefined,
      website: jsonResume.basics.url,
      social_networks: toSocialNetworks(jsonResume.basics.profiles),
      sections: {
        summary: jsonResume.basics.summary
          ? [jsonResume.basics.summary]
          : undefined,
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
        // JSON Resume publications have no authors field, but RenderCV
        // requires a list; they are the resume owner's work.
        publications: jsonResume.publications?.map((pub) => ({
          title: pub.name,
          authors: jsonResume.basics.name ? [jsonResume.basics.name] : [],
          journal: pub.publisher,
          url: pub.url,
          date: pub.releaseDate,
          summary: pub.summary,
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
                ?.find((skill) => skill.name === 'Languages')
                ?.keywords.join(', ') || '',
          },
          {
            label: 'Software',
            details:
              jsonResume.skills
                ?.find((skill) => skill.name === 'Software')
                ?.keywords.join(', ') || '',
          },
        ],
      },
    },
  };
  const content = YAML.stringify(renderCV);

  return content;
};
