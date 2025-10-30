import React from 'react';
/**
 * Flex Stories
 */
import { Flex } from './Flex';

const meta = {
  title: 'Resume Core/Utils/Flex',
  component: Flex,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'Flex container content',
  },
};

export const Example = {
  args: {
    direction: 'column',
    gap: 'medium',
    children: 'Vertical flex layout',
  },
};
