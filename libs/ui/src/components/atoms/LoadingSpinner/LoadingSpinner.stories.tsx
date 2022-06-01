import React from "react";

import { LoadingSpinner } from "./LoadingSpinner";

export default {
  title: "Atoms/LoadingSpinner",
  component: LoadingSpinner,
  argTypes: {
    color: { control: "color" },
  },
};

const Template = args => <LoadingSpinner {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: 64,
  color: "black",
};
