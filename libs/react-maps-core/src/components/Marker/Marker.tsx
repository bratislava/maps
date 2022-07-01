import React, { useState, useEffect, ReactNode, useContext } from "react";
import ReactDOM from "react-dom";
import { Marker as MapboxMarker } from "mapbox-gl";
import { mapboxContext } from "../Mapbox/Mapbox";

export interface IMarkerProps {
  children?: ReactNode;
  lat: number;
  lng: number;
}

export const Marker = ({ children, lat, lng }: IMarkerProps) => {
  const [marker, setMarker] = useState<MapboxMarker | null>(null);

  const { map } = useContext(mapboxContext);

  useEffect(() => {
    if (map) {
      if (!map) {
        console.warn("Marker component is suppousted to ");
        return;
      }

      const element = document.createElement("div");

      ReactDOM.render(<>{children}</>, element);

      console.log("Initializing marker");
      setMarker(
        new MapboxMarker({ element })
          .setLngLat([17.107748, 48.148598])
          .addTo(map)
      );
    }
  }, [map, children]);

  useEffect(() => {
    if (marker) {
      marker.setLngLat([lng, lat]);
    }
  }, [marker, lat, lng]);

  return null;
};
