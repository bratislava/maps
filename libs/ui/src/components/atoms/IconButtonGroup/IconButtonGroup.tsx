import React, { Fragment, ReactNode } from "react";

interface IconButtonGroupProps {
  children: ReactNode[];
}

export const IconButtonGroup = ({ children }: IconButtonGroupProps) => {
  return (
    <div className="shadow-lg bg-background rounded-lg flex text-font flex-col">
      {children.map((child, key) => (
        <Fragment key={key}>
          {key !== 0 && <div className="mx-2 h-[2px] bg-gray opacity-20"></div>}
          {child}
        </Fragment>
      ))}
    </div>
  );
};

export default IconButtonGroup;
