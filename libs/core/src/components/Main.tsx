import React, {
  ReactNode,
  useEffect,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
  ReactElement,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { LoadingSpinner } from "@bratislava/mapbox-maps-ui";
import { Mapbox } from "./Mapbox";
import { useResizeDetector } from "react-resize-detector";
import Layer, { ILayerProps } from "./Layer";
import cx from "classnames";
import DATA_DISTRICTS from "../assets/layers/districts.json";

import { Header } from "./Header";
import DetailPlaceholder from "./DetailPlaceholder";
import { ISlotProps, Slot } from "./Slot";
import FilterPlaceholder from "./FilterPlaceholder";
import { MobileBottomSheetSlot } from "./MobileBottomSheetSlot";
import { DesktopLeftSidebarSlot } from "./DesktopLeftSidebarSlot";

import { Sources, IViewportProps, MapIcon, IComponentSlot } from "../types";
import { ThemeController } from "./ThemeController";
import { ViewportController } from "./ViewportController";
import mapboxgl from "mapbox-gl";
import { MobileTopSlot } from "./MobileTopSlot";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
// import { LoadingSpinner } from '@bratislava/mapbox-maps-core';
import { i18n } from "i18next";

import enTranslation from "../translations/en.json";
import skTranslation from "../translations/sk.json";
import {
  exitFullscreen,
  getFullscreenElement,
  requestFullscreen,
} from "../utils/fullscreen";
import { SearchBarPlaceholder } from "./SearchBarPlaceholder";

type useStateType<T> = [T, Dispatch<SetStateAction<T>>];

export interface KeyStateRecord<T> {
  key: string;
  state: T;
}

export const getKeyStateValue = <T,>(
  state: KeyStateRecord<T>[],
  key: string
) => {
  const foundState = state.find((item) => item.key == key);
  return foundState ? foundState.state : undefined;
};

export const toggleKeyStateValue = (
  state: KeyStateRecord<boolean>[],
  key: string
) => {
  const foundState = state.find((item) => item.key == key);
  if (foundState) {
    foundState.state = !foundState.state;
  }
  return [...state];
};

export interface MapProps {
  i18next: i18n;
  mapboxgl: typeof mapboxgl;
  title?: string;
  sources?: Sources;
  districtFiltering?: boolean;
  showDistrictSelect?: boolean;
  icons?: {
    [index: string]: string | MapIcon;
  };
  mapStyles: {
    light?: string;
    dark?: string;
    satellite?: string;
  };
  mobileState: useStateType<boolean>;
  darkmodeState: useStateType<boolean>;
  geolocationState: useStateType<boolean>;
  detailOpenState: useStateType<boolean>;
  filteringOpenState: useStateType<boolean>;
  fullscreenState: useStateType<boolean>;
  satelliteState: useStateType<boolean>;
  loadingState: useStateType<boolean>;
  selectedDistrictState: useStateType<string | null>;
  detail?: ReactNode;
  isOutsideLoading?: boolean;
  selectedFeaturesState: useStateType<any[]>;

  slots?: IComponentSlot[];

  searchBar?: ReactNode;
  // slots?: ReactElement<ISlotProps> | Array<ReactElement<ISlotProps>>;
  children?: ReactElement<ILayerProps> | Array<ReactElement<ILayerProps>>;
  layerPrefix?: string;
  onDistrictChange?: (district: string | null) => void;
  moveSearchBarOutsideOfSideBarOnLargeScreen?: boolean;
}

export type MapHandle = {
  setViewport: (viewport: Partial<IViewportProps>) => void;
  closeFiltering: () => void;
  closeDetail: () => void;
  fitToDisplayedData: () => void;
  fitToDistrict: (district: string | null) => void;
  isSlotVisible: (name: string) => boolean;
};

export const Map = forwardRef<MapHandle, MapProps>(
  (
    {
      mapboxgl,
      districtFiltering = true,
      showDistrictSelect = true,
      i18next,
      title = "Untitled map",
      sources = {},
      icons = {},
      mapStyles,
      detail,
      slots = [],
      children,
      mobileState,
      darkmodeState,
      detailOpenState,
      filteringOpenState,
      fullscreenState,
      searchBar,
      satelliteState,
      loadingState,
      geolocationState,
      selectedDistrictState,
      layerPrefix = "BRATISLAVA",
      onDistrictChange,
      moveSearchBarOutsideOfSideBarOnLargeScreen = false,
      selectedFeaturesState,
    },
    forwardedRef
  ) => {
    i18next.addResources("en", "maps", enTranslation);
    i18next.addResources("sk", "maps", skTranslation);

    const mapboxRef = useRef<MapboxHandle>(null);

    const [isMobile, setMobile] = mobileState;
    const [isGeolocation, setGeolocation] = geolocationState;
    const [isDarkmode, setDarkmode] = darkmodeState;
    const [isDetailOpen, setDetailOpen] = detailOpenState;
    const [isFullscreen, setFullscreen] = fullscreenState;
    const [isSatellite, setSatellite] = satelliteState;
    const [isLoading, setLoading] = loadingState;
    const [isFilteringOpen, setFilteringOpen] = filteringOpenState;
    const [selectedDistrict, setSelectedDistrict] = selectedDistrictState;
    const [selectedFeatures, setSelectedFeatures] = selectedFeaturesState;

    const [slotVisibilities, setSlotVisibilities] = useState<
      KeyStateRecord<boolean>[]
    >([]);

    const extendedSources = {
      ...sources,
      DATA_DISTRICTS,
    };

    const [viewport, setViewport] = useState<IViewportProps>({
      lat: 48.1633,
      lng: 17.1202,
      zoom: 12,
      pitch: 0,
      bearing: 0,
      paddingLeft: isFilteringOpen ? (isMobile ? 0 : 384) : 0,
      paddingBottom: isFilteringOpen ? (isMobile ? 200 : 0) : 0,
      paddingRight: isDetailOpen ? 384 : 0,
    });
    const [bearing, setBearing] = useState(viewport.bearing);
    const [
      doesViewportControllerFitsUnderDetail,
      setViewportControllerFitsUnderDetail,
    ] = useState(false);

    const {
      height: detailPlaceholderHeight,
      width: detailPlaceholderWidth,
      ref: detailPlaceholderRef,
    } = useResizeDetector();
    const {
      width: filterPlaceholderWidth,
      height: filterPlaceholderHeight,
      ref: filterPlaceholderRef,
    } = useResizeDetector();
    const {
      height: containerHeight,
      width: containerWidth,
      ref: containerRef,
    } = useResizeDetector<HTMLDivElement>();
    const { height: viewportControllerHeight, ref: viewportControllerRef } =
      useResizeDetector<HTMLDivElement>();

    //TOGGLE DETAIL BASED ON SELECTED FEATURES
    useEffect(() => {
      setDetailOpen(!!selectedFeatures.length);
    }, [setDetailOpen, selectedFeatures]);

    //DESELECT ALL ON DETAIL CLOSE
    useEffect(() => {
      if (!isDetailOpen) {
        setSelectedFeatures([]);
      }
    }, [isDetailOpen]);

    //CALCULATION IF VIEWPORT CONTROLLER FITS UNDER DETAIL BOX
    useEffect(() => {
      if (
        containerHeight ??
        0 <=
          (viewportControllerHeight ?? 0) + (detailPlaceholderHeight ?? 0) + 84
      ) {
        setViewportControllerFitsUnderDetail(true);
      } else {
        setViewportControllerFitsUnderDetail(false);
      }
    }, [detailPlaceholderHeight, containerHeight, viewportControllerHeight]);

    //ZOOM IN HANDLER
    const zoomIn = useCallback(() => {
      setViewport((viewport) => ({
        ...viewport,
        zoom: viewport.zoom ? viewport.zoom + 0.5 : 13,
      }));
    }, []);

    //ZOOM OUT HANDLER
    const zoomOut = useCallback(() => {
      setViewport((viewport) => ({
        ...viewport,
        zoom: viewport.zoom ? viewport.zoom - 0.5 : 13,
      }));
    }, []);

    //FULLSCREEN HANDLER
    const toggleFullscreen = useCallback(() => {
      if (containerRef?.current) {
        if (getFullscreenElement()) {
          exitFullscreen();
          setFullscreen(false);
        } else {
          requestFullscreen(containerRef.current);
          setFullscreen(true);
        }
      }
    }, [containerRef]);

    //RESET BEARING HANDLER
    const resetBearing = useCallback(() => {
      setViewport((viewport) => ({ ...viewport, bearing: 0 }));
    }, []);

    // //CALLBACK WHEN SELECTED FEATURES CHANGE
    // useEffect(() => {
    //   onSelectedFeaturesChange && onSelectedFeaturesChange(selectedFeatures);
    // }, [onSelectedFeaturesChange, selectedFeatures]);

    //EXPOSING METHODS FOR PARENT COMPONENT
    useImperativeHandle(
      forwardedRef,
      () => ({
        setViewport(wantedViewport) {
          setViewport((viewport) => ({ ...viewport, ...wantedViewport }));
        },

        closeFiltering() {
          setFilteringOpen(false);
        },

        closeDetail() {
          setDetailOpen(false);
        },

        fitToDisplayedData() {
          mapboxRef?.current?.fitToDisplayedData();
        },

        fitToDistrict(district) {
          mapboxRef?.current?.fitToDistrict(district);
        },

        isSlotVisible(name: string) {
          return false;
        },
      }),
      [setViewport, setFilteringOpen, setDetailOpen]
    );

    //CALCULATE MAP PADDING ON DETAIL AND FILTERS TOGGLING
    useEffect(() => {
      const paddingLeft =
        !isMobile && isFilteringOpen ? filterPlaceholderWidth : 0;

      const paddingRight =
        isMobile && isFilteringOpen
          ? filterPlaceholderWidth
          : isDetailOpen
          ? detailPlaceholderWidth
          : 0;

      //move the mapbox logo
      const mapboxLogoElement = document.querySelector(
        ".mapboxgl-ctrl-bottom-left"
      );
      const informationElement = document.querySelector(
        ".mapboxgl-ctrl-bottom-right"
      );
      if (!mapboxLogoElement || !informationElement) return;
      if (isMobile) {
        mapboxLogoElement.setAttribute(
          "style",
          `transform: translate(${8}px, -2px)`
        );
        informationElement.setAttribute(
          "style",
          `transform: translate(${-6}px, -2px)`
        );
      } else {
        informationElement.setAttribute("style", "");
        if (isFilteringOpen) {
          mapboxLogoElement.setAttribute(
            "style",
            `transition: transform 0.5s; transform: translate(${
              (filterPlaceholderWidth ?? 0) + 8
            }px, 4px)`
          );
        } else {
          mapboxLogoElement.setAttribute(
            "style",
            `transition: transform 0.5s; transform: translate(${8}px, 4px)`
          );
        }
      }

      setViewport((viewport) => ({
        ...viewport,
        paddingLeft: paddingLeft ?? 0,
        paddingRight: paddingRight ?? 0,
      }));
    }, [
      isDetailOpen,
      isFilteringOpen,
      detailPlaceholderWidth,
      filterPlaceholderHeight,
      filterPlaceholderWidth,
      isMobile,
    ]);

    useEffect(() => {
      onDistrictChange && onDistrictChange(selectedDistrict);
    }, [selectedDistrict]);

    //SET MOBILE ACCORDING TO CONTAINER WIDTH
    useEffect(() => {
      setMobile((containerWidth ?? 0) < 640);
    }, [containerWidth, setMobile]);

    //TOGGLE FILTERING ACCORDING TO MOBILE
    useEffect(() => {
      setFilteringOpen(!isMobile);
    }, [isMobile, setFilteringOpen]);

    return (
      <>
        <div
          className={cx(
            "fixed z-50 top-0 right-0 bottom-0 left-0 bg-white flex items-center justify-center text-primary duration-500",
            {
              "visible opacity-100 transition-none": isLoading,
              "invisible opacity-0 transition-all": !isLoading,
            }
          )}
        >
          <LoadingSpinner />
        </div>
        <div ref={containerRef} className="w-full h-full text-font">
          <Mapbox
            ref={mapboxRef}
            isDarkmode={isDarkmode}
            satelliteState={satelliteState}
            layerPrefix={layerPrefix}
            mapStyles={mapStyles}
            mapboxgl={mapboxgl}
            sources={extendedSources}
            icons={icons}
            onFeatureClick={setSelectedFeatures}
            loadingState={[isLoading, setLoading]}
            viewportState={[viewport, setViewport]}
            selectedFeatures={selectedFeatures}
            onBearingChange={(bearing) => setBearing(bearing)}
            geolocationState={geolocationState}
            selectedDistrict={selectedDistrict}
            districtFiltering={districtFiltering}
          >
            {children}
          </Mapbox>
          <ThemeController
            isDarkmode={isDarkmode}
            isSatellite={isSatellite}
            isFilteringOpen={isFilteringOpen}
            onDarkmodeChange={(value) => setDarkmode(value)}
            onSatelliteChange={(value) => setSatellite(value)}
          />
          <ViewportController
            isFullscreen={isFullscreen}
            ref={viewportControllerRef}
            viewport={viewport}
            isDetailOpen={isDetailOpen}
            isDetailFullHeight={doesViewportControllerFitsUnderDetail}
            onZoomInClick={zoomIn}
            onZoomOutClick={zoomOut}
            onFullscreenClick={toggleFullscreen}
            onCompassClick={resetBearing}
            bearing={bearing}
            isGeolocation={isGeolocation}
            onLocationClick={() => setGeolocation(!isGeolocation)}
          />

          {slots.map(
            (
              {
                component: Component,
                isMobileOnly,
                isDesktopOnly,
                animation,
                className,
                isVisible = false,
                bottomSheetOptions,
              },
              index
            ) => {
              return (isMobileOnly && !isMobile) ||
                (isDesktopOnly && isMobile) ? null : (
                <Slot
                  key={index}
                  animation={animation}
                  className={className}
                  isVisible={isVisible}
                  bottomSheetOptions={bottomSheetOptions}
                >
                  {typeof Component == "function" ? (
                    <Component isVisible={true} setVisible={() => false} />
                  ) : (
                    Component
                  )}
                </Slot>
              );
            }
          )}

          {/* <SearchBarPlaceholder
            moveSearchBarOutsideOfSideBarOnLargeScreen={
              moveSearchBarOutsideOfSideBarOnLargeScreen
            }
            filteringOpenState={filteringOpenState}
          >
            {searchBar}
          </SearchBarPlaceholder>
          <Header
            title={title}
            isFilteringOpen={isFilteringOpen}
            onFilterClick={() => setFilteringOpen(!isFilteringOpen)}
          />
          <MobileTopSlot>{mobileTopSlot}</MobileTopSlot>
          <DetailPlaceholder
            // ref={detailPlaceholderRef}
            title={title}
            isOpen={false}
            onClose={() => setDetailOpen(false)}
          >
            {detail}
          </DetailPlaceholder>
          <DesktopLeftSidebarSlot
            showDistrictSelect={showDistrictSelect}
            moveSearchBarOutsideOfSideBarOnLargeScreen={
              moveSearchBarOutsideOfSideBarOnLargeScreen
            }
            selectedDistrict={selectedDistrict}
            onDistrictChange={setSelectedDistrict}
            ref={filterPlaceholderRef}
            title={title}
            isOpen={isFilteringOpen}
            onClose={() => setFilteringOpen(false)}
          >
            {desktopLeftSidebarSlot}
          </DesktopLeftSidebarSlot>
          <MobileBottomSheetSlot
            isMobile={isMobile}
            ref={detailPlaceholderRef}
            title={title}
            isOpen={isDetailOpen}
            onClose={() => setDetailOpen(false)}
          >
            {detail}
          </MobileBottomSheetSlot> */}
        </div>
      </>
    );
  }
);

export default Map;
