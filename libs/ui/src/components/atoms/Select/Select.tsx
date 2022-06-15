import React, { useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { ChevronDownSmall } from "@bratislava/mapbox-maps-icons";
import * as RadixSelect from "@radix-ui/react-select";

export interface SelectOption {
  key: string;
  label: string;
}

export const UNSELECTED_OPTION_KEY = "none";

interface ISelectProps {
  className?: string;
  unselectedOptionLabel?: string;
  options: SelectOption[];
  onChange?: (option: string) => void;
  value?: string | null;
  id?: string;
}

export const Select = ({
  className,
  options,
  unselectedOptionLabel,
  onChange,
  value,
}: ISelectProps) => {
  const [realValue, setRealValue] = useState<string>("");

  const [unselectedOption, setUnselectedOption] =
    useState<SelectOption | null>(null);

  const handleChange = useCallback(
    (key: string) => {
      if (!onChange) return;
      const option =
        options.find((option) => option.key === key) ?? unselectedOption;
      if (option) onChange(option.key);
    },
    [unselectedOption]
  );

  useEffect(() => {
    if (unselectedOptionLabel) {
      setUnselectedOption({
        key: UNSELECTED_OPTION_KEY,
        label: unselectedOptionLabel,
      });
    }
  }, [unselectedOptionLabel]);

  useEffect(() => {
    setRealValue(
      value ?? (unselectedOption ? unselectedOption.key : options[0].key)
    );
    console.log(value);
  }, [value]);

  return (
    <div className={cx("inline-flex relative items-center", className)}>
      <RadixSelect.Root value={realValue} onValueChange={handleChange}>
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
            {unselectedOption && (
              <RadixSelect.Item
                className={cx(
                  "px-4 py-1 relative focus:bg-gray focus:bg-gray focus:bg-opacity-10 outline-none"
                )}
                value={unselectedOption.key}
              >
                <RadixSelect.ItemIndicator className="relative bg-primary w-8 h-8" />
                <RadixSelect.ItemText className="relative ">
                  {unselectedOption.label}
                </RadixSelect.ItemText>
              </RadixSelect.Item>
            )}
            {options.map(({ key, label }) => (
              <RadixSelect.Item
                className={cx(
                  "px-4 py-1 relative focus:bg-gray focus:bg-gray1 focus:bg-opacity-10 outline-none"
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

export const getSelectOptionsFromStringArray = (
  array: string[]
): SelectOption[] => {
  const options = array.sort().map((item) => {
    return {
      key: item,
      label: item,
    };
  });

  return options;
};
