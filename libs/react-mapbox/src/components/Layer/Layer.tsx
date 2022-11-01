import { useContext, useEffect, useId } from 'react';
import { usePrevious } from '@bratislava/utils';
import { log } from '../../utils/log';
import { mapboxContext } from '../Mapbox/Mapbox';
import { FeatureCollection } from 'geojson';

type Filter = string | null | boolean | Filter[];

export interface ILayerProps {
  geojson: FeatureCollection;
  styles: any;
  isVisible?: boolean;
  filters?: Filter[];
  ignoreFilters?: boolean;
  ignoreClick?: boolean;
}

export const Layer = ({
  geojson,
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
    layerPrefix,
  } = useContext(mapboxContext);

  const layerIdStartsWith = 'label';

  const previousLoading = usePrevious(isLoading);
  const previousVisible = usePrevious(isVisible);
  const previousIgnoreFilters = usePrevious(ignoreFilters);
  const previousFilters = usePrevious(filters);

  const id = useId();

  useEffect(() => {
    if (map && !isLoading && !isStyleLoading) {
      styles.forEach((style: any) => {
        if (!map) return;

        const existingSource = map.getSource(id);

        if (!!existingSource && existingSource.type === 'geojson') {
          existingSource.setData(geojson);
        } else {
          map.addSource(id, {
            type: 'geojson',
            data: geojson,
            tolerance: 0,
          });
        }

        if (!map.getLayer(getPrefixedLayer(style.id))) {
          const layerId = map
            .getStyle()
            .layers.find((layer) => layer.id.includes(layerIdStartsWith))?.id;

          const layers = map.getStyle().layers;
          const bottomLayer = layers.find((layer) =>
            layer.id.startsWith(layerPrefix),
          );
          map.addLayer(
            {
              source: id,
              ...style,
              id: getPrefixedLayer(style.id),
            },
            style.type === 'line' || style.type === 'circle'
              ? layerId
              : style.type === 'fill'
              ? bottomLayer?.id
              : undefined,
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

        const resultFilters: Filter[] = [];

        if (!ignoreFilters) {
          if (filters && filters.length) {
            resultFilters.push(...filters);
          }
        }

        if (resultFilters && resultFilters.length) {
          map.setFilter(
            getPrefixedLayer(style.id),
            resultFilters.filter((filter) => filter),
          );
        } else {
          map.setFilter(getPrefixedLayer(style.id), null);
        }
      });
    }
  }, [
    isLoading,
    geojson,
    id,
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
    previousLoading,
    layerPrefix,
  ]);

  return null;
};
