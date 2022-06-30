import React, { ReactNode } from "react";
import cx from "classnames";
import { Listbox } from "@headlessui/react";

export interface ISelectOptionProps {
  value: string;
  children?: ReactNode;
}

export const SelectOption = ({ value, children }: ISelectOptionProps) => {
  return (
    <Listbox.Option key={value} value={value}>
      {({ active, selected }) => (
        <div
          className={cx(
            "px-4 py-1 relative outline-none select-none cursor-pointer",
            {
              "bg-gray bg-opacity-10": active && !selected,
              "bg-primary-soft": selected,
            }
          )}
        >
          {children ?? value}
        </div>
      )}
    </Listbox.Option>
  );
};
