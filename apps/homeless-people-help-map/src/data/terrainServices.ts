import { useTerenneSluzbyQuery } from "../../graphql";
import { useTranslation } from "react-i18next";
import { featureCollection } from "@turf/helpers";
import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";
import { REGIONS } from "./regions";
import { ITerrainService } from "../utils/types";

export const useTerrainServices = () => {
  const { i18n } = useTranslation();
  const { data, isLoading, error } = useTerenneSluzbyQuery({ locale: i18n.language });

  return {
    dataByService:
      data &&
      // map to format of old data
      data?.terenneSluzbies?.data.map((service) => {
        return {
          key: service.id,
          title: service.attributes?.Nazov,
          provider: service.attributes?.Poskytovatel,
          phone: service.attributes?.Telefon,
          available: service.attributes?.Dostupnost,
          price: service.attributes?.Cena_kapacita,
          areas: service.attributes?.Lokalita_posobnosti,
          geojson: featureCollection([
            ...DISTRICTS_GEOJSON.features.filter((feature) => {
              return service.attributes?.Lokalita_posobnosti?.split(",")
                .map((s) => s.trim())
                .includes(feature.properties.name.trim());
            }),
            ...REGIONS.features.filter((feature) => {
              if (!feature?.properties?.name) return;
              return service.attributes?.Lokalita_posobnosti?.split(",")
                .map((s) => s.trim())
                .includes(feature.properties.name.trim());
            }),
          ]),
        } as ITerrainService;
      }),
    dataGroupedByRegion:
      data &&
      DISTRICTS_GEOJSON.features
        .map((feature) => {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              terrainServices: data?.terenneSluzbies?.data
                .filter((service) => {
                  if (
                    service.attributes?.Lokalita_posobnosti?.split(",")
                      .map((s) => s.trim())
                      .includes(feature.properties.name.trim())
                  ) {
                    return service;
                  }
                })
                .map((service) => {
                  return {
                    key: service.id,
                    title: service.attributes?.Nazov,
                    provider: service.attributes?.Poskytovatel,
                    phone: service.attributes?.Telefon,
                    available: service.attributes?.Dostupnost,
                    price: service.attributes?.Cena_kapacita,
                    areas: service.attributes?.Lokalita_posobnosti,
                  };
                }),
            },
          };
        })
        .filter((region) => region.properties.terrainServices?.length),
    isLoading,
    error,
  };
};
