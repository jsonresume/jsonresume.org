import type { Meta, StoryObj } from "@storybook/react";

import { Volunteer } from "./Volunteer";
import storyResume from "./storyResume.json";
const meta: Meta<typeof Volunteer> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Volunteer",
  component: Volunteer,
};

export default meta;
type Story = StoryObj<typeof Volunteer>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Complete: Story = {
  render: () => <Volunteer volunteer={storyResume.volunteer} />,
};
