import React from 'react';
/**
 * HeaderMinimal Stories
 */
import { HeaderMinimal } from './HeaderMinimal';

const meta = {
  title: 'Resume Core/Header/HeaderMinimal',
  component: HeaderMinimal,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
  },
};

export const Example = {
  args: {
    name: 'Michael Chen',
    title: 'Product Manager',
    email: 'michael.chen@example.com',
  },
};
