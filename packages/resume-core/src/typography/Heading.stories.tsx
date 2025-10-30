import React from 'react';
/**
 * Heading Stories
 */
import { Heading } from './Heading';

const meta = {
  title: 'Resume Core/Typography/Heading',
  component: Heading,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    level: { control: { type: 'range', min: 1, max: 4, step: 1 } },
    weight: { control: 'text' },
    color: { control: 'color' },
  },
};

export default meta;

export const Level1: Story = {
  args: { level: 1, children: 'John Doe - Level 1 Heading' },
};
export const Level2: Story = {
  args: { level: 2, children: 'Work Experience - Level 2 Heading' },
};
export const Level3: Story = {
  args: { level: 3, children: 'Senior Software Engineer - Level 3' },
};
export const Level4: Story = {
  args: { level: 4, children: 'Additional Details - Level 4' },
};
export const CustomColor: Story = {
  args: { level: 2, color: '#007bff', children: 'Colored Heading' },
};

export const AllLevels = {
  render: () => (
    <div>
      <Heading level={1}>Level 1: John Doe</Heading>
      <Heading level={2}>Level 2: Work Experience</Heading>
      <Heading level={3}>Level 3: Senior Software Engineer</Heading>
      <Heading level={4}>Level 4: Project Details</Heading>
    </div>
  ),
};
