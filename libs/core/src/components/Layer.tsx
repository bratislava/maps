import { useContext, useEffect } from 'react';
import { usePrevious } from '../hooks/usePrevious';
import { ALL_DISTRICTS_KEY } from '../utils/districts';
import { log } from '../utils/log';
import { mapContext } from './Mapbox';

export interface ILayerProps {
  source: string;
  styles: any;
  isVisible?: boolean;
  filters?: [string, string, string][];
  ignoreFilters?: boolean;
  ignoreClick?: boolean;
}

const Layer = ({
  source,
  styles,
  isVisible = true,
  filters,
  ignoreFilters = false,
  ignoreClick = false,
}: ILayerProps) => {
  const {
    map,
    getPrefixedLayer,
    isLoading,
    selectedDistrict,
    addClickableLayer,
    districtFiltering,
  } = useContext(mapContext);

  const labelId = 'road-label';
  const roadPathLayerId = 'road-path';

  const previousLoading = usePrevious(isLoading);
  const previousVisible = usePrevious(isVisible);
  const previousSelectedDistrict = usePrevious(selectedDistrict);
  const previousIgnoreFilters = usePrevious(ignoreFilters);
  const previousFilters = usePrevious(filters);

  useEffect(() => {
    if (!isLoading) {
      styles.forEach((style) => {
        if (!map.getLayer(getPrefixedLayer(style.id))) {
          map.addLayer(
            {
              source: source,
              ...style,
              id: getPrefixedLayer(style.id),
            },
            style.type === 'line'
              ? labelId
              : style.type === 'fill'
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
              'visibility',
              'visible'
            );
          } else {
            log(`SETTING LAYER ${getPrefixedLayer(style.id)} HIDDEN`);

            map.setLayoutProperty(
              getPrefixedLayer(style.id),
              'visibility',
              'none'
            );
          }
        }

        const resultFilters = [];

        if (!ignoreFilters) {
          if (filters && filters.length) {
            resultFilters.push(filters);
          }

          if (districtFiltering && !(selectedDistrict === ALL_DISTRICTS_KEY)) {
            resultFilters.push(['==', 'district', selectedDistrict]);
          }
        }

        map.setFilter(getPrefixedLayer(style.id), [
          'all',
          ...resultFilters.filter(
            (filter) => filter[0] && filter[1] && filter[2]
          ),
        ]);
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
    selectedDistrict,
    ignoreFilters,
    styles,
    previousIgnoreFilters,
    previousSelectedDistrict,
    previousFilters,
    ignoreClick,
    addClickableLayer,
    districtFiltering,
  ]);

  return null;
};

export default Layer;
