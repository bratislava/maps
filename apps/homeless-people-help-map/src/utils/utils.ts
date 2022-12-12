import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { FeatureCollection, Point } from "geojson";
import { data as rawData } from "../data/data";
import { featureCollection } from "@turf/helpers";
import { ILayer, ILayerGroup } from "@bratislava/react-maps-ui";

export const processData = () => {
  const data: FeatureCollection<Point> = addDistrictPropertyToLayer(
    featureCollection(
      rawData.features.map((f) => {
        return {
          ...f,
          properties: {
            ...f.properties,
          },
        };
      }),
    ),
  ) as FeatureCollection<Point>;

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district").sort(
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  );

  const layerGroups = data.features.reduce(
    (result, feature) => {
      const layer: ILayer<string> = {
        label: feature.properties?.name,
        value: feature.properties?.name,
      };

      if (feature.properties?.isCounseling) {
        result[0].layers = Array.isArray(result[0].layers)
          ? [...result[0].layers, layer]
          : [result[0].layers, layer];
      }

      if (feature.properties?.isCulture) {
        result[0].layers = Array.isArray(result[1].layers)
          ? [...result[1].layers, layer]
          : [result[1].layers, layer];
      }

      if (feature.properties?.isHygiene) {
        result[0].layers = Array.isArray(result[2].layers)
          ? [...result[2].layers, layer]
          : [result[2].layers, layer];
      }

      if (feature.properties?.isMeals) {
        result[0].layers = Array.isArray(result[3].layers)
          ? [...result[3].layers, layer]
          : [result[3].layers, layer];
      }

      if (feature.properties?.isMedicalTreatment) {
        result[0].layers = Array.isArray(result[4].layers)
          ? [...result[4].layers, layer]
          : [result[4].layers, layer];
      }

      if (feature.properties?.isOvernight) {
        result[0].layers = Array.isArray(result[5].layers)
          ? [...result[5].layers, layer]
          : [result[5].layers, layer];
      }

      return result;
    },
    [
      {
        label: "counseling",
        layers: [],
      },
      {
        label: "culture",
        layers: [],
      },
      {
        label: "hygiene",
        layers: [],
      },
      {
        label: "meals",
        layers: [],
      },
      {
        label: "medialTreatment",
        layers: [],
      },
      {
        label: "overnight",
        layers: [],
      },
    ] as ILayerGroup<string>[],
  );

  return {
    data,
    uniqueDistricts,
    layerGroups,
  };
};
