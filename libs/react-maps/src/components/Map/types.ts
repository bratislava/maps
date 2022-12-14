import {
  MapboxGesturesOptions,
  PartialViewport,
  Viewport,
  Padding,
  LngLat,
} from '@bratislava/react-mapbox';
import { Feature } from 'geojson';
import { EventData, MapboxGeoJSONFeature, MapMouseEvent } from 'mapbox-gl';
import { ReactNode } from 'react';
import { i18n as i18nType } from 'i18next';

// State of one slot
export type SlotState = {
  id: string;
  isVisible: boolean;
  padding: Padding;
  avoidMapboxControls: boolean;
};

// Methods passed to context and imperative handle
export type MapMethods = {
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

export type MapProps = {
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
  cooperativeGestures?: boolean;
  interactive?: boolean;
  enableSatelliteOnLoad?: boolean;
  mapInformationButtonClassName?: string;
  onViewportChange?: (viewport: Viewport) => void;
  onViewportChangeDebounced?: (viewport: Viewport) => void;
  mapInformation: {
    title: string;
    description: ReactNode;
    partners: {
      name: string;
      link: string;
      image: string;
      height?: number;
      width?: number;
    }[];
    footer: ReactNode;
  };
  prevI18n: i18nType;
} & MapboxGesturesOptions;
