import type { Meta, StoryObj } from '@storybook/react';
import { LetterheadBar } from './LetterheadBar';

const meta = {
  title: 'Print/LetterheadBar',
  component: LetterheadBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Thin top bar across entire page with name. Reserves top margin for printer unprintable area. Appears as a fixed bar in print mode.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Full name to display prominently',
    },
    tagline: {
      control: 'text',
      description: 'Optional tagline or subtitle',
    },
    includeSpacer: {
      control: 'boolean',
      description: 'Add spacer to prevent content overlap',
    },
  },
} satisfies Meta<typeof LetterheadBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'John Doe',
    includeSpacer: true,
  },
  render: (args) => (
    <div>
      <LetterheadBar {...args} />
      <div style={{ padding: '2rem' }}>
        <h1>Resume Content</h1>
        <p>
          The letterhead bar appears at the top of the page, reserving space for
          printer margins.
        </p>
        <p>
          In print mode, it becomes fixed and accounts for the typical 0.25in
          unprintable area at the top of pages.
        </p>
      </div>
    </div>
  ),
};

export const WithTagline: Story = {
  args: {
    name: 'Jane Smith',
    tagline: 'Senior Product Designer',
    includeSpacer: true,
  },
  render: (args) => (
    <div>
      <LetterheadBar {...args} />
      <div style={{ padding: '2rem' }}>
        <h1>Professional Experience</h1>
        <p>Letterhead with name and professional tagline.</p>
      </div>
    </div>
  ),
};

export const WithCustomContent: Story = {
  args: {
    name: 'Alex Chen',
    includeSpacer: true,
  },
  render: (args) => (
    <div>
      <LetterheadBar {...args}>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
          <span>alex@example.com</span>
          <span>|</span>
          <span>555-0123</span>
        </div>
      </LetterheadBar>
      <div style={{ padding: '2rem' }}>
        <h1>Resume Content</h1>
        <p>Letterhead with custom contact information.</p>
      </div>
    </div>
  ),
};

export const WithoutSpacer: Story = {
  args: {
    name: 'Sarah Williams',
    tagline: 'Full Stack Developer',
    includeSpacer: false,
  },
  render: (args) => (
    <div>
      <LetterheadBar {...args} />
      <div style={{ padding: '2rem' }}>
        <h1>Resume Content (No Spacer)</h1>
        <p>
          Without the spacer, content will start immediately after the
          letterhead bar.
        </p>
        <p>
          This can be useful if you want to manually control spacing or have a
          custom layout.
        </p>
      </div>
    </div>
  ),
};

export const MinimalStyle: Story = {
  args: {
    name: 'Michael Brown',
    includeSpacer: true,
  },
  render: (args) => (
    <div>
      <LetterheadBar {...args} />
      <div style={{ padding: '2rem' }}>
        <h1>Minimal Letterhead</h1>
        <p>Simple name-only letterhead for clean, professional look.</p>
        {Array.from({ length: 10 }, (_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        ))}
      </div>
    </div>
  ),
};
