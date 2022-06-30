import { useRef, FC, useCallback, useMemo } from "react";
import { MapHandle } from "../components/Map/Map";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
export interface IUseMapProps {
  mapboxAccessToken: string;
}

export interface IUseMap extends MapHandle {
  mapboxgl: typeof mapboxgl;
}

export const useMap = ({ mapboxAccessToken }: IUseMapProps) => {
  const ref = useRef<MapHandle>(null);

  mapboxgl.accessToken = mapboxAccessToken;

  const changeViewport = useCallback(
    ref.current?.changeViewport ?? (() => void 0),
    [ref]
  );

  const deselectAllFeatures = useCallback(
    ref.current?.deselectAllFeatures ?? (() => void 0),
    [ref]
  );

  const fitToDistrict = useCallback(
    ref.current?.fitToDistrict ?? (() => void 0),
    [ref]
  );

  const turnOnGeolocation = useCallback(
    ref.current?.turnOnGeolocation ?? (() => void 0),
    [ref]
  );

  const turnOffGeolocation = useCallback(
    ref.current?.turnOffGeolocation ?? (() => void 0),
    [ref]
  );

  const toggleGeolocation = useCallback(
    ref.current?.toggleGeolocation ?? (() => void 0),
    [ref]
  );

  return {
    ref,
    mapboxgl,
    deselectAllFeatures,
    changeViewport,
    fitToDistrict,
    turnOnGeolocation,
    turnOffGeolocation,
    toggleGeolocation,
  };
};
