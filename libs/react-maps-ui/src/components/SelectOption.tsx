import { Listbox } from "@headlessui/react";
import cx from "classnames";
import { ReactNode } from "react";

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
              "bg-gray-lightmode dark:bg-gray-darkmode bg-opacity-10 dark:bg-opacity-20":
                active && !selected,
              "bg-primary-soft dark:text-background-darkmode": selected,
            }
          )}
        >
          {children ?? value}
        </div>
      )}
    </Listbox.Option>
  );
};
