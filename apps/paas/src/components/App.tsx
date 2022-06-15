import React, { useEffect, useState, useCallback } from "react";

import { useTranslation } from "react-i18next";

import {
  useMap,
  Layer,
  forwardGeocode,
  addDistrictPropertyToLayer,
} from "@bratislava/mapbox-maps-core";
import { SearchBar } from "@bratislava/mapbox-maps-ui";
import { Detail } from "./Detail";

import "../styles.css";

import PARKOMATS_DATA_RAW from "../assets/layers/PARKOMATS/PARKOMATS.json";
import PARKOMATS_STYLES from "../assets/layers/PARKOMATS/PARKOMATS";

import ASSISTANTS_DATA_RAW from "../assets/layers/ASSISTANTS/ASSISTANTS.json";
import ASSISTANTS_STYLES from "../assets/layers/ASSISTANTS/ASSISTANTS";

import ASSISTANTS_RU_DATA_RAW from "../assets/layers/ASSISTANTS_RU/ASSISTANTS_RU.json";
import ASSISTANTS_RU_STYLES from "../assets/layers/ASSISTANTS_RU/ASSISTANTS_RU";

import BRANCHES_DATA_RAW from "../assets/layers/BRANCHES/BRANCHES.json";
import BRANCHES_STYLES from "../assets/layers/BRANCHES/BRANCHES";

import PARTNERS_DATA_RAW from "../assets/layers/PARTNERS/PARTNERS.json";
import PARTNERS_STYLES from "../assets/layers/PARTNERS/PARTNERS";

import OKP_DATA_RAW from "../assets/layers/OKP/OKP.json";
import OKP_STYLES from "../assets/layers/OKP/OKP";

import UDR_DATA_RAW from "../assets/layers/UDR/UDR.json";
import UDR_STYLES from "../assets/layers/UDR/UDR";
import UDR_PLANNED_STYLES from "../assets/layers/UDR/UDR_PLANNED";

import ODP_DATA_RAW from "../assets/layers/ODP/ODP.json";
import ODP_STYLES from "../assets/layers/ODP/ODP";
import ODP_PLANNED_STYLES from "../assets/layers/ODP/ODP_PLANNED";

import i18next from "../utils/i18n";
import MobileTopSlot from "./MobileTopSlot";
import Sidebar from "./Sidebar";

import { ReactComponent as ResidentInactiveIcon } from "../assets/icons/resident-inactive.svg";
import { ReactComponent as ResidentActiveIcon } from "../assets/icons/resident-active.svg";
import { ReactComponent as VisitorInactiveIcon } from "../assets/icons/visitor-inactive.svg";
import { ReactComponent as VisitorActiveIcon } from "../assets/icons/visitor-active.svg";
import { ReactComponent as ParkomatInactiveIcon } from "../assets/icons/parkomat-inactive.svg";
import parkomatActiveIconUrl, {
  ReactComponent as ParkomatActiveIcon,
} from "../assets/icons/parkomat-active.svg";
import { ReactComponent as AssistantsInactiveIcon } from "../assets/icons/assistant-inactive.svg";
import assistantActiveIconUrl, {
  ReactComponent as AssistantsActiveIcon,
} from "../assets/icons/assistant-active.svg";
import { ReactComponent as BranchInactiveIcon } from "../assets/icons/branch-inactive.svg";
import branchActiveIconUrl, {
  ReactComponent as BranchActiveIcon,
} from "../assets/icons/branch-active.svg";
import { ReactComponent as PartnerInactiveIcon } from "../assets/icons/partner-inactive.svg";
import partnerActiveIconUrl, {
  ReactComponent as PartnerActiveIcon,
} from "../assets/icons/partner-active.svg";

const PARKOMATS_DATA = addDistrictPropertyToLayer(PARKOMATS_DATA_RAW);
const ASSISTANTS_DATA = addDistrictPropertyToLayer(ASSISTANTS_DATA_RAW);
const ASSISTANTS_RU_DATA = addDistrictPropertyToLayer(ASSISTANTS_RU_DATA_RAW);
const BRANCHES_DATA = addDistrictPropertyToLayer(BRANCHES_DATA_RAW);
const PARTNERS_DATA = addDistrictPropertyToLayer(PARTNERS_DATA_RAW);

const ODP_DATA = addDistrictPropertyToLayer({
  ...ODP_DATA_RAW,
  features: [
    ...ODP_DATA_RAW.features.filter(
      (feature) => feature.properties.Status === "active"
    ),
  ],
});

const ODP_PLANNED_DATA = addDistrictPropertyToLayer({
  ...ODP_DATA_RAW,
  features: [
    ...ODP_DATA_RAW.features.filter(
      (feature) => feature.properties.Status === "planned"
    ),
  ],
});

const UDR_DATA = addDistrictPropertyToLayer({
  ...UDR_DATA_RAW,
  features: [
    ...UDR_DATA_RAW.features.filter(
      (feature) =>
        feature.properties["UDR ID"]?.toString().length === 4 &&
        feature.properties.Status === "active"
    ),
  ],
});

const UDR_PLANNED_DATA = addDistrictPropertyToLayer({
  ...UDR_DATA_RAW,
  features: [
    ...UDR_DATA_RAW.features.filter(
      (feature) =>
        feature.properties["UDR ID"]?.toString().length === 4 &&
        feature.properties.Status === "planned"
    ),
  ],
});

const OKP_DATA = addDistrictPropertyToLayer({
  ...OKP_DATA_RAW,
  features: [
    ...OKP_DATA_RAW.features.filter(
      (feature) => feature.properties["OPK ID"]?.toString().length === 2
    ),
  ],
});

export const App = () => {
  const { t } = useTranslation();

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
    filteringOpenState,
    mapboxgl,
    ref: mapRef,
    selectedFeatures,
    fitToDistrict,
  } = mapProps;

  const mainLayers = [
    {
      key: "visitors",
      title: t("layers.visitorsLayer.title"),
      icon: VisitorInactiveIcon,
      activeIcon: VisitorActiveIcon,
      layerIcon: VisitorActiveIcon,
      description: t("layers.visitorsLayer.description"),
    },
    {
      key: "residents",
      title: t("layers.residentsLayer.title"),
      icon: ResidentInactiveIcon,
      activeIcon: ResidentActiveIcon,
      layerIcon: ResidentActiveIcon,
      description: t("layers.residentsLayer.description"),
    },
  ];

  const secondaryLayer1EnabledState = useState(false);
  const secondaryLayer2EnabledState = useState(false);
  const secondaryLayer3EnabledState = useState(false);
  const secondaryLayer4EnabledState = useState(false);

  const secondaryLayers = [
    {
      key: "parkomats",
      title: t("layers.parkomatsLayer.title"),
      icon: ParkomatInactiveIcon,
      enabledState: secondaryLayer1EnabledState,
      activeIcon: ParkomatActiveIcon,
      layerIcon: ParkomatActiveIcon,
    },
    {
      key: "parking-assistants",
      title: t("layers.assistantsLayer.title"),
      icon: AssistantsInactiveIcon,
      enabledState: secondaryLayer2EnabledState,
      activeIcon: AssistantsActiveIcon,
      layerIcon: AssistantsActiveIcon,
    },
    {
      key: "partners",
      title: t("layers.partnersLayer.title"),
      icon: PartnerInactiveIcon,
      enabledState: secondaryLayer3EnabledState,
      activeIcon: PartnerActiveIcon,
      layerIcon: PartnerActiveIcon,
    },
    {
      key: "branches",
      title: t("layers.branchesLayer.title"),
      icon: BranchInactiveIcon,
      enabledState: secondaryLayer4EnabledState,
      activeIcon: BranchActiveIcon,
      layerIcon: BranchActiveIcon,
    },
  ];

  const [selectedMainLayer, setSelectedMainLayer] = useState(mainLayers[0]);

  //ugly solution to enable and disable parkomats
  useEffect(() => {
    if (selectedMainLayer.key === "visitors") {
      secondaryLayers[0].enabledState[1](true);
      secondaryLayers[1].enabledState[1](true);
      secondaryLayers[2].enabledState[1](true);
      secondaryLayers[3].enabledState[1](false);
    } else if (selectedMainLayer.key === "residents") {
      secondaryLayers[0].enabledState[1](false);
      secondaryLayers[1].enabledState[1](false);
      secondaryLayers[2].enabledState[1](false);
      secondaryLayers[3].enabledState[1](true);
    }
  }, [selectedMainLayer]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchFeatures, setSearchFeatures] = useState<any[]>([]);

  const onSearchFeatureClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any) => {
      setSearchQuery(feature.place_name_sk.split(",")[0]);
      setSearchFeatures([]);
      if (mapRef && feature.geometry.type === "Point") {
        console.log(mapRef.current);

        mapRef.current?.setViewport({
          lng: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
          zoom: 18,
        });
      }
    },
    [mapRef]
  );

  useEffect(() => {
    console.log(mapRef);
  }, [mapRef]);

  return (
    <Map
      {...mapProps}
      districtFiltering={false}
      showDistrictSelect={false}
      title={t("title")}
      onDistrictChange={fitToDistrict}
      moveSearchBarOutsideOfSideBarOnLargeScreen
      icons={{
        parkomat: {
          path: parkomatActiveIconUrl,
          width: 64,
          height: 64,
        },
        assistant: {
          path: assistantActiveIconUrl,
          width: 64,
          height: 64,
        },
        partner: {
          path: partnerActiveIconUrl,
          width: 64,
          height: 64,
        },
        branch: {
          path: branchActiveIconUrl,
          width: 64,
          height: 64,
        },
      }}
      sources={{
        OKP_DATA,

        UDR_DATA,
        UDR_PLANNED_DATA,
        // UDR_RU_PLANNED_DATA,

        ODP_DATA,
        // ODP_RU_PLANNED_DATA,
        ODP_PLANNED_DATA,

        ASSISTANTS_DATA,
        ASSISTANTS_RU_DATA,

        PARKOMATS_DATA,
        PARTNERS_DATA,
        BRANCHES_DATA,
      }}
      slots={[
        {
          name: "desktop-sidebar",
          isVisible: true,
          className: "top-0 left-0 w-96 h-full bg-background shadow-lg",
          animation: "slide-left",
          isDesktopOnly: true,
          component: () => (
            <Sidebar
              filteringOpenState={filteringOpenState}
              mapboxgl={mapboxgl}
              mapRef={mapRef.current}
              mainLayers={mainLayers}
              secondaryLayers={secondaryLayers}
              selectedMainLayer={selectedMainLayer}
              onMainLayerSelect={(filter) => setSelectedMainLayer(filter)}
            />
          ),
        },
        {
          name: "desktop-detail",
          animation: "slide-right",
          isDesktopOnly: true,
          isVisible: !!selectedFeatures.length,
          className: "top-0 right-0 w-96 bg-background shadow-lg",
          component: () => <Detail features={selectedFeatures} />,
        },
        {
          name: "mobile-detail",
          bottomSheetOptions: {},
          isMobileOnly: true,
          isVisible: !!selectedFeatures.length,
          component: () => <Detail features={selectedFeatures} />,
        },
        {
          name: "mobile-top-buttons",
          isMobileOnly: true,
          isVisible: true,
          className: "w-full top-0 left-0 right-0",
          component: () => (
            <MobileTopSlot
              leftText={t("layers.visitorsLayer.title")}
              rightText={t("layers.residentsLayer.title")}
              onLeftClick={() => setSelectedMainLayer(mainLayers[0])}
              onRightClick={() => setSelectedMainLayer(mainLayers[1])}
              selectedIndex={selectedMainLayer.key === "visitors" ? 0 : 1}
            />
          ),
        },
      ]}
      // searchBar={
      //   <div className="relative">
      //     <SearchBar
      //       value={searchQuery}
      //       placeholder={t("search")}
      //       className="w-full relative"
      //       onFocus={(e) => {
      //         forwardGeocode(mapboxgl, e.target.value).then((results) =>
      //           setSearchFeatures(results)
      //         );
      //       }}
      //       onBlur={() => setSearchFeatures([])}
      //       onChange={(e) => {
      //         setSearchQuery(e.target.value);
      //         forwardGeocode(mapboxgl, e.target.value).then((results) =>
      //           setSearchFeatures(results)
      //         );
      //       }}
      //       isGeolocation={isGeolocation}
      //       onGeolocationClick={() => setGeolocation(!isGeolocation)}
      //     />
      //     {!!searchFeatures.length && (
      //       <div className="w-full absolute z-20 shadow-lg bottom-11 sm:bottom-auto sm:top-full mb-3 bg-white rounded-lg py-4">
      //         {searchFeatures.map((feature, i) => {
      //           return (
      //             <button
      //               className="text-left w-full hover:bg-background px-4 py-2"
      //               onMouseDown={() => onSearchFeatureClick(feature)}
      //               key={i}
      //             >
      //               {feature.place_name_sk.split(",")[0]}
      //             </button>
      //           );
      //         })}
      //       </div>
      //     )}
      //   </div>
      // }
    >
      <Layer
        source="OKP_DATA"
        styles={OKP_STYLES}
        isVisible={selectedMainLayer.key === "visitors"}
      />

      <Layer
        source="UDR_DATA"
        styles={UDR_STYLES}
        isVisible={selectedMainLayer.key === "visitors"}
      />
      <Layer
        source="UDR_PLANNED_DATA"
        styles={UDR_PLANNED_STYLES}
        isVisible={selectedMainLayer.key === "visitors"}
      />

      <Layer
        source="ODP_DATA"
        styles={ODP_STYLES}
        isVisible={selectedMainLayer.key === "residents"}
      />
      <Layer
        source="ODP_PLANNED_DATA"
        styles={ODP_PLANNED_STYLES}
        isVisible={selectedMainLayer.key === "residents"}
      />

      <Layer
        source="PARKOMATS_DATA"
        styles={PARKOMATS_STYLES}
        isVisible={secondaryLayers[0].enabledState[0]}
      />
      <Layer
        source="ASSISTANTS_DATA"
        styles={ASSISTANTS_STYLES}
        isVisible={secondaryLayers[1].enabledState[0]}
      />
      <Layer
        source="ASSISTANTS_RU_DATA"
        styles={ASSISTANTS_RU_STYLES}
        isVisible={secondaryLayers[1].enabledState[0]}
      />
      <Layer
        source="PARTNERS_DATA"
        styles={PARTNERS_STYLES}
        isVisible={secondaryLayers[2].enabledState[0]}
      />
      <Layer
        source="BRANCHES_DATA"
        styles={BRANCHES_STYLES}
        isVisible={secondaryLayers[3].enabledState[0]}
      />
    </Map>
  );
};

export default App;
