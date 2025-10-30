import React from 'react';
/**
 * ComparisonTable Stories
 */
import { ComparisonTable } from './ComparisonTable';

const meta = {
  title: 'Resume Core/Tables/ComparisonTable',
  component: ComparisonTable,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    headers: ['Skill', 'Previous Role', 'Current Role'],
    rows: [
      ['Team Leadership', '5 people', '12 people'],
      ['Budget Management', '$500K', '$2M'],
      ['Project Scope', 'Single Product', 'Multiple Products'],
      ['Tech Stack', 'React, Node.js', 'React, Node.js, Python, AWS'],
    ],
    firstColumnLabel: true,
  },
};

export const Example = {
  args: {
    headers: ['Category', 'Basic', 'Professional', 'Enterprise'],
    rows: [
      ['Price', '$0/month', '$29/month', '$99/month'],
      ['Users', '1', '10', 'Unlimited'],
      ['Storage', '1GB', '100GB', '1TB'],
      ['Support', 'Email', 'Priority Email', '24/7 Phone'],
    ],
    firstColumnLabel: true,
    align: 'center',
  },
};
