import { ReactNode } from "react";
import cx from "classnames";

export interface INoteProps {
  children: ReactNode;
  className?: string;
}

export const Note = ({ children, className }: INoteProps) => {
  return (
    <div
      className={cx(
        "p-6 rounded-xl bg-primary/20 dark:bg-primary/20 font-light text-[16px]",
        className
      )}
    >
      {children}
    </div>
  );
};
