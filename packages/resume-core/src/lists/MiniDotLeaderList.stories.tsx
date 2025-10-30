import React from 'react';
import { MiniDotLeaderList } from './MiniDotLeaderList';

/**
 * MiniDotLeaderList Stories
 */

const meta = {
  title: 'Resume Core/Lists/MiniDotLeaderList',
  component: MiniDotLeaderList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS'],
  },
};

export const Skills = {
  args: {
    items: [
      'Team Leadership',
      'Agile/Scrum',
      'Code Review',
      'Mentorship',
      'Technical Writing',
      'Public Speaking',
    ],
  },
};

export const CustomColor = {
  args: {
    items: [
      'Bachelor of Science',
      'Computer Science',
      'Stanford University',
      '2018',
    ],
    color: '#0066cc',
  },
};

export const LongList = {
  args: {
    items: [
      'React',
      'Vue.js',
      'Angular',
      'Svelte',
      'Next.js',
      'Nuxt',
      'Gatsby',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Express',
      'Fastify',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'Docker',
      'Kubernetes',
      'AWS',
      'Azure',
      'GCP',
    ],
  },
};
