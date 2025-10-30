import type { Meta, StoryObj } from '@storybook/react';
import { LanguageLevelBarLite } from './LanguageLevelBarLite';

const meta = {
  title: 'Languages/LanguageLevelBarLite',
  component: LanguageLevelBarLite,
  tags: ['autodocs'],
} satisfies Meta<typeof LanguageLevelBarLite>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Native: Story = {
  args: {
    language: 'English',
    fluency: 'Native',
  },
};

export const Professional: Story = {
  args: {
    language: 'Spanish',
    fluency: 'Professional',
  },
};

export const Intermediate: Story = {
  args: {
    language: 'French',
    fluency: 'Intermediate',
  },
};

export const Beginner: Story = {
  args: {
    language: 'Japanese',
    fluency: 'Beginner',
  },
};

export const WithPercentage: Story = {
  args: {
    language: 'German',
    fluency: 75,
  },
};

export const WithoutLabel: Story = {
  args: {
    language: 'Italian',
    fluency: 'Professional',
    showLabel: false,
  },
};

export const DirectSegments: Story = {
  args: {
    language: 'Mandarin',
    fluency: 3,
    showLabel: false,
  },
};

export const MultipleLanguages: Story = {
  render: () => (
    <div>
      <LanguageLevelBarLite language="English" fluency="Native" />
      <LanguageLevelBarLite language="Spanish" fluency="Fluent" />
      <LanguageLevelBarLite language="French" fluency="Professional" />
      <LanguageLevelBarLite language="German" fluency="Intermediate" />
      <LanguageLevelBarLite language="Japanese" fluency="Beginner" />
    </div>
  ),
};
