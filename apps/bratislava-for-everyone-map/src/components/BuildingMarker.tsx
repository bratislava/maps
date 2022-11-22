import { ReactComponent as CastleIcon } from "../assets/icons/buildings/castle.svg";
import { ReactComponent as SlavinIcon } from "../assets/icons/buildings/slavin.svg";
import { ReactComponent as MichalskaIcon } from "../assets/icons/buildings/michalska.svg";
import { ReactComponent as MainStationIcon } from "../assets/icons/buildings/main-station.svg";
import { ReactComponent as NewMarketplaceIcon } from "../assets/icons/buildings/new-marketplace.svg";
import { ReactComponent as BroadcastIcon } from "../assets/icons/buildings/broadcast.svg";
import { Marker } from "@bratislava/react-mapbox";
import { Feature, Point } from "geojson";

const iconMapComponent = {
  castle: CastleIcon,
  slavin: SlavinIcon,
  michalska: MichalskaIcon,
  "main-station": MainStationIcon,
  "new-marketplace": NewMarketplaceIcon,
  broadcast: BroadcastIcon,
} as const;

const iconMapWidth = {
  castle: 128,
  slavin: 64,
  michalska: 32,
  "main-station": 96,
  "new-marketplace": 192,
  broadcast: 96,
} as const;

export type BuildingIcon = keyof typeof iconMapComponent;

export const icons = Object.keys(iconMapComponent) as BuildingIcon[];

export interface IBuildingMarkerProps {
  feature: Feature<Point>;
  icon: BuildingIcon;
}

export const BuildingMarker = ({ icon, feature }: IBuildingMarkerProps) => {
  const Icon = iconMapComponent[icon];
  const width = iconMapWidth[icon];
  return (
    <Marker origin="bottom" baseZoom={15} isRelativeToZoom feature={feature}>
      <Icon width={width} />
    </Marker>
  );
};
