import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { featureCollection } from "@turf/helpers";
import type { Feature, FeatureCollection } from "geojson";
import type {
  IDigupsAndClosuresOriginalProps,
  IDisorderOriginalProps,
  IOldTownOriginalProps,
  IProcessDataProps,
  TStatus,
} from "../types/featureTypes";

// removed from params at some point were the following:
// rawRepairsPointsData,
// rawRepairsPolygonsData,
export const processData = ({ rawDisordersData, rawDigupsAndClosuresData }: IProcessDataProps) => {
  const setStatus = (startTimestamp: number, endTimestamp: number): TStatus => {
    const currentTimestamp = Date.now();
    return startTimestamp > currentTimestamp
      ? "planned"
      : startTimestamp < currentTimestamp && endTimestamp > currentTimestamp
      ? "active"
      : "done";
  };

  const disordersData: FeatureCollection = addDistrictPropertyToLayer({
    ...rawDisordersData,
    features: rawDisordersData.features.map((feature) => {
      const originalProperties = { ...(feature.properties as IDisorderOriginalProps) };

      const startTimestamp = originalProperties.datum_vzniku_poruchy;
      const endTimestamp = originalProperties.datum_finalnej_upravy;

      // long names shortned by gis, there's no nice way currently so using this hack
      let owner = originalProperties.ine_vlastnik || originalProperties?.vlastnik_spravca_vedenia;
      if (owner.startsWith("Bratislavská vodárenská")) {
        owner = "Bratislavská vodárenská spoločnosť, a.s.";
      } else if (owner.startsWith("Západoslovenská distribučná")) {
        owner = "Západoslovenská distribučná, a.s.";
      }

      const properties = {
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
        owner,
        type: originalProperties.druh_vedenia.split(","),
        layer: "disorders",
        icon: "disorder",
        displayFeature: true,
      };

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
      const originalProperties = {
        ...(feature.properties as IDigupsAndClosuresOriginalProps | IOldTownOriginalProps),
      };
      const layer = ["čiastočná", "úplná"].includes(originalProperties?.uzavierka)
        ? "closures"
        : "digups";

      const startTimestamp =
        originalProperties.potvrdeny_termin_realizacie || originalProperties.datum_vzniku;
      const endTimestamp = originalProperties.termin_finalnej_upravy;

      let investor = originalProperties.ine_investor || originalProperties?.investor;
      if (investor.startsWith("Bratislavská vodárenská")) {
        investor = "Bratislavská vodárenská spoločnosť, a.s.";
      } else if (investor.startsWith("Západoslovenská distribučná")) {
        investor = "Západoslovenská distribučná, a.s.";
      }

      let contractor = originalProperties.ine_zhotovitel || originalProperties?.zhotovitel;
      if (investor.startsWith("Bratislavská vodárenská")) {
        contractor = "Bratislavská vodárenská spoločnosť, a.s.";
      } else if (contractor.startsWith("Západoslovenská distribučná")) {
        contractor = "Západoslovenská distribučná, a.s.";
      }

      const properties = {
        originalProperties,
        startTimestamp,
        endTimestamp,
        startTime: originalProperties.cas_vzniku,
        endTime: originalProperties.cas_odstranenia,
        status: setStatus(startTimestamp, endTimestamp),
        type: originalProperties.druh_rozkopavky.split(","),
        subject: originalProperties?.predmet_nadpis,
        address: originalProperties?.adresa_rozkopavky,
        fullSize: originalProperties?.rozmery_vykopu_v_m2,
        width: originalProperties?.sirka_vykopu_m,
        length: originalProperties?.dlzka_vykopu_m,
        investor: investor,
        contractor: contractor,
        layer,
        icon: layer === "closures" ? "closure" : "digup",
        objectId: originalProperties.__oldTownMarker
          ? (originalProperties as IOldTownOriginalProps).objectid
          : (originalProperties as IDigupsAndClosuresOriginalProps).OBJECTID,
        infoForResidents: originalProperties?.informacie,
        displayFeature: originalProperties.zobrazovanie === "Zobrazovat",
      };

      return {
        ...feature,
        id: originalProperties.globalid,
        properties,
      } as Feature;
    }),
  });

  const digupsData: FeatureCollection = {
    ...digupsAndClosuresData,
    features: digupsAndClosuresData.features.filter(
      (feature) => feature.properties?.layer === "digups" && feature.properties.displayFeature,
    ),
  };

  const closuresData: FeatureCollection = {
    ...digupsAndClosuresData,
    features: digupsAndClosuresData.features.filter(
      (feature) => feature.properties?.layer === "closures" && feature.properties.displayFeature,
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
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b),
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
