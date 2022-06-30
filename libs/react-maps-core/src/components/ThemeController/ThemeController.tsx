import React, { CSSProperties } from "react";
import cx from "classnames";
import { Satellite, Darkmode } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";

interface ThemeControllerProps {
  isDarkmode: boolean;
  isSatellite: boolean;
  onDarkmodeChange: (value: boolean) => void;
  onSatelliteChange: (value: boolean) => void;
  style?: CSSProperties;
}

export const ThemeController = ({
  isDarkmode,
  isSatellite,
  onDarkmodeChange,
  onSatelliteChange,
  style,
}: ThemeControllerProps) => {
  return (
    <div
      className={cx(
        "fixed left-4 bottom-24 sm:bottom-7 transform duration-500 ease-in-out flex gap-2 transition-transform"
      )}
      style={style}
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
