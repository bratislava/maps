import { addDistrictPropertyToLayer, DISTRICTS } from "@bratislava/react-maps";
import { getUniqueValuesFromFeatures } from "@bratislava/utils";
import { Feature, FeatureCollection } from "geojson";

const seasonMapping = {
  JAR: "spring",
  LETO: "summer",
  JESEŇ: "autumn",
  ZIMA: "winter",
};

export const treeKindColorMappingObject: { [key: string]: string } = {
  "javor-polny": "#1A961D",
  "ceresna-pilkata": "#C1E00E",
  "ceresna-vtacia": "#37AA4B",
  "javor-mliecny": "#00A000",
  "hrab-obycajny": "#BDED8A",
  "jasen-uzkolisty": "#16BF5A",
  "pagastan-pletovy": "#00AB92",
  "dub-cerveny": "#4C6B2D",
  "jasen-cerveny": "#EDFF43",
  "zelkova-ostrolista": "#C2F14C",
  "cremcha-obycajna": "#95DBC6",
  "sofora-japonska": "#A3A838",
  "ginkgo-dvojlalocne": "#94C991",
  "hruska-okrasna": "#08C41A",
  "platan-javorolisty": "#5D8232",
  "jasen-mannovy": "#52E167",
  "ambrovnik-styraxovy": "#BC9F82",
  "agat-biely": "#BFD989",
  "javor-ohnivy": "#326E43",
  "jasenovec-metlinaty": "#72AA66",
  "muchovnik-lamarckov": "#83B252",
  "lipa-zelenkasta": "#97E254",
  "hruska-obycajna": "#6BEA36",
  "parocia-perzska": "#C4EFCE",
  "hruska-calleriova": "#DAFFB0",
  "hrabovec-hrabolisty": "#ADEFA8",
  "gledicia-trojtrnova": "#39441B",
  "lipa-striebrista": "#DAE8BA",
  "dub-balkansky": "#01401C",
  "jasen-stihly": "#D1D841",
  "lieska-turecka": "#62F989",
  "visna-chlpkata": "#DBC9B9",
  "muchovnik-stromovity": "#FBFFA9",
  "dub-letny": "#4D540A",
  "lipa-malolista": "#A4B88E",
  "muchovnik-robin-hill": "#6CE07D",
  "breza-himalajska": "#C6D62F",
  "ceresna-sargentova": "#525B45",
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

const CONIFERS = [
  "metasekvoja-cinska",
  "borovica-lesna",
  "ceder-atlantsky",
  "ceder-himalajsky",
  "cyprustek",
  "tisovec",
];

export const CONIFER_COLOR = "#90A58E";
export const DECIDUOUS_COLOR = "#A0E14C";
export const DISTRICT_COLOR = "#4FC268";
export const DISTRICT_OPACITY = 0.4;

export const kinds = Object.keys(treeKindNameSkMappingObject);

export const processData = (rawData: FeatureCollection) => {
  const data: FeatureCollection = addDistrictPropertyToLayer({
    ...rawData,
    features: rawData.features.map((feature) => {
      const originalProperties = feature.properties;

      const nameSk = feature.properties?.drevina_sk?.toLowerCase().trim() || "";
      const nameLat = feature.properties?.drevina_lat?.toLowerCase().trim() || "";

      const kind = nameSk
        .trim()
        .normalize("NFD")
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/(_| )/g, "-")
        .replace(/(´|"|\u00ad)/g, "");

      const kindSimple = kind.split("-")[0] || "";

      const season = feature.properties?.obdobie || "";
      const year = feature.properties?.Vysadba_rok || "";

      // pick the exact color from mapping or use specific color for conifer / deciduous tree
      const color =
        treeKindColorMappingObject[kind] ??
        (CONIFERS.includes(kind) ? CONIFER_COLOR : DECIDUOUS_COLOR);

      // pick the layer based on projekt property
      const layer =
        feature.properties?.projekt === "10 000"
          ? "planting"
          : feature.properties?.projekt === "NAHRADKA"
          ? "replacement-planting"
          : null;

      const donor = feature.properties?.donor?.trim();
      const cultivar = feature.properties?.kultivar?.trim();
      const height = getHeight(feature);
      const log = getLog(feature);
      const cadastralArea = feature.properties?.nazov_ku?.trim();

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
    (a, b) => DISTRICTS.findIndex((d) => d == a) - DISTRICTS.findIndex((d) => d == b),
  );
  const seasons = ["spring", "summer", "autumn", "winter"];
  const uniqueSeasons: string[] = getUniqueValuesFromFeatures(data.features, "season").sort(
    (a, b) => seasons.findIndex((d) => d == a) - seasons.findIndex((d) => d == b),
  );

  return {
    data,
    uniqueYears,
    uniqueDistricts,
    uniqueSeasons,
    uniqueKinds: kinds,
  };
};

const getLog = (feature: Feature) => {
  let logText: string | undefined = feature?.properties?.kmen?.trim() || "";

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
  let heightText: string | undefined = feature?.properties?.vyska?.trim() || "";

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
