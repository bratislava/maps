export declare enum DistrictEnum {
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
    CUNOVO = "CUNOVO"
}
export type District = {
    key: DistrictEnum;
    title: string;
};
export declare const districts: District[];
