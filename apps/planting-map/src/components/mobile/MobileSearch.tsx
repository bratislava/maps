import { forwardGeocode, GeocodeFeature, MapHandle } from "@bratislava/react-maps-core";
import { SearchBar } from "@bratislava/react-maps-ui";
import { RefObject, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import mapboxgl from "mapbox-gl";

export interface IMobileSearchProps {
  mapRef: RefObject<MapHandle>;
  mapboxgl: typeof mapboxgl;
  isGeolocation: boolean;
}

export const MobileSearch = ({ mapRef, mapboxgl, isGeolocation }: IMobileSearchProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFeatures, setSearchFeatures] = useState<GeocodeFeature[]>([]);

  const onSearchFeatureClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any) => {
      setSearchQuery(feature.place_name_sk.split(",")[0]);
      setSearchFeatures([]);
      if (feature.geometry.type === "Point") {
        mapRef.current?.changeViewport({
          center: {
            lng: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
          },
          zoom: 17,
        });
      }
    },
    [mapRef],
  );

  const { t } = useTranslation();

  return (
    <div className="fixed bottom-8 left-4 right-4 z-10 shadow-lg rounded-lg sm:hidden">
      <SearchBar
        value={searchQuery}
        placeholder={t("search")}
        onFocus={(e) => {
          forwardGeocode(mapboxgl, e.target.value).then((results) => setSearchFeatures(results));
        }}
        onBlur={() => setSearchFeatures([])}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          forwardGeocode(mapboxgl, e.target.value).then((results) => setSearchFeatures(results));
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
      )}
    </div>
  );
};
