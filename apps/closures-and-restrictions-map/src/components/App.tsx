import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles.css";

// maps
import { Layer } from "@bratislava/react-mapbox";
import {
  DISTRICTS_GEOJSON,
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
import DIGUPS_STYLE from "../assets/layers/digups/digups";
import DISORDERS_STYLE from "../assets/layers/disorders/disorders";
import DISTRICTS_STYLE from "../assets/layers/districts/districts";
import REPAIRS_POINTS_STYLE from "../assets/layers/repairs/repairsPoints";
import REPAIRS_POLYGONS_STYLE from "../assets/layers/repairs/repairsPolygons";

// utils
import { usePrevious } from "@bratislava/utils";
import { FeatureCollection } from "geojson";
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

  const [repairsPointsData, setRepairsPointsData] = useState<FeatureCollection | null>(null);

  const [repairsPolygonsData, setRepairsPolygonsData] = useState<FeatureCollection | null>(null);
  const [isGeolocation, setGeolocation] = useState(false);

  const { data: rawDisordersData } = useArcgis(DISORDERS_URL);
  const { data: rawDigupsData } = useArcgis(DIGUPS_URL);

  const { data: rawRepairsPointsData } = useArcgis(REPAIRS_POINTS_URLS);
  const { data: rawRepairsPolygonsData } = useArcgis(REPAIRS_POLYGONS_URLS);

  const [selectedFeature, setSelectedFeature] = useState<MapboxGeoJSONFeature | null>(null);

  useEffect(() => {
    if (rawDisordersData && rawDigupsData && rawRepairsPointsData && rawRepairsPolygonsData) {
      setDisordersData(rawDisordersData);
      setDigupsData(rawDigupsData);
      setRepairsPointsData(rawRepairsPointsData);
      setRepairsPolygonsData(rawRepairsPolygonsData);
      setLoading(false);
    }
  }, [rawDisordersData, rawDigupsData, rawRepairsPointsData, rawRepairsPolygonsData]);

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
      REPAIRS_POINTS_DATA: repairsPointsData,
      REPAIRS_POLYGONS_DATA: repairsPolygonsData,
      DISTRICTS_GEOJSON,
    }),
    [digupsData, disordersData, repairsPointsData, repairsPolygonsData],
  );

  const selectedFeatures = useMemo(() => {
    return selectedFeature ? [selectedFeature] : [];
  }, [selectedFeature]);

  const viewportControllerSlots: SlotType = useMemo(() => {
    return isMobile ? ["compass", "zoom"] : ["geolocation", "compass", ["fullscreen", "zoom"]];
  }, [isMobile]);

  return isLoading ? null : (
    <Map
      loadingSpinnerColor="#237c36"
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
      <Layer isVisible source="DISORDERS_DATA" styles={DISORDERS_STYLE} />
      <Layer isVisible source="DIGUPS_DATA" styles={DIGUPS_STYLE} />
      <Layer isVisible source="REPAIRS_POINTS_DATA" styles={REPAIRS_POINTS_STYLE} />
      <Layer isVisible source="REPAIRS_POLYGONS_DATA" styles={REPAIRS_POLYGONS_STYLE} />
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
    </Map>
  );
};

export default App;
