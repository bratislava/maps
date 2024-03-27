import { useCallback, useContext, useEffect, useState } from 'react';
import { usePrevious } from '../../../../../libs/utils/src';
import { log } from '../../utils/log';
import { mapboxContext } from '../Mapbox/Mapbox';
import {
  Feature,
  LineString as GeoJsonLineString,
  GeoJsonProperties,
} from 'geojson';
import { animate } from 'framer-motion';

import lineSliceAlong from '@turf/line-slice-along';

import length from '@turf/length';
import { featureCollection, lineString } from '@turf/helpers';

export interface AnimationChangeEvent {
  value: number;
  center: { lat: number; lng: number };
}

export interface ILineStringProps {
  id: string;
  styles: any;
  isVisible?: boolean;
  coordinates: Feature<GeoJsonLineString>['geometry']['coordinates'];
  visiblePart?: number;
  initialVisiblePart?: number;
  duration?: number;
  onAnimationDone?: () => void;
  onAnimationChange?: (event: AnimationChangeEvent) => void;
}

export const LineString = ({
  id,
  styles,
  coordinates,
  isVisible = true,
  visiblePart = 1,
  initialVisiblePart = 0,
  duration = 1000,
  onAnimationDone,
  onAnimationChange,
}: ILineStringProps) => {
  const {
    map,
    isLoading,
    getPrefixedLayer,
    isStyleLoading,
    addClickableLayer,
  } = useContext(mapboxContext);

  const previousLoading = usePrevious(isLoading);
  const previousVisible = usePrevious(isVisible);

  const [isSourceAdded, setSourceAdded] = useState(false);

  const [line, setLine] = useState<
    Feature<GeoJsonLineString, GeoJsonProperties>
  >(lineString(coordinates));

  useEffect(() => {
    const line = lineString(coordinates);
    const lineLength = length(line, { units: 'meters' });
    line.properties
      ? (line.properties.length = lineLength)
      : (line.properties = { length: lineLength });
    setLine(line);
  }, [coordinates]);

  useEffect(() => {
    if (map && !isLoading && !isStyleLoading) {
      map.addSource(id, {
        type: 'geojson',
        data: featureCollection([]),
      });
      setSourceAdded(true);

      styles.forEach((style: any) => {
        const isLayerAlreadyThere = map.getLayer(getPrefixedLayer(style.id));
        if (!isLayerAlreadyThere) {
          map.addLayer({
            source: id,
            ...style,
            id: getPrefixedLayer(style.id),
          });
        }
        if (
          previousVisible !== isVisible ||
          isLoading !== previousLoading ||
          !isLayerAlreadyThere
        ) {
          if (isVisible) {
            log(`SETTING LAYER ${getPrefixedLayer(style.id)} VISIBLE`);

            map.setLayoutProperty(
              getPrefixedLayer(style.id),
              'visibility',
              'visible',
            );
          } else {
            log(`SETTING LAYER ${getPrefixedLayer(style.id)} HIDDEN`);

            map.setLayoutProperty(
              getPrefixedLayer(style.id),
              'visibility',
              'none',
            );
          }
        }
      });
    }

    return () => {
      // cleaning
      if (map && !isLoading && !isStyleLoading) {
        styles.forEach((style: any) => {
          if (map.getLayer(getPrefixedLayer(style.id)))
            map.removeLayer(getPrefixedLayer(style.id));
        });
        if (map.getSource(id)) map.removeSource(id);
        setSourceAdded(false);
      }
    };
  }, [
    isLoading,
    map,
    previousVisible,
    isVisible,
    getPrefixedLayer,
    isStyleLoading,
    styles,
    addClickableLayer,
    previousLoading,
    id,
    coordinates,
    line,
  ]);

  const completeHandler = useCallback(() => {
    onAnimationDone && onAnimationDone();
  }, [onAnimationDone]);

  const drawLineHandler = useCallback(
    (value: number) => {
      const fullLineLength = (line.properties?.length as number) ?? 0;

      const visibleLineLength = fullLineLength * value;

      const source = map?.getSource(id);

      if (visibleLineLength === 0) {
        if (isSourceAdded && source && source.type === 'geojson') {
          source.setData(featureCollection([]));
        }
      } else {
        const visibleLine = lineSliceAlong(line, 0, visibleLineLength, {
          units: 'meters',
        });

        const coordinates = visibleLine.geometry.coordinates;
        const coordinatesLength = coordinates.length;
        const lastCoordinate = coordinates[coordinatesLength - 1];

        onAnimationChange &&
          onAnimationChange({
            value,
            center: { lng: lastCoordinate[0], lat: lastCoordinate[1] },
          });

        if (visiblePart === value) {
          completeHandler();
        }

        if (isSourceAdded && source && source.type === 'geojson') {
          source.setData(featureCollection([visibleLine]));
        }
      }
    },
    [
      id,
      isSourceAdded,
      line,
      map,
      completeHandler,
      visiblePart,
      onAnimationChange,
    ],
  );

  useEffect(() => {
    if (initialVisiblePart === visiblePart) {
      drawLineHandler(visiblePart);
    } else {
      const animation = animate(initialVisiblePart, visiblePart, {
        duration,
        onUpdate: drawLineHandler,
      });
      return () => {
        if (animation.isAnimating()) animation.stop();
      };
    }
  }, [
    completeHandler,
    drawLineHandler,
    duration,
    initialVisiblePart,
    visiblePart,
  ]);

  return null;
};
