import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles.css";

// maps
import { Layer, useCombinedFilter, useFilter } from "@bratislava/react-mapbox";
import {
  DISTRICTS_GEOJSON,
  Layout,
  Map,
  MapHandle,
  Slot,
  SlotType,
  ThemeController,
  ViewportController,
} from "@bratislava/react-maps";
import { useArcgis } from "@bratislava/react-use-arcgis";
import mapboxgl, { MapboxGeoJSONFeature } from "mapbox-gl";

// components

// layer styles
import CLOSURES_STYLE from "../assets/layers/closures/closures";
import DIGUPS_STYLE from "../assets/layers/digups/digups";
import DISORDERS_STYLE from "../assets/layers/disorders/disorders";
import DISTRICTS_STYLE from "../assets/layers/districts/districts";
import REPAIRS_POINTS_STYLE from "../assets/layers/repairs/repairsPoints";
import REPAIRS_POLYGONS_STYLE from "../assets/layers/repairs/repairsPolygons";

// utils
import { usePrevious } from "@bratislava/utils";
import { FeatureCollection } from "geojson";
import { processData } from "../utils/utils";
import Detail from "./Detail";
import { Filters } from "./Filters";
import { ILayerCategory } from "./Layers";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileSearch } from "./mobile/MobileSearch";

const DISORDERS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/ArcGIS/rest/services/survey123_42a33d618acc4c23bee02bbe005402ca_stakeholder/FeatureServer/0";

const DIGUPS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/ArcGIS/rest/services/survey123_d681e359eca84126824e7e074e7c3cba_stakeholder/FeatureServer/0";

const REPAIRS_2022_ZEBRA_CROSSING_POINTS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plan_oprav_2022_Priechody_pre_chodcov_view/FeatureServer/18";

const REPAIRS_2022_ODP_POLYGONS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_Opráv_2022_ODS_read_only/FeatureServer/0";

const REPAIRS_2022_RECONSTRUCTION_DESIGN_POLYGONS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/návrh_na_rekonštrukcie_2022/FeatureServer/49";

const REPAIRS_2022_POLYGONS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_opráv_2022_view/FeatureServer/0";

const REPAIRS_POINTS_URLS = [REPAIRS_2022_ZEBRA_CROSSING_POINTS_URL];

const REPAIRS_POLYGONS_URLS = [
  REPAIRS_2022_ODP_POLYGONS_URL,
  REPAIRS_2022_RECONSTRUCTION_DESIGN_POLYGONS_URL,
  REPAIRS_2022_POLYGONS_URL,
];

export const App = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("title");
  }, [t]);

  const [isLoading, setLoading] = useState(true);

  const [disordersData, setDisordersData] = useState<FeatureCollection | null>(null);
  const [digupsData, setDigupsData] = useState<FeatureCollection | null>(null);
  const [closuresData, setClosuresData] = useState<FeatureCollection | null>(null);

  const [repairsPointsData, setRepairsPointsData] = useState<FeatureCollection | null>(null);

  const [repairsPolygonsData, setRepairsPolygonsData] = useState<FeatureCollection | null>(null);
  const [isGeolocation, setGeolocation] = useState(false);

  const { data: rawDisordersData } = useArcgis(DISORDERS_URL);
  const { data: rawDigupsAndClosuresData } = useArcgis(DIGUPS_URL);

  const { data: rawRepairsPointsData } = useArcgis(REPAIRS_POINTS_URLS);
  const { data: rawRepairsPolygonsData } = useArcgis(REPAIRS_POLYGONS_URLS);

  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>(null);
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueLayers, setUniqueLayers] = useState<string[]>([]);

  useEffect(() => {
    if (
      rawDisordersData &&
      rawDigupsAndClosuresData &&
      rawRepairsPointsData &&
      rawRepairsPolygonsData
    ) {
      const {
        disordersData,
        digupsData,
        closuresData,
        repairsPointData,
        repairsPolygonsData,
        uniqueDistricts,
        uniqueLayers,
      } = processData({
        rawDisordersData,
        rawDigupsAndClosuresData,
        rawRepairsPointsData,
        rawRepairsPolygonsData,
      });

      setDisordersData(disordersData);
      setDigupsData(digupsData);
      setClosuresData(closuresData);
      setRepairsPointsData(repairsPointData);
      setRepairsPolygonsData(repairsPolygonsData);

      setUniqueDistricts(uniqueDistricts);
      setUniqueLayers(uniqueLayers);

      setLayerCategories([
        {
          label: t("layerCategories.digups.title"),
          subLayers: ["digups"],
        },
        {
          label: t("layerCategories.closures.title"),
          subLayers: ["closures"],
        },
        {
          label: t("layerCategories.disorders.title"),
          subLayers: ["disorders"],
        },
        {
          label: t("layerCategories.repairs.title"),
          subLayers: ["repairs"],
        },
      ]);

      setLoading(false);
    }
  }, [rawDisordersData, rawDigupsAndClosuresData, rawRepairsPointsData, rawRepairsPolygonsData, t]);

  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const [isMobile, setMobile] = useState<boolean | null>(null);
  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  // close sidebar on mobile and open on desktop
  useEffect(() => {
    // from mobile to desktop
    if (previousMobile == true && isMobile == false) {
      setSidebarVisible(true);
    }
    // from desktop to mobile
    if (previousMobile == false && isMobile == true) {
      setSidebarVisible(false);
    }
  }, [isMobile, previousMobile]);

  const closeDetail = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  // close detailbox when sidebar is opened on mobile
  useEffect(() => {
    if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
      closeDetail();
    }
  }, [closeDetail, isMobile, isSidebarVisible, previousSidebarVisible]);

  const initialViewport = useMemo(
    () => ({
      zoom: 12.229005488986582,
      center: {
        lat: 48.16290360284438,
        lng: 17.125377342563297,
      },
    }),
    [],
  );

  const mapStyles = useMemo(
    () => ({
      light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
      dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
    }),
    [],
  );

  const sources = useMemo(
    () => ({
      DISORDERS_DATA: disordersData,
      DIGUPS_DATA: digupsData,
      CLOSURES_DATA: closuresData,
      REPAIRS_POINTS_DATA: repairsPointsData,
      REPAIRS_POLYGONS_DATA: repairsPolygonsData,
      DISTRICTS_GEOJSON,
    }),
    [closuresData, digupsData, disordersData, repairsPointsData, repairsPolygonsData],
  );

  const selectedFeatures = useMemo(() => {
    return selectedFeature ? [selectedFeature] : [];
  }, [selectedFeature]);

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile ? ["compass", "zoom"] : ["geolocation", "compass", ["fullscreen", "zoom"]];
  }, [isMobile]);

  const districtFilter = useFilter({
    property: "district",
    keys: uniqueDistricts,
  });

  const layerfilter = useFilter({
    property: "layer",
    keys: uniqueLayers,
    defaultValues: useMemo(
      () => uniqueLayers.reduce((prev, curr) => ({ ...prev, [curr]: true }), {}),
      [uniqueLayers],
    ),
  });

  const combinedFilter = useCombinedFilter({
    combiner: "all",
    filters: [
      {
        filter: districtFilter,
        mapToActive: (activeDistricts) => ({
          title: t("filters.district.title"),
          items: activeDistricts,
        }),
      },
      {
        onlyInExpression: true,
        filter: layerfilter,
        mapToActive: (activeLayers) => ({
          title: t("layers"),
          items: activeLayers.map((l) => t(`layerCategories.${l}.title`)),
        }),
      },
    ],
  });

  const [layerCategories, setLayerCategories] = useState<ILayerCategory[]>([]);

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#0F6D95"
      initialViewport={initialViewport}
      ref={mapRef}
      mapboxgl={mapboxgl}
      mapStyles={mapStyles}
      sources={sources}
      isOutsideLoading={isLoading}
      onFeaturesClick={(features) => setSelectedFeature(features[0])}
      selectedFeatures={selectedFeatures}
      onMobileChange={setMobile}
      onGeolocationChange={setGeolocation}
      onMapClick={closeDetail}
    >
      <Layer filters={combinedFilter.expression} source="DISORDERS_DATA" styles={DISORDERS_STYLE} />
      <Layer filters={combinedFilter.expression} source="DIGUPS_DATA" styles={DIGUPS_STYLE} />
      <Layer filters={combinedFilter.expression} source="CLOSURES_DATA" styles={CLOSURES_STYLE} />
      <Layer
        filters={combinedFilter.expression}
        source="REPAIRS_POINTS_DATA"
        styles={REPAIRS_POINTS_STYLE}
      />
      <Layer
        filters={combinedFilter.expression}
        source="REPAIRS_POLYGONS_DATA"
        styles={REPAIRS_POLYGONS_STYLE}
      />
      <Layer ignoreClick source="DISTRICTS_GEOJSON" styles={DISTRICTS_STYLE} />

      <Slot name="controls">
        <ThemeController
          className={cx("fixed left-4 bottom-[88px] sm:bottom-8 sm:transform", {
            "translate-x-96": isSidebarVisible && !isMobile,
          })}
        />
        <ViewportController
          className="fixed right-4 bottom-[88px] sm:bottom-8"
          slots={viewportControllerSlots}
        />
        <MobileSearch mapRef={mapRef} mapboxgl={mapboxgl} isGeolocation={isGeolocation} />
      </Slot>

      <Layout isOnlyMobile>
        <Slot name="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
          />
        </Slot>
      </Layout>

      <Filters
        mapboxgl={mapboxgl}
        mapRef={mapRef}
        isGeolocation={isGeolocation}
        isMobile={isMobile ?? false}
        isVisible={isSidebarVisible}
        setVisible={(isVisible) => setSidebarVisible(isVisible ?? false)}
        districtFilter={districtFilter}
        areFiltersDefault={combinedFilter.areDefault}
        activeFilters={combinedFilter.active}
        onResetFiltersClick={combinedFilter.reset}
        layerFilter={layerfilter}
        layerCategories={layerCategories}
      />

      <Detail feature={selectedFeature} isMobile={isMobile ?? false} />
    </Map>
  );
};

export default App;
