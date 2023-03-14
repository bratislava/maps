import {
  LngLat, MapboxGesturesOptions, Padding, PartialViewport,
  Viewport
} from '@bratislava/react-mapbox';
import { Feature } from 'geojson';
import { i18n as i18nType } from 'i18next';
import { EventData, MapboxGeoJSONFeature, MapMouseEvent } from 'mapbox-gl';
import { ReactNode } from 'react';

// State of one slot
export interface SlotState {
  id: string;
  isVisible: boolean;
  padding: Padding;
  avoidMapboxControls: boolean;
};

// Methods passed to context and imperative handle
export interface MapMethods {
  changeViewport: (
    wantedViewport: PartialViewport,
    duration?: number,
  ) => void | undefined;
  fitDistrict: (district: string | string[]) => void;
  fitBounds: (
    bounds: mapboxgl.LngLatBoundsLike,
    options?: mapboxgl.FitBoundsOptions,
  ) => void;
  fitFeature: (
    features: Feature | Feature[],
    options?: { padding?: number },
  ) => void;
  moveToFeatures: (
    features: Feature | Feature[],
    options?: { zoom?: number },
  ) => void;
  turnOnGeolocation: () => void;
  turnOffGeolocation: () => void;
  toggleGeolocation: () => void;
  addSearchMarker: (lngLat: LngLat) => void;
  removeSearchMarker: () => void;
  // Slots
  mountOrUpdateSlot: (slotState: SlotState) => void;
  unmountSlot: (slotState: SlotState) => void;
};

interface IPartner {
  name: string;
  link: string;
  image: string;
  height?: number;
  width?: number;
}

export interface IMapInfoNotification {
  title: string;
  txt: ReactNode;
  moreTxt: string;
}

interface IMapInformation {
  title: string;
  description: ReactNode;
  partners: Array<IPartner>;
  footer: ReactNode;
  infoNotification?: IMapInfoNotification;
}

export interface MapProps extends MapboxGesturesOptions {
  mapboxAccessToken: string;
  isDevelopment?: boolean;
  mapStyles: {
    light?: string;
    dark?: string;
  };
  children?: ReactNode;
  layerPrefix?: string;
  initialViewport?: PartialViewport;
  onSelectedFeaturesChange?: (features: Feature[]) => void;
  onMobileChange?: (isMobile: boolean) => void;
  onGeolocationChange?: (isGeolocation: boolean) => void;
  onMapClick?: (event: MapMouseEvent & EventData) => void;
  loadingSpinnerColor?: string;
  selectedFeatures?: MapboxGeoJSONFeature[];
  onFeaturesClick?: (features: MapboxGeoJSONFeature[]) => void;
  maxBounds?: [[number, number], [number, number]];
  maxZoom?: number;
  minZoom?: number;
  cooperativeGestures?: boolean;
  interactive?: boolean;
  enableSatelliteOnLoad?: boolean;
  mapInformationButtonClassName?: string;
  onViewportChange?: (viewport: Viewport) => void;
  onViewportChangeDebounced?: (viewport: Viewport) => void;
  mapInformation: IMapInformation;
  prevI18n: i18nType;
};
