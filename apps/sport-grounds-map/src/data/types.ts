
export interface IPool {
    "Nazov_SK": string;
    "Popis": string;
    "Kategoria sportoviska_SK": string;
    "Sport_SK": string;
    "Sluzby_SK": string;
    "Otvaracie hodiny_SK": string;
    "Adresa_SK": string;
    "Email_SK": string;
    "Web": string;
    "Listok": string;
    "Fotka": string;
    "Navigovat": string;
    "X": number;
    "Y": number;
}

export interface IWorkout {
    "Názov_SK": string;
    "Kategória športoviska_SK": string;
    "Sport_SK": string;
    "Umiestnenie_SK": string;
    "Email_SK"?: string;
    "Web": string;
    "Navigovať": string;
    "Fotka": string;
    "X": number;
    "Y": number;
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
