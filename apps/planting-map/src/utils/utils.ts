import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps-core";
import { getUniqueValuesFromFeatures } from "@bratislava/react-maps-utils";
import { FeatureCollection, Feature } from "geojson";

const seasonMapping = {
  JAR: "spring",
  LETO: "summer",
  JESEŇ: "autumn",
  ZIMA: "winter",
};

const treeKindColorMappingObject: { [key: string]: string } = {
  "javor-polny": "#C1E00E",
  "ceresna-pilkata": "#5D8232",
  "ceresna-vtacia": "#A3A838",
  "javor-mliecny": "#01401C",
  "hrab-obycajny": "#639B6A",
  "jasen-uzkolisty": "#1A961D",
  "pagastan-pletovy": "#83B252",
  "dub-cerveny": "#62F989",
  "jasen-cerveny": "#BDED8A",
  "zelkova-ostrolista": "#EDFF43",
  "cremcha-obycajna": "#00AB92",
  "sofora-japonska": "#A4B88E",
  "ginkgo-dvojlalocne": "#525B45",
  "hruska-okrasna": "#4C6B2D",
  "platan-javorolisty": "#326E43",
  "jasen-mannovy": "#FBFFA9",
  "ambrovnik-styraxovy": "#52E167",
  "agat-biely": "#16BF5A",
  "javor-ohnivy": "#6CE07D",
  "jasenovec-metlinaty": "#95DBC6",
  "muchovnik-lamarckov": "#BFD989",
  "lipa-zelenkasta": "#37AA4B",
  "hruska-obycajna": "#08C41A",
  "parocia-perzska": "#B0EE78",
  "hruska-calleriova": "#97E254",
  "hrabovec-hrabolisty": "#DAE8BA",
  "gledicia-trojtrnova": "#DAFFB0",
  "lipa-striebrista": "#ADEFA8",
  "dub-balkansky": "#94C991",
  "jasen-stihly": "#C4EFCE",
  "lieska-turecka": "#C2F14C",
  "visna-chlpkata": "#BC9F82",
  "muchovnik-stromovity": "#72AA66",
  "dub-letny": "#00A000",
  "lipa-malolista": "#6BEA36",
  "muchovnik-robin-hill": "#DBC9B9",
  "breza-himalajska": "#4D540A",
  "ceresna-sargentova": "#39441B",
};

export const treeKindNameSkMappingObject: { [key: string]: string } = {
  javor: "javor",
  ceresna: "čerešňa",
  hrab: "hrab",
  jasen: "jaseň",
  pagastan: "pagaštan",
  dub: "dub",
  zelkova: "zelkova",
  cremcha: "čremcha",
  sofora: "sofora",
  ginkgo: "ginkgo",
  hruska: "hruška",
  platan: "platan",
  ambrovnik: "ambrovník",
  agat: "agát",
  jasenovec: "jaseňovec",
  muchovnik: "muchovník",
  lipa: "lipa",
  parocia: "parócia",
  hrabovec: "hrabovec",
  gledicia: "gledíčia",
  lieska: "lieska",
  visna: "višňa",
  breza: "breza",
};

const conifers = [
  "metasekvoja-cinska",
  "borovica-lesna",
  "ceder-atlantsky",
  "ceder-himalajsky",
  "cyprustek",
  "tisovec",
];

export const kinds = Object.keys(treeKindNameSkMappingObject);

export const processData = (rawData: FeatureCollection) => {
  const data: FeatureCollection = addDistrictPropertyToLayer({
    ...rawData,
    features: rawData.features.map((feature) => {
      const originalProperties = feature.properties;
      const nameSk = feature.properties?.Drevina_SK?.toLowerCase().trim();
      const nameLat = feature.properties?.DrevinaLAT?.toLowerCase().trim();

      const kind = nameSk
        .trim()
        .normalize("NFD")
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/(_| )/g, "-")
        .replace(/(´|"|\u00ad)/g, "");

      const kindSimple = kind.split("-")[0];

      const { season, year } = getSeasonAndYear(feature);
      const color =
        treeKindColorMappingObject[kind] ?? (conifers.includes(kind) ? "#90A58E" : "#CCF9C8");
      const layer =
        feature.properties?.PROJEKT === "10 000"
          ? "planting"
          : feature.properties?.PROJEKT === "NAHRADKA"
          ? "substitute-planting"
          : null;

      const donor = feature.properties?.Donor?.trim();
      const cultivar = feature.properties?.Kultivar?.trim();
      const height = getHeight(feature);
      const log = getLog(feature);
      const cadastralArea = feature.properties?.Nazov_KU?.trim();

      return {
        ...feature,
        properties: {
          ...originalProperties,
          nameSk,
          nameLat,
          kind,
          kindSimple,
          season,
          color,
          year,
          layer,
          donor,
          cultivar,
          height,
          log,
          cadastralArea,
        },
      } as Feature;
    }),
  });

  const uniqueYears: string[] = getUniqueValuesFromFeatures(data.features, "year").sort(
    (a, b) => parseInt(b) - parseInt(a),
  );
  const uniqueDistricts: string[] = getUniqueValuesFromFeatures(data.features, "district").sort(
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b) ?? 0,
  );
  const seasons = ["spring", "summer", "autumn", "winter"];
  const uniqueSeasons: string[] = getUniqueValuesFromFeatures(data.features, "season").sort(
    (a, b) => seasons.findIndex((d) => d == a) - seasons.findIndex((d) => d == b) ?? 0,
  );

  return {
    data,
    uniqueYears,
    uniqueDistricts,
    uniqueSeasons,
    uniqueKinds: kinds,
  };
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// format: 2022 JAR
const getSeasonAndYear = (feature: Feature) => {
  if (feature.properties?.OBDOBIE_VY) {
    const [inputYear, inputSeason] = feature.properties.OBDOBIE_VY.split(" ");
    return {
      year: inputYear,
      season: seasonMapping[inputSeason as "JAR" | "LETO" | "JESEŇ" | "ZIMA"],
    };
  } else {
    return {
      year: null,
      season: null,
    };
  }
};

const getLog = (feature: Feature) => {
  let logText: string | undefined = feature?.properties?.Kmeň?.trim();

  if (logText) {
    if (logText.includes("/")) {
      logText = logText
        .split("/")
        .map((value) => value.trim())
        .join("/");
    }

    if (logText.includes("-")) {
      logText = logText
        .split("-")
        .map((value) => value.trim())
        .join("/");
    }

    if (!logText.endsWith("cm")) {
      logText += " cm";
    }
  }

  return logText;
};

const getHeight = (feature: Feature) => {
  let heightText: string | undefined = feature?.properties?.Výška?.trim();

  if (heightText) {
    if (heightText.includes("/")) {
      heightText = heightText
        .split("/")
        .map((value) => value.trim())
        .join("/");
    }

    if (heightText.includes("-")) {
      heightText = heightText
        .split("-")
        .map((value) => value.trim())
        .join("/");
    }

    if (!heightText.endsWith("m")) {
      heightText += " cm";
    }
  }
  return heightText;
};
