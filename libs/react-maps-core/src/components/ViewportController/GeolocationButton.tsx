import { Location } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";
import React, { useCallback, useContext } from "react";
import { mapContext } from "../Map/Map";

export const GeolocationButton = () => {
  const { mapState, geolocationChangeHandler } = useContext(mapContext);

  // GEOLOCATION HANDLER
  const handleLocationClick = useCallback(() => {
    geolocationChangeHandler(!mapState?.isGeolocation);
  }, [geolocationChangeHandler, mapState?.isGeolocation]);

  return (
    <IconButton onClick={handleLocationClick}>
      <Location isActive={mapState?.isGeolocation} size="xl" />
    </IconButton>
  );
};
