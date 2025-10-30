import React from 'react';
import { ListDashCompact } from './ListDashCompact';

/**
 * ListDashCompact Stories
 */

const meta = {
  title: 'Resume Core/Lists/ListDashCompact',
  component: ListDashCompact,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      'JavaScript, TypeScript, Python',
      'React, Vue.js, Angular',
      'Node.js, Express, Django',
      'PostgreSQL, MongoDB, Redis',
    ],
  },
};

export const MinimalStyle = {
  args: {
    items: [
      'Bachelor of Science in Computer Science',
      'Certified AWS Solutions Architect',
      'Google Cloud Professional',
      'Scrum Master Certification',
    ],
  },
};

export const MixedLength = {
  args: {
    items: [
      'Short',
      'This is a longer item that demonstrates how the compact dash list handles multi-line content',
      'Medium length item',
      'Another concise entry',
    ],
  },
};

export const CustomColor = {
  args: {
    items: [
      'Team leadership and mentorship',
      'Agile project management',
      'Technical documentation',
      'Stakeholder communication',
    ],
    color: '#666',
  },
};
