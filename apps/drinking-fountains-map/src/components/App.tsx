import cx from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles.css";

// maps
import { Cluster } from "@bratislava/react-mapbox";
import {
  Layout,
  Map,
  MapHandle,
  SearchBar,
  Slot,
  ThemeController,
  ViewportController,
} from "@bratislava/react-maps";

// components
import { Detail } from "./Detail";

// utils
import { Feature, Point } from "geojson";
import { processData } from "../utils/utils";

import { Modal, Sidebar } from "@bratislava/react-maps-ui";
import { Trans, useTranslation } from "react-i18next";
import { ReactComponent as BALogo } from "../assets/ba-logo.svg";
import { Legend } from "./Legend";
import { Marker } from "./Marker";

const { data } = processData();

export const App = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("title");
  }, [t]);

  const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null);
  const [isLegendVisible, setLegendVisible] = useState<boolean | undefined>(undefined);

  const mapRef = useRef<MapHandle>(null);

  const isDetailOpen = useMemo(() => !!selectedFeature, [selectedFeature]);

  const closeDetail = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  const markerClickHandler = useCallback((feature: Feature<Point>) => {
    setSelectedFeature(feature);
    mapRef.current?.changeViewport({
      center: {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      },
    });
  }, []);

  const [isMobile, setMobile] = useState<boolean | null>(null);

  const initialViewport = useMemo(
    () => ({
      center: {
        lat: 48.16055874931445,
        lng: 17.090805635872925,
      },
      zoom: 11.717870557689393,
    }),
    [],
  );

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={import.meta.env.PUBLIC_MAPBOX_PUBLIC_TOKEN}
      mapStyles={{
        light: import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
        dark: import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      }}
      initialViewport={initialViewport}
      loadingSpinnerColor="#2BACE2"
      isDevelopment={import.meta.env.DEV}
      onMobileChange={setMobile}
      onMapClick={closeDetail}
      mapInformationButtonClassName="!top-20 sm:!top-6"
      mapInformation={{
        title: t("informationModal.title"),
        description: (
          <Trans i18nKey="informationModal.description">
            before
            <a
              className="underline text-secondary font-semibold"
              href={t("informationModal.descriptionLink")}
              target="_blank"
              rel="noreferrer"
            >
              link
            </a>
            after
          </Trans>
        ),
        partners: [
          {
            name: "bratislava",
            link: "https://bratislava.sk",
            image: "logos/bratislava.png",
          },
          {
            name: "inovation",
            link: "https://inovacie.bratislava.sk/",
            image: "logos/inovation.png",
          },
          {
            name: "mib",
            link: "https://mib.sk",
            image: "logos/mib.png",
            height: 72,
          },
          {
            name: "bvs",
            link: "https://www.bvsas.sk/",
            image: "logos/bvs.png",
            height: 72,
          },
        ],
        footer: (
          <Trans i18nKey="informationModal.footer">
            before
            <a href={t("informationModal.footerLink")} className="underline font-semibold">
              link
            </a>
          </Trans>
        ),
      }}
    >
      <Cluster features={data?.features ?? []} radius={24}>
        {({ features, lng, lat, key, clusterExpansionZoom }) =>
          features.length === 1 ? (
            <Marker
              isSelected={features[0].id === selectedFeature?.id}
              key={key}
              feature={features[0]}
              onClick={markerClickHandler}
            />
          ) : (
            <Marker
              key={key}
              feature={{
                ...features[0],
                geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
              }}
              count={features.length}
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

      <Slot id="header" position="top-left">
        <div className="w-screen sm:w-fit pointer-events-none p-4">
          <div className="h-12 items-center border-2 border-background-lightmode dark:border-gray-darkmode/20 w-full bg-background-lightmode dark:bg-background-darkmode shadow-lg rounded-lg px-4 flex gap-4">
            <span className="text-primary">
              <BALogo />
            </span>
            <span className="font-semibold flex-1 text-center">{t("title")}</span>
          </div>
        </div>
      </Slot>

      <Slot
        id="controls"
        position="bottom"
        className={cx("p-4 pb-9  w-screen pointer-events-none")}
      >
        <div
          className={cx("flex flex-col gap-2 transition-transform duration-500 delay-500", {
            "-translate-y-[72px] !delay-[0]": isDetailOpen && isMobile,
          })}
        >
          <div className="flex justify-between items-end">
            <ThemeController className="pointer-events-auto" />
            <ViewportController
              slots={["legend", ["compass", "zoom"]]}
              desktopSlots={["legend", "geolocation", "compass", ["fullscreen", "zoom"]]}
              isLegendOpen={isLegendVisible ?? false}
              onLegendOpenChange={setLegendVisible}
            />
          </div>
          <div className="pointer-events-auto shadow-lg rounded-lg sm:hidden">
            <SearchBar placeholder={t("search")} language={i18n.language} direction="top" />
          </div>
        </div>
      </Slot>

      <Layout isOnlyMobile>
        <Slot
          id="mobile-detail"
          padding={{ bottom: 88 }}
          position="bottom"
          isVisible={isDetailOpen ?? false}
        >
          <Detail isMobile feature={selectedFeature} onClose={closeDetail} />
        </Slot>
        <Slot position="top-right" id="mobile-legend" isVisible={isLegendVisible}>
          <Sidebar
            title={t("legend.backToMap")}
            isVisible={isLegendVisible ?? false}
            onOpen={() => setLegendVisible(true)}
            onClose={() => setLegendVisible(false)}
            position="right"
            closeText={t("close")}
          >
            <Legend />
          </Sidebar>
        </Slot>
      </Layout>
      <Layout isOnlyDesktop>
        <Slot id="desktop-detail" position="top-right" isVisible={isDetailOpen}>
          <div
            className={cx("w-96 bg-background transition-all duration-500", {
              "translate-x-full": !isDetailOpen,
              "shadow-lg": isDetailOpen,
            })}
          >
            <Detail isMobile={false} feature={selectedFeature} onClose={closeDetail} />
          </div>
        </Slot>
        <Slot id="desktop-legend">
          <Modal
            closeButtonInCorner
            title={t("legend.title")}
            isOpen={isLegendVisible ?? false}
            onClose={() => setLegendVisible(false)}
          >
            <Legend />
          </Modal>
        </Slot>
      </Layout>
    </Map>
  );
};

export default App;
