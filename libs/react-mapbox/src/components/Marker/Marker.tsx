import { Feature, Point } from 'geojson';
import { Marker as MapboxMarker } from 'mapbox-gl';
import {
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { filterContext } from '../Filter/Filter';
import { mapboxContext } from '../Mapbox/Mapbox';
import { motion } from 'framer-motion';

export interface IMarkerProps {
  children?: ReactNode;
  feature: Feature<Point>;
  isRelativeToZoom?: boolean;
  baseZoom?: number; // scale will be 1 at this zoom
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  ignoreFilters?: boolean;
  origin?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  zIndex?: number;
}

export const Marker = ({
  children,
  feature,
  isRelativeToZoom = false,
  baseZoom = 12,
  className,
  onClick,
  ignoreFilters = false,
  origin = 'center',
  zIndex = 0,
}: IMarkerProps) => {
  const { isFeatureVisible } = useContext(filterContext);
  const { map } = useContext(mapboxContext);

  const [scale, setScale] = useState(1);

  const marker: MapboxMarker = useMemo(() => {
    return new MapboxMarker({
      element: document.createElement('div'),
    }).setLngLat([0, 0]);
  }, []);

  const recalculateScale = useCallback(() => {
    if (isRelativeToZoom) {
      const zoom = map?.getZoom() ?? 0;
      const scalePercent = 1 + (zoom - baseZoom) * 0.25;
      setScale(Math.max(scalePercent, 0));
    } else {
      setScale(1);
    }
  }, [map, baseZoom, isRelativeToZoom]);

  useEffect(() => {
    recalculateScale();
    map?.on('zoom', recalculateScale);
    return () => {
      map?.off('zoom', recalculateScale);
    };
  }, [map, recalculateScale, isRelativeToZoom]);

  useEffect(() => {
    marker.setLngLat(feature.geometry.coordinates as [number, number]);
  }, [marker, feature.geometry.coordinates]);

  useEffect(() => {
    if (!map) return;

    marker.addTo(map);
    const element = marker.getElement();
    element.setAttribute('style', `${element.style}; z-index: ${zIndex};`);

    return () => {
      marker.remove();
    };
  }, [map, marker, zIndex]);

  const clickHandler = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onClick && onClick(e);
    },
    [onClick],
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
          transformOrigin: origin,
          transform: `scale(${scale})`,
          background: 'red',
          width: 0,
          height: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
        className={className}
      >
        <motion.div
          onMouseMove={(e) => e.stopPropagation()}
          initial={{ scale: 0 }}
          exit={{ scale: 0 }}
          animate={{
            scale: 1,
          }}
          onClick={clickHandler}
          style={{
            position: 'absolute',
            [origin]: 0,
          }}
        >
          {children}
        </motion.div>
      </div>
    ) : null,

    marker.getElement(),
  );
};
