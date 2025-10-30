import React from 'react';
/**
 * IconList Stories
 */
import { IconList } from './IconList';

const meta = {
  title: 'Resume Core/Lists/IconList',
  component: IconList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      { text: 'Email: sarah.johnson@example.com', icon: '📧' },
      { text: 'Phone: (555) 123-4567', icon: '📱' },
      { text: 'Location: San Francisco, CA', icon: '📍' },
      { text: 'LinkedIn: linkedin.com/in/sarahjohnson', icon: '💼' },
    ],
  },
};

export const Example = {
  args: {
    items: [
      { text: 'Led team of 12 engineers', icon: '👥' },
      { text: 'Shipped 15+ major features', icon: '🚀' },
      { text: 'Reduced costs by 40%', icon: '💰' },
      { text: 'Improved performance 3x', icon: '⚡' },
    ],
  },
};
