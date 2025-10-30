import React from 'react';
/**
 * ContactInfo Stories
 */
import { ContactInfo } from './ContactInfo';

const meta = {
  title: 'Resume Core/Primitives/ContactInfo',
  component: ContactInfo,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
  },
};

export const Example = {
  args: {
    email: 'michael.chen@example.com',
    url: 'https://michaelchen.com',
    linkedin: 'linkedin.com/in/michaelchen',
  },
};
