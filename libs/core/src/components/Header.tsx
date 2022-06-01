import React from "react";
import cx from "classnames";
import { ChevronLeftSmall, Funnel } from "@bratislava/mapbox-maps-icons";
import { IconButton } from "./IconButton";

interface HeaderProps {
  title: string;
  isFilteringOpen: boolean;
  onFilterClick: () => void;
}

export const Header = ({
  title,
  isFilteringOpen,
  onFilterClick,
}: HeaderProps) => {
  return (
    <div
      className={cx(
        "fixed top-0 w-full sm:w-96 sm:z-10 transform duration-500 ease-in-out transition-transform",
        {
          "sm:-translate-x-full": !isFilteringOpen,
        }
      )}
    >
      <div className="flex justify-end sm:justify-between w-full items-center pr-4 pt-4 sm:p-0">
        <h1 className="hidden sm:block text-md relative z-30 sm:text-3xl font-medium px-4 sm:px-8 sm:py-4">
          {title}
        </h1>
        <div className="bg-transparent sm:bg-background text-md z-10 sm:z-20 absolute top-0 left-0 right-0 bottom-0"></div>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onFilterClick()}
          className="sm:bg-background rounded-br-lg relative z-20 sm:z-10 sm:py-8 transform sm:translate-x-full hover:text-primary"
          onClick={onFilterClick}
        >
          <div
            className="shadow-lg rounded-br-lg hidden sm:block absolute top-0 left-0 right-0 bottom-0 sm:shadow-lg"
            style={{ zIndex: -20 }}
          ></div>
          <IconButton className="sm:hidden flex items-center gap-2">
            <Funnel />
          </IconButton>
          <ChevronLeftSmall
            width={24}
            height={24}
            className={cx("hidden sm:block transform transition-transform", {
              "rotate-180": !isFilteringOpen,
            })}
            stroke="var(--font-color)"
          />
          <div className="hidden sm:block bg-background absolute w-4 h-4 right-full top-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
