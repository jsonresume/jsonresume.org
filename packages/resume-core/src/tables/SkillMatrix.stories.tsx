import React from 'react';
/**
 * SkillMatrix Stories
 */
import { SkillMatrix } from './SkillMatrix';

const meta = {
  title: 'Resume Core/Tables/SkillMatrix',
  component: SkillMatrix,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    categories: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    skills: [
      {
        name: 'JavaScript',
        levels: {
          Beginner: null,
          Intermediate: null,
          Advanced: 'advanced',
          Expert: 'expert',
        },
      },
      {
        name: 'Python',
        levels: {
          Beginner: null,
          Intermediate: 'intermediate',
          Advanced: 'advanced',
          Expert: null,
        },
      },
      {
        name: 'React',
        levels: {
          Beginner: null,
          Intermediate: null,
          Advanced: null,
          Expert: 'expert',
        },
      },
      {
        name: 'Node.js',
        levels: {
          Beginner: null,
          Intermediate: null,
          Advanced: 'advanced',
          Expert: null,
        },
      },
    ],
  },
};

export const Example = {
  args: {
    categories: ['Learning', 'Proficient', 'Expert'],
    skills: [
      {
        name: 'TypeScript',
        levels: {
          Learning: null,
          Proficient: null,
          Expert: 'expert',
        },
      },
      {
        name: 'GraphQL',
        levels: {
          Learning: null,
          Proficient: 'advanced',
          Expert: null,
        },
      },
      {
        name: 'Docker',
        levels: {
          Learning: 'intermediate',
          Proficient: null,
          Expert: null,
        },
      },
    ],
  },
};
