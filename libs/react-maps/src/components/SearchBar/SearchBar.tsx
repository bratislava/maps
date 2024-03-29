import { Location, MagnifyingGlass, X } from '@bratislava/react-maps-icons';
import { ComboBox } from '@bratislava/react-maps-ui';
import { GeocodeFeature } from '@mapbox/mapbox-sdk/services/geocoding';
import { point } from '@turf/helpers';
import { useCallback, useContext, useMemo, useState } from 'react';

import { useMapboxSearch } from '../../hooks/useMapboxSearch';
import { mapContext } from '../Map/Map';

export interface ISearchBarProps {
  direction?: 'top' | 'bottom';
  language: string;
  placeholder: string;
}

export function SearchBar({
  direction,
  language,
  placeholder,
}: ISearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    mapState,
    mapboxAccessToken,
    methods: mapMethods,
  } = useContext(mapContext);

  const { results } = useMapboxSearch({
    searchQuery,
    language,
    mapboxAccessToken,
  });

  const options = useMemo(() => {
    return (
      results?.map((result) => {
        if (result.place_type.includes('poi')) {
          return {
            title:
              result.text +
              (result.properties.address
                ? `, ${result.properties.address}`
                : ''),
            label: (
              <div>
                {result.text}
                <span className="font-normal opacity-75">
                  {result.properties.address
                    ? `, ${result.properties.address}`
                    : ''}
                </span>
              </div>
            ),
            value: result.place_name,
            feature: result,
          };
        }

        return {
          // ugly workaround for ugly addresses from mapbox
          title: result.text + (result.address ? ` ${result.address}` : ''),
          label: result.text + (result.address ? ` ${result.address}` : ''),
          value: result.place_name,
          feature: result,
        };
      }) ?? []
    );
  }, [results]);

  const handleOptionPress = useCallback(
    (option: { title: string; value: string; feature: GeocodeFeature }) => {
      mapMethods.addSearchMarker({
        lng: option.feature.geometry.coordinates[0],
        lat: option.feature.geometry.coordinates[1],
      });
      mapMethods.moveToFeatures(point(option.feature.geometry.coordinates), {
        zoom: 16,
      });
    },
    [mapMethods],
  );

  const handleResetPress = useCallback(() => {
    mapMethods.removeSearchMarker();
    setSearchQuery('');
  }, [mapMethods]);

  return (
    <ComboBox
      direction={direction}
      options={options}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onOptionPress={handleOptionPress}
      placeholder={placeholder}
      rightSlot={
        <div className="absolute inset-y-0 right-[3px] flex items-center gap-[4px]">
          {searchQuery && searchQuery.length > 0 ? (
            <button className="p-3" onClick={handleResetPress}>
              <X size="sm" />
            </button>
          ) : (
            <div className="p-2">
              <MagnifyingGlass size="lg" />
            </div>
          )}
          <div className="bg-gray-lightmode dark:bg-gray-darkmode h-8 w-[2px] opacity-20 md:hidden" />
          <button
            onClick={mapMethods.toggleGeolocation}
            className="flex h-10 translate-x-[1px] items-center justify-center p-2 md:hidden"
          >
            <Location size="lg" isActive={mapState?.isGeolocation} />
          </button>
        </div>
      }
    />
  );
}
