import React, { ReactNode } from "react";
import { Popover } from "@headlessui/react";

export interface IDropdownProps {
  children: ReactNode;
}

export const Dropdown = ({ children }: IDropdownProps) => {
  return (
    <Popover>
      <Popover.Panel className="absolute z-10">{children}</Popover.Panel>
    </Popover>
  );
};
