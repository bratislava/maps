import { useCallback, useContext, useEffect, useState } from "react";
import { usePrevious } from "@bratislava/utils";
import { log } from "../../utils/log";
import { mapboxContext } from "../Mapbox/Mapbox";
import {
  Feature,
  LineString as GeoJsonLineString,
  GeoJsonProperties,
} from "geojson";
import { useSpring } from "framer-motion";

import {
  featureCollection,
  lineString,
  length,
  lineChunk,
  point,
} from "@turf/turf";

export interface ILineStringProps {
  id: string;
  styles: any;
  isVisible?: boolean;
  coordinates: Feature<GeoJsonLineString>["geometry"]["coordinates"];
  visiblePart?: number;
  duration?: number;
  onAnimationDone?: () => void;
}

export const LineString = ({
  id,
  styles,
  coordinates,
  isVisible = true,
  visiblePart = 1,
  duration = 1000,
  onAnimationDone = () => void 0,
}: ILineStringProps) => {
  const {
    map,
    isLoading,
    getPrefixedLayer,
    isStyleLoading,
    addClickableLayer,
  } = useContext(mapboxContext);

  const springVisiblePart = useSpring(0, {
    duration,
  });

  useEffect(() => {
    springVisiblePart.set(visiblePart);
  }, [springVisiblePart, visiblePart]);

  const previousLoading = usePrevious(isLoading);
  const previousVisible = usePrevious(isVisible);

  const [isSourceAdded, setSourceAdded] = useState(false);

  const [line, setLine] = useState<
    Feature<GeoJsonLineString, GeoJsonProperties>
  >(lineString(coordinates));

  useEffect(() => {
    const line = lineString(coordinates);
    const lineLength = length(line, { units: "meters" });
    line.properties
      ? (line.properties.length = lineLength)
      : (line.properties = { length: lineLength });
    setLine(line);
  }, [coordinates]);

  useEffect(() => {
    if (map && !isLoading && !isStyleLoading) {
      map.addSource(id, {
        type: "geojson",
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
              "visibility",
              "visible"
            );
          } else {
            log(`SETTING LAYER ${getPrefixedLayer(style.id)} HIDDEN`);

            map.setLayoutProperty(
              getPrefixedLayer(style.id),
              "visibility",
              "none"
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

  const drawLineHandler = useCallback(
    (value: number) => {
      const fullLineLength = (line.properties?.length as number) ?? 0;

      const visibleLineLength = fullLineLength * value;

      const source = map?.getSource(id);

      if (value === 1) {
        onAnimationDone();
      }

      if (visibleLineLength === 0) {
        if (isSourceAdded && source && source.type === "geojson") {
          source.setData(
            featureCollection([
              lineString([
                [0, 0],
                [0, 0],
              ]),
            ])
          );
        }
        return;
      }

      const visibleLine = lineChunk(line, visibleLineLength, {
        units: "meters",
      }).features[0];

      if (isSourceAdded && source && source.type === "geojson") {
        source.setData(featureCollection([visibleLine]));
      }
    },
    [id, isSourceAdded, line, map, onAnimationDone]
  );

  useEffect(() => {
    drawLineHandler(springVisiblePart.get());
    return springVisiblePart.onChange(drawLineHandler);
  }, [springVisiblePart, drawLineHandler]);

  return null;
};
