import { Marker as MapMarker } from "@bratislava/react-mapbox";
import { Feature } from "geojson";
import { point } from "@turf/helpers";
import { MultiFeatureMarker } from "./MultiFeatureMarker";
import { SingleFeatureMarker } from "./SingleFeatureMarker";

export interface IMarkerProps {
  features: Feature[];
  isSelected: boolean;
  lng: number;
  lat: number;
  onClick: () => void;
}

export const Marker = ({ features, lng, lat, onClick, isSelected }: IMarkerProps) => {
  return (
    <MapMarker feature={point([lng, lat], features[0].properties)} onClick={onClick}>
      {features.length > 1 ? (
        <MultiFeatureMarker features={features} isSelected={isSelected} />
      ) : (
        <SingleFeatureMarker feature={features[0]} isSelected={isSelected} />
      )}
    </MapMarker>
  );
};
