import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './sonner';
import { toast } from 'sonner';
import { Button } from './button';

const meta: Meta<typeof Toaster> = {
  title: 'UI/Sonner',
  component: Toaster,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <Button onClick={() => toast('This is a toast notification')}>
      Show Toast
    </Button>
  ),
};

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success('Successfully saved!')}>
      Show Success
    </Button>
  ),
};

export const Error: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() => toast.error('Something went wrong!')}
    >
      Show Error
    </Button>
  ),
};

export const Warning: Story = {
  render: () => (
    <Button onClick={() => toast.warning('Warning: Check your inputs')}>
      Show Warning
    </Button>
  ),
};

export const Info: Story = {
  render: () => (
    <Button onClick={() => toast.info('Here is some information')}>
      Show Info
    </Button>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
        })
      }
    >
      Show with Description
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      onClick={() =>
        toast('Event has been created', {
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
        })
      }
    >
      Show with Action
    </Button>
  ),
};

export const Promise: Story = {
  render: () => (
    <Button
      onClick={() => {
        const promise = new Promise((resolve) => setTimeout(resolve, 2000));

        toast.promise(promise, {
          loading: 'Loading...',
          success: 'Data loaded successfully',
          error: 'Error loading data',
        });
      }}
    >
      Show Promise Toast
    </Button>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="space-x-2">
      <Button onClick={() => toast('First notification')}>Toast 1</Button>
      <Button onClick={() => toast('Second notification')}>Toast 2</Button>
      <Button onClick={() => toast('Third notification')}>Toast 3</Button>
    </div>
  ),
};
