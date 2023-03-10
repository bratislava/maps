import type { FeatureCollection } from "geojson";

export type TLayer = 'disorders' | 'closures' | 'digups';
export type TIcon = 'disorder' | 'closure' | 'digup';
export type TStatus = 'planned' | 'active' | 'done';

type TNetworkType = "Voda"
    | "Kanalizácia"
    | "Plyn"
    | "Optické_siete"
    | "Elektrina_(VN_NN_a_pod.)"
    | "Horúcovod"
    | "Voda"
    | "Verejné_Osvetlenie"
    | "Výstavba"
    | "Iné";

type TCityDistrict = "Staré Mesto"
    | "Ružinov"
    | "Vrakuňa"
    | "Podunajské Biskupice"
    | "Nové Mesto"
    | "Rača"
    | "Vajnory"
    | "Karlova Ves"
    | "Dúbravka"
    | "Lamač"
    | "Devín"
    | "Devínska Nová Ves"
    | "Záhorská Bystrica"
    | "Petržalka"
    | "Jarovce"
    | "Rusovce"
    | "Čunovo";

type TClosure = "čiastočná" | "úplná" | "žiadna";

export interface IProcessDataProps {
    rawDisordersData: FeatureCollection;
    rawDigupsAndClosuresData: FeatureCollection;
    // rawRepairsPointsData: FeatureCollection;
    // rawRepairsPolygonsData: FeatureCollection;
}

export interface ICommonOriginalProps {
    CreationDate: number;
    Creator: string;
    EditDate: number;
    Editor: string;
    dlzka_vykopu_m: number;
    globalid: string;
    mestska_cast: TCityDistrict;
    mestska_cast_other: string | null;
    objectid: number;
    poznamky_a_doplnujuce_udaje: string | null;
    predmet_nadpis: string;
    rozmery_vykopu_v_m2: number;
    sirka_vykopu_m: number;
}

export interface IDigupsAndClosuresOriginalProps extends ICommonOriginalProps {
    adresa_rozkopavky: string;
    cas_odstranenia: string | null;
    cas_vzniku: string | null;
    datum_vzniku: number;
    datum_vzniku_rozkopavky: number | null;
    druh_rozkopavky: TNetworkType;
    ine_investor: string | null;
    ine_zhotovitel: string | null;
    informacie: string;
    investor: string;
    termin_finalnej_upravy: number;
    termin_finalnej_upravy_rozkop: number | null;
    uzavierka: TClosure;
    zhotovitel: string;
}

export interface IDisorderOriginalProps extends ICommonOriginalProps {
    CreationDate: number;
    Creator: string;
    EditDate: number;
    Editor: string;
    dlzka_vykopu_m: number;
    globalid: string;
    mestska_cast: TCityDistrict;
    mestska_cast_other: string | null;
    objectid: number;
    poznamky_a_doplnujuce_udaje: string | null;
    predmet_nadpis: string;
    rozmery_vykopu_v_m2: number;
    sirka_vykopu_m: number;
    adresa: string;
    datum_finalnej_upravy: number;
    datum_sprejazdnenia: number;
    datum_vzniku_poruchy: number;
    druh_vedenia: TNetworkType;
    email: string;
    ine_vlastnik: string | null;
    meno_zodpovednej_osoby: string;
    telefon: number;
    vlastnik_spravca_vedenia: string;
}

export interface IFeatureProps {
    objectId: number;
    subject: string | null;
    type: Array<string>;
    address: string | null;
    startTimestamp: number;
    endTimestamp: number;
    dateOfPassage?: number | null;
    startTime?: string | null;
    endTime?: string | null;
    length: number | null;
    width: number | null;
    fullSize: number | null;
    investor?: string | null;
    contractor?: string | null;
    owner?: string | null;
    layer: TLayer;
    icon: TIcon;
    infoForResidents?: string | null;
    status: TStatus;
    imageUrl?: string;
    originalProperties: IDigupsAndClosuresOriginalProps | IDisorderOriginalProps;
}
