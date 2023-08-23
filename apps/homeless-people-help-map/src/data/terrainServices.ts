import { useTerenneSluzbyQuery } from "../../graphql";
import { useTranslation } from "react-i18next";
import { featureCollection } from "@turf/helpers";
import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";
import { ITerrainService } from "../components/Layers";
import { regions } from "./regions";

export const useTerrainServices = () => {
  const { i18n } = useTranslation();
  const { data, isLoading, error } = useTerenneSluzbyQuery({ locale: i18n.language });

  return {
    data:
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
          geojson: featureCollection([
            ...DISTRICTS_GEOJSON.features.filter((feature) => {
              return service.attributes?.Lokalita_posobnosti?.split(",")
                .map((s) => s.trim())
                .includes(feature.properties.name.trim());
            }),
            ...regions.features.filter((feature) => {
              if (!feature?.properties?.name) return;
              return service.attributes?.Lokalita_posobnosti?.split(",")
                .map((s) => s.trim())
                .includes(feature.properties.name.trim());
            }),
          ]),
        } as ITerrainService;
      }),
    isLoading,
    error,
  };
};
