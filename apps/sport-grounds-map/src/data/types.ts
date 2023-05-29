
interface IPoolAttributes {
    nazov: string;
    popis: string;
    kategoriaSportoviska: string;
    sport: string;
    sluzby: string;
    otvaracieHodiny: string;
    adresa: string;
    email: string;
    webLink: string;
    listokLink: string;
    Fotka: string;
    navigovatLink: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    oznam: string;
}

export interface IPool {
    attributes: IPoolAttributes;
}

interface IWorkoutAttributes {
    nazov: string;
    kategoriaSportoviska: string;
    sport: string;
    umiestnenie: string;
    webLink: string;
    navigovatLink: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
}
export interface IWorkout {
    attributes: IWorkoutAttributes;
}

export type TSportGround = "zimný štadión"
    | "športová hala"
    | "plaváreň"
    | "fitness"
    | "sauna"
    | "multifunkčný areál"
    | "kúpalisko"
    | "workoutové ihrisko"
    | "bežecká dráha"
    | "spevnená plocha"
    | "atletická dráha"
    | "basketbalové ihrisko"
    | "futbalové ihrisko"
    | "klzisko"
    | "lezecká stena"
    | "telocvičňa"
    | "športový areál"
    | "futbalový štadión"
    | "štadión"
    | "tenisový kurt"
    | "stolný tenis"
    | "petangové ihrisko"
    | "strelnica"
    | "volejbalové ihrisko"
    | "vodná plocha"
    | "pumptrack"
    | "skatepark"
    | "tanečné štúdio"
    | "dopravné ihrisko"
    | "wellness";


export type TSport = "futbal"
    | "basketbal"
    | "hokej"
    | "hokejbal"
    | "volejbal"
    | "tenis"
    | "plávanie"
    | "workout"
    | "gymnastika"
    | "beh"
    | "kánoistika"
    | "paddle board"
    | "bicykel"
    | "voľnočasové aktivity"
    | "skateboard"
    | "korčulovanie"
    | "parkour"
    | "fitness"
    | "florbal"
    | "tanec"
    | "petang"
    | "wellness"
    | "potápanie"
    | "stolný tenis"
    | "jóga"
    | "vodné aktivity";

export type TService = "toalety"
    | "bufet"
    | "parkovanie"
    | "mhd"
    | "bicykel"
    | "ihrisko"
    | "šatňa"
    | "sprcha"
    | "detský kútik"
    | "reštaurácia"
    | "fitness"
    | "wellness"
    | "detský bazén";
