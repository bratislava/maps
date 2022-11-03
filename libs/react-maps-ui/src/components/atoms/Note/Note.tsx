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
        "p-6 rounded-xl bg-primary-soft text-foreground-lightmode font-light text-[16px]",
        className
      )}
    >
      {children}
    </div>
  );
};
