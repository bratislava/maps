import React, {
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useState,
  FC,
} from "react";
import { mapboxContext } from "../Mapbox/Mapbox";
import Supercluster from "supercluster";
import { Feature, Point } from "geojson";
import { filterContext } from "../Filter/Filter";

export interface IClusterChildProps {
  key: number;
  features: Feature<Point>[];
  isCluster: boolean;
  clusterExpansionZoom: number | null;
  lat: number;
  lng: number;
}

export interface IClusterProps {
  features: Feature[];
  children: FC<IClusterChildProps>;
  radius?: number;
}

export const Cluster = ({
  children,
  features,
  radius = 100,
}: IClusterProps) => {
  const { isFeatureVisible } = useContext(filterContext);

  const pointFeatures = useMemo(
    () =>
      features.filter(
        (f) => f.geometry.type === "Point"
      ) as Supercluster.PointFeature<Supercluster.AnyProps>[],
    [features]
  );

  const supercluster = useMemo(() => {
    const s = new Supercluster({ radius });
    s.load(
      pointFeatures.filter((f) =>
        isFeatureVisible === undefined ? true : isFeatureVisible(f)
      )
    );
    return s;
  }, [pointFeatures, radius, isFeatureVisible]);

  const { map } = useContext(mapboxContext);

  const [clusters, setClusters] = useState<IClusterChildProps[]>([]);

  const recalculate = useCallback(() => {
    const MAP = map;
    if (!MAP) return;

    const zoom = MAP.getZoom();

    // width and height in pixels
    const { width: canvasWidth, height: canvasHeight } = MAP.getCanvas();
    const offset = 100;

    const { lng: west, lat: north } = MAP.unproject([-offset, -offset]);
    const { lng: east, lat: south } = MAP.unproject([
      canvasWidth + offset,
      canvasHeight + offset,
    ]);

    const bbox = [west, south, east, north] as [number, number, number, number];

    setClusters(
      supercluster.getClusters(bbox, zoom ?? 0).map((cluster, key) => {
        const isCluster = cluster.properties.cluster_id !== undefined;

        if (isCluster) {
          return {
            key,
            features: supercluster.getLeaves(
              cluster.properties.cluster_id,
              Infinity
            ),
            lng: cluster.geometry.coordinates[0],
            lat: cluster.geometry.coordinates[1],
            isCluster,
            clusterExpansionZoom: supercluster.getClusterExpansionZoom(
              cluster.properties.cluster_id
            ),
          };
        } else {
          const feature = cluster;
          return {
            key,
            features: [feature],
            lng: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
            isCluster,
            clusterExpansionZoom: null,
          };
        }
      })
    );
  }, [map, supercluster]);

  useEffect(() => {
    recalculate();
    map?.on("move", recalculate);
    return () => {
      map?.off("move", recalculate);
    };
  }, [map, recalculate]);

  return <>{clusters.map((cluster) => children(cluster))}</>;
};
