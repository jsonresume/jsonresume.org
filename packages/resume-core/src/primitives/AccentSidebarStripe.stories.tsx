import type { Meta, StoryObj } from '@storybook/react';
import { AccentSidebarStripe } from './AccentSidebarStripe';

const meta = {
  title: 'Primitives/Dividers/AccentSidebarStripe',
  component: AccentSidebarStripe,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccentSidebarStripe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ position: 'relative', minHeight: '300px', padding: '2rem' }}>
      <AccentSidebarStripe />
      <h2>Section Title</h2>
      <p>Content with left accent stripe</p>
    </div>
  ),
};

export const RightAligned: Story = {
  render: () => (
    <div style={{ position: 'relative', minHeight: '300px', padding: '2rem' }}>
      <AccentSidebarStripe position="right" />
      <h2>Section Title</h2>
      <p>Content with right accent stripe</p>
    </div>
  ),
};

export const CustomWidth: Story = {
  render: () => (
    <div style={{ position: 'relative', minHeight: '300px', padding: '2rem' }}>
      <AccentSidebarStripe width="6mm" />
      <h2>Section Title</h2>
      <p>Content with wider accent stripe (6mm)</p>
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div style={{ position: 'relative', minHeight: '300px', padding: '2rem' }}>
      <AccentSidebarStripe color="#8b5cf6" />
      <h2>Section Title</h2>
      <p>Content with purple accent stripe</p>
    </div>
  ),
};

export const PartialHeight: Story = {
  render: () => (
    <div style={{ position: 'relative', minHeight: '300px', padding: '2rem' }}>
      <AccentSidebarStripe height="150px" top="1rem" />
      <h2>Section Title</h2>
      <p>Content with partial-height accent stripe</p>
      <p>The stripe doesn't extend the full height</p>
    </div>
  ),
};
