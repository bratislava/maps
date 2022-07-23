import React from "react";
import cx from "classnames";
import { Input } from "../Input/Input";
import { MagnifyingGlass, Location } from "@bratislava/react-maps-icons";

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
    <div className="absolute right-0 bottom-0 top-0 flex items-center">
      <MagnifyingGlass size="lg" />
      {onGeolocationClick && (
        <>
          <div className="md:hidden h-8 bg-gray-lightmode dark:bg-gray-darkmode opacity-20 w-[2px]"></div>
          <button
            onClick={onGeolocationClick}
            className="h-10 flex items-center justify-center p-2"
          >
            <Location
              size="lg"
              isActive={isGeolocation}
              className="md:hidden"
            />
          </button>
        </>
      )}
    </div>
  </div>
);
