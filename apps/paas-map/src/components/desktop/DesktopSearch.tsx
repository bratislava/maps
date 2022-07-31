import cx from "classnames";
import { forwardGeocode, GeocodeFeature, MapHandle } from "@bratislava/react-maps";
import { SearchBar } from "@bratislava/react-maps-ui";
import { RefObject, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import mapboxgl from "mapbox-gl";

export interface IDesktopSearchProps {
  mapRef: RefObject<MapHandle>;
  mapboxgl: typeof mapboxgl;
  isGeolocation: boolean;
  areFiltersOpen: boolean;
}

export const DesktopSearch = ({
  mapRef,
  mapboxgl,
  isGeolocation,
  areFiltersOpen,
}: IDesktopSearchProps) => {
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
          zoom: 18,
        });
      }
    },
    [mapRef],
  );

  const { t } = useTranslation();

  return (
    <div
      className={cx(
        "fixed top-[18px] left-10 w-72 z-10 shadow-lg rounded-lg transition-transform duration-500",
        {
          "translate-x-96": areFiltersOpen,
        },
      )}
    >
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
        <div className="w-full absolute z-20 shadow-lg top-full mb-3 bg-white rounded-lg py-4">
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
