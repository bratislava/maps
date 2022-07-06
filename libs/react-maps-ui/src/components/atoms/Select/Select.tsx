import React, { FC, MouseEventHandler, ReactElement, useCallback } from "react";
import cx from "classnames";
import { Chevron, X } from "@bratislava/react-maps-icons";
import { Listbox, Transition } from "@headlessui/react";
import { ISelectOptionProps } from "./SelectOption";
import { DropdownArrow } from "../Dropdown/DropdownArrow";
interface ISelectProps {
  className?: string;
  buttonClassName?: string;
  isMultiple?: boolean;
  noBorder?: boolean;
  onChange?: (key: string | string[] | null) => void;
  onReset?: () => void;
  value: string | string[] | null;
  placeholder?: string;
  renderValue?: FC<{ values: string[] }>;
  children:
    | ReactElement<ISelectOptionProps>
    | ReactElement<ISelectOptionProps>[];
}

export const Select = ({
  className,
  buttonClassName,
  onChange = () => void 0,
  onReset = () => void 0,
  value,
  isMultiple = false,
  renderValue = ({ values }) =>
    values.length == 0 ? (
      <div className="ml-3 flex">{placeholder}</div>
    ) : Array.isArray(values) ? (
      <div className="ml-3 flex gap-2 whitespace-nowrap">
        {values.join(", ")}
      </div>
    ) : (
      <span className="ml-4">{values}</span>
    ),
  noBorder = false,
  children,
  placeholder,
}: ISelectProps) => {
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
                "flex items-center justify-between cursor-pointer w-full h-12 outline-none transition-all",
                {
                  "bg-gray group-focus:bg-opacity-10 group-hover:bg-opacity-10":
                    noBorder,
                  "bg-opacity-0": noBorder && !open,
                  "bg-opacity-10": noBorder && open,
                  "bg-white border-2 rounded-lg": !noBorder,
                  "border-primary": open,
                  "border-gray border-opacity-10 group-focus:border-primary group-focus:border-opacity-100":
                    !open,
                },
                buttonClassName
              )}
            >
              <div className="overflow-auto font-medium w-full">
                {!value || (Array.isArray(value) && value.length == 0)
                  ? renderValue({ values: [] as string[] })
                  : Array.isArray(value)
                  ? renderValue({ values: value })
                  : renderValue({ values: [value] })}
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
          enter="duration-100 ease-out"
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
            <DropdownArrow isCenter={false} />
            {children}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};
