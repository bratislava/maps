import React, {
  useEffect,
  ReactNode,
  useContext,
  useMemo,
  useCallback,
  useState,
  MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { Marker as MapboxMarker } from "mapbox-gl";
import { mapboxContext } from "../Mapbox/Mapbox";
import { filterContext } from "../Filter/Filter";
import { Feature, Point } from "geojson";

export interface IMarkerProps {
  children?: ReactNode;
  feature: Feature<Point>;
  isRelativeToZoom?: boolean;
  baseZoom?: number; // scale will be 1 at this zoom
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  ignoreFilters?: boolean;
}

export const Marker = ({
  children,
  feature,
  isRelativeToZoom = false,
  baseZoom = 20,
  className,
  onClick,
  ignoreFilters = false,
}: IMarkerProps) => {
  const { isFeatureVisible } = useContext(filterContext);
  const { map } = useContext(mapboxContext);

  const [scale, setScale] = useState(1);

  const marker: MapboxMarker = useMemo(() => {
    return new MapboxMarker({
      element: document.createElement("div"),
    }).setLngLat([0, 0]);
  }, []);

  const recalculateScale = useCallback(() => {
    const zoom = map?.getZoom();
    setScale((zoom ?? baseZoom) / baseZoom);
  }, [map, baseZoom]);

  useEffect(() => {
    if (isRelativeToZoom) {
      recalculateScale();
      map?.on("zoom", recalculateScale);
    }
    return () => {
      map?.off("zoom", recalculateScale);
    };
  }, [map, recalculateScale, isRelativeToZoom]);

  useEffect(() => {
    marker.setLngLat(feature.geometry.coordinates as [number, number]);
  }, [marker, feature.geometry.coordinates]);

  useEffect(() => {
    if (!map) return;

    marker.addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, marker]);

  const clickHandler = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onClick && onClick(e);
    },
    [onClick]
  );

  const isVisible = useMemo(() => {
    if (ignoreFilters) return true;

    if (isFeatureVisible) {
      return isFeatureVisible(feature);
    }
    return true;
  }, [feature, isFeatureVisible, ignoreFilters]);

  return createPortal(
    isVisible ? (
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
        className={className}
        onClick={clickHandler}
      >
        {children}
      </div>
    ) : (
      <div>nenisim</div>
    ),
    marker.getElement()
  );
};
