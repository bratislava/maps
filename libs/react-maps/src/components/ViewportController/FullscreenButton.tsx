import { Fullscreen } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";
import React, { useCallback, useContext } from "react";
import { mapContext } from "../Map/Map";
import {
  exitFullscreen,
  getFullscreenElement,
  requestFullscreen,
} from "../../utils/fullscreen";
import { MapActionKind } from "../Map/mapReducer";

export const FullscreenButton = () => {
  const { mapState, dispatchMapState, containerRef } = useContext(mapContext);

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

  return (
    <IconButton onClick={handleFullscreenClick}>
      <Fullscreen size="lg" isFullscreen={mapState?.isFullscreen} />
    </IconButton>
  );
};
