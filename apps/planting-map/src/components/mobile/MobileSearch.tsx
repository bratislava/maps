import { MapHandle } from "@bratislava/react-maps";
import { AddressPointFeature, AddressSearchBox } from "@bratislava/react-maps-ui";
import { RefObject, useCallback, useState } from "react";
import { Feature, Point } from "geojson";
export interface IMobileSearchProps {
  mapRef: RefObject<MapHandle>;
  isGeolocation: boolean;
  onSearchFeatureClick: (feature: Feature<Point>) => void;
  onSearchFeatureReset: () => void;
}

export const MobileSearch = ({
  mapRef,
  isGeolocation,
  onSearchFeatureClick,
  onSearchFeatureReset,
}: IMobileSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchFeatureClick = useCallback(
    (feature: AddressPointFeature) => {
      setSearchQuery(`${feature.properties.name} ${feature.properties.number}`);
      mapRef.current?.fitFeature(feature);
      onSearchFeatureClick(feature);
    },
    [mapRef, onSearchFeatureClick],
  );

  const onResetPress = useCallback(() => {
    setSearchQuery("");
    onSearchFeatureReset();
  }, [onSearchFeatureReset]);

  return (
    <div className="fixed bottom-8 left-4 right-4 z-10 shadow-lg rounded-lg sm:hidden">
      <AddressSearchBox
        direction="top"
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onResetPress={onResetPress}
        onAddressPress={handleSearchFeatureClick}
        isGeolocation={isGeolocation}
        onGeolocationClick={mapRef.current?.toggleGeolocation}
      />
      {/* <SearchBar
        value={searchQuery}
        placeholder={t("search")}
        onFocus={(e) => {
          forwardGeocode(import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN, e.target.value).then(
            (results) => setSearchFeatures(results),
          );
        }}
        onBlur={() => setSearchFeatures([])}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          forwardGeocode(import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN, e.target.value).then(
            (results) => setSearchFeatures(results),
          );
        }}
        isGeolocation={isGeolocation}
        onGeolocationClick={mapRef.current?.toggleGeolocation}
      />
      {!!searchFeatures.length && (
        <div className="w-full absolute z-20 shadow-lg bottom-11 sm:bottom-auto sm:top-full mb-3 bg-white rounded-lg py-4">
          {searchFeatures.map((feature: any, i) => {
            return (
              <button
                className="text-left w-full hover:bg-background px-4 py-2"
                onMouseDown={() => onSearchFeatureClick(feature)}
                key={i}
              >
                {feature.place_name_sk.split(",")[0]}
              </button>
            );
          })}
        </div>
      )} */}
    </div>
  );
};
