import React from "react";
import cx from "classnames";
import { ChevronDownSmall } from "@bratislava/mapbox-maps-icons";
import * as RadixSelect from "@radix-ui/react-select";

export interface Option {
  key: string;
  label: string;
}

interface ISelectProps {
  className?: string;
  defaultOption?: Option;
  options: Option[];
  onChange?: (option: Option) => void;
  value: Option;
  id?: string;
}

export const Select = ({
  className,
  options,
  defaultOption,
  onChange,
}: ISelectProps) => {
  const handleChange = (key: string) => {
    if (!onChange) return;
    const option = options.find(option => option.key === key);
    if (option) onChange(option);
  };

  return (
    <div className={cx("inline-flex relative items-center", className)}>
      <RadixSelect.Root
        defaultValue={defaultOption ? defaultOption.key : options[0].key}
        onValueChange={handleChange}
      >
        <RadixSelect.Trigger className="bg-white flex pl-4 rounded-lg border-2 border-highlight items-center cursor-pointer pr-16 w-full h-12 outline-none focus:border-primary">
          <RadixSelect.Value />
          <RadixSelect.Icon className="absolute right-4">
            <ChevronDownSmall className="text-primary" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Content className="bg-white rounded-lg shadow-lg">
          <RadixSelect.ScrollUpButton className="flex justify-center py-2">
            <ChevronDownSmall className="text-primary transform rotate-180" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className="py-4">
            {options.map(({ key, label }) => (
              <RadixSelect.Item
                className={cx(
                  "px-4 py-1 relative focus:bg-highlight outline-none"
                )}
                value={key}
                key={key}
              >
                <RadixSelect.ItemIndicator className="relative bg-primary w-8 h-8" />
                <RadixSelect.ItemText className="relative ">
                  {label}
                </RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
            <RadixSelect.Separator />
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="flex justify-center py-1">
            <ChevronDownSmall className="text-primary" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Root>
    </div>
  );
};

export default Select;
