import React from "react";
import cx from "classnames";
import { Root, Indicator } from "@radix-ui/react-checkbox";
import { Tick } from "@bratislava/mapbox-maps-icons";

export interface CheckboxProps {
  id: string;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({
  id,
  label,
  checked = false,
  onChange,
}: CheckboxProps) => {
  return (
    <div className="flex items-center">
      <Root
        checked={checked}
        onCheckedChange={(e) => onChange && onChange(!!e)}
        id={id}
        className={cx(
          "flex border-2 flex-col w-4 h-4 rounded items-center justify-center focus:border-primary transition-all outline-none",
          {
            "bg-primary border-primary": checked,
            "border-gray border-opacity-50": !checked,
          }
        )}
      >
        <Indicator>
          <Tick width={10} height={10} className="text-white" />
        </Indicator>
      </Root>
      {label && (
        <label className="cursor-pointer pl-2" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};
