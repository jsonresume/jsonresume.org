import React from 'react';
import { AchievementListTight } from './AchievementListTight';

/**
 * AchievementListTight Stories
 */

const meta = {
  title: 'Resume Core/Lists/AchievementListTight',
  component: AchievementListTight,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      'Increased system performance by 300% through code optimization',
      'Led team of 5 engineers to deliver project 2 weeks ahead of schedule',
      'Reduced cloud costs by $50K annually through infrastructure redesign',
      'Achieved 99.99% uptime across all production services',
    ],
    bullet: '•',
  },
};

export const CustomBullet = {
  args: {
    items: [
      'Shipped 15 major features with zero production incidents',
      'Mentored 3 junior developers resulting in 2 promotions',
      'Built CI/CD pipeline reducing deployment time from 2 hours to 5 minutes',
    ],
    bullet: '▸',
  },
};

export const LongContent = {
  args: {
    items: [
      'This is a very long achievement that demonstrates the 2-3 line maximum enforcement with ellipsis overflow handling for achievements that exceed the maximum height constraint',
      'Architected and deployed microservices platform serving 1M+ daily active users with 99.99% SLA',
      'Short achievement',
      'Medium length achievement showing how text wraps naturally within the tight spacing constraints',
    ],
  },
};
