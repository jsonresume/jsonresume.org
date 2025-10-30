import React from 'react';
/**
 * Testimonial Stories
 */
import { Testimonial } from './Testimonial';

const meta = {
  title: 'Resume Core/Quotes/Testimonial',
  component: Testimonial,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    quote:
      'Sarah is an exceptional engineer who consistently delivers high-quality work. Her technical expertise and problem-solving abilities are outstanding.',
    author: 'Michael Chen',
    position: 'CTO',
    company: 'Tech Corp',
    photo: 'https://i.pravatar.cc/150?img=12',
  },
};

export const Example = {
  args: {
    quote:
      "One of the best developers I've had the pleasure of working with. Sarah's leadership and mentorship have been invaluable to our team's growth.",
    author: 'Jennifer Martinez',
    position: 'VP of Engineering',
    company: 'Innovation Labs',
    photo: 'https://i.pravatar.cc/150?img=5',
  },
};
