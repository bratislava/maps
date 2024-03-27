import { FeatureCollection } from "geojson";
export declare const fetchFromArcgis: (url: string, { offset, count, format, }: {
    offset?: number;
    count?: number;
    format?: string;
}) => Promise<any>;
export declare const fetchCount: (url: string) => Promise<any>;
export declare const fetchAllFromArcgis: (url: string, options?: IUseArcgisOptions) => Promise<FeatureCollection<import("geojson").Geometry, {
    [name: string]: any;
}>>;
export interface Attachment {
    contentType: string;
    globalId: string;
    id: number;
    name: string;
    parentGlobalId: string;
    size: number;
    keywords?: string;
}
export declare const fetchAttachmentsFromArcgis: (serverUrl: string, objectId: string | number) => Promise<Attachment[]>;
interface IUseArcgisOptions {
    countPerRequest?: number;
    pagination?: boolean;
    format?: string;
}
export declare const useArcgis: (url: string | string[], options?: IUseArcgisOptions) => {
    data: FeatureCollection<import("geojson").Geometry, {
        [name: string]: any;
    }>;
};
export declare const useArcgisAttachments: (url: string, objectId: string | number | null) => {
    data: Attachment[];
};
export {};
