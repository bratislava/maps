import { useContext, useEffect } from "react";
import { usePrevious } from "../../hooks/usePrevious";
import { log } from "../../utils/log";
import { mapboxContext } from "../Mapbox/Mapbox";

type Filter = string | null | boolean | Filter[];

export interface ILayerProps {
  source: string;
  styles: any;
  isVisible?: boolean;
  filters?: Filter[];
  ignoreFilters?: boolean;
  ignoreClick?: boolean;
}

export const Layer = ({
  source,
  styles,
  isVisible = true,
  filters = [],
  ignoreFilters = false,
  ignoreClick = false,
}: ILayerProps) => {
  const {
    map,
    getPrefixedLayer,
    isLoading,
    isStyleLoading,
    addClickableLayer,
  } = useContext(mapboxContext);

  const labelId = "road-label";
  const roadPathLayerId = "road-path";

  const previousLoading = usePrevious(isLoading);
  const previousVisible = usePrevious(isVisible);
  const previousIgnoreFilters = usePrevious(ignoreFilters);
  const previousFilters = usePrevious(filters);

  useEffect(() => {
    if (map && !isLoading && !isStyleLoading) {
      styles.forEach((style: any) => {
        if (!map.getLayer(getPrefixedLayer(style.id))) {
          map.addLayer(
            {
              source: source,
              ...style,
              id: getPrefixedLayer(style.id),
            },
            style.type === "line" || style.type === "circle"
              ? labelId
              : style.type === "fill"
              ? roadPathLayerId
              : undefined
          );

          if (!ignoreClick) {
            addClickableLayer(getPrefixedLayer(style.id));
          }
        }

        if (previousVisible !== isVisible || isLoading !== previousLoading) {
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

        const resultFilters: Filter[] = [];

        if (!ignoreFilters) {
          if (filters && filters.length) {
            resultFilters.push(...filters);
          }
        }

        if (resultFilters && resultFilters.length) {
          map.setFilter(
            getPrefixedLayer(style.id),
            resultFilters.filter((filter) => filter)
          );
        }
      });
    }
  }, [
    isLoading,
    source,
    map,
    previousVisible,
    isVisible,
    filters,
    getPrefixedLayer,
    isStyleLoading,
    ignoreFilters,
    styles,
    previousIgnoreFilters,
    previousFilters,
    ignoreClick,
    addClickableLayer,
  ]);

  return null;
};