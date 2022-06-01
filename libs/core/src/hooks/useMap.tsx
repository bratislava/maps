import {
  useState,
  useRef,
  useCallback,
  MutableRefObject,
  RefAttributes,
  ForwardRefExoticComponent,
} from 'react';
import { MapProps, Map } from '../components/Main';
import { MapHandle } from '../types';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import { i18n } from 'i18next';

export interface IUseMap {
  mapboxAccessToken: string;
  mapStyles: {
    light?: string;
    dark?: string;
    satellite?: string;
  };
  i18next: i18n;
}

interface useMapComponentProps extends MapProps {
  ref: MutableRefObject<MapHandle>;
  closeFiltering: () => void;
  closeDetail: () => void;
  fitToDisplayedData: () => void;
  fitToDistrict: (district: string) => void;
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

  const selectedDistrictState = useState<string>(null);

  const props: useMapComponentProps = {
    //helpers
    ref,
    closeFiltering: () => ref.current?.closeFiltering(),
    closeDetail: () => ref.current?.closeDetail(),
    fitToDisplayedData: () => ref.current?.fitToDisplayedData(),
    fitToDistrict: (district) => ref.current?.fitToDistrict(district),
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
