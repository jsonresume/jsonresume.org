import type { Meta, StoryObj } from '@storybook/react';
import { AccentTopRule } from './AccentTopRule';

const meta = {
  title: 'Primitives/Dividers/AccentTopRule',
  component: AccentTopRule,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccentTopRule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <AccentTopRule />
      <h2>Work Experience</h2>
      <p>Section content below the accent rule</p>
    </div>
  ),
};

export const Centered: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <AccentTopRule align="center" />
      <h2 style={{ textAlign: 'center' }}>Work Experience</h2>
      <p style={{ textAlign: 'center' }}>
        Section content below the centered accent rule
      </p>
    </div>
  ),
};

export const RightAligned: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <AccentTopRule align="right" />
      <h2 style={{ textAlign: 'right' }}>Work Experience</h2>
      <p style={{ textAlign: 'right' }}>
        Section content below the right-aligned accent rule
      </p>
    </div>
  ),
};

export const CustomWidth: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <AccentTopRule width="40%" />
      <h2>Work Experience</h2>
      <p>Section with wider accent rule (40%)</p>
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <AccentTopRule color="#8b5cf6" />
      <h2>Work Experience</h2>
      <p>Section with purple accent rule</p>
    </div>
  ),
};

export const Thicker: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <AccentTopRule thickness="4pt" />
      <h2>Work Experience</h2>
      <p>Section with thicker accent rule (4pt)</p>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <AccentTopRule />
      <h3>Left aligned (default)</h3>

      <div style={{ marginTop: '2rem' }}>
        <AccentTopRule align="center" />
        <h3 style={{ textAlign: 'center' }}>Center aligned</h3>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <AccentTopRule align="right" />
        <h3 style={{ textAlign: 'right' }}>Right aligned</h3>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <AccentTopRule width="40%" color="#8b5cf6" thickness="3pt" />
        <h3>Custom (40% width, purple, 3pt thick)</h3>
      </div>
    </div>
  ),
};
