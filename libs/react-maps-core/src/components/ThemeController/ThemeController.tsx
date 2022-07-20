import React, { CSSProperties, useCallback, useContext } from "react";
import cx from "classnames";
import { Satellite, Darkmode } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";
import { mapContext } from "../Map/Map";
import { MapActionKind } from "../Map/mapReducer";

interface ThemeControllerProps {
  className?: string;
}

export const ThemeController = ({ className }: ThemeControllerProps) => {
  const { mapState, dispatchMapState } = useContext(mapContext);

  const handleDarkmodeChange = useCallback(
    (isDarkmode: boolean) => {
      dispatchMapState &&
        dispatchMapState({
          type: MapActionKind.SetDarkmode,
          value: isDarkmode,
        });
      document.body.classList[isDarkmode ? "add" : "remove"]("dark");
    },
    [dispatchMapState]
  );

  const handleSatelliteChange = useCallback(
    (isSatellite: boolean) => {
      dispatchMapState &&
        dispatchMapState({
          type: MapActionKind.SetSatellite,
          value: isSatellite,
        });
    },
    [dispatchMapState]
  );

  return (
    <div
      className={cx(
        "transform duration-500 ease-in-out flex gap-2 transition-transform",
        className
      )}
    >
      <IconButton onClick={() => handleSatelliteChange(!mapState?.isSatellite)}>
        <Satellite className="w-11 h-11" />
      </IconButton>
      <IconButton onClick={() => handleDarkmodeChange(!mapState?.isDarkmode)}>
        <Darkmode className="w-11 h-11" />
      </IconButton>
    </div>
  );
};

export default ThemeController;
