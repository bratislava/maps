import React, { useEffect, ReactNode, useContext, useMemo } from "react";
import { createPortal } from "react-dom";
import { Marker as MapboxMarker } from "mapbox-gl";
import { mapboxContext } from "../Mapbox/Mapbox";

export interface IMarkerProps {
  children?: ReactNode;
  lat: number;
  lng: number;
}

export const Marker = ({ children, lat, lng }: IMarkerProps) => {
  const { map } = useContext(mapboxContext);

  const marker: MapboxMarker = useMemo(() => {
    return new MapboxMarker({
      element: document.createElement("div"),
    }).setLngLat([0, 0]);
  }, []);

  useEffect(() => {
    marker.setLngLat([lng, lat]);
  }, [marker, lat, lng]);

  useEffect(() => {
    if (!map) return;

    marker.addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, marker]);

  return createPortal(children, marker.getElement());
};
