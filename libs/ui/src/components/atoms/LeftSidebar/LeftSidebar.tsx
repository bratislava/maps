import React, { ReactNode } from "react";
import cx from "classnames";
import { Chevron } from "@bratislava/mapbox-maps-icons";

export interface ILeftSidebarProps {
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
  children?: ReactNode;
  title?: string;
}

export const LeftSidebar = ({
  isVisible,
  setVisible,
  children,
  title,
}: ILeftSidebarProps) => {
  return (
    <div
      className={cx(
        "fixed top-0 left-0 bottom-0 w-96 h-full pr-0 transition-all duration-500",
        {
          "-translate-x-full": !isVisible,
        }
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setVisible(!isVisible)}
        className="absolute right-0 bg-background rounded-br-lg z-20 py-8 transform translate-x-full hover:text-primary"
        onClick={() => {
          setVisible(!isVisible);
        }}
      >
        <div
          className="shadow-lg rounded-br-lg hidden sm:block absolute top-0 left-0 right-0 bottom-0 sm:shadow-lg"
          style={{ zIndex: -20 }}
        ></div>
        <Chevron
          direction="right"
          className={cx("transform transition-transform", {
            "rotate-180": isVisible,
          })}
        />
        <div className="hidden sm:block bg-background absolute w-4 min-h-full box-content right-full top-0 pb-4"></div>
      </div>

      <div className="space-y-6 w-full h-full font-medium overflow-auto bg-background shadow-lg">
        {title && (
          <h1 className="text-lg font-semibold relative z-30 px-6 pt-6 pb-3">
            {title}
          </h1>
        )}
        {children}
      </div>
    </div>
  );
};
