import React from 'react';
/**
 * Link Stories
 */
import { Link } from './Link';

const meta = {
  title: 'Resume Core/Primitives/Link',
  component: Link,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    href: 'https://example.com',
    children: 'Visit website',
  },
};

export const Example = {
  args: {
    href: 'https://github.com/username',
    children: 'GitHub Profile',
    external: true,
  },
};
