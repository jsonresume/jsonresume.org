import React from 'react';
/**
 * Avatar Stories
 */
import { Avatar } from './Avatar';

const meta = {
  title: 'Resume Core/Profile/Avatar',
  component: Avatar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'text' },
    rounded: { control: 'boolean' },
    border: { control: 'boolean' },
  },
};

export default meta;

export const WithImage = {
  args: {
    src: 'https://i.pravatar.cc/150?img=12',
    alt: 'John Doe',
    size: '80px',
    rounded: true,
  },
};

export const Placeholder = {
  args: {
    alt: 'John Doe',
    size: '80px',
    rounded: true,
  },
};

export const Large = {
  args: {
    src: 'https://i.pravatar.cc/150?img=33',
    alt: 'Jane Smith',
    size: '120px',
    rounded: true,
  },
};

export const Small = {
  args: {
    src: 'https://i.pravatar.cc/150?img=45',
    alt: 'Alex Johnson',
    size: '40px',
    rounded: true,
  },
};

export const Square = {
  args: {
    src: 'https://i.pravatar.cc/150?img=56',
    alt: 'Mike Wilson',
    size: '80px',
    rounded: false,
  },
};

export const WithBorder = {
  args: {
    src: 'https://i.pravatar.cc/150?img=68',
    alt: 'Sarah Davis',
    size: '80px',
    rounded: true,
    border: true,
  },
};

export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar src="https://i.pravatar.cc/150?img=12" alt="Small" size="40px" />
      <Avatar src="https://i.pravatar.cc/150?img=12" alt="Medium" size="60px" />
      <Avatar src="https://i.pravatar.cc/150?img=12" alt="Large" size="80px" />
      <Avatar src="https://i.pravatar.cc/150?img=12" alt="XL" size="120px" />
    </div>
  ),
};
