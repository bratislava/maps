import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import "../styles.css";
import { useResizeDetector } from "react-resize-detector";

// maps
import {
  DISTRICTS_GEOJSON,
  usePrevious,
  Slot,
  Layout,
  MapHandle,
  Map,
  Layer,
  useFilter,
  Cluster,
  Filter,
  useCombinedFilter,
} from "@bratislava/react-maps-core";

// components
import { Detail } from "./Detail";

// utils
import i18next from "../utils/i18n";
import { processData } from "../utils/utils";
import mapboxgl from "mapbox-gl";
import { Feature, Point, FeatureCollection } from "geojson";
import { MobileHeader } from "./mobile/MobileHeader";
import { MobileFilters } from "./mobile/MobileFilters";
import { DesktopFilters } from "./desktop/DesktopFilters";
import { MobileSearch } from "./mobile/MobileSearch";

import RAW_DATA_SPORT_GROUNDS_FEATURES from "../data/sport-grounds/sport-grounds-data";
import RAW_DATA_SPORT_GROUNDS_ALT_FEATURES from "../data/sport-grounds/sport-grounds-alt-data";

import DISTRICTS_STYLE from "../data/districts/districts";
import { Marker } from "./Marker";
import { MultipleMarker } from "./MultipleMarker";
import { ILayerGroup } from "@bratislava/react-maps-ui/src/components/molecules/Layers/Layers";
import { Icon, IIconProps } from "./Icon";
import { BottomSheet } from "react-spring-bottom-sheet";

export const App = () => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<FeatureCollection | null>(null);

  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);

  const [isSidebarVisible, setSidebarVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const { data, uniqueDistricts, uniqueTypes } = processData(
      RAW_DATA_SPORT_GROUNDS_FEATURES,
      RAW_DATA_SPORT_GROUNDS_ALT_FEATURES,
    );

    setData(data);
    setUniqueDistricts(uniqueDistricts);
    setUniqueTypes(uniqueTypes);
    setLoading(false);
  }, []);

  const mapRef = useRef<MapHandle>(null);
  mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN;

  const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null);
  const [isMobile, setMobile] = useState<boolean | null>(null);
  const [isGeolocation, setGeolocation] = useState(false);

  const previousSidebarVisible = usePrevious(isSidebarVisible);
  const previousMobile = usePrevious(isMobile);

  const districtFilter = useFilter({
    property: "district",
    keys: uniqueDistricts,
  });

  const tagFilter = useFilter({
    property: "tags",
    keys: uniqueTypes,
    comparator: useCallback(({ value, property }: { value: string; property: string }) => {
      return ["in", value, ["get", property]];
    }, []),
    defaultValues: useMemo(
      () => uniqueTypes.reduce((prev, curr) => ({ ...prev, [curr]: true }), {}),
      [uniqueTypes],
    ),
  });

  const sportGroundFilter = useFilter({
    property: "kind",
    keepOnEmpty: true,
    keys: useMemo(
      () => [
        "zimný štadión",
        "športová hala",
        "plaváreň",
        "fitness",
        "sauna",
        "multifunkčný areál",
        "kúpalisko",
        "workoutové ihrisko",
        "bežecká dráha",
        "spevnená plocha",
        "atletická dráha",
        "basketbalové ihrisko",
        "futbalové ihrisko",
        "klzisko",
        "lezecká stena",
        "telocvičňa",
        "športový areál",
        "futbalový štadión",
        "štadión",
        "tenis",
        "stolný tenis",
        "petangové ihrisko",
        "strelnica",
        "volejbalové ihrisko",
        "vodná plocha",
        "pumptrack",
        "skatepark",
        "tanečné štúdio",
        "dopravné ihrisko",
        "wellness",
        "jóga",
      ],
      [],
    ),
  });

  const layerFilter = useFilter({
    property: "layer",
    keepOnEmpty: true,
    keys: useMemo(() => ["sportGrounds", "cvicko", "swimmingPools"], []),
    defaultValues: useMemo(
      () => ({
        sportGrounds: true,
        cvicko: true,
        swimmingPools: true,
      }),
      [],
    ),
  });

  // close sidebar on mobile and open on desktop
  useEffect(() => {
    // from mobile to desktop
    if (previousMobile !== false && isMobile === false) {
      setSidebarVisible(true);
    }
    // from desktop to mobile
    if (previousMobile !== true && isMobile === true) {
      setSidebarVisible(false);
    }
  }, [previousMobile, isMobile]);

  const isDetailOpen = useMemo(() => !!selectedFeature, [selectedFeature]);

  const closeDetail = useCallback(() => {
    setSelectedFeature(null);
  }, []);

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
        filter: tagFilter,
        mapToActive: (activeTypes) => ({
          title: t("filters.tag.title"),
          items: activeTypes,
        }),
      },
      {
        filter: layerFilter,
        onlyInExpression: true,
        mapToActive: (activeLayers) => ({
          title: t("filters.layer.title"),
          items: activeLayers,
        }),
      },
    ],
  });

  // close detailbox when sidebar is opened on mobile
  useEffect(() => {
    if (isMobile && isSidebarVisible == true && previousSidebarVisible == false) {
      closeDetail();
    }
  }, [closeDetail, isMobile, isSidebarVisible, previousSidebarVisible]);

  // fit to district
  useEffect(() => {
    districtFilter.activeKeys.length == 0
      ? mapRef.current?.changeViewport({
          center: {
            lat: 48.148598,
            lng: 17.107748,
          },
          zoom: 10.75,
        })
      : mapRef.current?.fitToDistrict(districtFilter.activeKeys);
  }, [districtFilter.activeKeys, mapRef]);

  const markerClickHandler = useCallback((feature: Feature<Point>) => {
    setSelectedFeature(feature);
    mapRef.current?.changeViewport({
      center: {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      },
    });
  }, []);

  const { height: desktopDetailHeight, ref: desktopDetailRef } =
    useResizeDetector<HTMLDivElement>();

  const layerToIconMappingObject: { [layer: string]: IIconProps["icon"] } = useMemo(
    () => ({
      sportGrounds: "table-tennis",
      cvicko: "cvicko",
      swimmingPools: "pool",
    }),
    [],
  );

  const layerGroups: ILayerGroup<typeof layerFilter.keys[0]>[] = useMemo(
    () =>
      layerFilter.keys.map((layerKey) => ({
        label: t(`layers.${layerKey}.title`),
        icon: (
          <div className="bg-primary rounded-full text-white">
            <Icon size={40} icon={layerToIconMappingObject[layerKey]} />
          </div>
        ),
        layers: { value: layerKey, isActive: layerFilter.isAnyKeyActive([layerKey]) },
      })),
    [layerFilter, layerToIconMappingObject, t],
  );

  return isLoading ? null : (
    <Map
      ref={mapRef}
      mapboxgl={mapboxgl}
      i18next={i18next}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      initialViewport={{
        center: {
          lat: 48.148598,
          lng: 17.107748,
        },
      }}
      isDevelopment={import.meta.env.DEV}
      isOutsideLoading={isLoading}
      moveSearchBarOutsideOfSideBarOnLargeScreen
      sources={{
        SPORT_GROUNDS_DATA: data,
        DISTRICTS_GEOJSON,
      }}
      onMobileChange={setMobile}
      onGeolocationChange={setGeolocation}
      onMapClick={closeDetail}
    >
      <Layer
        ignoreClick
        filters={districtFilter.expression.length ? districtFilter.expression : undefined}
        source="DISTRICTS_GEOJSON"
        styles={DISTRICTS_STYLE}
      />

      <Filter expression={combinedFilter.expression}>
        <Cluster features={data?.features ?? []} radius={100}>
          {({ features, lng, lat, key, clusterExpansionZoom }) =>
            features.length === 1 ? (
              <Marker
                isSelected={features[0].id === selectedFeature?.id}
                key={key}
                feature={features[0]}
                onClick={markerClickHandler}
              />
            ) : (
              <MultipleMarker
                isSelected={features[0].id === selectedFeature?.id}
                key={key}
                features={features}
                lat={lat}
                lng={lng}
                onClick={() =>
                  mapRef.current?.changeViewport({
                    zoom: clusterExpansionZoom ?? 0,
                    center: {
                      lat,
                      lng,
                    },
                  })
                }
              />
            )
          }
        </Cluster>
      </Filter>

      <Layout isOnlyMobile>
        <Slot name="mobile-header">
          <MobileHeader
            onFunnelClick={() => setSidebarVisible((isSidebarVisible) => !isSidebarVisible)}
          />
        </Slot>

        <Slot
          name="mobile-filter"
          isVisible={isSidebarVisible}
          setVisible={setSidebarVisible}
          avoidControls={false}
        >
          <MobileFilters
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            activeFilters={combinedFilter.active}
            onResetFiltersClick={combinedFilter.reset}
            districtFilter={districtFilter}
            tagFilter={tagFilter}
            sportGroundFilter={sportGroundFilter}
            layerFilter={layerFilter}
            layerGroups={layerGroups}
          />
        </Slot>

        <Slot name="mobile-detail" isVisible={true}>
          <Detail isMobile feature={selectedFeature} onClose={closeDetail} />
        </Slot>

        <Slot name="mobile-search">
          <MobileSearch mapRef={mapRef} mapboxgl={mapboxgl} isGeolocation={isGeolocation} />
        </Slot>
      </Layout>
      <Layout isOnlyDesktop>
        <Slot
          name="desktop-filters"
          isVisible={isSidebarVisible}
          setVisible={setSidebarVisible}
          openPadding={{
            left: 384, // w-96 or 24rem
          }}
        >
          <DesktopFilters
            mapboxgl={mapboxgl}
            isVisible={isSidebarVisible}
            setVisible={setSidebarVisible}
            areFiltersDefault={combinedFilter.areDefault}
            onResetFiltersClick={combinedFilter.reset}
            mapRef={mapRef}
            districtFilter={districtFilter}
            layerFilter={layerFilter}
            sportGroundFilter={sportGroundFilter}
            tagFilter={tagFilter}
            layerGroups={layerGroups}
            isGeolocation={isGeolocation}
          />
        </Slot>

        <Slot
          name="desktop-detail"
          isVisible={isDetailOpen}
          openPadding={{
            right: 384,
          }}
          avoidControls={window.innerHeight <= (desktopDetailHeight ?? 0) + 200 ? true : false}
        >
          <div
            ref={desktopDetailRef}
            className={cx("fixed top-0 right-0 w-96 bg-background transition-all duration-500", {
              "translate-x-full": !isDetailOpen,
              "shadow-lg": isDetailOpen,
            })}
          >
            <Detail isMobile={false} feature={selectedFeature} onClose={closeDetail} />
          </div>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
