import React from 'react';
/**
 * BulletList Stories
 */
import { BulletList } from './BulletList';

const meta = {
  title: 'Resume Core/Lists/BulletList',
  component: BulletList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      'Led development of cloud-native microservices architecture',
      'Mentored 5 junior developers and conducted code reviews',
      'Improved system performance by 300% through optimization',
      'Established CI/CD pipeline reducing deployment time by 60%',
    ],
    bullet: '•',
  },
};

export const Example = {
  args: {
    items: [
      'React, TypeScript, Node.js expertise',
      'AWS cloud infrastructure management',
      'Agile/Scrum methodologies',
      'Technical leadership and mentorship',
    ],
    bullet: '→',
  },
};
