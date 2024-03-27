import { RasterSource } from 'mapbox-gl';
import { Viewport } from '../types';

// Default initial viewport if nothing is provided
export const defaultInitialViewport: Viewport = {
  center: {
    lat: 48.148598,
    lng: 17.107748,
  },
  zoom: 12,
  pitch: 0,
  bearing: 0,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

export const defaultSatelliteSource: RasterSource = {
  type: 'raster',
  tileSize: 256,
  tiles: [
    'https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/Hosted/Ortofoto_2021_WGS/MapServer/tile/{z}/{y}/{x}',
  ],
};
