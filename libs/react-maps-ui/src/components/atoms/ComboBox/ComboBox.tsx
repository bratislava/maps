import { Combobox } from "@headlessui/react";
import { KeyboardEvent, ReactNode, useEffect, useState } from "react";
import cx from "classnames";

export type IOption = {
  value: string;
  label: ReactNode;
  title: string;
};

export interface ComboBoxProps<T extends IOption> {
  searchQuery: string;
  onSearchQueryChange: (searchQuery: string) => void;
  options: T[];
  onOptionPress: (option: T) => void;
  placeholder?: string;
  rightSlot?: ReactNode;
  direction?: "top" | "bottom";
}

export const ComboBox = <T extends IOption>({
  options,
  onOptionPress,
  onSearchQueryChange,
  searchQuery,
  placeholder,
  rightSlot,
  direction = "bottom",
}: ComboBoxProps<T>) => {
  const [selectedOption, setSelectedOption] = useState<T | null>(null);

  const handleChange = (option: T) => {
    setSelectedOption(option);
    if (option) {
      onOptionPress(option);
    }
  };

  const handleInputKeyPress = (e: KeyboardEvent) => {
    if (e.code === "Enter" && selectedOption) {
      onOptionPress(selectedOption);
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
            displayValue={(option: T | null) => option?.title ?? ""}
            placeholder={placeholder}
            onKeyPress={handleInputKeyPress}
          />
          {rightSlot}
        </div>
        {options.length ? (
          <Combobox.Options
            className={cx(
              "w-full absolute z-20 shadow-lg mb-3 bg-background-lightmode border-2 dark:bg-background-darkmode border-background-lightmode dark:border-gray-darkmode/20 rounded-lg py-2",
              {
                "top-14": direction === "bottom",
                "bottom-11": direction === "top",
              }
            )}
          >
            {options.map((option) => (
              <Combobox.Option
                className="text-left w-full hover:bg-background select-none cursor-pointer"
                key={option.value}
                value={option}
              >
                {({ active }) => (
                  <div
                    className={cx("px-4 py-2", {
                      "bg-gray-lightmode/10 dark:bg-gray-darkmode/20": active,
                    })}
                  >
                    {option.label}
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
