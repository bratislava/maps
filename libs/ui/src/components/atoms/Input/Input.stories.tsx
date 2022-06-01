import React from "react";

import { Input, IInputProps } from "./Input";

export default {
  title: "Atoms/Input",
  component: Input,
};

const Template = (args: IInputProps) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {};
