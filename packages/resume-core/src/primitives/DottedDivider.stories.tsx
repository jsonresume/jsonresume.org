import type { Meta, StoryObj } from '@storybook/react';
import { DottedDivider } from './DottedDivider';

const meta = {
  title: 'Primitives/Dividers/DottedDivider',
  component: DottedDivider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DottedDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomColor: Story = {
  args: {
    color: '#94a3b8',
  },
};

export const SparseSpacing: Story = {
  args: {
    spacing: '8px',
  },
};

export const LargerDots: Story = {
  args: {
    dotSize: '3px',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <p>Default dotted divider</p>
      <DottedDivider />

      <p>Custom color (slate)</p>
      <DottedDivider color="#94a3b8" />

      <p>Sparse spacing (8px)</p>
      <DottedDivider spacing="8px" />

      <p>Larger dots (3px)</p>
      <DottedDivider dotSize="3px" />
    </div>
  ),
};
