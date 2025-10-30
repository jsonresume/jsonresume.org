import React from 'react';
import { HeaderSplit } from './HeaderSplit';

const meta = {
  title: 'Resume Core/Header/HeaderSplit',
  component: HeaderSplit,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
  },
};

export const WithContacts = {
  args: {},
};

export const WithTitle = {
  args: {},
};
