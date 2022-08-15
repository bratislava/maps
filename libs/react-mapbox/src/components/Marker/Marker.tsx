import { Feature, Point } from "geojson";
import { Marker as MapboxMarker } from "mapbox-gl";
import {
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { filterContext } from "../Filter/Filter";
import { mapboxContext } from "../Mapbox/Mapbox";

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
  baseZoom = 12,
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
    if (isRelativeToZoom) {
      const zoom = map?.getZoom() ?? 0;
      const scalePercent = 1 + (zoom - baseZoom) * 0.25;
      setScale(scalePercent);
    } else {
      setScale(1);
    }
  }, [map, baseZoom, isRelativeToZoom]);

  useEffect(() => {
    recalculateScale();
    map?.on("zoom", recalculateScale);
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
      e.stopPropagation();
      onClick && onClick(e);
    },
    [onClick]
  );

  const isVisible = useMemo(() => {
    if (ignoreFilters) return true;

    if (isFeatureVisible) {
      console.log(isFeatureVisible(feature));
      return isFeatureVisible(feature);
    }
    return true;
  }, [feature, isFeatureVisible, ignoreFilters]);

  return createPortal(
    isVisible ? (
      <div
        onMouseMove={(e) => e.stopPropagation()}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
        className={className}
        onClick={clickHandler}
      >
        {children}
      </div>
    ) : null,
    marker.getElement()
  );
};
