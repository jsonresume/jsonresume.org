import React from 'react';
/**
 * AwardCard Stories
 */
import { AwardCard } from './AwardCard';

const meta = {
  title: 'Resume Core/Certifications/AwardCard',
  component: AwardCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    title: 'Excellence in Engineering Award',
    organization: 'Tech Corp',
    date: '2023',
  },
};

export const Example = {
  args: {
    title: 'Innovation Award',
    organization: 'Innovation Labs',
    date: '2022',
    description:
      'Recognized for developing breakthrough performance optimization',
  },
};
