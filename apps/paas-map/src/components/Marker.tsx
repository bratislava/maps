import { Marker as MapMarker } from "@bratislava/react-mapbox";
import { motion } from "framer-motion";
import { Feature, Point } from "geojson";
import { MouseEvent, useCallback, useMemo } from "react";
import { Icon } from "./Icon";
import { ReactComponent as WarningIcon } from "../assets/icons/warning-marker.svg";

export interface IMarkerProps {
  features: any;
  onClick: (feature: Feature<Point>) => void;
  isSelected: boolean;
  lat: number;
  lng: number;
}

export const Marker = ({ features, lat, lng, onClick, isSelected }: IMarkerProps) => {
  const feature = useMemo(
    () =>
      features.length
        ? ({
          ...(features.find((f: any) => f.properties?.Parkomat_ID) ?? features[0]),
          // ...features[0],
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        } as Feature<Point>)
        : null,
    [features, lng, lat],
  );

  const onClickHandler = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick && feature && onClick(feature);
    },
    [feature, onClick],
  );

  return feature ? (
    <MapMarker
      baseZoom={14}
      scalePercentMultiplier={0.1}
      isRelativeToZoom
      ignoreFilters
      onClick={onClickHandler}
      feature={feature}
    >
      <motion.div className="relative" initial={{ scale: 0 }} animate={{ scale: 1 }}>
        {features.length === 1 && features[0].properties["Stav_en"] === 'inactive' &&
          <WarningIcon className="absolute right-0 z-[90] mb-2" width={22} height={22} />
        }
        <Icon
          isWhite={isSelected}
          count={features.length > 1 ? features.length : undefined}
          size={48}
          icon={feature.properties?.icon ?? ""}
        />
      </motion.div>
    </MapMarker>
  ) : null;
};
