import { useContext, useEffect, useState } from "react";
import { usePrevious } from "@bratislava/utils";
import { log } from "../../utils/log";
import { mapboxContext } from "../Mapbox/Mapbox";
import {
  Feature,
  LineString as GeoJsonLineString,
  GeoJsonProperties,
} from "geojson";
import { useSpring } from "framer-motion";

import { featureCollection, lineString, length, lineChunk } from "@turf/turf";

export interface ILineStringProps {
  id: string;
  styles: any;
  isVisible?: boolean;
  coordinates: Feature<GeoJsonLineString>["geometry"]["coordinates"];
  visiblePart?: number;
  duration?: number;
}

export const LineString = ({
  id,
  styles,
  coordinates,
  isVisible = true,
  visiblePart = 1,
  duration = 1000,
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

  useEffect(
    () =>
      springVisiblePart.onChange((value) => {
        const fullLineLength = (line.properties?.length as number) ?? 0;

        const visibleLineLength = fullLineLength * value;

        const visibleLine = lineChunk(line, visibleLineLength, {
          units: "meters",
        }).features[0];

        const source = map?.getSource(id);

        if (isSourceAdded && source && source.type === "geojson") {
          source.setData(featureCollection([visibleLine]));
        }
      }),
    [id, line, map, springVisiblePart, isSourceAdded]
  );

  return null;
};
