import { ComboBox } from "@bratislava/react-maps-ui";
import { useCallback, useContext, useMemo, useState } from "react";
import { Location, MagnifyingGlass, X } from "@bratislava/react-maps-icons";
import { useMapboxSearch } from "../../hooks/useMapboxSearch";
import { mapContext } from "../Map/Map";
import { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { point } from "@turf/helpers";

export interface ISearchBarProps {
  direction?: "top" | "bottom";
  language: string;
  placeholder: string;
}

export const SearchBar = ({
  direction,
  language,
  placeholder,
}: ISearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

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
      results?.map((result) => ({
        // ugly workaround for ugly addresses from mapbox
        title: result.text + (result.address ? ` ${result.address}` : ""),
        value: result.place_name,
        feature: result,
      })) ?? []
    );
  }, [results]);

  const handleOptionPress = useCallback(
    (option: { title: string; value: string; feature: GeocodeFeature }) => {
      mapMethods.addSearchMarker({
        lng: option.feature.geometry.coordinates[0],
        lat: option.feature.geometry.coordinates[1],
      });
      mapMethods.fitFeature(point(option.feature.geometry.coordinates), {
        padding: 200,
      });
    },
    [mapMethods]
  );

  const handleResetPress = useCallback(() => {
    mapMethods.removeSearchMarker();
    setSearchQuery("");
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
        <div className="absolute right-[3px] gap-[4px] bottom-0 top-0 flex items-center">
          {searchQuery && searchQuery.length && (
            <>
              <button className="p-2" onClick={handleResetPress}>
                <X size="sm" />
              </button>
              <div className="h-8 bg-gray-lightmode dark:bg-gray-darkmode opacity-20 w-[2px]"></div>
            </>
          )}
          <div className="p-2">
            <MagnifyingGlass size="lg" />
          </div>
          <div className="md:hidden h-8 bg-gray-lightmode dark:bg-gray-darkmode opacity-20 w-[2px]"></div>
          <button
            onClick={mapMethods.toggleGeolocation}
            className="md:hidden h-10 flex items-center justify-center p-2 translate-x-[1px]"
          >
            <Location size="lg" isActive={mapState?.isGeolocation} />
          </button>
        </div>
      }
    />
  );
};
