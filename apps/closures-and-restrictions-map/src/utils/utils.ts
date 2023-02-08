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

  const disordersData: FeatureCollection = addDistrictPropertyToLayer({
    ...rawDisordersData,
    features: rawDisordersData.features.map((feature) => {
      GLOBAL_ID++;
      const originalProperties = feature.properties;

      const startTimestamp = parseInt(originalProperties?.["d_tum_vzniku_poruchy"] ?? "0");
      const endTimestamp = parseInt(originalProperties?.["term_n_fin_lnej_pravy_povrchu"] ?? "0");

      const subject = originalProperties?.predmet_iadosti;
      const type = parseSlovakTypeToKey(originalProperties?.druh_vedenia);
      const address = originalProperties?.adresa;
      const fullSize = originalProperties?.rozmery_vykopu;
      const width = originalProperties?._rka_v_kopu_m;
      const length = originalProperties?.velkost_vykopu;
      const investor = originalProperties?.investor;
      const contractor = originalProperties?.zhotovite_;

      return {
        ...feature,
        id: GLOBAL_ID,
        properties: {
          originalProperties,
          layer: "disorders",
          icon: "disorder",
          type,
          subject,
          address,
          startTimestamp,
          endTimestamp,
          fullSize,
          width,
          length,
          investor,
          contractor,
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

      const startTimestamp = parseInt(originalProperties?.["d_tum_vzniku_poruchy"] ?? "0");
      const endTimestamp = parseInt(originalProperties?.["term_n_fin_lnej_pravy_povrchu"] ?? "0");
      const status =
        startTimestamp > currentTimestamp
          ? "planned"
          : startTimestamp < currentTimestamp && endTimestamp > currentTimestamp
          ? "active"
          : "done";

      const subject = originalProperties?.predmet_iadosti;
      const type = parseSlovakTypeToKey(originalProperties?.druh_vedenia).split(",");
      const address = originalProperties?.adresa;
      const fullSize = originalProperties?.rozmery_vykopu;
      const width = originalProperties?._rka_v_kopu_m;
      const length = originalProperties?.velkost_vykopu;
      const investor = originalProperties?.investor;
      const contractor = originalProperties?.zhotovite_;
      const objectId = originalProperties?.objectid;

      return {
        ...feature,
        id: GLOBAL_ID,
        properties: {
          originalProperties,
          type,
          layer,
          subject,
          address,
          startTimestamp,
          endTimestamp,
          fullSize,
          width,
          icon,
          length,
          objectId,
          status,
          investor,
          contractor,
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
