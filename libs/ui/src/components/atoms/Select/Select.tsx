import React, { MouseEventHandler, ReactElement, useCallback } from "react";
import cx from "classnames";
import {
  Chevron,
  ChevronDownSmall,
  Close,
  X,
} from "@bratislava/mapbox-maps-icons";
import { Listbox, Transition } from "@headlessui/react";
import { ISelectOption, ISelectOptionProps } from "./SelectOption";
import { SelectArrow } from "./SelectArrow";

interface ISelectProps<T extends ISelectOption | ISelectOption[] | null> {
  className?: string;
  buttonClassName?: string;
  isMultiple?: boolean;
  noBorder?: boolean;
  onChange?: (value: T) => void;
  onReset?: () => void;
  value: T;
  placeholder?: string;
  children:
    | ReactElement<ISelectOptionProps>
    | ReactElement<ISelectOptionProps>[];
}

export const Select = <T extends (ISelectOption | ISelectOption[]) | null>({
  className,
  buttonClassName,
  onChange = () => void 0,
  onReset = () => void 0,
  value,
  isMultiple = false,
  noBorder = false,
  children,
  placeholder,
}: ISelectProps<T>) => {
  const onResetClick: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();
      onReset();
    },
    [onReset]
  );

  return (
    <div className={cx("relative items-center w-full", className)}>
      <Listbox value={value} onChange={onChange} multiple={isMultiple}>
        <Listbox.Button className="flex w-full outline-none group">
          {({ open }) => (
            <div
              className={cx(
                "bg-white flex items-center justify-between cursor-pointer w-full h-12 outline-none transition-all",
                {
                  "group-focus:bg-gray group-focus:bg-opacity-10": noBorder,
                  "bg-gray bg-opacity-10": noBorder && open,
                  "border-2 rounded-lg": !noBorder,
                  "border-primary": open,
                  "border-gray border-opacity-10 group-focus:border-primary group-focus:border-opacity-100":
                    !open,
                },
                buttonClassName
              )}
            >
              <div className="overflow-auto w-full">
                {!value || (Array.isArray(value) && value.length == 0) ? (
                  <div className="ml-3 flex">{placeholder}</div>
                ) : Array.isArray(value) ? (
                  <div className="ml-3 flex gap-2 whitespace-nowrap">
                    {value.map((v) => v.label).join(", ")}
                  </div>
                ) : (
                  <span className="ml-4">{value.label}</span>
                )}
              </div>
              <div className="flex items-center rounded-full text-white mr-1">
                {!(!value || (Array.isArray(value) && value.length == 0)) && (
                  <div
                    tabIndex={0}
                    onClick={onResetClick}
                    className="flex w-6 h-6 rounded-full bg-primary-soft items-center justify-center text-primary mr-1 hover:text-white hover:bg-primary focus:text-white focus:bg-primary outline-none"
                  >
                    <X size="xs" />
                  </div>
                )}
                <div className="w-8 h-8 p-2">
                  <Chevron
                    direction="bottom"
                    size="sm"
                    className={cx(" transition-transform text-gray", {
                      "rotate-180": open,
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </Listbox.Button>
        <Transition
          enter="☺ duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
          className={cx("absolute top-full z-50 translate-y-4 outline-none", {
            "left-6 right-6": noBorder,
            "w-full": !noBorder,
          })}
        >
          <Listbox.Options className="w-full py-4 bg-white rounded-lg shadow-lg overflow-hidden outline-none">
            <SelectArrow />
            {children}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};
