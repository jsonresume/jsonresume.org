import type { Meta, StoryObj } from '@storybook/react';
import { CornerInitials } from './CornerInitials';

const meta = {
  title: 'Header/CornerInitials',
  component: CornerInitials,
  tags: ['autodocs'],
} satisfies Meta<typeof CornerInitials>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'John Smith',
    position: 'relative',
  },
};

export const CustomInitials: Story = {
  args: {
    initials: 'JQ',
    position: 'relative',
  },
};

export const Outline: Story = {
  args: {
    name: 'Jane Doe',
    outline: true,
    position: 'relative',
  },
};

export const OutlineSerif: Story = {
  args: {
    name: 'Alex Johnson',
    outline: true,
    serif: true,
    position: 'relative',
  },
};

export const Bordered: Story = {
  args: {
    name: 'Maria Garcia',
    bordered: true,
    position: 'relative',
  },
};

export const BorderedRounded: Story = {
  args: {
    name: 'Robert Chen',
    bordered: true,
    rounded: true,
    position: 'relative',
  },
};

export const LargeSize: Story = {
  args: {
    name: 'Sarah Williams',
    size: '80px',
    bordered: true,
    rounded: true,
    position: 'relative',
  },
};

export const CustomColor: Story = {
  args: {
    name: 'David Brown',
    color: '#0066cc',
    bordered: true,
    position: 'relative',
  },
};

export const ThreeInitials: Story = {
  args: {
    name: 'John Patrick Smith',
    bordered: true,
    rounded: true,
    position: 'relative',
  },
};

export const InCorner: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '300px',
        border: '2px solid #ddd',
        padding: '20px',
      }}
    >
      <CornerInitials name="Jessica Taylor" corner="top-right" />
      <h1 style={{ marginTop: '60px' }}>Resume Content</h1>
      <p>
        The initials appear in the top-right corner when position is absolute.
      </p>
    </div>
  ),
};

export const AllCorners: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        border: '2px solid #ddd',
      }}
    >
      <CornerInitials name="Top Left" corner="top-left" size="40px" />
      <CornerInitials name="Top Right" corner="top-right" size="40px" />
      <CornerInitials name="Bottom Left" corner="bottom-left" size="40px" />
      <CornerInitials name="Bottom Right" corner="bottom-right" size="40px" />
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Resume Header</h2>
        <p>Content area with initials in all four corners</p>
      </div>
    </div>
  ),
};
