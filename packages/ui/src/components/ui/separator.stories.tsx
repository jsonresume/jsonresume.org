import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
    },
    decorative: {
      control: 'boolean',
      description:
        'When true, the separator is purely decorative and not exposed to screen readers',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center space-x-4">
      <div className="text-sm">Item 1</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Item 2</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Item 3</div>
    </div>
  ),
};

export const InList: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Section 1</h3>
        <p className="text-sm text-muted-foreground">
          Content for the first section.
        </p>
      </div>
      <Separator />
      <div>
        <h3 className="font-medium">Section 2</h3>
        <p className="text-sm text-muted-foreground">
          Content for the second section.
        </p>
      </div>
      <Separator />
      <div>
        <h3 className="font-medium">Section 3</h3>
        <p className="text-sm text-muted-foreground">
          Content for the third section.
        </p>
      </div>
    </div>
  ),
};
