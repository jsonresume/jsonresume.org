import React from 'react';
/**
 * ContactGrid Stories
 */
import { ContactGrid } from './ContactGrid';

const meta = {
  title: 'Resume Core/Profile/ContactGrid',
  component: ContactGrid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      { icon: '📧', label: 'Email', value: 'sarah.johnson@example.com' },
      { icon: '📱', label: 'Phone', value: '(555) 123-4567' },
      { icon: '📍', label: 'Location', value: 'San Francisco, CA' },
    ],
  },
};

export const Example = {
  args: {
    items: [
      { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/sarahjohnson' },
      { icon: '🐙', label: 'GitHub', value: 'github.com/sarahjohnson' },
    ],
  },
};
