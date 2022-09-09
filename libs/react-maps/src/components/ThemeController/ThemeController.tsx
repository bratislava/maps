import { Darkmode, Satellite, Themes } from "@bratislava/react-maps-icons";
import { AnimateHeight, Popover } from "@bratislava/react-maps-ui";
import cx from "classnames";
import React, { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { mapContext } from "../Map/Map";
import { MapActionKind } from "../Map/mapReducer";

interface ThemeControllerProps {
  className?: string;
}

export const ThemeController = ({ className }: ThemeControllerProps) => {
  const { mapState, dispatchMapState } = useContext(mapContext);
  const { t } = useTranslation("map", {
    keyPrefix: "components.ThemeController",
  });

  const [isOpen, setOpen] = useState(false);

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
      <div
        className={cx(
          "flex flex-col h-auto text-font items-center justify-center pointer-events-auto shadow-lg bg-background-lightmode dark:bg-background-darkmode rounded-lg border-2 border-background-lightmode dark:border-gray-darkmode dark:border-opacity-20 w-12",
          {
            // "transform active:scale-75 transition-all": !noAnimation,
          }
        )}
      >
        <AnimateHeight isVisible={isOpen} className="flex flex-col">
          <Popover
            isSmall
            button={({ open, close }) => (
              <button
                onMouseEnter={open}
                onMouseLeave={close}
                onMouseDown={() =>
                  handleSatelliteChange(!mapState?.isSatellite)
                }
                className="w-12 h-12 flex items-center justify-center"
              >
                <Satellite size="xl" />
              </button>
            )}
            panel={
              <div>
                {mapState?.isSatellite
                  ? t("disableSatellite")
                  : t("enableSatellite")}
              </div>
            }
          />
          <div className="mx-auto h-[2px] w-8 bg-gray-lightmode dark:bg-gray-darkmode opacity-20"></div>
          <Popover
            isSmall
            button={({ open, close }) => (
              <button
                onMouseEnter={open}
                onMouseLeave={close}
                onMouseDown={() => handleDarkmodeChange(!mapState?.isDarkmode)}
                className="w-12 h-12 flex items-center justify-center"
              >
                <Darkmode size="xl" />
              </button>
            )}
            panel={
              <div>
                {mapState?.isDarkmode
                  ? t("disableDarkmode")
                  : t("enableDarkmode")}
              </div>
            }
          />
        </AnimateHeight>
        <button
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className="w-12 h-11 flex items-center justify-center"
        >
          <Themes size="xl" />
        </button>
      </div>
    </div>
  );
};

export default ThemeController;
