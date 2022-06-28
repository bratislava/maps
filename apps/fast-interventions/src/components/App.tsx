import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import "../styles.css";

// maps
import {
  useMap,
  Layer,
  addDistrictPropertyToLayer,
  forwardGeocode,
  DISTRICTS_GEOJSON,
  usePrevious,
} from "@bratislava/mapbox-maps-core";
import { LoadingSpinner, SearchBar } from "@bratislava/mapbox-maps-ui";
import { Close, ChevronLeftSmall, Funnel } from "@bratislava/mapbox-maps-icons";
import { useArcgeo } from "@bratislava/mapbox-maps-esri";

// components
import { Detail } from "./Detail";

// layer styles
import DISORDERS_STYLE from "../assets/layers/disorders/disorders";
import DIGUPS_STYLE from "../assets/layers/digups/digups";
import REPAIRS_POINTS_STYLE from "../assets/layers/repairs/repairsPoints";
import REPAIRS_POLYGONS_STYLE from "../assets/layers/repairs/repairsPolygons";
import REPAIRS_CURVES_STYLE from "../assets/layers/repairs/repairsCurves";
import DISTRICTS_STYLE from "../assets/layers/districts/districts";

// utils
import i18next from "../utils/i18n";
import { Feature } from "geojson";

const DISORDERS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/ArcGIS/rest/services/survey123_42a33d618acc4c23bee02bbe005402ca_stakeholder/FeatureServer/0";
const DIGUPS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/ArcGIS/rest/services/survey123_d681e359eca84126824e7e074e7c3cba_stakeholder/FeatureServer/0";

const REPAIRS_2018_MHD_POINTS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Pl%C3%A1n_opr%C3%A1v_2018_zast%C3%A1vky_MHD/FeatureServer/0";

const REPAIRS_2018_SIDEWALKS_CURVES_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Pl%C3%A1n_opr%C3%A1v_2018_chodn%C3%ADky/FeatureServer/0";

const REPAIRS_2018_ROADS_CURVES_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Pl%C3%A1n_opr%C3%A1v_2018_komunik%C3%A1cie/FeatureServer/0";

const REPAIRS_2019_WHEEL_CHAIR_ACCESSIBLE_POINTS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_opráv_2019_read_only/FeatureServer/0";

const REPAIRS_2019_MHD_POINTS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_opráv_2019_read_only/FeatureServer/1";

const REPAIRS_2019_SIDEWALKS_CURVES_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_opráv_2019_read_only/FeatureServer/2";

const REPAIRS_2019_ROADS_CURVES_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_opráv_2019_read_only/FeatureServer/3";

const REPAIRS_2020_WHEEL_CHAIR_ACCESSIBLE_POINTS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_opráv_2020_Bezbariérová_úprava_read_only/FeatureServer/0";

const REPAIRS_2020_MHD_POINTS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Pl%C3%A1n_opr%C3%A1v_2020/FeatureServer/1";

const REPAIRS_2020_SIDEWALKS_CURVES_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Pl%C3%A1n_opr%C3%A1v_2020/FeatureServer/2";

const REPAIRS_2020_ROADS_CURVES_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Pl%C3%A1n_opr%C3%A1v_2020/FeatureServer/3";

const REPAIRS_2021_ENGINEER_PROJECTS_POLYGONS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_opráv_2021_Inžinierske_objekty/FeatureServer/0";

const REPAIRS_2021_ROADS_POLYGONS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_Opráv_2021/FeatureServer/0";

const REPAIRS_2021_WHEEL_CHAIR_ACCESSIBLE_POINTS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_opráv_2020_Bezbariérová_úprava_read_only/FeatureServer/0";

const REPAIRS_2022_ZEBRA_CROSSING_POINTS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plan_oprav_2022_Priechody_pre_chodcov_view/FeatureServer/18";

const REPAIRS_2022_ODP_POLYGONS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_Opráv_2022_ODS_read_only/FeatureServer/0";

const REPAIRS_2022_RECONSTRUCTION_DESIGN_POLYGONS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/návrh_na_rekonštrukcie_2022/FeatureServer/49";

const REPAIRS_2022_POLYGONS_URL =
  "https://services8.arcgis.com/pRlN1m0su5BYaFAS/arcgis/rest/services/Plán_opráv_2022_view/FeatureServer/0";

const REPAIRS_POINTS_URLS = [
  REPAIRS_2018_MHD_POINTS_URL,
  REPAIRS_2019_WHEEL_CHAIR_ACCESSIBLE_POINTS_URL,
  REPAIRS_2019_MHD_POINTS_URL,
  REPAIRS_2020_WHEEL_CHAIR_ACCESSIBLE_POINTS_URL,
  REPAIRS_2020_MHD_POINTS_URL,
  REPAIRS_2021_WHEEL_CHAIR_ACCESSIBLE_POINTS_URL,
  REPAIRS_2022_ZEBRA_CROSSING_POINTS_URL,
];

const REPAIRS_POLYGONS_URLS = [
  REPAIRS_2021_ENGINEER_PROJECTS_POLYGONS_URL,
  REPAIRS_2021_ROADS_POLYGONS_URL,
  REPAIRS_2022_ODP_POLYGONS_URL,
  REPAIRS_2022_RECONSTRUCTION_DESIGN_POLYGONS_URL,
  REPAIRS_2022_POLYGONS_URL,
];

const REPAIRS_CURVES_URLS = [
  REPAIRS_2018_SIDEWALKS_CURVES_URL,
  REPAIRS_2018_ROADS_CURVES_URL,
  REPAIRS_2019_SIDEWALKS_CURVES_URL,
  REPAIRS_2019_ROADS_CURVES_URL,
  REPAIRS_2020_SIDEWALKS_CURVES_URL,
  REPAIRS_2020_ROADS_CURVES_URL,
];

export const App = () => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);

  const [disordersData, setDisordersData] = useState<ReturnType<typeof useArcgeo>["data"]>(null);
  const [digupsData, setDigupsData] = useState<ReturnType<typeof useArcgeo>["data"]>(null);

  const [repairsPointsData, setRepairsPointsData] =
    useState<ReturnType<typeof useArcgeo>["data"]>(null);

  const [repairsPolygonsData, setRepairsPolygonsData] =
    useState<ReturnType<typeof useArcgeo>["data"]>(null);

  const [repairsCurvesData, setRepairsCurvesData] =
    useState<ReturnType<typeof useArcgeo>["data"]>(null);

  const { data: rawDisordersData } = useArcgeo(DISORDERS_URL);
  const { data: rawDigupsData } = useArcgeo(DIGUPS_URL);

  const { data: rawRepairsPointsData } = useArcgeo(REPAIRS_POINTS_URLS);
  const { data: rawRepairsPolygonsData } = useArcgeo(REPAIRS_POLYGONS_URLS);
  const { data: rawRepairsCurvesData } = useArcgeo(REPAIRS_CURVES_URLS);

  useEffect(() => {
    if (
      rawDisordersData &&
      rawDigupsData &&
      rawRepairsPointsData &&
      rawRepairsPolygonsData &&
      rawRepairsCurvesData
    ) {
      setDisordersData(addDistrictPropertyToLayer(rawDisordersData));
      setDigupsData(addDistrictPropertyToLayer(rawDigupsData));
      setRepairsPointsData(addDistrictPropertyToLayer(rawRepairsPointsData));
      setRepairsPolygonsData(addDistrictPropertyToLayer(rawRepairsPolygonsData));
      setRepairsCurvesData(addDistrictPropertyToLayer(rawRepairsCurvesData));
      setLoading(false);
    }
  }, [
    rawDisordersData,
    rawDigupsData,
    rawRepairsPointsData,
    rawRepairsPolygonsData,
    rawRepairsCurvesData,
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFeatures, setSearchFeatures] = useState<Feature[]>([]);
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const { Map, ...mapProps } = useMap({
    mapboxAccessToken: import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN,
    i18next: i18next,
    mapStyles: {
      light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
      dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      satellite: import.meta.env.PUBLIC_MAPBOX_SATELLITE_STYLE,
    },
  });

  const {
    geolocationState: [isGeolocation, setGeolocation],
    mapboxgl,
    ref: mapRef,
    selectedFeaturesState: [selectedFeatures, setSelectedFeatures],
    mobileState: [isMobile],
  } = mapProps;

  // USE PREVIOUS

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const onSearchFeatureClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any) => {
      setSearchQuery(feature.place_name_sk.split(",")[0]);
      setSearchFeatures([]);
      if (mapRef && feature.geometry.type === "Point") {
        mapRef.current?.setViewport({
          lng: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
          zoom: 18,
        });
      }
    },
    [mapRef],
  );

  // close detailbox when sidebar is opened on mobile
  useEffect(() => {
    if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
      closeDetail();
    }
  }, [isMobile, isSidebarVisible, previousSidebarVisible]);

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
    setSelectedFeatures([]);
  }, [setSelectedFeatures]);

  return isLoading ? (
    <div
      className={cx(
        "fixed z-50 top-0 right-0 bottom-0 left-0 bg-white flex items-center justify-center text-primary duration-500",
        {
          "visible opacity-100 transition-none": isLoading,
          "invisible opacity-0 transition-all": !isLoading,
        },
      )}
    >
      <LoadingSpinner size={96} color="var(--primary-color)" />
    </div>
  ) : (
    <Map
      {...mapProps}
      isOutsideLoading={isLoading}
      districtFiltering={true}
      showDistrictSelect={false}
      title={t("title")}
      moveSearchBarOutsideOfSideBarOnLargeScreen
      sources={{
        DISORDERS_DATA: disordersData,
        DIGUPS_DATA: digupsData,
        REPAIRS_POINTS_DATA: repairsPointsData,
        REPAIRS_POLYGONS_DATA: repairsPolygonsData,
        REPAIRS_CURVES_DATA: repairsCurvesData,
        DISTRICTS_GEOJSON,
      }}
      slots={[
        // MOBILE SLOTS
        {
          name: "mobile-header",
          isMobileOnly: true,
          className: "top-4 right-4 z-10",
          component: (
            <button
              onClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
              className="flex text-font w-12 h-12 items-center justify-center pointer-events-auto shadow-lg bg-background rounded-lg"
            >
              <Funnel className="w-12 h-12" />
            </button>
          ),
        },
        {
          name: "mobile-filter",
          animation: "slide-right",
          isMobileOnly: true,
          isVisible: isSidebarVisible,
          className: "top-0 left-0 bottom-0 w-full z-30",
          component: (
            <div className="w-full h-full pr-0 relative bg-background shadow-lg flex flex-col justify-between">
              <div className="space-y-6 w-full h-full overflow-auto relative">
                <div className="flex items-center pl-5 pr-8 pt-6 pb-3 gap-2">
                  <button onClick={() => setSidebarVisible(false)} className="flex p-2">
                    <ChevronLeftSmall className="text-primary" width={16} height={16} />
                  </button>
                  <h1 className="text-lg relative font-medium">{t("title")}</h1>
                </div>
                <div className="sticky top-full bg-gray bg-opacity-10">
                  <button
                    onClick={() => setSidebarVisible(false)}
                    className="p-3 flex items-center hover:underline justify-center mx-auto"
                  >
                    <span className="font-bold">{t("close")}</span>
                    <Close className="text-primary" width={32} height={32} />
                  </button>
                </div>
              </div>
            </div>
          ),
        },
        {
          name: "mobile-detail",
          bottomSheetOptions: {},
          isMobileOnly: true,
          className: "z-20",
          isVisible: !!selectedFeatures.length,
          component: (
            <div className="relative h-full">
              <Detail features={selectedFeatures} />

              <div className="sticky top-full bg-gray bg-opacity-10">
                <button
                  onClick={closeDetail}
                  className="p-3 flex items-center hover:underline justify-center mx-auto"
                >
                  <span className="font-bold">{t("close")}</span>
                  <Close className="text-primary" width={32} height={32} />
                </button>
              </div>
            </div>
          ),
        },
        {
          name: "mobile-search",
          isMobileOnly: true,
          isVisible: true,
          className: "bottom-10 left-4 right-4 z-10",
          component: (
            <div className="shadow-lg rounded-lg">
              <SearchBar
                value={searchQuery}
                placeholder={t("search")}
                onFocus={(e) => {
                  forwardGeocode(mapboxgl, e.target.value).then((results) =>
                    setSearchFeatures(results),
                  );
                }}
                onBlur={() => setSearchFeatures([])}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  forwardGeocode(mapboxgl, e.target.value).then((results) =>
                    setSearchFeatures(results),
                  );
                }}
                isGeolocation={isGeolocation}
                onGeolocationClick={() => setGeolocation(!isGeolocation)}
              />
              {!!searchFeatures.length && (
                <div className="w-full absolute z-20 shadow-lg bottom-11 sm:bottom-auto sm:top-full mb-3 bg-white rounded-lg py-4">
                  {searchFeatures.map((feature, i) => {
                    return (
                      <button
                        className="text-left w-full hover:bg-background px-4 py-2"
                        onMouseDown={() => onSearchFeatureClick(feature)}
                        key={i}
                      >
                        {feature.place_name_sk.split(",")[0]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ),
        },

        // DESKTOP SLOTS
        {
          name: "desktop-filter",
          animation: "slide-left",
          isDesktopOnly: true,
          isVisible: isSidebarVisible,
          className: "top-0 left-0 bottom-0 w-96",
          component: (
            <div className="w-full h-full pr-0 relative">
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSidebarVisible(!isSidebarVisible)}
                className="absolute right-0 bg-background rounded-br-lg z-20 py-8 transform translate-x-full hover:text-primary"
                onClick={() => {
                  setSidebarVisible(!isSidebarVisible);
                }}
              >
                <div
                  className="shadow-lg rounded-br-lg hidden sm:block absolute top-0 left-0 right-0 bottom-0 sm:shadow-lg"
                  style={{ zIndex: -20 }}
                ></div>
                <ChevronLeftSmall
                  width={24}
                  height={24}
                  className={cx("transform transition-transform", {
                    "rotate-180": !isSidebarVisible,
                  })}
                  stroke="var(--font-color)"
                />
                <div className="hidden sm:block bg-background absolute w-4 min-h-full box-content right-full top-0 pb-4"></div>
              </div>

              <div className="space-y-6 w-full h-full overflow-auto bg-background shadow-lg">
                <h1 className="text-lg relative z-30 font-medium px-8 pt-6 pb-3">{t("title")}</h1>

                <div className="mx-8 relative">
                  <SearchBar
                    value={searchQuery}
                    placeholder={t("search")}
                    onFocus={(e) => {
                      forwardGeocode(mapboxgl, e.target.value).then((results) =>
                        setSearchFeatures(results),
                      );
                    }}
                    onBlur={() => setSearchFeatures([])}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      forwardGeocode(mapboxgl, e.target.value).then((results) =>
                        setSearchFeatures(results),
                      );
                    }}
                    isGeolocation={isGeolocation}
                    onGeolocationClick={() => setGeolocation(!isGeolocation)}
                  />
                  {!!searchFeatures.length && (
                    <div className="w-full absolute z-20 shadow-lg bottom-11 sm:bottom-auto sm:top-full mb-3 bg-white rounded-lg py-4">
                      {searchFeatures.map((feature, i) => {
                        return (
                          <button
                            className="text-left w-full hover:bg-background px-4 py-2"
                            onMouseDown={() => onSearchFeatureClick(feature)}
                            key={i}
                          >
                            {feature.place_name_sk.split(",")[0]}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ),
        },
        {
          name: "desktop-detail",
          animation: "slide-right",
          isDesktopOnly: true,
          isVisible: !!selectedFeatures.length,
          className: "top-0 right-0 w-96 bg-background shadow-lg",
          component: <Detail features={selectedFeatures} />,
        },
      ]}
    >
      <Layer isVisible source="DISORDERS_DATA" styles={DISORDERS_STYLE} />
      <Layer isVisible source="DIGUPS_DATA" styles={DIGUPS_STYLE} />
      <Layer isVisible source="REPAIRS_POINTS_DATA" styles={REPAIRS_POINTS_STYLE} />
      <Layer isVisible source="REPAIRS_POLYGONS_DATA" styles={REPAIRS_POLYGONS_STYLE} />
      <Layer isVisible source="REPAIRS_CURVES_DATA" styles={REPAIRS_CURVES_STYLE} />
      <Layer ignoreClick source="DISTRICTS_GEOJSON" styles={DISTRICTS_STYLE} />
    </Map>
  );
};

export default App;
