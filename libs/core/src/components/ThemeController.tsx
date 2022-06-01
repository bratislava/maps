import React from "react";
import cx from "classnames";
import { Satellite, Darkmode } from "@bratislava/mapbox-maps-icons";
import { IconButton } from "./IconButton";

interface ThemeControllerProps {
  isDarkmode: boolean;
  isSatellite: boolean;
  isFilteringOpen: boolean;
  onDarkmodeChange: (value: boolean) => void;
  onSatelliteChange: (value: boolean) => void;
}

export const ThemeController = ({
  isDarkmode,
  isSatellite,
  isFilteringOpen,
  onDarkmodeChange,
  onSatelliteChange,
}: ThemeControllerProps) => {
  return (
    <div
      className={cx(
        "fixed left-4 bottom-24 sm:bottom-7 transform duration-500 ease-in-out flex gap-2 transition-transform",
        {
          "sm:translate-x-96": isFilteringOpen,
        }
      )}
    >
      <IconButton onClick={() => onSatelliteChange(!isSatellite)}>
        <Satellite className="w-11 h-11" />
      </IconButton>
      <IconButton onClick={() => onDarkmodeChange(!isDarkmode)}>
        <Darkmode className="w-11 h-11" />
      </IconButton>
    </div>
  );
};

export default ThemeController;
