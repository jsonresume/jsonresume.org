import type { Meta, StoryObj } from '@storybook/react';
import { QuoteStripe } from './QuoteStripe.jsx';

const meta: Meta<typeof QuoteStripe> = {
  title: 'Typography/QuoteStripe',
  component: QuoteStripe,
  tags: ['autodocs'],
  argTypes: {
    accentColor: { control: 'color' },
    borderWidth: { control: 'text' },
    fontStyle: {
      control: 'select',
      options: ['italic', 'normal'],
    },
    paddingLeft: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof QuoteStripe>;

export const Default: Story = {
  args: {
    children: '"Exceptional problem solver with keen attention to detail"',
  },
};

export const WithoutQuotes: Story = {
  args: {
    children: 'Leadership excellence in cross-functional teams',
  },
};

export const CustomAccentColor: Story = {
  args: {
    children: '"Innovative thinker who drives transformational change"',
    accentColor: '#8b5cf6',
  },
};

export const ThickBorder: Story = {
  args: {
    children: '"Technical expertise combined with business acumen"',
    borderWidth: '5px',
    accentColor: '#2563eb',
  },
};

export const NormalFontStyle: Story = {
  args: {
    children:
      'Strategic leader with proven track record in scaling organizations',
    fontStyle: 'normal',
  },
};

export const MinimalStyle: Story = {
  args: {
    children: 'Passionate about creating accessible, user-centered experiences',
    accentColor: '#000',
    borderWidth: '2px',
  },
};
