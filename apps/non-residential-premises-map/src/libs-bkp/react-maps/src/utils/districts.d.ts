import { Feature, FeatureCollection, Geometry } from 'geojson';
export declare const DISTRICTS: readonly ["Staré Mesto", "Ružinov", "Vrakuňa", "Podunajské Biskupice", "Nové Mesto", "Rača", "Vajnory", "Karlova Ves", "Dúbravka", "Lamač", "Devín", "Devínska Nová Ves", "Záhorská Bystrica", "Petržalka", "Jarovce", "Rusovce", "Čunovo"];
type District = typeof DISTRICTS[number];
export declare const addDistrictPropertyToLayer: <G extends Geometry, P extends {
    [name: string]: any;
}>(collection: FeatureCollection<G, P>) => FeatureCollection<G, P & {
    district: District;
}>;
export declare const getFeatureDistrict: (feature: Feature) => District | null;
export {};
