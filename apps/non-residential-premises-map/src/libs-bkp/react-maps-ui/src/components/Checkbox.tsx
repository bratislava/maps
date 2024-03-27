import { Tick } from "@bratislava/react-maps-icons";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import cx from "classnames";
import { ReactNode } from "react";

export interface CheckboxProps {
  id: string;
  label?: string | ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  color?: string;
}

export const Checkbox = ({
  id,
  label,
  checked = false,
  onChange,
  color,
}: CheckboxProps) => {
  return (
    <div className="flex items-center">
      <Root
        checked={checked}
        onCheckedChange={(e) => onChange && onChange(!!e)}
        id={id}
        className={cx(
          "flex shrink-0 border-2 flex-col w-4 h-4 rounded items-center justify-center focus:border-primary dark:focus:border-primary transition-all outline-none",
          {
            "bg-primary border-primary": checked && !color,
            "border-gray-lightmode dark:border-gray-darkmode border-opacity-50 dark:border-opacity-100":
              !checked,
          }
        )}
        style={{
          background: checked ? color : undefined,
          borderColor: checked ? color : undefined,
        }}
      >
        <Indicator>
          <Tick width={10} height={10} className="text-white" />
        </Indicator>
      </Root>
      {label && (
        <label className="cursor-pointer select-none pl-2" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};
