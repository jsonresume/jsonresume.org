import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InlineSeparatorPipe } from './InlineSeparatorPipe';

const meta: Meta<typeof InlineSeparatorPipe> = {
  title: 'Primitives/InlineSeparatorPipe',
  component: InlineSeparatorPipe,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Vertical pipe separator for inline metadata with thin space padding. Uses Unicode thin space (U+2009) for optimal spacing without crowding.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InlineSeparatorPipe>;

export const Default: Story = {
  render: () => (
    <div>
      <span>Remote</span>
      <InlineSeparatorPipe />
      <span>Full-time</span>
      <InlineSeparatorPipe />
      <span>$100k-$150k</span>
    </div>
  ),
};

export const LocationAndDate: Story = {
  render: () => (
    <div>
      <span>San Francisco, CA</span>
      <InlineSeparatorPipe />
      <span>Jan 2020 - Present</span>
      <InlineSeparatorPipe />
      <span>3 years</span>
    </div>
  ),
};

export const JobMetadata: Story = {
  render: () => (
    <div style={{ fontSize: '14px', color: '#666' }}>
      <span>Senior Engineer</span>
      <InlineSeparatorPipe />
      <span>Tech Corp</span>
      <InlineSeparatorPipe />
      <span>Remote</span>
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div>
      <span>Item A</span>
      <InlineSeparatorPipe color="#0066cc" />
      <span>Item B</span>
      <InlineSeparatorPipe color="#0066cc" />
      <span>Item C</span>
    </div>
  ),
};

export const InParagraph: Story = {
  render: () => (
    <p style={{ maxWidth: '600px' }}>
      Led a cross-functional team of 8 engineers
      <InlineSeparatorPipe />
      Delivered 5 major features on time
      <InlineSeparatorPipe />
      Increased system performance by 40%
      <InlineSeparatorPipe />
      Mentored 3 junior developers to senior level.
    </p>
  ),
};

export const CompactMetadata: Story = {
  render: () => (
    <div style={{ fontSize: '12px', color: '#888' }}>
      <span>Published</span>
      <InlineSeparatorPipe />
      <span>Mar 2023</span>
      <InlineSeparatorPipe />
      <span>IEEE</span>
      <InlineSeparatorPipe />
      <span>DOI: 10.1109/example</span>
    </div>
  ),
};
