import {
  useState,
  useRef,
  useCallback,
  RefObject,
  RefAttributes,
  ForwardRefExoticComponent,
} from "react";
import { MapProps, MapHandle, Map } from "../components/Main";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import { i18n } from "i18next";
import { ALL_DISTRICTS_KEY } from "../utils/districts";

export interface IUseMap {
  mapboxAccessToken: string;
  mapStyles: {
    light?: string;
    dark?: string;
    satellite?: string;
  };
  i18next: i18n;
}

interface useMapComponentProps extends MapProps, MapHandle {
  ref: RefObject<MapHandle>;
  selectedFeatures: any[];
  Map: ForwardRefExoticComponent<MapProps & RefAttributes<MapHandle>>;
}

export const useMap = ({ mapboxAccessToken, mapStyles, i18next }: IUseMap) => {
  mapboxgl.accessToken = mapboxAccessToken;

  const ref = useRef<MapHandle>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<any[]>([]);

  const mobileState = useState(false);
  const geolocationState = useState(false);
  const darkmodeState = useState(false);
  const detailOpenState = useState(false);
  const filteringOpenState = useState(false);
  const fullscreenState = useState<boolean>(false);
  const satelliteState = useState<boolean>(false);
  const loadingState = useState(true);

  const selectedDistrictState = useState<string>(ALL_DISTRICTS_KEY);

  const props: useMapComponentProps = {
    //helpers
    ref,
    setViewport: (wantedViewport) => ref.current?.setViewport(wantedViewport),
    closeFiltering: () => ref.current?.closeFiltering(),
    closeDetail: () => ref.current?.closeDetail(),
    fitToDisplayedData: () => ref.current?.fitToDisplayedData(),
    fitToDistrict: (district) => ref.current?.fitToDistrict(district),
    isSlotVisible: (name) => ref.current?.isSlotVisible(name),
    //map component props
    mapboxgl,
    mobileState,
    geolocationState,
    darkmodeState,
    detailOpenState,
    fullscreenState,
    filteringOpenState,
    satelliteState,
    selectedDistrictState,
    loadingState,
    mapStyles,
    i18next,
    onSelectedFeaturesChange: setSelectedFeatures,
    selectedFeatures,
    Map,
  };

  return props;
};
