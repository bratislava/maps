// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Source = any;

export interface Sources {
  [key: string]: Source;
}

export type LngLat = {
  lng: number;
  lat: number;
};

export type PartialLngLat = Partial<LngLat>;

export type Padding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type PartialPadding = Partial<Padding>;

export type Viewport = {
  center: LngLat;
  zoom: number;
  bearing: number;
  pitch: number;
  padding: Padding;
};

export type PartialViewport = Partial<{
  center: PartialLngLat;
  zoom: number;
  bearing: number;
  pitch: number;
  padding: PartialPadding;
}>;

export interface MapIcon {
  path: string;
  width: number;
  height: number;
}