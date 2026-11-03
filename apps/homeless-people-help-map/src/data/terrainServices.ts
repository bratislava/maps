import { useTerenneSluzbyQuery } from "../../graphql";
import { useTranslation } from "react-i18next";
import { featureCollection } from "@turf/helpers";
import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";
import { REGIONS } from "./regions";
import { ITerrainService } from "../utils/types";
import { sortByName } from "../utils/sortByName";

export const useTerrainServices = () => {
  const { i18n } = useTranslation();
  const { data, isLoading, error } = useTerenneSluzbyQuery({ locale: i18n.language });
  const services = data && sortByName(data.terenneSluzbies, i18n.language);

  return {
    dataByService:
      data &&
      // map to format of old data
      services?.map((service) => {
        return {
          key: service?.documentId,
          title: service?.Nazov,
          provider: service?.Poskytovatel,
          phone: service?.Telefon,
          available: service?.Dostupnost,
          price: service?.Cena_kapacita,
          areas: service?.Lokalita_posobnosti,
          geojson: featureCollection([
            ...DISTRICTS_GEOJSON.features.filter((feature) => {
              return service?.Lokalita_posobnosti?.split(",")
                .map((s) => s.trim())
                .includes(feature.properties.name.trim());
            }),
            ...REGIONS.features.filter((feature) => {
              if (!feature?.properties?.name) return;
              return service?.Lokalita_posobnosti?.split(",")
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
              terrainServices: services
                ?.filter((service) => {
                  if (
                    service?.Lokalita_posobnosti?.split(",")
                      .map((s) => s.trim())
                      .includes(feature.properties.name.trim())
                  ) {
                    return service;
                  }
                })
                .map((service) => {
                  return {
                    key: service?.documentId,
                    title: service?.Nazov,
                    provider: service?.Poskytovatel,
                    phone: service?.Telefon,
                    available: service?.Dostupnost,
                    price: service?.Cena_kapacita,
                    areas: service?.Lokalita_posobnosti,
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
