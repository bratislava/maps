import { Feature } from "geojson";

export type PopupProps = {
  feature: Feature;
};

export const Popup = ({ feature }: PopupProps) => <div>{feature.properties?.name}</div>;
