import { Marker as MapMarker } from "@bratislava/react-maps-core";
import { Feature } from "geojson";
import { useEffect, useMemo, useState } from "react";

export interface IMarkerProps {
  feature: Feature;
}

export const Marker = ({ feature }: IMarkerProps) => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(() => {
    if (feature.geometry.type === "Point") {
      setLat(feature.geometry.coordinates[0]);
      setLng(feature.geometry.coordinates[1]);
    }
  }, [feature.geometry]);

  useEffect(() => {
    console.log(lat, lng);
  }, [lat, lng]);

  return feature.geometry.type == "Point" ? (
    <MapMarker lat={lat} lng={lng}>
      <div className="w-4 h-4 rounded-full bg-primary">dadawdawdawdawd dawdaw </div>
    </MapMarker>
  ) : null;
};
