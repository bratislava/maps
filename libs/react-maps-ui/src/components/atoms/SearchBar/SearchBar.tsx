import { Location, MagnifyingGlass } from "@bratislava/react-maps-icons";
import cx from "classnames";
import React from "react";
import { Input } from "../Input/Input";

interface ISearchBarProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  className?: string;
  value?: string;
  placeholder?: string;
  onGeolocationClick?: () => void;
  isGeolocation?: boolean;
}

export const SearchBar = ({
  className,
  value,
  placeholder = "",
  onGeolocationClick,
  isGeolocation,
  ...etcProps
}: ISearchBarProps) => (
  <div className={cx(className, "relative")}>
    <Input
      className="w-full"
      placeholder={placeholder}
      value={value}
      {...etcProps}
    />
    <div className="absolute right-[3px] gap-[4px] bottom-0 top-0 flex items-center">
      <div className="p-2">
        <MagnifyingGlass size="lg" />
      </div>
      {onGeolocationClick && (
        <>
          <div className="md:hidden h-8 bg-gray-lightmode dark:bg-gray-darkmode opacity-20 w-[2px]"></div>
          <button
            onClick={onGeolocationClick}
            className="md:hidden h-10 flex items-center justify-center p-2 translate-x-[1px]"
          >
            <Location size="lg" isActive={isGeolocation} />
          </button>
        </>
      )}
    </div>
  </div>
);
