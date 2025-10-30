import React from 'react';
import { ContactRowLine } from './ContactRowLine';

const meta = {
  title: 'Resume Core/Header/ContactRowLine',
  component: ContactRowLine,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      { text: 'jane.smith@example.com', href: 'mailto:jane.smith@example.com' },
      { text: '(555) 123-4567', href: 'tel:+15551234567' },
      { text: 'San Francisco, CA' },
    ],
  },
};

export const WithLinks = {
  args: {
    items: [
      { text: 'john.doe@example.com', href: 'mailto:john.doe@example.com' },
      {
        text: 'linkedin.com/in/johndoe',
        href: 'https://linkedin.com/in/johndoe',
      },
      { text: 'github.com/johndoe', href: 'https://github.com/johndoe' },
    ],
  },
};

export const Minimal = {
  args: {
    items: [
      { text: 'alex@example.com', href: 'mailto:alex@example.com' },
      { text: 'New York, NY' },
    ],
  },
};

export const CustomSeparator = {
  args: {
    items: [
      { text: 'contact@example.com' },
      { text: '(555) 987-6543' },
      { text: 'Boston, MA' },
    ],
    separator: '|',
  },
};

export const SingleItem = {
  args: {
    items: [
      {
        text: 'singlecontact@example.com',
        href: 'mailto:singlecontact@example.com',
      },
    ],
  },
};
