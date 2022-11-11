import cx from "classnames";
import { ReactComponent as SpecialDivider } from "../assets/special-divider.svg";

export interface IDividerProps {
  className?: string;
  isSpecial?: boolean;
}

export const Divider = ({ className, isSpecial = false }: IDividerProps) => {
  return isSpecial ? (
    <div>
      <SpecialDivider className="w-full" />
    </div>
  ) : (
    <div
      className={cx(
        "h-[2px] bg-gray-lightmode dark:bg-gray-darkmode opacity-20",
        className
      )}
    ></div>
  );
};
