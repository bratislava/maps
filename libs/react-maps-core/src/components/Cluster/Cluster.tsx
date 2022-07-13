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
    const zoom = map?.getZoom();

    const bounds = map?.getBounds() as
      | {
          _sw: {
            lng: number;
            lat: number;
          };
          _ne: {
            lng: number;
            lat: number;
          };
        }
      | undefined;

    const bbox = ([
      (bounds?._sw.lng as number) ?? 0,
      (bounds?._sw.lat as number) ?? 0,
      (bounds?._ne.lng as number) ?? 0,
      (bounds?._ne.lat as number) ?? 0,
    ] ?? [0, 0, 0, 0]) as [number, number, number, number];

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
          };
        } else {
          const feature = cluster;
          return {
            key,
            features: [feature],
            lng: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
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
