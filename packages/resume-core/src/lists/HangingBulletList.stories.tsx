import React from 'react';
import { HangingBulletList } from './HangingBulletList';

/**
 * HangingBulletList Stories
 */

const meta = {
  title: 'Resume Core/Lists/HangingBulletList',
  component: HangingBulletList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      'Developed RESTful APIs serving 100K+ requests daily',
      'Implemented real-time data synchronization across distributed systems',
      'Optimized database queries reducing response time by 65%',
      'Built automated testing framework with 90% code coverage',
    ],
    bullet: '•',
  },
};

export const CustomBullet = {
  args: {
    items: [
      'React, TypeScript, Node.js, Python',
      'AWS, Docker, Kubernetes, Terraform',
      'PostgreSQL, MongoDB, Redis',
      'Git, CI/CD, Agile methodologies',
    ],
    bullet: '▸',
  },
};

export const LongContent = {
  args: {
    items: [
      'This is a longer item that demonstrates how the hanging bullet list maintains clean alignment when content wraps to multiple lines, with text remaining flush to the left margin',
      'Short item',
      'Medium length item showing proper text flow and alignment with the hanging bullet technique',
      'Another example of multi-line content that wraps naturally while maintaining the visual hierarchy and clean left edge alignment',
    ],
  },
};
