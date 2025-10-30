import React from 'react';
/**
 * ProfileCard Stories
 */
import { ProfileCard } from './ProfileCard';

const meta = {
  title: 'Resume Core/Profile/ProfileCard',
  component: ProfileCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    image: 'https://i.pravatar.cc/150?img=1',
    summary:
      'Experienced software engineer with 8+ years building scalable web applications.',
  },
};

export const Example = {
  args: {
    name: 'Michael Chen',
    title: 'Product Manager',
    image: 'https://i.pravatar.cc/150?img=12',
    location: 'San Francisco, CA',
    summary:
      'Product leader focused on user-centric design and data-driven decisions.',
  },
};
