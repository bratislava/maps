import { Combobox } from "@headlessui/react";
import { ReactNode, useEffect, useState } from "react";
import cx from "classnames";

export type IOption = {
  value: string;
  title: ReactNode;
};

export interface ComboBoxProps<T extends IOption> {
  searchQuery: string;
  onSearchQueryChange: (searchQuery: string) => void;
  options: T[];
  onOptionPress: (option: T) => void;
  placeholder?: string;
  rightSlot?: ReactNode;
}

export const ComboBox = <T extends IOption>({
  options,
  onOptionPress,
  onSearchQueryChange,
  searchQuery,
  placeholder,
  rightSlot,
}: ComboBoxProps<T>) => {
  const [selectedOption, setSelectedOption] = useState<T | null>(null);

  const handleChange = (option: T) => {
    setSelectedOption(option);
    if (option) {
      onOptionPress(option);
    }
  };

  useEffect(() => {
    if (searchQuery === "") setSelectedOption(null);
  }, [searchQuery]);

  return (
    <div className="relative w-full">
      <Combobox value={selectedOption} onChange={handleChange}>
        <div className="relative">
          <Combobox.Input
            className="w-full bg-background-lightmode dark:bg-background-darkmode placeholder:text-foreground-lightmode placeholder:dark:text-foreground-darkmode border-2 font-medium placeholder:font-medium border-gray-lightmode dark:border-gray-darkmode border-opacity-10 dark:border-opacity-20 h-12 rounded-lg px-3 outline-none focus:border-primary focus:border-opacity-100 focus:dark:border-primary transition-all"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            displayValue={(option: T | null) => option?.value ?? ""}
            placeholder={placeholder}
          />
          {rightSlot}
        </div>
        {options.length ? (
          <Combobox.Options className="w-full absolute z-20 shadow-lg bottom-11 sm:bottom-auto sm:top-full mb-3 bg-background-lightmode border-2 dark:bg-background-darkmode border-background-lightmode dark:border-gray-darkmode/20 rounded-lg py-4">
            {options.map((option) => (
              <Combobox.Option
                className="text-left w-full hover:bg-background"
                key={option.value}
                value={option}
              >
                {({ active }) => (
                  <div
                    className={cx("px-4 py-2", {
                      "bg-gray-lightmode/10 dark:bg-gray-darkmode/20": active,
                    })}
                  >
                    {option.title}
                  </div>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        ) : null}
      </Combobox>
    </div>
  );
};
