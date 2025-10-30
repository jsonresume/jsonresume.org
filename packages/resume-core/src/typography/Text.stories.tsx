import React from 'react';
/**
 * Text Stories
 */
import { Text } from './Text';

const meta = {
  title: 'Resume Core/Typography/Text',
  component: Text,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

const longText =
  'Experienced software engineer with 8+ years building scalable web applications. Specialized in React, Node.js, and cloud technologies. Passionate about mentoring and open source.';

export const Default = {
  args: {
    children: 'Body text content',
  },
};
export const CustomSize: Story = {
  args: { size: '18px', children: 'Larger text for emphasis' },
};
export const CustomColor: Story = {
  args: { color: '#666', children: 'Secondary color text' },
};
export const Bold: Story = {
  args: { weight: 'bold', children: 'Bold emphasized text' },
};
export const CustomLineHeight: Story = {
  args: { lineHeight: '1.8', children: longText },
};
