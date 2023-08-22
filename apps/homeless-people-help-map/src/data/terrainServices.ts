import { useTerenneSluzbyQuery } from "../../graphql";
import { useTranslation } from "react-i18next";
import { featureCollection } from "@turf/helpers";
import { DISTRICTS_GEOJSON } from "@bratislava/geojson-data";
import { ITerrainService } from "../components/Layers";

export const useTerrainServices = () => {
  const { i18n } = useTranslation();
  const { data, isLoading, error } = useTerenneSluzbyQuery({ locale: i18n.language });

  return {
    data:
      data &&
      // map to format of old data
      data?.terenneSluzbies?.data.map(
        (service) =>
          ({
            key: service.id,
            title: service.attributes?.Nazov,
            provider: service.attributes?.Poskytovatel,
            phone: service.attributes?.Telefon,
            available: service.attributes?.Dostupnost,
            price: service.attributes?.Cena_kapacita,
            geojson: featureCollection(
              DISTRICTS_GEOJSON.features.filter((feature) =>
                service.attributes?.Lokalita_posobnosti?.split(",").includes(
                  feature.properties.name,
                ),
              ),
            ),
          } as ITerrainService),
      ),
    isLoading,
    error,
  };
};
