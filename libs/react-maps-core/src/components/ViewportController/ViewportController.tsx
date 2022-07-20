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
import React, { forwardRef, MouseEvent, useCallback, useContext } from "react";
import { IconButton, IconButtonGroup } from "@bratislava/react-maps-ui";
import { mapContext } from "../Map/Map";
import { MapActionKind } from "../Map/mapReducer";
import {
  exitFullscreen,
  getFullscreenElement,
  requestFullscreen,
} from "../../utils/fullscreen";

interface ViewportControllerProps {
  className?: string;
  showLegendButton?: boolean;
  showLocationButton?: boolean;
  onLegendClick?: (e: MouseEvent) => void;
}

export const ViewportController = forwardRef<
  HTMLDivElement,
  ViewportControllerProps
>(
  (
    {
      className,
      showLegendButton = false,
      onLegendClick,
      showLocationButton = false,
    },
    ref
  ) => {
    const {
      mapState,
      dispatchMapState,
      changeViewport,
      containerRef,
      geolocationChangeHandler,
    } = useContext(mapContext);

    // ZOOM IN HANDLER
    const handleZoomInClick = useCallback(() => {
      changeViewport({ zoom: (mapState?.viewport.zoom ?? 0) + 0.5 });
    }, [changeViewport, mapState?.viewport.zoom]);

    // ZOOM OUT HANDLER
    const handleZoomOutClick = useCallback(() => {
      changeViewport({ zoom: (mapState?.viewport.zoom ?? 0) - 0.5 });
    }, [changeViewport, mapState?.viewport.zoom]);

    // FULLSCREEN HANDLER
    const handleFullscreenClick = useCallback(() => {
      if (containerRef?.current) {
        if (getFullscreenElement()) {
          exitFullscreen();
          dispatchMapState &&
            dispatchMapState({
              type: MapActionKind.SetFullscreen,
              value: false,
            });
        } else {
          requestFullscreen(containerRef.current);
          dispatchMapState &&
            dispatchMapState({
              type: MapActionKind.SetFullscreen,
              value: true,
            });
        }
      }
    }, [dispatchMapState, containerRef]);

    // RESET BEARING HANDLER
    const handleCompassClick = useCallback(() => {
      changeViewport({ bearing: 0 });
    }, [changeViewport]);

    // GEOLOCATION HANDLER
    const handleLocationClick = useCallback(() => {
      geolocationChangeHandler(!mapState?.isGeolocation);
    }, [geolocationChangeHandler, mapState?.isGeolocation]);

    return (
      <div
        ref={ref}
        className={cx(
          "transform  duration-500 ease-in-out transition-transform pointer-events-none",
          className
        )}
      >
        <div className="flex gap-2 items-end">
          {showLegendButton && (
            <IconButton onClick={onLegendClick}>
              <List size="xl" />
            </IconButton>
          )}
          {showLocationButton && (
            <IconButton onClick={handleLocationClick}>
              {mapState?.isGeolocation ? (
                <LocationActive className="w-12 h-12" />
              ) : (
                <Location className="w-12 h-12" />
              )}
            </IconButton>
          )}
          <IconButton onClick={handleCompassClick}>
            <Compass
              className="w-12 h-12"
              style={{
                transform: `rotate(${-(mapState?.viewport?.bearing ?? 0)}deg)`,
              }}
            />
          </IconButton>
          <div className="flex flex-col gap-2">
            <IconButton onClick={handleFullscreenClick}>
              {mapState?.isFullscreen ? (
                <FullscreenActive className="w-12 h-12" />
              ) : (
                <Fullscreen className="w-12 h-12" />
              )}
            </IconButton>
            <IconButtonGroup>
              <IconButton noAnimation noStyle onClick={handleZoomInClick}>
                <Plus className="w-12 h-12" />
              </IconButton>
              <IconButton noAnimation noStyle onClick={handleZoomOutClick}>
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
