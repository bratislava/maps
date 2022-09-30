import { Location } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";
import { useContext } from "react";
import { mapContext } from "../Map/Map";

export const GeolocationButton = () => {
  const { mapState, methods: mapMethods } = useContext(mapContext);

  return (
    <IconButton onClick={mapMethods.toggleGeolocation}>
      <Location isActive={mapState?.isGeolocation} size="xl" />
    </IconButton>
  );
};
