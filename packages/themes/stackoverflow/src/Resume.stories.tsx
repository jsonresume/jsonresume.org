import type { Meta, StoryObj } from '@storybook/react';

import { Resume } from './Resume';
import storyResume from './storyResume.json';
const meta: Meta<typeof Resume> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Resume',
  component: Resume,
};

export default meta;
type Story = StoryObj<typeof Resume>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Complete: Story = {
  render: () => <Resume {...storyResume} />,
};
