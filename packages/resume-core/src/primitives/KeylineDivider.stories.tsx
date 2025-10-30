import type { Meta, StoryObj } from '@storybook/react';
import { KeylineDivider } from './KeylineDivider';

const meta = {
  title: 'Primitives/Dividers/KeylineDivider',
  component: KeylineDivider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof KeylineDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithInset: Story = {
  args: {
    inset: '2rem',
  },
};

export const CustomColor: Story = {
  args: {
    color: '#94a3b8',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <p>Full width keyline</p>
      <KeylineDivider />

      <p>With 1rem inset</p>
      <KeylineDivider inset="1rem" />

      <p>With 2rem inset</p>
      <KeylineDivider inset="2rem" />

      <p>Custom color (slate)</p>
      <KeylineDivider color="#94a3b8" />
    </div>
  ),
};
