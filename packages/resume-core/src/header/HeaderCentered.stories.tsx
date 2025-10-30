import React from 'react';
import { HeaderCentered } from './HeaderCentered';

const meta = {
  title: 'Resume Core/Header/HeaderCentered',
  component: HeaderCentered,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    contact: [
      { icon: '📧', text: 'sarah.johnson@example.com' },
      { icon: '📱', text: '(555) 123-4567' },
    ],
  },
};

export const WithContacts = {
  args: {},
};

export const WithTitle = {
  args: {},
};
