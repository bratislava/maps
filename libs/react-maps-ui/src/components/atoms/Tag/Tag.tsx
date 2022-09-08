import cx from "classnames";
import { ReactNode } from "react";

export interface ITagProps {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  isSmall?: boolean;
}

export const Tag = ({
  className = "",
  onClick,
  children,
  isSmall = false,
}: ITagProps) => {
  return (
    <div
      className={cx(
        "rounded select-none text-[14px] font-semibold transition-all",
        {
          "bg-gray-lightmode dark:bg-gray-darkmode bg-opacity-10 dark:bg-opacity-20":
            !className.includes("bg-"),
          "px-3 py-1": !isSmall,
          "px-2": isSmall,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
