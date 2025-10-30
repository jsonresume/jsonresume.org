import React from 'react';
/**
 * Label Stories
 */
import { Label } from './Label';

const meta = {
  title: 'Resume Core/Typography/Label',
  component: Label,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'Label Text',
  },
};
export const Uppercase: Story = {
  args: { uppercase: true, children: 'Uppercase Label' },
};
export const CustomColor: Story = {
  args: { color: '#007bff', children: 'Colored Label' },
};
export const Bold: Story = { args: { weight: 'bold', children: 'Bold Label' } };
