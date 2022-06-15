import { Map } from ".";
import { Mapbox } from "./components/Mapbox";
import { FC, Dispatch, SetStateAction, ReactNode } from "react";

export enum DistrictEnum {
  STARE_MESTO = "STARE_MESTO",
  RUZINOV = "RUZINOV",
  VRAKUNA = "VRAKUNA",
  PODUNAJSKE_BISKUPICE = "PODUNAJSKE_BISKUPICE",
  NOVE_MESTO = "NOVE_MESTO",
  RACA = "RACA",
  VAJNORY = "VAJNORY",
  KARLOVA_VES = "KARLOVA_VES",
  DUBRAVKA = "DUBRAVKA",
  LAMAC = "LAMAC",
  DEVIN = "DEVIN",
  DEVINSKA_NOVA_VES = "DEVINSKA_NOVA_VES",
  ZAHORSKA_BYSTRICA = "ZAHORSKA_BYSTRICA",
  PETRZALKA = "PETRZALKA",
  JAROVCE = "JAROVCE",
  RUSOVCE = "RUSOVCE",
  CUNOVO = "CUNOVO",
}

export type District = {
  key: DistrictEnum;
  title: string;
};

export interface MapIcon {
  path: string;
  width: number;
  height: number;
}

export const districts: District[] = [
  { key: DistrictEnum.STARE_MESTO, title: "Staré Mesto" },
  { key: DistrictEnum.RUZINOV, title: "Ružinov" },
  { key: DistrictEnum.VRAKUNA, title: "Vrakuňa" },
  { key: DistrictEnum.PODUNAJSKE_BISKUPICE, title: "Podunajské Biskupice" },
  { key: DistrictEnum.NOVE_MESTO, title: "Nové Mesto" },
  { key: DistrictEnum.RACA, title: "Rača" },
  { key: DistrictEnum.VAJNORY, title: "Vajnory" },
  { key: DistrictEnum.KARLOVA_VES, title: "Karlova Ves" },
  { key: DistrictEnum.DUBRAVKA, title: "Dúbravka" },
  { key: DistrictEnum.LAMAC, title: "Lamač" },
  { key: DistrictEnum.DEVIN, title: "Devín" },
  { key: DistrictEnum.DEVINSKA_NOVA_VES, title: "Devínska Nová Ves" },
  { key: DistrictEnum.ZAHORSKA_BYSTRICA, title: "Záhorská Bystrica" },
  { key: DistrictEnum.PETRZALKA, title: "Petržalka" },
  { key: DistrictEnum.JAROVCE, title: "Jarovce" },
  { key: DistrictEnum.RUSOVCE, title: "Rusovce" },
  { key: DistrictEnum.CUNOVO, title: "Čunovo" },
];

export interface Sources {
  [key: string]: Source;
}

// export interface Source {
//   title: string;
//   type: 'geojson';
//   data: any;
// }

export type Source = any;

export enum LayerType {
  point = "point",
}

export interface ILayer {
  source: string;
  styles: any[];
  isVisible: boolean;
  icon?: string;
}

export interface Filters {
  [key: string]: Filter;
}

export interface Filter {
  [key: string]: any;
  key: string;
  title: string;
}

// export type MapHandle = React.ElementRef<typeof Map>;
// export type MapboxHandle = React.ElementRef<typeof Mapbox>;

export interface IViewportProps {
  lat: number;
  lng: number;
  zoom: number;
  pitch: number;
  bearing: number;
  paddingLeft: number;
  paddingRight: number;
  paddingBottom: number;
}

export interface ComponentProps {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export interface IComponentSlot {
  name: string;
  component: FC<ComponentProps> | ReactNode;
  isMobileOnly?: boolean;
  isDesktopOnly?: boolean;
  animation?: SlotAnimation;
  className?: string;
  bottomSheetOptions?: any;
  isVisible?: boolean;
  onClose?: () => void;
}

export type SlotAnimation = "slide-left" | "slide-right" | "none";
