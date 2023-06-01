import { colors } from "../../../../utils/colors";

export interface IRunningTrack {
    name: string;
    lat: number;
    lng: number;
    color: string;
    length: string;
}

export const runningTracks: Array<IRunningTrack> = [
    {
        name: "apollo",
        lat: 48.13781218517968,
        lng: 17.122609073972086,
        color: colors.red,
        length: "10 km",
    },
    {
        name: "bridge",
        lat: 48.13829323226889,
        lng: 17.110750156057293,
        color: colors.violet,
        length: "8 km",
    },
    {
        name: "snp",
        lat: 48.14075397693506,
        lng: 17.079605067162618,
        color: colors.orange,
        length: "6 km",
    },
    {
        name: "small",
        lat: 48.1317443849081,
        lng: 17.10715026913175,
        color: colors.blue,
        length: "800 m",
    },
    {
        name: "large",
        lat: 48.13153408900732,
        lng: 17.11424132548811,
        color: colors.brown,
        length: "1700 m",
    }
];
