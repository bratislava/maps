import React from "react";
import cx from "classnames";
import { Input } from "../Input/Input";
import { Search, Location, LocationActive } from "@bratislava/react-maps-icons";

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
      className="text-font w-full"
      placeholder={placeholder}
      value={value}
      {...etcProps}
    />
    <div className="absolute right-0 bottom-0 top-0 flex items-center">
      <Search className="w-12 h-12 p-1" />
      {onGeolocationClick && (
        <>
          <div className="md:hidden h-8 bg-gray opacity-20 w-[2px]"></div>
          <button onClick={onGeolocationClick}>
            {isGeolocation ? (
              <LocationActive className="md:hidden w-12 h-12 p-1" />
            ) : (
              <Location className="md:hidden w-12 h-12 p-1" />
            )}
          </button>
        </>
      )}
    </div>
  </div>
);
