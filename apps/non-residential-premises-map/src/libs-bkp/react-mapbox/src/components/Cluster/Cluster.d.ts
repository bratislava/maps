import { Feature, Point } from 'geojson';
import { FC } from 'react';
export interface IClusterChildProps {
    key: number | string;
    features: Feature<Point>[];
    isCluster: boolean;
    clusterExpansionZoom: number | null;
    lat: number;
    lng: number;
}
export interface IClusterProps {
    splitPoints?: boolean;
    features: Feature[];
    children: FC<IClusterChildProps>;
    radius?: number;
}
export declare const Cluster: ({ children, features, radius, splitPoints, }: IClusterProps) => JSX.Element;
