import cx from "classnames";
import {
  Plus,
  Minus,
  Fullscreen,
  FullscreenActive,
  Compass,
  Location,
  LocationActive,
  List,
} from "@bratislava/react-maps-icons";
import React, { CSSProperties, forwardRef } from "react";
import { IViewport } from "../../types";
import { IconButton, IconButtonGroup } from "@bratislava/react-maps-ui";

interface ViewportControllerProps {
  viewport?: IViewport;
  isGeolocation: boolean;
  isFullscreen: boolean;
  onZoomOutClick: () => void;
  onZoomInClick: () => void;
  onFullscreenClick: () => void;
  onCompassClick: () => void;
  onLocationClick: () => void;
  onLegendClick?: () => void;
  bearing: number;
  style?: CSSProperties;
}

export const ViewportController = forwardRef<
  HTMLDivElement,
  ViewportControllerProps
>(
  (
    {
      viewport,
      onZoomOutClick,
      onZoomInClick,
      onFullscreenClick,
      onCompassClick,
      onLocationClick,
      bearing,
      isGeolocation,
      isFullscreen,
      onLegendClick,
      style,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cx(
          "fixed right-4 bottom-24 sm:bottom-7 transform  duration-500 ease-in-out transition-transform pointer-events-none"
        )}
        style={style}
      >
        <div className="flex gap-2 items-end">
          {onLegendClick && (
            <IconButton
              onClick={() => {
                console.log("legee");
                onLegendClick();
              }}
            >
              <List size="xl" />
            </IconButton>
          )}
          <IconButton className={"hidden md:flex"} onClick={onLocationClick}>
            {isGeolocation ? (
              <LocationActive className="w-12 h-12" />
            ) : (
              <Location className="w-12 h-12" />
            )}
          </IconButton>
          <IconButton onClick={onCompassClick}>
            <Compass
              className="w-12 h-12"
              style={{ transform: `rotate(${-bearing}deg)` }}
            />
          </IconButton>
          <div className="flex flex-col gap-2">
            <IconButton
              className={"hidden md:flex"}
              onClick={onFullscreenClick}
            >
              {isFullscreen ? (
                <FullscreenActive className="w-12 h-12" />
              ) : (
                <Fullscreen className="w-12 h-12" />
              )}
            </IconButton>
            <IconButtonGroup>
              <IconButton noStyle onClick={onZoomInClick}>
                <Plus className="w-12 h-12" />
              </IconButton>
              <IconButton noStyle onClick={onZoomOutClick}>
                <Minus className="w-12 h-12" />
              </IconButton>
            </IconButtonGroup>
          </div>
        </div>
      </div>
    );
  }
);

ViewportController.displayName = "ViewportController";
