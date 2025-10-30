import React from 'react';
/**
 * PortfolioGrid Stories
 */
import { PortfolioGrid } from './PortfolioGrid';

const meta = {
  title: 'Resume Core/Publications/PortfolioGrid',
  component: PortfolioGrid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      {
        title: 'E-Commerce Platform',
        image: 'https://placehold.co/400x300',
        url: '#',
      },
      {
        title: 'Analytics Dashboard',
        image: 'https://placehold.co/400x300',
        url: '#',
      },
      { title: 'Mobile App', image: 'https://placehold.co/400x300', url: '#' },
      {
        title: 'Design System',
        image: 'https://placehold.co/400x300',
        url: '#',
      },
    ],
  },
};

export const Example = {
  args: {
    items: [
      {
        title: 'Project Alpha',
        image: 'https://placehold.co/400x300',
        url: '#',
        tags: ['React', 'AWS'],
      },
      {
        title: 'Project Beta',
        image: 'https://placehold.co/400x300',
        url: '#',
        tags: ['Vue', 'Firebase'],
      },
      {
        title: 'Project Gamma',
        image: 'https://placehold.co/400x300',
        url: '#',
        tags: ['Angular', 'GCP'],
      },
    ],
  },
};
