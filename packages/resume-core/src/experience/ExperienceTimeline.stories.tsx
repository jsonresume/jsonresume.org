import React from 'react';
/**
 * ExperienceTimeline Stories
 */
import { ExperienceTimeline } from './ExperienceTimeline';

const meta = {
  title: 'Resume Core/Experience/ExperienceTimeline',
  component: ExperienceTimeline,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    experiences: [
      {
        position: 'Senior Software Engineer',
        company: 'Tech Corp',
        date: '2020 - Present',
        summary:
          'Led development of cloud-native microservices architecture serving 1M+ daily active users.',
      },
      {
        position: 'Software Engineer',
        company: 'Innovation Labs',
        date: '2018 - 2020',
        summary:
          'Built scalable APIs and contributed to open source projects. Improved deployment pipeline reducing release time by 60%.',
      },
      {
        position: 'Junior Developer',
        company: 'WebDev Agency',
        date: '2016 - 2018',
        summary:
          'Developed responsive websites for clients using React and Node.js. Collaborated with design team on UI/UX improvements.',
      },
    ],
  },
};

export const Example = {
  args: {
    experiences: [
      {
        position: 'Product Manager',
        company: 'StartupXYZ',
        date: 'Jan 2022 - Present',
        summary:
          'Defined product strategy and roadmap for B2B SaaS platform. Launched 3 major features increasing user engagement by 45%.',
      },
      {
        position: 'Product Owner',
        company: 'Enterprise Corp',
        date: '2019 - 2021',
        summary:
          'Managed agile development team of 8 engineers. Prioritized backlog and collaborated with stakeholders on feature requirements.',
      },
    ],
  },
};
