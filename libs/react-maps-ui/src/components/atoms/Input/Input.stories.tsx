import React from "react";

import { Input, InputProps } from "./Input";

export default {
  title: "Atoms/Input",
  component: Input,
};

const Template = (args: InputProps) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {};
