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

export type Source = any;

export interface ILngLat {
  lng: number;
  lat: number;
}

export interface IPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IViewport {
  center: ILngLat;
  zoom: number;
  bearing: number;
  pitch: number;
  padding: IPadding;
}
