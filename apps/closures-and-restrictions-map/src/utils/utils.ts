import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { featureCollection } from "@turf/helpers";
import type { Feature, FeatureCollection } from "geojson";
import type { IDigupsAndClosuresOriginalProps, IDisorderOriginalProps, IFeatureProps, IProcessDataProps, TStatus } from "../types/featureTypes";

export const processData = ({
  rawDisordersData,
  rawDigupsAndClosuresData,
  // rawRepairsPointsData,
  // rawRepairsPolygonsData,
}: IProcessDataProps) => {


  const setStatus = (startTimestamp: number, endTimestamp: number): TStatus => {
    const currentTimestamp = Date.now();
    return startTimestamp > currentTimestamp
      ? "planned"
      : startTimestamp < currentTimestamp && endTimestamp > currentTimestamp
        ? "active"
        : "done";
  }

  const disordersData: FeatureCollection = addDistrictPropertyToLayer({
    ...rawDisordersData,
    features: rawDisordersData.features.map((feature) => {
      const originalProperties = { ...feature.properties as IDisorderOriginalProps };

      const startTimestamp = originalProperties.datum_vzniku_poruchy;
      const endTimestamp = originalProperties.datum_finalnej_upravy;

      const properties: IFeatureProps = {
        originalProperties,
        objectId: originalProperties.objectid,
        startTimestamp,
        endTimestamp,
        dateOfPassage: originalProperties.datum_sprejazdnenia,
        status: setStatus(startTimestamp, endTimestamp),
        subject: originalProperties?.predmet_nadpis,
        address: originalProperties?.adresa,
        fullSize: originalProperties?.rozmery_vykopu_v_m2,
        width: originalProperties?.sirka_vykopu_m,
        length: originalProperties?.dlzka_vykopu_m,
        owner: originalProperties.ine_vlastnik || originalProperties?.vlastnik_spravca_vedenia,
        type: originalProperties.druh_vedenia.split(','),
        layer: "disorders",
        icon: "disorder",
      }

      return {
        ...feature,
        id: originalProperties.globalid,
        properties,
      } as Feature;
    }),
  });

  const digupsAndClosuresData: FeatureCollection = addDistrictPropertyToLayer({
    ...rawDigupsAndClosuresData,
    features: rawDigupsAndClosuresData.features.map((feature) => {
      const originalProperties = { ...feature.properties as IDigupsAndClosuresOriginalProps };
      const layer = ["čiastočná", "úplná"].includes(originalProperties?.uzavierka) ? "closures" : "digups";

      const startTimestamp = originalProperties.datum_vzniku;
      const endTimestamp = originalProperties.termin_finalnej_upravy;

      const properties: IFeatureProps = {
        originalProperties,
        startTimestamp,
        endTimestamp,
        startTime: originalProperties.cas_vzniku,
        endTime: originalProperties.cas_odstranenia,
        status: setStatus(startTimestamp, endTimestamp),
        type: originalProperties.druh_rozkopavky.split(','),
        subject: originalProperties?.predmet_nadpis,
        address: originalProperties?.adresa_rozkopavky,
        fullSize: originalProperties?.rozmery_vykopu_v_m2,
        width: originalProperties?.sirka_vykopu_m,
        length: originalProperties?.dlzka_vykopu_m,
        investor: originalProperties?.ine_investor || originalProperties?.investor,
        contractor: originalProperties?.ine_zhotovitel || originalProperties?.zhotovitel,
        layer,
        icon: layer === "closures" ? "closure" : "digup",
        objectId: originalProperties.objectid,
        infoForResidents: originalProperties?.informacie,
      }

      return {
        ...feature,
        id: originalProperties.globalid,
        properties
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
