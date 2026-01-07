// Sample resume for anonymous users to start with
export const SAMPLE_RESUME = {
  basics: {
    name: 'Jane Doe',
    label: 'Full-Stack Developer',
    email: 'jane.doe@example.com',
    phone: '+1-555-0123',
    url: 'https://janedoe.dev',
    location: { city: 'San Francisco', region: 'CA', countryCode: 'US' },
    summary:
      'Experienced full-stack developer with 5+ years building scalable web applications.',
    profiles: [
      {
        network: 'GitHub',
        username: 'janedoe',
        url: 'https://github.com/janedoe',
      },
      {
        network: 'LinkedIn',
        username: 'janedoe',
        url: 'https://linkedin.com/in/janedoe',
      },
    ],
  },
  work: [
    {
      name: 'Tech Solutions Inc.',
      position: 'Senior Software Engineer',
      startDate: '2022-03-01',
      summary: 'Lead development of microservices architecture.',
      highlights: [
        'Architected microservices reducing response time by 40%',
        'Led migration to containerized architecture',
      ],
    },
    {
      name: 'StartupCo',
      position: 'Full-Stack Developer',
      startDate: '2020-01-01',
      endDate: '2022-02-01',
      summary: 'Built features for B2B SaaS platform.',
      highlights: [
        'Developed real-time collaboration features',
        'Improved application performance by 60%',
      ],
    },
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      area: 'Computer Science',
      studyType: 'Bachelor',
      startDate: '2016-09-01',
      endDate: '2020-05-01',
    },
  ],
  skills: [
    {
      name: 'JavaScript',
      level: 'Expert',
      keywords: ['TypeScript', 'React', 'Node.js'],
    },
    {
      name: 'Backend',
      level: 'Advanced',
      keywords: ['Python', 'PostgreSQL', 'Docker'],
    },
  ],
};
