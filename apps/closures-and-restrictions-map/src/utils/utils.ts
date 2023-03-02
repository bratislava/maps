import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { featureCollection } from "@turf/helpers";
import { Feature, FeatureCollection } from "geojson";

export interface IProcessDataProps {
  rawDisordersData: FeatureCollection;
  rawDigupsAndClosuresData: FeatureCollection;
  // rawRepairsPointsData: FeatureCollection;
  // rawRepairsPolygonsData: FeatureCollection;
}

export type TLayer = 'disorders' | 'closures' | 'digups';
export type TIcon = 'disorder' | 'closure' | 'digup';
export type TStatus = 'planned' | 'active' | 'done';

export interface IFeatureProps {
  objectId?: number;
  subject: string | null;
  type: Array<string>;
  address: string | null;
  startTimestamp: number | null;
  endTimestamp: number | null;
  length: number | null;
  width: number | null;
  fullSize: number | null;
  investor: string | null;
  contractor: string | null;
  layer: TLayer;
  icon: TIcon;
  infoForResidents?: string | null;
  status: TStatus;
  imageUrl?: string;
  originalProperties: any;
}

const currentTimestamp = Date.now();

const parseSlovakTypeToKey = (slovakType: string) => {
  const slovakTypes = slovakType.split(",").map((t) => t.trim());
  const mapSlovakTypeToKeyObject: { [index: string]: string } = {
    Kanalizacia: "sewerage",
    Optika: "optics",
    Plyn: "gas",
    VN: "highVoltage",
    Voda: "sewerage",
  };
  return slovakTypes.map((t) => mapSlovakTypeToKeyObject[t] ?? "other").join(",");
};

export const processData = ({
  rawDisordersData,
  rawDigupsAndClosuresData,
  // rawRepairsPointsData,
  // rawRepairsPolygonsData,
}: IProcessDataProps) => {

  let GLOBAL_ID = 0;

  const setStatus = (startTimestamp: number, endTimestamp: number): TStatus => {
    return startTimestamp > currentTimestamp
      ? "planned"
      : startTimestamp < currentTimestamp && endTimestamp > currentTimestamp
        ? "active"
        : "done";
  }

  const setCommonFeatureProps = (feature: Feature): Omit<IFeatureProps, 'layer' | 'icon'> => {
    const originalProperties = { ...feature.properties };
    const startTimestamp = originalProperties?.d_tum_vzniku_poruchy || 0;
    const endTimestamp = originalProperties?.term_n_fin_lnej_pravy_povrchu || 0;

    return {
      originalProperties,
      startTimestamp,
      endTimestamp,
      status: setStatus(startTimestamp, endTimestamp),
      type: parseSlovakTypeToKey(originalProperties?.druh_vedenia).split(","),
      subject: originalProperties?.predmet_iadosti,
      address: originalProperties?.adresa,
      fullSize: originalProperties?.rozmery_vykopu,
      width: originalProperties?._rka_v_kopu_m,
      length: originalProperties?.velkost_vykopu,
      investor: originalProperties?.investor,
      contractor: originalProperties?.zhotovite_
    }
  }

  const disordersData: FeatureCollection = addDistrictPropertyToLayer({
    ...rawDisordersData,
    features: rawDisordersData.features.map((feature) => {
      GLOBAL_ID++;

      return {
        ...feature,
        id: GLOBAL_ID,
        properties: {
          ...setCommonFeatureProps(feature),
          layer: "disorders",
          icon: "disorder",
        },
      } as Feature;
    }),
  });

  const digupsAndClosuresData: FeatureCollection = addDistrictPropertyToLayer({
    ...rawDigupsAndClosuresData,
    features: rawDigupsAndClosuresData.features.map((feature) => {
      GLOBAL_ID++;
      const originalProperties = feature.properties;
      const layer =
        originalProperties?.["uz_vierka"] === "čiastočná" ||
          originalProperties?.["uz_vierka"] === "úplná"
          ? "closures"
          : "digups";

      const icon = layer == "closures" ? "closure" : "digup";

      return {
        ...feature,
        id: GLOBAL_ID,
        properties: {
          ...setCommonFeatureProps(feature),
          layer,
          icon,
          objectId: originalProperties?.objectid,
          infoForResidents: originalProperties?.inform_cie_pre_obyvate_ov,
        },
      } as Feature;
    }),
  });

  const digupsData: FeatureCollection = {
    ...digupsAndClosuresData,
    features: digupsAndClosuresData.features.filter(
      (feature) => feature.properties?.layer === "digups",
    ),
  };

  const closuresData: FeatureCollection = {
    ...digupsAndClosuresData,
    features: digupsAndClosuresData.features.filter(
      (feature) => feature.properties?.layer === "closures",
    ),
  };

  // const repairsPointData: FeatureCollection = addDistrictPropertyToLayer({
  //   ...rawRepairsPointsData,
  //   features: rawRepairsPointsData.features.map((feature) => {
  //     GLOBAL_ID++;
  //     const originalProperties = feature.properties;
  //     const timestamp = originalProperties?.datum;
  //     const location = originalProperties?.f4;
  //     const status = "active";
  //     return {
  //       ...feature,
  //       id: GLOBAL_ID,
  //       properties: {
  //         originalProperties,
  //         layer: "repairs",
  //         icon: "repair",
  //         type: "other",
  //         timestamp,
  //         location,
  //         status,
  //       },
  //     } as Feature;
  //   }),
  // });

  // const repairsPolygonsData: FeatureCollection = addDistrictPropertyToLayer({
  //   ...rawRepairsPolygonsData,
  //   features: rawRepairsPolygonsData.features.map((feature) => {
  //     GLOBAL_ID++;
  //     const originalProperties = feature.properties;
  //     const address = originalProperties?.ulica;
  //     const description = originalProperties?.popis_opravy ?? originalProperties?.Popis;
  //     const location = originalProperties?.lokalizacia;
  //     const length = originalProperties?.Dlzka_usek;
  //     const fullSize = originalProperties?.Plocha_opr;
  //     return {
  //       ...feature,
  //       id: GLOBAL_ID,
  //       properties: {
  //         originalProperties,
  //         layer: "repairs",
  //         address,
  //         description,
  //         location,
  //         length,
  //         fullSize,
  //       },
  //     } as Feature;
  //   }),
  // });

  const allFeatures = [
    ...disordersData.features,
    ...digupsData.features,
    ...closuresData.features,
    // ...repairsPointData.features,
    // ...repairsPolygonsData.features,
  ];

  const markersData = featureCollection([
    ...disordersData.features,
    ...digupsData.features,
    ...closuresData.features,
    // ...repairsPointData.features,
  ]);

  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(allFeatures, "district").sort(
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  );

  const uniqueLayers: string[] = getUniqueValuesFromFeatures(allFeatures, "layer").sort();

  const uniqueTypes: string[] = getUniqueValuesFromFeatures(allFeatures, "type")
    .map((t) => t.split(","))
    .flat()
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .sort((a, b) => (a === "other" ? 1 : b === "other" ? -1 : 0));

  return {
    markersData,
    // repairsPolygonsData,
    uniqueLayers,
    uniqueDistricts,
    uniqueTypes,
  };
};
