import type { Meta, StoryObj } from '@storybook/react';
import { RulesetStack } from './RulesetStack';

const meta = {
  title: 'Primitives/Dividers/RulesetStack',
  component: RulesetStack,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RulesetStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const TwoRules: Story = {
  args: {
    count: 2,
  },
};

export const FiveRules: Story = {
  args: {
    count: 5,
  },
};

export const TightSpacing: Story = {
  args: {
    count: 3,
    gapMultiplier: 0.5,
  },
};

export const WideSpacing: Story = {
  args: {
    count: 3,
    gapMultiplier: 2,
  },
};

export const CustomColor: Story = {
  args: {
    count: 3,
    color: '#94a3b8',
  },
};

export const Thicker: Story = {
  args: {
    count: 3,
    thickness: '0.6pt',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <p>2 rules (minimal)</p>
      <RulesetStack count={2} />

      <p>3 rules (default)</p>
      <RulesetStack count={3} />

      <p>5 rules (maximum)</p>
      <RulesetStack count={5} />

      <p>Tight spacing (0.5x multiplier)</p>
      <RulesetStack count={3} gapMultiplier={0.5} />

      <p>Wide spacing (2x multiplier)</p>
      <RulesetStack count={3} gapMultiplier={2} />

      <p>Custom color (slate)</p>
      <RulesetStack count={3} color="#94a3b8" />

      <p>Thicker rules (0.6pt)</p>
      <RulesetStack count={3} thickness="0.6pt" />
    </div>
  ),
};
